# Submission Checklist

Do not submit the repository until every item below is true.

## Required

- Run `npm install` and commit `package-lock.json`.
- Run `npm run check` with zero warnings treated as ignored technical debt only where documented.
- Run `npx playwright install chromium` and `npm run test:e2e`.
- Run `docker compose up --build` and verify `/`, `/for-you`, `/preferences`, and `/api/health`.
- Test once with `NEWS_PROVIDER_MODE=mock` and once with valid live credentials.
- Verify no API key appears in client JavaScript, browser network responses, logs, screenshots, or Git history.
- Replace repository metadata, author information, and deployment URL before sending.

## Demonstration sequence

1. Open the News page and search for `performance`.
2. Apply source, category, and date filters; reload the URL.
3. Save source/category/author preferences and open For You.
4. Run the partial-provider Playwright test.
5. Show the provider interface and add-provider extension path.
6. Explain why deduplication, global pagination, Redux, microfrontends, and authentication are explicit non-goals.

## Do not do this

- Do not add technology solely to make the repository look larger.
- Do not expose provider keys through `VITE_` variables.
- Do not claim live-provider behavior was verified unless you actually tested it.
- Do not submit without a dependency lock file.
