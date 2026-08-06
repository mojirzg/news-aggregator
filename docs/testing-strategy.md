# Testing Strategy

## Unit and module integration

Colocated Vitest tests cover the behavior with the highest architectural risk:

- publication-date sorting and deterministic ties;
- partial provider failure isolation;
- selected-provider execution;
- normalized author filtering;
- provider request translation and response mapping;
- URL filter round-tripping;
- cancellation and flushing of debounced URL filter patches;
- versioned preferences and corrupted-storage recovery.

Provider tests use fixtures or injected fakes. CI must never call live news APIs.

## Browser journeys

Playwright covers:

- keyword search and URL synchronization;
- mobile draft filtering, Cancel/close, Apply, and Reset behavior;
- filtered URL reload;
- preference persistence and personalized feed request;
- partial-provider warning while successful articles remain visible.

The CI browser job installs Chromium and runs both the desktop Chromium and mobile Chromium projects with `NEWS_PROVIDER_MODE=mock`. Failed runs upload the HTML report as `playwright-report-<commit-sha>`.

## Quality gate

The CI workflow runs these gates from a clean checkout:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint`
3. `pnpm typecheck`
4. `pnpm test`
5. `pnpm build`
6. `pnpm test:e2e`
7. `docker build .`
8. `docker compose up` using the image built for the exact commit
9. a health check against `/api/health`

Every job writes machine-readable commit metadata and command logs. Successful source builds upload `build-<commit-sha>`. Source, browser, and container evidence is uploaded separately as `quality-gate-*-<commit-sha>`, so every artifact is tied directly to `GITHUB_SHA` rather than to screenshots.

`pnpm check` remains the local source quality gate and runs lint, architecture boundaries, strict type checks, unit tests, and both production builds. The Docker build repeats that source gate before producing the runtime image.
