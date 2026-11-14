export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }

  static badRequest(message, details) {
    return new HttpError(400, message, details);
  }

  static notFound(message = 'Recurso no encontrado') {
    return new HttpError(404, message);
  }
}

/** Envuelve controladores async para delegar errores en el middleware. */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
