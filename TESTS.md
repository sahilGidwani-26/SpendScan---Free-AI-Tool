# TESTS

All automated tests are in `server/__tests__/auditEngine.test.js`.

## How to run

```bash
cd server
npm install
npm test
```

## Test coverage

| # | File | What it covers | Test name |
|---|------|----------------|-----------|
| 1 | auditEngine.test.js | Cursor Business with 3 seats → recommend Pro downgrade, savings=$60 | `Cursor Business with 3 seats should recommend downgrade to Pro` |
| 2 | auditEngine.test.js | GitHub Copilot Individual for 1 dev → optimal, no savings | `GitHub Copilot Individual for 1 developer should be optimal` |
| 3 | auditEngine.test.js | Claude Team with 2 seats (below 5-seat minimum) → recommend Pro, savings=$20 | `Claude Team with 2 seats should recommend downgrade to Pro` |
| 4 | auditEngine.test.js | ChatGPT Team with 1 user → recommend Plus, savings=$10 | `ChatGPT Team with 1 seat should recommend Plus downgrade` |
| 5 | auditEngine.test.js | High API spend ($800/mo) → recommend optimization, severity=significant | `High Anthropic API spend ($800/mo) should recommend cost optimization` |
| 6 | auditEngine.test.js | runAudit sums savings correctly across multiple tools | `runAudit should correctly sum savings across all tools` |
| 7 | auditEngine.test.js | Windsurf Pro for coding → optimal, no savings | `Windsurf Pro for coding use case should be optimal` |
| 8 | auditEngine.test.js | Cursor used for writing (wrong tool) → recommend Claude Pro switch | `Cursor used for writing should recommend switching to Claude Pro` |
| 9 | auditEngine.test.js | Gemini Enterprise with 5 seats → recommend Business, savings=$60 | `Gemini Enterprise with 5 seats should recommend Business downgrade` |
| 10 | auditEngine.test.js | runAudit returns correct number of results | `runAudit should return one result per tool submitted` |

## Test design decisions

- **Pure unit tests** — The audit engine is a pure function (input → output, no DB/network). Tests run without any external dependencies or mocks.
- **Specific savings figures** — Tests assert exact dollar amounts to catch any regression in pricing constants. If Cursor raises prices, the test breaks immediately.
- **Severity assertions** — Tests check `severity` field to ensure the UI renders the correct warning level.
- **runAudit integration** — Tests 6 and 10 test the top-level `runAudit()` function, not just individual evaluators, to catch any aggregation bugs.

## CI

Tests run automatically on every push to `main` via `.github/workflows/ci.yml`. Green check required before merge.
