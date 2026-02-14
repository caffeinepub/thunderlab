# Specification

## Summary
**Goal:** Fix the Founder login flow so the Founder can sign in via Internet Identity and access the app reliably without getting stuck in the unlock path, while preserving the existing unlock requirements for non-Founder users and preparing the project for redeployment.

**Planned changes:**
- Adjust frontend routing/guards (LoginPage/UnlockPage/UnlockGate) so Founder sign-in deterministically reaches protected routes (e.g., `/projects`) without being redirected to `/unlock`.
- Keep the existing App Password unlock flow enforced for non-Founder users when accessing protected routes.
- Update backend authorization/role checks so only the designated Founder/admin principal(s) receive the Founder-specific access behavior, and non-Founders cannot bypass unlock via client-side manipulation.
- Ensure build/typecheck and backend canister compilation succeed with no new runtime traps in the login/unlock flow.

**User-visible outcome:** After signing in with Internet Identity as the Founder, the user can reliably reach `/projects` (and other protected pages) without being stuck on `/unlock`; non-Founder users still must unlock before accessing protected routes.
