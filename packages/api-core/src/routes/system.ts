import type { OpenAPIHono } from "@hono/zod-openapi";
import { exampleEchoRoute, healthRoute, readinessRoute } from "@repo/contracts";
import type { AppBindings, AppServices } from "../types.js";

export const registerSystemRoutes = (
  app: OpenAPIHono<AppBindings>,
  services: AppServices,
): void => {
  const healthPayload = {
    message: "ok",
    service: services.config.SERVICE_NAME,
    status: "ok" as const,
  };

  app.openapi(healthRoute, (context) => {
    context.get("logger").debug("health check requested");
    return context.json(healthPayload, 200);
  });

  app.openapi(readinessRoute, (context) => {
    context.get("logger").debug("readiness check requested");
    return context.json(healthPayload, 200);
  });

  app.openapi(exampleEchoRoute, (context) => {
    const { name } = context.req.valid("json");

    return context.json(
      {
        greeting: `Hello, ${name}!`,
      },
      200,
    );
  });
};
