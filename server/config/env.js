import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CLOUDFLARE_ZONE_ID,
  CLOUDFLARE_API_TOKEN,
  DOMAIN_URI,
  OPEN_AI_API_KEY,
  OPEN_AI_MODEL,
  VERCEL_DOMAIN,
  VERCEL_API_TOKEN
} = process.env;