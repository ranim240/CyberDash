import 'dotenv/config';

export const PORT     = process.env.PORT     || 3000;
if (!process.env.JWT_SECRET) {
  throw new Error('[env] JWT_SECRET is not defined — check your .env file');
}
export const JWT_SECRET = process.env.JWT_SECRET;
export const DB_HOST  = process.env.DB_HOST;
export const DB_PORT  = process.env.DB_PORT  || 5432;
export const DB_NAME  = process.env.DB_NAME;
export const DB_USER  = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;