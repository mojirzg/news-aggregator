# Security

- Provider API keys exist only in the server environment.
- No secret is exposed through `VITE_` variables or serialized BFF errors.
- Helmet applies CSP, frame, MIME, and related browser protections.
- API requests are rate limited.
- JSON bodies have a small size limit.
- Request IDs support incident correlation without logging authorization or cookie headers.
- Pino redacts common secret fields.
- External URLs open with `noopener noreferrer`.
- External API payloads are untrusted and validated with Zod.
- The container runs as an unprivileged user.

For a public production system, add upstream WAF controls, managed secret storage, observability export, provider quota dashboards, and dependency/SBOM scanning.
