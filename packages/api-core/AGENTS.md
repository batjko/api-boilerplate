# Package Guide

## Purpose

`packages/api-core` owns shared Hono app assembly. Keep it runtime-neutral.

## Allowed imports

- `hono`
- `@hono/zod-openapi`
- shared workspace packages
- fetch-standard APIs

## Disallowed imports

- `node:*`
- `pino`
- OpenTelemetry Node SDK packages
- Docker or process bootstrap concerns

## Edit rules

- New routes should consume contracts from `@repo/contracts`
- Preserve the standard error envelope and request ID propagation
- Keep docs endpoints and middleware wired at the shared-app layer
