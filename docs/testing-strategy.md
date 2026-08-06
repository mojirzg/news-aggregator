# Testing Strategy

## Unit and module integration

Colocated Vitest tests cover the behavior with the highest architectural risk:

- publication-date sorting and deterministic ties;
- partial provider failure isolation and `invalid_response` classification;
- selected-provider execution;
- canonical multi-author normalization and exact case-insensitive filtering;
- malformed timestamp fixtures for Guardian, New York Times, and NewsAPI;
- provider request translation and response mapping;
- URL filter round-tripping and date-range validation;
- cancellation and flushing of debounced URL filter patches;
- stable input label, hint, error, and `aria-invalid` semantics;
- CSP directives and Sentry ingest-origin allowlisting;
- versioned preferences and corrupted-storage recovery.

Provider tests use fixtures or injected fakes. CI must never call live news APIs.

## Browser journeys

Playwright covers:

- keyword search and URL synchronization;
- mobile draft filtering, close, Apply, and Reset behavior;
- reciprocal date constraints, preserved invalid drafts, and disabled Apply;
- filtered URL reload;
- preference persistence;
- discovery of canonical authors and provider-availability feedback;
- partial-provider warning while successful articles remain visible;
- LCP image priority and explicit dimensions;
- strict response headers and a runtime CSP-violation listener;
- axe WCAG A/AA checks for key routes and the mobile modal state;
- a Firefox load-and-search smoke journey.

The CI browser job installs Chromium and Firefox. Chromium runs the deeper desktop/mobile suite; Firefox runs the focused secondary-engine smoke journey. Failed runs upload the HTML report as `playwright-report-<commit-sha>`.

## Quality gate

The CI workflow runs these gates from a clean checkout:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint`
3. `pnpm typecheck`
4. `pnpm test`
5. `pnpm build`
6. `pnpm test:e2e`
7. `docker compose config`
8. `docker compose up --build`
9. a health check against `/api/health`

Every job writes machine-readable commit metadata and command logs. Successful source builds upload `build-<commit-sha>`. Source, browser, and container evidence is uploaded separately as `quality-gate-*-<commit-sha>`, so every artifact is tied directly to `GITHUB_SHA` rather than to screenshots.

`pnpm check` remains the local source quality gate and runs lint, architecture boundaries, CSS custom-property checks, strict type checks, unit tests, and both production builds. The Docker build repeats that source gate before producing the runtime image.
