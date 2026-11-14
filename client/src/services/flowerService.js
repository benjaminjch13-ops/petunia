import { apiGet } from './api.js';

/** Capa de acceso a la API REST de flores. */
export const flowerService = {
  list: (filters, options) => apiGet('/flowers', filters, options),
  search: (q, limit = 6, options) => apiGet('/flowers/search', { q, limit }, options).then((r) => r.data),
  getById: (id, options) => apiGet(`/flowers/${encodeURIComponent(id)}`, undefined, options).then((r) => r.data),
  getRelated: (id, options) => apiGet(`/flowers/${encodeURIComponent(id)}/related`, undefined, options).then((r) => r.data),
  featured: (options) => apiGet('/flowers/featured', undefined, options).then((r) => r.data),
  random: (params, options) => apiGet('/flowers/random', params, options).then((r) => r.data),
  daily: (options) => apiGet('/flowers/daily', undefined, options).then((r) => r.data),
  bySeason: (season, hemisphere, options) => apiGet(`/flowers/season/${season}`, { hemisphere }, options).then((r) => r.data),
  byMonth: (month, hemisphere, options) => apiGet(`/flowers/month/${month}`, { hemisphere }, options).then((r) => r.data),
  compare: (ids, options) => apiGet('/flowers/compare', { ids }, options).then((r) => r.data),
};

export const metaService = {
  get: (options) => apiGet('/meta', undefined, options).then((r) => r.data),
  tips: (options) => apiGet('/tips', undefined, options).then((r) => r.data),
  randomTip: (type = 'tip', options) => apiGet('/tips/random', { type }, options).then((r) => r.data),
};
