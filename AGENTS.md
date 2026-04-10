# Agent Guide

## Repo map

- `apps/api-node`: Node adapter, process bootstrap, Docker runtime, OTEL startup
- `apps/api-worker`: Worker adapter and worker-local tests
- `packages/api-core`: shared Hono app factory, middleware, route binding, error handling
- `packages/contracts`: route contracts, schemas, DTOs, OpenAPI document generation
- `packages/config`: env schemas and typed runtime config parsing
- `scripts`: repo automation such as OpenAPI generation/checks

## Ownership boundaries

- Route schemas and public payloads belong in `packages/contracts`
- Route handlers, middleware wiring, and error mapping belong in `packages/api-core`
- Runtime-specific logging and observability belong in the adapter apps
- Do not import Node-only libraries into `packages/api-core` or `packages/contracts`

## Required commands before handoff

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm openapi:check
```

## Edit rules

- If you change a route contract, update or regenerate `apps/api-node/openapi/openapi.json`
- Keep request/response typing code-first from the Zod/OpenAPI contract source
- Preserve the standard error envelope: `{ error: { code, message, requestId, details? } }`
- Preserve `/healthz`, `/readyz`, `/openapi.json`, and `/docs`
- Prefer package-local changes; avoid cross-package edits unless the contract actually changes

## Runtime invariants

- `packages/api-core` must stay runtime-neutral
- `apps/api-node` owns Pino and OTEL bootstrap
- `apps/api-worker` proves the same shared app can run outside Node
- Config parsing must remain fail-fast and immutable
