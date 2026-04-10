import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import type { Context } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { toErrorEnvelope } from "./errors.js";
import { registerSystemRoutes } from "./routes/system.js";
import type { AppBindings, AppServices } from "./types.js";

const getRequestId = (context: Context<AppBindings>): string => {
  return context.get("requestId");
};

const logResponse = async (
  context: Context<AppBindings>,
  next: () => Promise<void>,
): Promise<void> => {
  const start = performance.now();
  await next();
  const durationMs = Math.round(performance.now() - start);
  context.get("logger").info("request completed", {
    durationMs,
    method: context.req.method,
    path: context.req.path,
    requestId: getRequestId(context),
    status: context.res.status,
  });
};

export const createApp = (services: AppServices): OpenAPIHono<AppBindings> => {
  const app = new OpenAPIHono<AppBindings>({
    defaultHook: (result, context) => {
      if (result.success) {
        return undefined;
      }

      const requestId = getRequestId(context);
      context.get("logger").warn("request validation failed", {
        issues: result.error.issues,
        requestId,
      });

      return context.json(
        toErrorEnvelope(
          "invalid_request",
          "Request validation failed",
          requestId,
          result.error.flatten(),
        ),
        400,
      );
    },
  });

  app.use("*", requestId());
  app.use("*", async (context, next) => {
    const currentRequestId = getRequestId(context);
    const logger = services.logger.child({
      method: context.req.method,
      path: context.req.path,
      requestId: currentRequestId,
    });

    context.set("logger", logger);
    await next();
  });
  app.use("*", secureHeaders());
  app.use(
    "*",
    cors({
      origin:
        services.config.CORS_ORIGIN.length === 1
          ? services.config.CORS_ORIGIN[0]
          : services.config.CORS_ORIGIN,
    }),
  );
  app.use("*", logResponse);

  app.notFound((context) => {
    return context.json(
      toErrorEnvelope("not_found", "Route not found", getRequestId(context)),
      404,
    );
  });

  app.onError((error, context) => {
    const requestId = getRequestId(context);
    context.get("logger").error("unhandled request error", {
      error,
      requestId,
    });

    return context.json(
      toErrorEnvelope(
        "internal_error",
        services.config.NODE_ENV === "production"
          ? "Internal server error"
          : error.message || "Internal server error",
        requestId,
      ),
      500,
    );
  });

  app.doc("/openapi.json", {
    info: {
      title: services.config.SERVICE_NAME,
      version: "1.0.0",
    },
    openapi: "3.1.0",
  });

  app.get(
    "/docs",
    apiReference({
      pageTitle: `${services.config.SERVICE_NAME} API`,
      spec: {
        url: "/openapi.json",
      },
      theme: "kepler",
    }),
  );

  registerSystemRoutes(app, services);

  return app;
};

export * from "./errors.js";
export * from "./types.js";
