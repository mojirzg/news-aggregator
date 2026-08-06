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
  → validate external payloads
  → map to Article
  → isolate provider failures
  → apply normalized author filter
  → sort by publishedAt descending
  → validate unified response
```

Provider-specific query translation and response mapping are confined to each adapter. The aggregator knows only the `NewsProvider` interface.

## Adding a fourth provider

1. Add a provider directory with config, request mapper, runtime response schema, mapper, client, adapter, and tests.
2. Implement `NewsProvider`.
3. Register it in `provider-registry.ts`.
4. Extend `ProviderId` and UI metadata.

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

The production client uses Sentry Browser Tracing for real-user
performance monitoring.

Captured signals include:

- Core Web Vitals: LCP, INP and CLS
- page-load and route-navigation duration
- `/api/feed` request latency
- JavaScript exceptions
- partial provider failures
- long browser tasks

Lighthouse is used for local synthetic auditing. Sentry is used for
field data from actual sessions.

Search terms, author preferences, authorization headers and provider
credentials are not attached to monitoring events.
