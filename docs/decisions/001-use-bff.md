# ADR 001 — Use a BFF

**Status:** Accepted

The browser must not own provider credentials or provider-specific response mapping. A small Node BFF protects keys, validates inputs and outputs, normalizes incompatible APIs, executes requests concurrently, and exposes one stable client contract.
