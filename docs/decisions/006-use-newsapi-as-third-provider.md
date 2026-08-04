# ADR 006 — Use NewsAPI as the third provider

**Status:** Accepted

The assessment explicitly permits NewsAPI.org. This implementation uses Guardian, New York Times, and NewsAPI because all three fit the same server-side JSON adapter model and can be exercised within the five-day scope. The provider interface keeps the third adapter replaceable; adding BBC later does not require changing the aggregation algorithm or client contract.
