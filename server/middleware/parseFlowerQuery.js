import { ALLOWED } from '../models/taxonomy.js';
import { HttpError } from './httpError.js';

const LIST_PARAMS = ['category', 'color', 'climate', 'season', 'growth', 'difficulty', 'environment', 'lifecycle'];
const BOOLEAN_PARAMS = ['indoor', 'outdoor', 'giftable', 'featured', 'petSafe'];

const toList = (value) =>
  (Array.isArray(value) ? value.join(',') : String(value ?? ''))
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

function toBoolean(name, value) {
  if (value === undefined || value === '') return undefined;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  throw HttpError.badRequest(`El parámetro "${name}" debe ser true o false`);
}

function toPositiveInt(name, value) {
  if (value === undefined || value === '') return undefined;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) throw HttpError.badRequest(`El parámetro "${name}" debe ser un entero positivo`);
  return n;
}

/**
 * Convierte y valida los parámetros de consulta del catálogo.
 * Deja el resultado en req.filters.
 */
export function parseFlowerQuery(req, res, next) {
  try {
    const { query } = req;
    const filters = {};

    if (query.q) filters.q = String(query.q).slice(0, 80);

    for (const key of LIST_PARAMS) {
      const values = toList(query[key]);
      const invalid = values.filter((v) => !ALLOWED[key].includes(v));
      if (invalid.length) {
        throw HttpError.badRequest(`Valor no válido para "${key}": ${invalid.join(', ')}`, { allowed: ALLOWED[key] });
      }
      filters[key] = values;
    }

    for (const key of BOOLEAN_PARAMS) {
      const value = toBoolean(key, query[key]);
      if (value !== undefined) filters[key] = value;
    }

    filters.hemisphere = query.hemisphere || 'north';
    if (!ALLOWED.hemisphere.includes(filters.hemisphere)) {
      throw HttpError.badRequest('El parámetro "hemisphere" debe ser north o south');
    }

    if (query.sort) {
      if (!ALLOWED.sort.includes(query.sort)) throw HttpError.badRequest(`Orden no válido: ${query.sort}`, { allowed: ALLOWED.sort });
      filters.sort = query.sort;
    }

    filters.ids = toList(query.ids);
    filters.page = toPositiveInt('page', query.page);
    filters.limit = toPositiveInt('limit', query.limit);

    req.filters = filters;
    next();
  } catch (error) {
    next(error);
  }
}
