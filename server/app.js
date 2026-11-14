import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import { config, isProduction } from './config/index.js';
import apiRoutes from './routes/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: config.clientOrigin }));
  app.use(express.json());
  if (config.nodeEnv !== 'test') app.use(requestLogger);

  app.use('/api', apiRoutes);
  app.use('/api', notFound);

  // En producción, Express sirve también el frontend compilado (client/dist).
  if (isProduction && fs.existsSync(config.clientDistPath)) {
    app.use(express.static(config.clientDistPath));
    app.get('*', (req, res) => res.sendFile(path.join(config.clientDistPath, 'index.html')));
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
