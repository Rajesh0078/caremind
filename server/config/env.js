import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

export const { PORT, NODE_ENV, DB_URI } = process.env;