# Modern API Boilerplate

Portable TypeScript API starter built as a small pnpm workspace monorepo.

## What this includes

- Hono-based shared app core with REST + OpenAPI
- Node adapter and Cloudflare Worker adapter
- Strict TypeScript + ESM
- Zod contracts shared across validation, types, and OpenAPI
- Biome, Vitest, tsup, and tsx
- OpenTelemetry-first observability with optional Sentry
- Agent-oriented repo docs and package boundaries

## Workspace layout

- `apps/api-node`: Node runtime, local server, Docker entrypoint, OTEL bootstrap
- `apps/api-worker`: Cloudflare Worker adapter proving runtime portability
- `packages/api-core`: runtime-neutral app assembly and middleware
- `packages/contracts`: route definitions, DTOs, and OpenAPI generation
- `packages/config`: typed env parsing for Node and Worker runtimes

## Quick start

```bash
pnpm install
pnpm dev:node
```

Then open:

- `http://localhost:3000/healthz`
- `http://localhost:3000/readyz`
- `http://localhost:3000/openapi.json`
- `http://localhost:3000/docs`

## Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm openapi:generate
pnpm openapi:check
pnpm verify
```

## Environment

Copy `.env.example` to `.env` when you want local overrides. Everything is validated on startup.

## Docs

- [AGENTS.md](./AGENTS.md)
- [docs/architecture.md](./docs/architecture.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
