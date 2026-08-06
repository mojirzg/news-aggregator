# Signal News — innoscripta Frontend Take-Home

A news aggregator built as a **modular monolith**: one React application, one Node BFF, one Docker container, and three provider adapters.

## What is implemented

- React + TypeScript responsive interface.
- Keyword search with URL-backed state.
- Date, category, and provider filters.
- Personalized feed using versioned local-storage preferences and canonical multi-author data.
- Guardian, New York Times, and NewsAPI adapters.
- Runtime validation for provider responses, API contracts, query parameters, environment variables, and preferences.
- Concurrent provider requests with timeout, abort propagation, deterministic sorting, and partial-failure isolation.
- Mock provider mode so evaluators can run the complete product without API credentials.
- Unit/module tests, axe accessibility gates, Chromium and Firefox Playwright journeys, Docker, health checks, strict CSP, rate limiting, structured logs, and CI.

## Prerequisites

- Node.js 22+
- pnpm 10+
- Docker 24+ for container execution

## Local setup

```bash
cp .env.example .env
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to the BFF on port `3000`.

The committed `pnpm-lock.yaml` is used by local development, CI, and Docker for deterministic installs.

## Provider modes

`NEWS_PROVIDER_MODE=mock` is the default and returns deterministic data from all three provider identities.

`NEWS_PROVIDER_MODE=live` requires every credential:

```env
GUARDIAN_API_KEY=
NYT_API_KEY=
NEWS_API_KEY=
```

`NEWS_PROVIDER_MODE=auto` uses a live adapter when its key exists and the equivalent mock adapter otherwise. Provider credentials are server-only and must never use a `VITE_` prefix.

## Monitoring and CSP

Browser monitoring is optional. When enabled, set both DSN variables to the same Sentry project:

```env
VITE_SENTRY_DSN=https://public-key@example.ingest.sentry.io/project-id
SENTRY_DSN=https://public-key@example.ingest.sentry.io/project-id
```

`VITE_SENTRY_DSN` is embedded in the client build. `SENTRY_DSN` remains server runtime configuration and is used only to add the exact ingest origin to CSP `connect-src`. The DSN is a public ingestion identifier, not a provider API secret.

## Commands

```bash
pnpm dev          # client + BFF with watch mode
pnpm lint         # ESLint + import boundaries + CSS token validation
pnpm typecheck    # strict client/server TypeScript checks
pnpm test         # Vitest unit and module tests
pnpm exec playwright install chromium firefox # one-time browser setup
pnpm test:e2e     # Chromium desktop/mobile + Firefox smoke + axe
pnpm build        # production client and server bundles
pnpm check        # complete quality gate
pnpm start        # serve built BFF and React assets
```

## Docker

```bash
cp .env.example .env
docker compose up --build
```

Open `http://localhost:3000`. The container exposes:

- `GET /api/feed`
- `GET /api/health`
- React production assets and SPA fallback

## API example

```text
GET /api/feed?query=climate&sourceIds=guardian,nyt&categories=science&dateFrom=2026-01-01
```

See [docs/api-contract.md](docs/api-contract.md) for the normalized response.

## Architecture summary

Client dependency direction is enforced:

```text
app → pages → widgets → features → entities → shared
```

Server flow:

```text
Express route → FeedService → NewsProvider implementations → external API
```

Details and trade-offs are documented in [docs/architecture.md](docs/architecture.md). Measurable release evidence and the honest Lighthouse follow-up checklist are in [docs/production-readiness-validation.md](docs/production-readiness-validation.md).

## Known limitations

- No cross-provider semantic deduplication or story clustering.
- No globally consistent pagination across incompatible providers.
- Preferences are local to the browser and are not synchronized to a user account.
- NewsAPI category filtering is translated into query terms because its `everything` endpoint does not expose the same category semantics as the other providers.
- Live API quotas and development-plan restrictions remain provider-specific.
- Exact initial-document discovery of the first provider image would require SSR/streaming or a server-generated preload contract; the current client-rendered feed removes lazy-loading delay but cannot advertise an unknown image URL in the initial HTML.

These items were excluded to keep the assessment focused; the trade-offs are documented in the ADRs.
