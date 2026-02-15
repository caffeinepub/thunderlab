import Map "mo:core/Map";

module {
  type OldActor = {
    appPasswords : Map.Map<Principal, Text>;
    unlockedSessions : Map.Map<Principal, Int>;
    userProfiles : Map.Map<Principal, {
      name : Text;
    }>;
  };

  public func run(old : OldActor) : {
    appPasswords : Map.Map<Principal, Text>;
    unlockedSessions : Map.Map<Principal, Int>;
    userProfiles : Map.Map<Principal, {
      name : Text;
    }>;
    projects : Map.Map<Nat, { id : Nat; name : Text; owner : Principal }>;
    userProjects : Map.Map<Principal, [Nat]>;
    projectCounter : Nat;
  } {
    {
      old with
      projects = Map.empty<Nat, { id : Nat; name : Text; owner : Principal }>();
      userProjects = Map.empty<Principal, [Nat]>();
      projectCounter = 0;
    };
  };
};
