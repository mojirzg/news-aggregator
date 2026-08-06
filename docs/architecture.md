# Architecture

## Decision

The application is a modular monolith. It has one React client, one Express BFF, shared runtime contracts, and one deployable container. This is enough structure to demonstrate scale without introducing workspace, package, microfrontend, or microservice overhead.

## Client boundaries

```text
app
 ↓
pages
 ↓
widgets
 ↓
features
 ↓
entities
 ↓
shared
```

The `scripts/check-import-boundaries.mjs` quality gate rejects imports from a lower layer into a higher layer. Barrel files exist only at public module boundaries.

## State ownership

| State                       | Owner                   | Reason                                           |
| --------------------------- | ----------------------- | ------------------------------------------------ |
| Search and public filters   | URL search parameters   | Shareable, reload-safe, browser navigation works |
| Feed data and request state | TanStack Query          | Cache, retry, background refresh, cancellation   |
| Feed preferences            | Versioned local storage | Assessment has no authentication or profile API  |
| Filter drawer draft         | Local component state   | Temporary and discarded on cancel                |

Redux is intentionally absent. There is no complex cross-feature client state that justifies it.

## BFF data flow

```text
GET /api/feed
  → validate normalized query
  → select providers
  → request concurrently
  → validate external payloads and timestamps
  → normalize provider bylines into canonical author arrays
  → map to Article
  → isolate provider failures
  → apply exact case-insensitive canonical-author filtering
  → sort by publishedAt descending
  → validate unified response
```

Provider-specific query translation and response mapping are confined to each provider implementation. `FeedService` depends only on the `NewsProvider` interface and performs provider selection, concurrent execution, failure isolation, author filtering, and final sorting.

## Author personalization

Provider bylines are untrusted presentation strings, not stable identities. Each adapter normalizes values such as `By Jane Smith, Reuters` or `Jane Smith and John Doe` into a canonical `authors: string[]` contract. Feed filtering compares canonical names case-insensitively instead of comparing a preference with the complete upstream byline.

The preferences page reads authors from successful feed entries already cached by TanStack Query. Suggestions are grouped with the provider ids where they were observed. Manual entry remains available, and selected authors are explicitly marked when they were discovered but are unavailable from the currently selected providers.

## Adding a fourth provider

1. Extend `providerIdSchema` in `src/contracts/provider.contract.ts` and the client provider metadata.
2. Add a provider implementation of `NewsProvider`, including URL construction, a runtime response schema, response mapping, and tests.
3. Add its API-key field to the server environment schema and environment loader.
4. Register the live and mock implementations in `provider-registry.ts` and add deterministic mock articles.

The aggregation algorithm does not change.

## Failure handling

- One provider failure: successful articles remain visible and a status banner names the failed source.
- All providers fail: fatal feed state with retry action.
- Empty successful response: no-results state with a clear-filters action.
- Background refresh: current results remain visible while the result count reports refreshing.
- Client disconnect: BFF abort signal propagates into provider requests.

## Build and deployment

Vite builds the client to `dist/client`. tsup bundles the server entry to `dist/server/index.js`. The production Express process serves both `/api/*` and static React assets.

## Performance observability

When `VITE_SENTRY_DSN` is present at build time, the production client initializes Sentry Browser Tracing. It records SDK-provided page-load/navigation instrumentation, JavaScript exceptions, a custom feed-loading span, and warning events for partial provider failures.

The separate `web-vitals` integration logs CLS, FCP, INP, LCP, and TTFB to the browser console in development only; this implementation does not explicitly send those measurements to Sentry. Lighthouse remains a manual synthetic-audit tool and is not run by the application.

Search terms, author preferences, authorization headers and provider
credentials are not attached to monitoring events.
