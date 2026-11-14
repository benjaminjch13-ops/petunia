import { isProduction } from '../config/index.js';
import { HttpError } from './httpError.js';

export function notFound(req, res, next) {
  next(HttpError.notFound(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) console.error('[error]', err);
  res.status(status).json({
    error: {
      status,
      message: status >= 500 && isProduction ? 'Error interno del servidor' : err.message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}
