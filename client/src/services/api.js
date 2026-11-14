const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/** Construye una query string ignorando valores vacíos; los arrays se unen con comas. */
export function toQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      if (value.length) search.set(key, value.join(','));
    } else {
      search.set(key, String(value));
    }
  });
  const str = search.toString();
  return str ? `?${str}` : '';
}

export async function apiGet(path, params, { signal } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}${toQuery(params)}`, { signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('No pudimos conectar con el servidor de Petunia. ¿Está en marcha la API?', 0);
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(body?.error?.message || 'Ocurrió un error inesperado', response.status);
  }
  return body;
}
