# AI Workflow

## Purpose
Use AI to speed up maintenance and small feature work without weakening the repository's architecture. The safest starting point is test generation, refactors inside one domain, and documentation updates.

## Recommended AI Tasks
Good fits for AI in this repository:
- add or update unit tests under `test/unit/`
- implement small DOM adapter changes in `Infrastructure/Dom/`
- refactor interface names or method signatures across one domain
- review dependency update PRs for runtime and test risk
- improve README and contributor documentation
- run `npm run format:check` as part of change validation for source edits

Avoid using AI for broad rewrites across all domains in a single pass.

## Architecture Guardrails
AI changes should preserve the current structure:
- keep contracts in `Domain/` and browser code in `Infrastructure/Dom/`
- do not introduce direct DOM manipulation into `Domain/` interfaces
- when an interface changes, update all affected adapters and tests in the same change
- mirror source paths in tests, for example `src/Player/.../PlayerDom.ts` with `test/unit/Player/.../PlayerDom.test.ts`

## Standard Prompt Pattern
Use prompts with explicit scope and acceptance criteria.

Example:

```text
Update `src/Enemy/Infrastructure/Dom/EnemyDom.ts` to support X.
Keep changes inside the Enemy domain unless a shared interface must change.
Add or update Jest tests under `test/unit/Enemy/`.
Do not change unrelated formatting.
Run `npm test` and `npm run lint`.
```

## Validation Checklist
Require AI-generated changes to pass these checks before review:
- `npm run lint`
- `npm test`
- `npm run format:check`
- `npm run test:coverage` for non-trivial gameplay or architecture changes

## Review Rules
Human review should focus on:
- domain boundaries staying intact
- missing test updates when interfaces change
- naming consistency, especially `Interface` and `Dom` suffixes
- accidental edits in unrelated domains
- generated code that duplicates existing behavior

## First Pilot Tasks
Use one of these as an initial AI-assisted task:
- add tests for uncovered behavior in `src/Game.ts`
- add a small dashboard enhancement in `src/IO/Infrastructure/Dom/Dashboard/`
