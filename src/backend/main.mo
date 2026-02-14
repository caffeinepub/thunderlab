import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // App Password Types
  type PasswordHash = Text;
  type SessionToken = Text;
  type Timestamp = Int;
  let SESSION_TIMEOUT_NANOS = 3_600_000_000_000; // 1 hour

  let appPasswords = Map.empty<Principal, PasswordHash>();
  let unlockedSessions = Map.empty<Principal, Timestamp>();

  // Initialize the user system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Check if user is currently unlocked
  public query ({ caller }) func getIsUnlocked() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check unlock status");
    };
    switch (unlockedSessions.get(caller)) {
      case (null) { false };
      case (?timestamp) {
        if (isSessionExpired(timestamp)) {
          false;
        } else {
          true;
        };
      };
    };
  };

  // Set or change App Password
  public shared ({ caller }) func saveAppPassword(passwordHash : PasswordHash) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set app passwords");
    };
    // Allow initial password setup without being unlocked
    // For password changes, require unlocked session
    switch (appPasswords.get(caller)) {
      case (null) {
        // First time setup - no unlock required
        if (storedPasswordIsEmpty(passwordHash)) {
          Runtime.trap("Password cannot be empty");
        };
      };
      case (?_existing) {
        // Changing existing password - must be unlocked
        verifyUserUnlocked(caller);
      };
    };
    appPasswords.add(caller, passwordHash);
  };

  // Verify App Password and start session
  public shared ({ caller }) func unlockAccount(passwordHash : PasswordHash) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlock accounts");
    };
    let currentTime = Time.now();
    switch (appPasswords.get(caller)) {
      case (?stored) {
        if (passwordHash != stored) {
          return false;
        };
      };
      case (null) {
        // No password set yet - cannot unlock
        Runtime.trap("Password must be set before unlocking");
      };
    };
    unlockedSessions.add(caller, currentTime);
    true;
  };

  // Logout endpoint
  public shared ({ caller }) func logout() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can logout");
    };
    switch (unlockedSessions.remove(caller)) {
      case () { () };
    };
  };

  // Confirm password validity (non-empty, not default hash)
  private func storedPasswordIsEmpty(hash : PasswordHash) : Bool {
    hash == "";
  };

  // Check if session is expired
  private func isSessionExpired(sessionTimestamp : Timestamp) : Bool {
    Time.now() > (sessionTimestamp + SESSION_TIMEOUT_NANOS);
  };

  // Require account to be unlocked (internal helper)
  private func verifyUserUnlocked(user : Principal) {
    switch (unlockedSessions.get(user)) {
      case (null) {
        Runtime.trap("To access sensitive actions, please unlock your account first.");
      };
      case (?timestamp) {
        if (isSessionExpired(timestamp)) {
          unlockedSessions.remove(user);
          Runtime.trap("Session expired. Please log in again.");
        };
      };
    };
  };
};
