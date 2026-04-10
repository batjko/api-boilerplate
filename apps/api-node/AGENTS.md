# Package Guide

## Purpose

`apps/api-node` owns the Node runtime entrypoint, logging, OTEL/Sentry bootstrap, and container-facing startup behavior.

## Edit rules

- Keep runtime-neutral behavior in `@repo/api-core`
- Logging changes belong here, not in shared packages
- Startup must stay fail-fast on invalid config
- Graceful shutdown and startup errors should remain explicit
