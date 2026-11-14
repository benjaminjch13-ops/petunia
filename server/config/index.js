import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Un único archivo .env en la raíz del proyecto, compartido por cliente y servidor.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// Permite también un .env propio dentro de /server (no sobrescribe valores ya definidos).
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = Object.freeze({
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  dataSource: process.env.DATA_SOURCE || 'local',
  clientDistPath: path.resolve(__dirname, '../../client/dist'),
  pagination: { defaultLimit: 60, maxLimit: 100 },
});

export const isProduction = config.nodeEnv === 'production';
