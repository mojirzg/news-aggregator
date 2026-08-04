# API Contract

## `GET /api/feed`

Query parameters:

| Parameter    | Type                   | Meaning                                                               |
| ------------ | ---------------------- | --------------------------------------------------------------------- |
| `query`      | string                 | Keyword, maximum 160 characters                                       |
| `sourceIds`  | comma-separated enum   | `guardian`, `nyt`, `newsapi`; empty means all                         |
| `categories` | comma-separated enum   | business, technology, science, sports, health, entertainment, general |
| `authors`    | comma-separated string | Case-insensitive normalized-author match                              |
| `dateFrom`   | `YYYY-MM-DD`           | Inclusive lower bound                                                 |
| `dateTo`     | `YYYY-MM-DD`           | Inclusive upper bound                                                 |

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
      "author": "Author Name",
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
