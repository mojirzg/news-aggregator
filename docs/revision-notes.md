# Revision notes

This revision focuses on submission credibility, failure handling, semantics, and simplicity.

- Standardized local development, CI, and Docker on pnpm with a frozen lockfile.
- Added a GitHub Actions quality gate.
- Removed generated `dist` output and evaluator-only rehearsal documents.
- Fixed the preferences saved-state bug and added visible validation feedback.
- Replaced the invalid button label element with semantic text.
- Removed provider debug logging in favor of the existing structured feed logging.
- Added safe provider failure codes and separated request cancellation from provider outages.
- Changed preferred-author matching to exact normalized, case-insensitive matching.
- Replaced feed virtualization and nested scrolling with a normal accessible document flow.
- Replaced conditional provider construction with a typed provider-definition registry.
- Moved feed orchestration from the page layer into a widget boundary.
- Added request-cancellation coverage and updated timeout/failure tests.
