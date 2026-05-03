import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.string().default("8000"),

  DATABASE_URL: z.string().url(),

  TOKEN_SECRET: z.string().min(1),

  TOKEN_EXPIRY: z.string().min(1),

  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number(), // converts string → number
});

function createEnv(env: NodeJS.ProcessEnv) {
  const safeParseResult = envSchema.safeParse(env);

  if (!safeParseResult.success) {
    console.error("❌ Invalid environment variables:");
    console.error(safeParseResult.error.format());
    throw new Error("Invalid environment variables");
  }

  return safeParseResult.data;
}

export const env = createEnv(process.env);
