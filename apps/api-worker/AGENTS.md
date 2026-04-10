# Package Guide

## Purpose

`apps/api-worker` proves the shared app can run in a worker-style runtime without Node-only imports.

## Edit rules

- Keep the adapter thin
- Avoid introducing Node dependencies
- If worker env handling changes, keep it aligned with `@repo/config`
