import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
  PORT: z.string(),
  MONGO_URI: z.string(),
  CLIENT_URL: z.string()
})

const parsed = envSchema.parse(process.env);

export const env = {
  PORT: parsed.PORT,
  MONGO_URI: parsed.MONGO_URI,
  CLIENT_URL: parsed.CLIENT_URL
}