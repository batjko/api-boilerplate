# Architecture

## Core shape

This boilerplate is a transport-only API starter. The shared HTTP application lives in `packages/api-core`, contracts live in `packages/contracts`, and runtime-specific adapters live under `apps/`.

## Request lifecycle

1. Runtime adapter parses immutable config
2. Adapter initializes logging and optional observability
3. Adapter creates the shared app via `createApp()`
4. Shared middleware applies request ID, security headers, CORS, and request logging
5. Routes validate requests from shared Zod/OpenAPI contracts
6. Errors are mapped to the standard error envelope

## Contract flow

The same route definitions are used for:

- runtime validation
- TypeScript inference
- OpenAPI generation
- OpenAPI artifact drift checks

## Runtime split

- `apps/api-node` is the primary production target for containers
- `apps/api-worker` is the portability proof target

Shared packages must not depend on Node-specific APIs.
