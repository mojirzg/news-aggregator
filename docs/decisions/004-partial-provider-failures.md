# ADR 004 — Partial provider failures

**Status:** Accepted

Provider requests are independent and use failure isolation. One failed provider must not discard successful articles from the others. The response explicitly reports each provider status so the UI can communicate degraded results honestly.
