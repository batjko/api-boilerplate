# Contributing

## Workflow

1. Install dependencies with `pnpm install`
2. Run the relevant dev command for the adapter you are touching
3. Make contract changes in `packages/contracts` before touching handlers
4. Regenerate and check the OpenAPI artifact when contract surfaces change
5. Run `pnpm verify` before opening a PR

## Change rules

- Public payload and schema changes must start in `packages/contracts`
- Node-only libraries stay in `apps/api-node`
- New middleware should be added in `packages/api-core`
- Agent guidance and architecture docs must be updated when package boundaries or commands change

## Pull requests

Every PR should answer:

- Did the public contract change?
- Did runtime behavior or observability change?
- Were docs and `AGENTS.md` updated if structure or commands changed?
