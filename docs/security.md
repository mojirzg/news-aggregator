# Security

- Provider API keys exist only in the server environment.
- No provider secret is exposed through `VITE_` variables or serialized BFF errors.
- Helmet applies CSP, frame, MIME, referrer, and related browser protections.
- CSP uses `script-src 'self'`, `style-src 'self'`, and blocks script/style attributes; it does not grant `unsafe-inline`.
- The mobile drawer locks scrolling with a generated CSS class instead of mutating `body.style`, so the interaction remains compatible with strict `style-src-attr 'none'`.
- When monitoring is enabled, the server derives exactly one additional `connect-src` origin from `SENTRY_DSN`, falling back to the server process's `VITE_SENTRY_DSN` value when `SENTRY_DSN` is absent. `VITE_SENTRY_DSN` also embeds the client DSN at build time; setting both to the same project avoids a client/CSP mismatch.
- Docker Compose passes the client monitoring values as build arguments and the server DSN at runtime.
- API requests are rate limited.
- JSON bodies have a small size limit.
- Request IDs support incident correlation without logging authorization or cookie headers.
- Pino redacts common secret fields.
- External URLs open with `noopener noreferrer`.
- External API payloads are untrusted and validated with Zod, including provider timestamps.
- The container runs as an unprivileged user.

For a public production system, add upstream WAF controls, managed secret storage, observability export, provider quota dashboards, dependency/SBOM scanning, and automated deployed-environment header monitoring.
