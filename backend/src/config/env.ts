import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
  PORT: z.string(),
  MONGO_URI: z.string(),
  CLIENT_URL: z.string(),
  NODE_ENV: z.string(),
  LOG_LEVEL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  VERIFY_EMAIL_SECRET: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
})

const parsed = envSchema.parse(process.env);

export const env = {
  PORT: parsed.PORT,
  MONGO_URI: parsed.MONGO_URI,
  CLIENT_URL: parsed.CLIENT_URL,
  NODE_ENV: parsed.NODE_ENV,
  LOG_LEVEL: parsed.LOG_LEVEL,
  ACCESS_TOKEN_SECRET: parsed.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: parsed.REFRESH_TOKEN_SECRET,
  VERIFY_EMAIL_SECRET: parsed.VERIFY_EMAIL_SECRET,
  EMAIL_USER: parsed.EMAIL_USER,
  EMAIL_PASS: parsed.EMAIL_PASS,

}