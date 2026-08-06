# Security

- Provider API keys exist only in the server environment.
- No provider secret is exposed through `VITE_` variables or serialized BFF errors.
- Helmet applies CSP, frame, MIME, referrer, and related browser protections.
- CSP uses `script-src 'self'`, `style-src 'self'`, and blocks script/style attributes; it does not grant `unsafe-inline`.
- The mobile drawer locks scrolling with a generated CSS class instead of mutating `body.style`, so the interaction remains compatible with strict `style-src-attr 'none'`.
- When monitoring is enabled, the server derives exactly one `connect-src` origin from `SENTRY_DSN`. `VITE_SENTRY_DSN` embeds the client DSN at build time; both values should identify the same Sentry project.
- Docker Compose passes the client monitoring values as build arguments and the server DSN at runtime.
- API requests are rate limited.
- JSON bodies have a small size limit.
- Request IDs support incident correlation without logging authorization or cookie headers.
- Pino redacts common secret fields.
- External URLs open with `noopener noreferrer`.
- External API payloads are untrusted and validated with Zod, including provider timestamps.
- The container runs as an unprivileged user.

Unit tests assert the generated directives and Sentry origin. Playwright asserts production response headers and listens for browser `securitypolicyviolation` events while opening the mobile drawer.

For a public production system, add upstream WAF controls, managed secret storage, observability export, provider quota dashboards, dependency/SBOM scanning, and automated deployed-environment header monitoring.
