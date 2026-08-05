# Runbook

## Health

```bash
curl http://localhost:3000/api/health
```

Expected response: HTTP 200 with `status: ok`.

## Feed returns no data

1. Check `NEWS_PROVIDER_MODE`.
2. In `live` mode, confirm all three keys exist.
3. Inspect structured logs by `requestId` and `providerId`.
4. Check provider quotas and plan restrictions.
5. Switch to `mock` mode to isolate UI/BFF behavior from external services.

## One provider fails

This is a degraded but valid state. The BFF returns HTTP 200, successful articles, and a provider result with `status: error`. Investigate the specific provider without taking down the feed.

## Build fails

Run:

```bash
pnpm install --frozen-lockfile
pnpm check
```

Do not bypass a failing type, test, or architecture gate for the submission.
