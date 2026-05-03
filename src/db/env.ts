import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.string().default("9000"),

  DATABASE_URL: z.string().url(),

  TOKEN_SECRET: z.string().min(1),

  TOKEN_EXPIRY: z.string().min(1),

  CLIENT_URL: z.string().default("http://localhost:9000"),
  KAFKA_BROKER: z.string().default("localhost:29092"),
  KAFKA_CONNECT_RETRIES: z.coerce.number().default(10),
  KAFKA_CONNECT_RETRY_DELAY_MS: z.coerce.number().default(3000),

  FIREBASE_SERVICE_ACCOUNT_PATH: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_JSON: z.string().optional(),
});

const publicEnvSchema = z.object({
  PUBLIC_API_BASE_URL: z.string().default("http://localhost:9000"),
  FIREBASE_API_KEY: z.string().min(1).default("AIzaSyDWX4atpsOcyf3uP1W-kSl2dXUu581X1MY"),
  FIREBASE_AUTH_DOMAIN: z.string().min(1).default("tracking-fadb1.firebaseapp.com"),
  FIREBASE_PROJECT_ID: z.string().min(1).default("tracking-fadb1"),
  FIREBASE_STORAGE_BUCKET: z.string().min(1).default("tracking-fadb1.firebasestorage.app"),
  FIREBASE_MESSAGING_SENDER_ID: z.string().min(1).default("1085163290634"),
  FIREBASE_APP_ID: z.string().min(1).default("1:1085163290634:web:1b14c094819491a7dd1ff3"),
  FIREBASE_MEASUREMENT_ID: z.string().min(1).default("G-ZPN19HP4V0"),
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

function createPublicEnv(env: NodeJS.ProcessEnv) {
  return publicEnvSchema.parse(env);
}

export const env = createEnv(process.env);
export const publicEnv = createPublicEnv(process.env);
