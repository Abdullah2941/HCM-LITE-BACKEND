import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// Always load backend/.env, even if the server is started from another folder.
const envPath = fileURLToPath(new URL('../../.env', import.meta.url));
dotenv.config({ path: envPath });

export const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'development-only-change-me',
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173',
  mongoUri: process.env.MONGODB_URI || '',
};

if (config.jwtSecret === 'development-only-change-me' && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production.');
}
