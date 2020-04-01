# Pat's API boilerplate

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) ![CI Status](https://travis-ci.org/batjko/api-boilerplate.svg?branch=master 'CI Status')

## Shit included:

1. **Fastify** as the API server (fast and comes eith **Pino** out of the box)
2. **AVA** and **supertest** for testing
3. **Flow** for totally optional type annotations
4. **Standardjs** and **Prettier** for never-think-of-it-again code formatting

## Design

The thing is designed to be simple but extendable.

For example:

- Fastify makes the service very lightweight and fast. Just add routes under the routes folder and `app.register(myRoute)` them in app.js or whatever.

> An example route is the /healthCheck one, which also has an integration test (see below), and can be used to report service health to some monitoring solution.

- `config.js` holds all app-level configurations the rest of the app could use. The whole config object can be overridden at launch/deployment time using a `CONFIG` environment variable.

- Write some bloody tests, man. Ava is super simple and I have added examples for unit and integration tests.

> `npm run test` for unit tests
> `npm run test:int` for integration tests

- The built-in logger is doing a few convenience tasks, but is really just a thin wrapper around pino. Outputs logs in JSON, ready for ELK or other centralised monitoring.

That's it.
Now go build your shit.

## Todo:

- [x] Dockerfile and docker-compose config
- [ ] K8s service definitions
- [x] Some CI config
- [ ] Migrate from Flow to Typescript?
- [x] Replace Koa with Fastify
