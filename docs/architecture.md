# Architecture

Signal News is a modular monolith: one React client, one Express BFF, shared
runtime contracts, and one deployable Docker container.

## State ownership

| State | Owner | Reason |
| --- | --- | --- |
| Search and public filters | URL search parameters | Shareable and reload-safe |
| Feed data and request state | TanStack Query | Caching, retries, and cancellation |
| Feed preferences | Versioned local storage | No authentication is required for the assignment |
| Mobile filter draft | Local component state | Discarded until the user applies it |

Redux is intentionally absent: the application has no complex shared client
state that needs it.

## Data flow

`GET /api/feed` validates filters, requests the selected providers concurrently,
normalizes their responses into a shared article shape, isolates individual
provider failures, applies author filters, and sorts the result. Provider-specific
request and response handling stays inside each adapter.

One failed provider leaves successful articles visible with a status message;
when all providers fail, the user receives a retry state. Adding a provider means
adding its adapter, schema, environment variable, registry entry, and tests.
