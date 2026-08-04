# Technical Interview Walkthrough

## Five-minute opening

1. State the requirements and explicit non-goals.
2. Draw the single-container modular monolith.
3. Explain why the BFF owns secrets, normalization, concurrency, and partial failure.
4. Show state ownership: URL, TanStack Query, local storage, local component state.
5. Run a partial-provider failure test and the mobile flow.

## Files worth opening

- `src/contracts/*`: shared runtime contract, not TypeScript-only trust.
- `src/server/providers/news-provider.ts`: dependency inversion boundary.
- `src/server/modules/feed/feed-aggregator.ts`: concurrency and failure isolation.
- `src/client/features/filter-articles/model/use-article-filters.ts`: URL source of truth.
- `src/client/entities/feed-preferences/*`: versioned persistence.
- `scripts/check-import-boundaries.mjs`: architecture enforcement.

## Defend these choices

- No Redux: wrong tool for this state shape.
- No microfrontends/Nx: deployment and team boundaries do not justify them.
- No semantic deduplication: high-risk domain behavior outside scope.
- Mock mode: evaluator usability without compromising the real adapter design.
- HTTP 200 on partial failure: the aggregate request succeeded with degraded source coverage; status is represented in the body.

## Questions to expect

**How would you scale provider traffic?** Add provider-aware cache and quota policies behind the same interface, then distribute the BFF only when load measurements justify it.

**How would preferences become cross-device?** Replace the storage adapter with an authenticated preferences API while preserving the UI-facing `FeedPreferences` contract.

**Why author filtering after normalization?** Provider author-query semantics are inconsistent. Post-normalization gives deterministic product behavior; for large result volumes, push supported author filters down and retain the normalized safety filter.

**What would you monitor?** Provider latency/error rate/quota, aggregate degraded-response rate, feed latency, client Web Vitals, API contract failures, and no-results rate by filter combination.
