import { createRoute, z } from "@hono/zod-openapi";

export const healthResponseSchema = z
  .object({
    message: z.string().openapi({ example: "ok" }),
    service: z.string().openapi({ example: "api-boilerplate" }),
    status: z.enum(["ok"]).openapi({ example: "ok" }),
  })
  .openapi("HealthResponse");

export const errorEnvelopeSchema = z
  .object({
    error: z.object({
      code: z.string().openapi({ example: "invalid_request" }),
      details: z.unknown().optional(),
      message: z.string().openapi({ example: "Request validation failed" }),
      requestId: z
        .string()
        .openapi({ example: "f3a3ce38-66f0-4425-82b6-fce8db85b95b" }),
    }),
  })
  .openapi("ErrorEnvelope");

export const exampleEchoBodySchema = z
  .object({
    name: z.string().min(1).openapi({ example: "Pat" }),
  })
  .openapi("ExampleEchoBody");

export const exampleEchoResponseSchema = z
  .object({
    greeting: z.string().openapi({ example: "Hello, Pat!" }),
  })
  .openapi("ExampleEchoResponse");

const defaultErrorResponses = {
  400: {
    content: {
      "application/json": {
        schema: errorEnvelopeSchema,
      },
    },
    description: "Bad request",
  },
  500: {
    content: {
      "application/json": {
        schema: errorEnvelopeSchema,
      },
    },
    description: "Server error",
  },
} as const;

export const healthRoute = createRoute({
  method: "get",
  path: "/healthz",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: healthResponseSchema,
        },
      },
      description: "Liveness probe",
    },
    ...defaultErrorResponses,
  },
  summary: "Liveness check",
  tags: ["system"],
});

export const readinessRoute = createRoute({
  method: "get",
  path: "/readyz",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: healthResponseSchema,
        },
      },
      description: "Readiness probe",
    },
    ...defaultErrorResponses,
  },
  summary: "Readiness check",
  tags: ["system"],
});

export const exampleEchoRoute = createRoute({
  method: "post",
  path: "/examples/echo",
  request: {
    body: {
      content: {
        "application/json": {
          schema: exampleEchoBodySchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: exampleEchoResponseSchema,
        },
      },
      description: "Echoes a greeting",
    },
    ...defaultErrorResponses,
  },
  summary: "Example typed route",
  tags: ["examples"],
});
