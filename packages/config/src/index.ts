import { z } from "zod";

export const logLevelSchema = z.enum([
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
  "silent",
]);

const baseConfigSchema = z.object({
  CORS_ORIGIN: z
    .string()
    .default("*")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  LOG_LEVEL: logLevelSchema.default("info"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  SENTRY_DSN: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  SENTRY_ENVIRONMENT: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined),
  SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(0),
  SERVICE_NAME: z.string().trim().min(1).default("api-boilerplate"),
});

const nodeConfigSchema = baseConfigSchema.extend({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

const workerConfigSchema = baseConfigSchema.extend({});

export type BaseConfig = z.output<typeof baseConfigSchema>;
export type NodeConfig = z.output<typeof nodeConfigSchema>;
export type WorkerConfig = z.output<typeof workerConfigSchema>;

const formatParseError = (error: z.ZodError): string => {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "root";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
};

const parse = <T>(
  schema: z.ZodSchema<T>,
  input: unknown,
  runtime: string,
): T => {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw new Error(
      `Invalid ${runtime} configuration: ${formatParseError(result.error)}`,
    );
  }

  return Object.freeze(result.data);
};

export const loadNodeConfig = (
  env: NodeJS.ProcessEnv = process.env,
): NodeConfig => {
  return parse(nodeConfigSchema, env, "node");
};

export type WorkerEnvInput = Record<string, string | undefined>;

export const loadWorkerConfig = (env: WorkerEnvInput): WorkerConfig => {
  return parse(workerConfigSchema, env, "worker");
};
