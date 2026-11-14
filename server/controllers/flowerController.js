import * as flowerService from '../services/flowerService.js';
import { ALLOWED } from '../models/taxonomy.js';
import { HttpError } from '../middleware/httpError.js';

/** GET /api/flowers — listado con filtros, búsqueda, orden y paginación. */
export async function getFlowers(req, res) {
  const result = await flowerService.listFlowers(req.filters);
  res.json(result);
}

/** GET /api/flowers/search?q= — búsqueda rápida por nombre (sugerencias). */
export async function searchFlowers(req, res) {
  const q = String(req.query.q || '').trim();
  if (!q) throw HttpError.badRequest('Indica un término de búsqueda con el parámetro "q"');
  const limit = Math.min(Number(req.query.limit) || 8, 20);
  const data = await flowerService.searchFlowers(q, limit);
  res.json({ data, meta: { total: data.length, query: q } });
}

/** GET /api/flowers/featured */
export async function getFeatured(req, res) {
  const data = await flowerService.getFeaturedFlowers();
  res.json({ data, meta: { total: data.length } });
}

/** GET /api/flowers/random?exclude=&category= */
export async function getRandom(req, res) {
  const { exclude, category } = req.query;
  if (category && !ALLOWED.category.includes(category)) throw HttpError.badRequest(`Categoría no válida: ${category}`);
  const data = await flowerService.getRandomFlower({ exclude, category });
  if (!data) throw HttpError.notFound('No hay flores disponibles para ese criterio');
  res.json({ data });
}

/** GET /api/flowers/daily */
export async function getDaily(req, res) {
  const { date, flower } = await flowerService.getFlowerOfTheDay();
  res.json({ data: flower, meta: { date } });
}

/** GET /api/flowers/category/:category */
export async function getByCategory(req, res) {
  const { category } = req.params;
  if (!ALLOWED.category.includes(category)) throw HttpError.notFound(`Categoría no encontrada: ${category}`);
  const result = await flowerService.listFlowers({ ...req.filters, category: [category] });
  res.json(result);
}

/** GET /api/flowers/climate/:climate */
export async function getByClimate(req, res) {
  const { climate } = req.params;
  if (!ALLOWED.climate.includes(climate)) throw HttpError.notFound(`Clima no encontrado: ${climate}`);
  const result = await flowerService.listFlowers({ ...req.filters, climate: [climate] });
  res.json(result);
}

/** GET /api/flowers/season/:season?hemisphere=north|south */
export async function getBySeason(req, res) {
  const { season } = req.params;
  if (!ALLOWED.season.includes(season)) throw HttpError.notFound(`Temporada no encontrada: ${season}`);
  const hemisphere = req.filters.hemisphere;
  const data = await flowerService.getFlowersBySeason(season, hemisphere);
  res.json({ data, meta: { total: data.length, season, hemisphere } });
}

/** GET /api/flowers/month/:month?hemisphere= — qué plantar y qué florece. */
export async function getByMonth(req, res) {
  const month = Number(req.params.month);
  if (!Number.isInteger(month) || month < 1 || month > 12) throw HttpError.badRequest('El mes debe estar entre 1 y 12');
  const data = await flowerService.getMonthOverview(month, req.filters.hemisphere);
  res.json({ data });
}

/** GET /api/flowers/compare?ids=a,b,c */
export async function compare(req, res) {
  const ids = req.filters.ids;
  if (ids.length < 2 || ids.length > 3) throw HttpError.badRequest('Indica entre 2 y 3 flores con el parámetro "ids"');
  const data = await flowerService.compareFlowers(ids);
  res.json({ data, meta: { total: data.length } });
}

/** GET /api/flowers/:id */
export async function getFlowerById(req, res) {
  const flower = await flowerService.getFlowerById(req.params.id);
  if (!flower) throw HttpError.notFound(`No encontramos la flor "${req.params.id}"`);
  res.json({ data: flower });
}

/** GET /api/flowers/:id/related */
export async function getRelated(req, res) {
  const flower = await flowerService.getFlowerById(req.params.id);
  if (!flower) throw HttpError.notFound(`No encontramos la flor "${req.params.id}"`);
  const data = await flowerService.getRelatedFlowers(req.params.id);
  res.json({ data });
}
