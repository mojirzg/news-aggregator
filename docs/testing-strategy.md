# Testing Strategy

## Unit and module integration

Colocated Vitest tests cover the behavior with the highest architectural risk:

- publication-date sorting and deterministic ties;
- partial provider failure isolation;
- selected-provider execution;
- normalized author filtering;
- provider request translation and response mapping;
- URL filter round-tripping;
- versioned preferences and corrupted-storage recovery.

Provider tests use fixtures or injected fakes. CI must never call live news APIs.

## Browser journeys

Playwright covers:

- keyword search and URL synchronization;
- filtered URL reload;
- preference persistence and personalized feed request;
- mobile filter drawer apply/reset behavior;
- partial-provider warning while successful articles remain visible.

Desktop Chromium and a mobile Chromium profile run in CI.

## Quality gate

`npm run check` runs lint, architecture boundaries, strict type checks, unit tests, client build, and server build. Docker build repeats the gate before producing a runtime image.
