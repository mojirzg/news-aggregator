# Production-readiness validation

This report records what is enforced by source, unit tests, browser tests, and CI. It deliberately does not invent Lighthouse numbers that were not measured against a deployed build.

## Before-and-after evidence

| Area                         | Review baseline                                                                                               | Revision evidence                                                                                                                                                                                                                                                                                          | Result to record after deployment                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Article placeholder contrast | Lighthouse reported 4.22:1, below WCAG AA for normal text.                                                    | Placeholder is now `#475467` on `#e8edf3`, a calculated contrast of 6.53:1. The Playwright axe gate covers WCAG A/AA rules.                                                                                                                                                                                | Capture the Accessibility score and attach the Lighthouse report.                                        |
| LCP article image            | The first article image was lazy-loaded and the review reported roughly three seconds of resource-load delay. | The first visible article image is eager, has `fetchpriority="high"`, and has explicit `460x340` dimensions. Later images remain lazy. Playwright asserts these attributes.                                                                                                                                | Capture mobile and desktop LCP values from the same deployed URL and test profile used for the baseline. |
| Form accessibility           | Visible labels and validation messages were not consistently programmatically associated.                     | Shared `Input` generates a stable id, binds `label[for]`, preserves explicit `aria-invalid`, and composes hint/error ids in `aria-describedby`. Unit and axe tests enforce the behavior.                                                                                                                   | No manual exception expected. Record axe and Lighthouse results.                                         |
| CSP                          | A browser CSP issue was reported despite source-level security controls.                                      | All React inline style props were removed. Drawer scroll locking now toggles a CSS class instead of mutating `body.style`. CSP blocks inline script/style attributes and allowlists only the configured Sentry ingest origin. Unit and browser tests assert headers and listen for runtime CSP violations. | Verify the deployed response headers and browser console with monitoring both disabled and enabled.      |
| Date validation              | The API rejected descending ranges, but the form allowed invalid drafts without clear reciprocal feedback.    | Date inputs now set reciprocal `min`/`max`, expose an inline alert, preserve the draft, and prevent mobile Apply until valid. Desktop never commits the invalid endpoint. Unit and Playwright coverage are included.                                                                                       | No manual exception expected.                                                                            |

The feed remains client-fetched, so a provider image URL cannot appear in the initial HTML document without introducing SSR/streaming or a server-generated preload contract. This revision removes the avoidable lazy-loading delay and adds a high-priority hint; the remaining initial-document discovery limitation is explicit rather than hidden behind a false Lighthouse claim.

## Automated gates

A clean CI run must produce evidence for all of the following:

1. ESLint, import-boundary validation, and CSS custom-property validation.
2. Strict client and server TypeScript checks.
3. Vitest unit and module tests, including accessibility semantics, author normalization, malformed provider timestamps, CSP directives, and feed failure classification.
4. Production client/server builds and `dist/bundle-report.html` with gzip and Brotli sizes.
5. Chromium desktop and mobile journeys, including axe WCAG checks and response-header assertions.
6. A Firefox smoke journey for loading and searching the feed.
7. Docker Compose configuration, image build, startup, and health verification.

Test counts and bundle sizes are intentionally read from the CI logs and generated artifacts instead of being hard-coded here; hard-coded values become false as soon as a test is added or a bundle changes.

## Manual release verification

Run against the exact release candidate, not the Vite development server:

```bash
NEWS_PROVIDER_MODE=mock pnpm build
NEWS_PROVIDER_MODE=mock pnpm start
pnpm test:e2e
```

Then capture:

- Lighthouse mobile and desktop reports for `/`, including LCP, CLS, INP/TBT proxy, Accessibility, Best Practices, and the LCP request-discovery diagnostics;
- browser DevTools `securitypolicyviolation` events and response headers with no Sentry DSN;
- the same CSP check with `SENTRY_DSN` and `VITE_SENTRY_DSN` configured to the same project DSN;
- `dist/bundle-report.html` and the production asset sizes;
- the CI run URL and `quality-gate-*` artifacts tied to the release commit.

## Known production limitations

The following remain deliberately outside the five-day assessment scope:

- globally consistent pagination across providers with incompatible paging models;
- authentication and server-synchronized preferences;
- semantic cross-provider deduplication, clustering, or recommendation ranking;
- long-term production operation, quota dashboards, WAF controls, and managed secret rotation.

These are not forgotten features. Adding them without product requirements would increase architecture and operational cost while weakening the assignment's KISS constraint.
