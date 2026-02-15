# Specification

## Summary
**Goal:** Add a protected in-app Beat Maker so signed-in, unlocked users can create simple drum beats, export them as audio, and use them in projects.

**Planned changes:**
- Add a new authenticated-only “Beat Maker” entry point and route/page guarded by the existing UnlockGate (redirect locked users to `/unlock`).
- Build a step sequencer UI with at least 3 drum rows (kick, snare, hi-hat) on a 16-step grid, including Play/Stop transport and a BPM (tempo) control that affects playback timing.
- Add an Export/Download action that renders the current pattern + BPM to a downloadable audio file (WAV or similar), with clear English UI text and a clear filename.
- Add an “Add to project” action that takes the generated beat audio and inserts it into a project as an audio track via the same handling/path as importing an audio file, with a clear next step if no project is currently selected.
- Ensure the Beat Maker UI remains usable on mobile (touch-friendly step toggles and controls) and all new user-facing text is in English.

**User-visible outcome:** Signed-in users can open Beat Maker, program a simple drum pattern, play it at a chosen BPM, export it as an audio download, and add it into a project as an audio track (or be guided to select/create a project).
