# API Contract

## `GET /api/feed`

Query parameters:

| Parameter    | Type                        | Meaning                                                                                                    |
| ------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `query`      | string                      | Trimmed keyword, maximum 160 characters                                                                    |
| `sourceIds`  | comma-separated or repeated | `guardian`, `nyt`, `newsapi`; omitted/empty means all                                                      |
| `categories` | comma-separated or repeated | business, technology, science, sports, health, entertainment, general                                      |
| `authors`    | comma-separated or repeated | Exact case-insensitive match against normalized canonical authors; each value is limited to 100 characters |
| `dateFrom`   | `YYYY-MM-DD`                | Inclusive lower bound                                                                                      |
| `dateTo`     | `YYYY-MM-DD`                | Inclusive upper bound; cannot precede `dateFrom`                                                           |

Duplicate source, category, and author values are removed before provider execution. Unknown enum values and invalid dates return HTTP 400.

Response:

```json
{
  "articles": [
    {
      "id": "guardian:technology/example",
      "url": "https://example.com/article",
      "title": "Article title",
      "description": "Optional summary",
      "imageUrl": "https://example.com/image.jpg",
      "authors": ["Author One", "Author Two"],
      "publishedAt": "2026-08-04T12:00:00.000Z",
      "keywords": ["optional"],
      "categories": ["technology"],
      "source": { "id": "guardian", "name": "The Guardian" }
    }
  ],
  "providers": [
    { "providerId": "guardian", "status": "success", "articleCount": 10 },
    {
      "providerId": "nyt",
      "status": "error",
      "articleCount": 0,
      "errorCode": "invalid_response",
      "errorMessage": "This source is temporarily unavailable."
    }
  ],
  "generatedAt": "2026-08-04T12:00:01.000Z"
}
```

Errors use this envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid feed filters.",
    "requestId": "uuid"
  }
}
```

Validation errors also include a Zod-derived `error.details` object. Application-generated error envelopes include `requestId` when one is available. The rate limiter is an exception: it returns HTTP 429 with `RATE_LIMITED` and a message, but its configured response body does not include `requestId`.

Successful feed responses include `Cache-Control: private, max-age=30, stale-while-revalidate=60`.

## Provider failures

Provider failures keep successful articles from other sources. Failed provider entries include a safe `errorCode` (`timeout`, `rate_limited`, `unauthorized`, `invalid_response`, `network_error`, `aborted`, or `unknown`) and a generic user-facing `errorMessage`. Raw upstream response bodies and credentials are never returned to the client.

Provider timestamps must pass ISO date-time validation before mapping. Malformed timestamps are classified as `invalid_response`; mappers never call `toISOString()` on an unvalidated provider value.
