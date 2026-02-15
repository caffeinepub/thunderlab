# Specification

## Summary
**Goal:** Fix the Projects page so users can actually create a project after login, with clear feedback and proper persistence.

**Planned changes:**
- Wire the /projects page “New Project” and “Create Your First Project” buttons to a real create-project flow (dialog or dedicated screen) with immediate visible UI response.
- Add a minimal create-project UX that collects a project name (or uses a sensible default), supports Create/Cancel, and shows loading/disabled state during creation.
- On successful creation, navigate to the new project’s workspace (or closest existing project screen) and ensure it appears in the projects list.
- Implement/verify backend project create + list operations so projects persist to the authenticated user across refresh, enforcing existing auth/unlock guards.
- Add clear English error messaging and a retry path when project creation fails, while preserving existing redirect behavior for unauthenticated/locked users.

**User-visible outcome:** From /projects, users can click either create call-to-action to start creating a project, see progress while it’s created, and end up in the new project with the project saved and visible in their projects list (or see a clear error with a way to retry).
