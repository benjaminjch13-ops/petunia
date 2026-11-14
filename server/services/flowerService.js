import { flowerRepository } from './repositories/index.js';
import { normalizeText, toSummary, toPublic, DIFFICULTY_ORDER } from '../models/Flower.js';
import { config } from '../config/index.js';

/**
 * Lógica de negocio del catálogo: búsqueda, filtros, destacados,
 * flor aleatoria, flor del día y comparación.
 */

/** Puntuación de relevancia para búsquedas por texto. */
function scoreFlower(flower, query) {
  if (!query) return 0;
  const q = normalizeText(query);
  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;
  if (flower._name === q) score += 200;
  if (flower._name.startsWith(q)) score += 100;
  if (flower._name.includes(q)) score += 60;
  if ((flower.otherNames || []).some((n) => normalizeText(n).includes(q))) score += 50;
  if (normalizeText(flower.scientificName).includes(q)) score += 40;
  if (normalizeText(flower.family).includes(q)) score += 15;
  // Coincidencia parcial por palabras (todas deben aparecer).
  if (tokens.length && tokens.every((t) => flower._search.includes(t))) score += 20;
  return score;
}

const matchesAny = (values, wanted) => !wanted.length || wanted.some((w) => values.includes(w));

function applyFilters(flowers, filters) {
  const {
    q, category = [], color = [], climate = [], season = [], growth = [], difficulty = [],
    environment = [], lifecycle = [], hemisphere = 'north', indoor, outdoor, giftable, featured, petSafe, ids = [],
  } = filters;

  let result = flowers.filter((f) =>
    matchesAny(f.categories, category)
    && matchesAny(f.colors, color)
    && matchesAny(f.climates, climate)
    && matchesAny(f.seasons[hemisphere], season)
    && matchesAny([f.growthType], growth)
    && matchesAny([f.difficulty], difficulty)
    && matchesAny([f.lifecycle], lifecycle)
    && matchesAny(f.environments, environment)
    && (ids.length === 0 || ids.includes(f.id))
    && (indoor === undefined || f.extra.indoor === indoor)
    && (outdoor === undefined || f.extra.outdoor === outdoor)
    && (giftable === undefined || f.giftable === giftable)
    && (featured === undefined || f.featured === featured)
    && (petSafe === undefined || (f.extra.petToxicity.status === 'no-toxica') === petSafe));

  if (q) {
    result = result
      .map((f) => ({ f, score: scoreFlower(f, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.f._name.localeCompare(b.f._name))
      .map(({ f }) => f);
  }
  return result;
}

function applySort(flowers, sort, hasQuery) {
  const list = [...flowers];
  switch (sort) {
    case 'name': return list.sort((a, b) => a._name.localeCompare(b._name));
    case '-name': return list.sort((a, b) => b._name.localeCompare(a._name));
    case 'difficulty': return list.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] || a._name.localeCompare(b._name));
    case '-difficulty': return list.sort((a, b) => DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty] || a._name.localeCompare(b._name));
    default: return hasQuery ? list : list.sort((a, b) => a._name.localeCompare(b._name));
  }
}

function paginate(list, page = 1, limit = config.pagination.defaultLimit) {
  const safeLimit = Math.min(Math.max(1, limit), config.pagination.maxLimit);
  const pages = Math.max(1, Math.ceil(list.length / safeLimit));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage - 1) * safeLimit;
  return {
    items: list.slice(start, start + safeLimit),
    meta: { total: list.length, page: safePage, pages, limit: safeLimit },
  };
}

export async function listFlowers(filters = {}) {
  const all = await flowerRepository.findAll();
  const filtered = applySort(applyFilters(all, filters), filters.sort, Boolean(filters.q));
  const { items, meta } = paginate(filtered, filters.page, filters.limit);
  return { data: items.map(toSummary), meta };
}

export async function searchFlowers(query, limit = 10) {
  const all = await flowerRepository.findAll();
  const results = applyFilters(all, { q: query }).slice(0, limit);
  return results.map(toSummary);
}

export async function getFlowerById(id) {
  const flower = await flowerRepository.findById(id);
  return flower ? toPublic(flower) : null;
}

export async function getRelatedFlowers(id, limit = 4) {
  const flower = await flowerRepository.findById(id);
  if (!flower) return [];
  const all = await flowerRepository.findAll();
  return all
    .filter((f) => f.id !== id)
    .map((f) => ({ f, shared: f.categories.filter((c) => flower.categories.includes(c)).length }))
    .filter(({ shared }) => shared > 0)
    .sort((a, b) => b.shared - a.shared || a.f._name.localeCompare(b.f._name))
    .slice(0, limit)
    .map(({ f }) => toSummary(f));
}

export async function getFeaturedFlowers() {
  const all = await flowerRepository.findAll();
  return all.filter((f) => f.featured).map(toSummary);
}

export async function getRandomFlower({ exclude, category } = {}) {
  const all = await flowerRepository.findAll();
  let pool = all.filter((f) => f.id !== exclude);
  if (category) pool = pool.filter((f) => f.categories.includes(category));
  if (!pool.length) return null;
  return toPublic(pool[Math.floor(Math.random() * pool.length)]);
}

/** Flor del día: determinista para una fecha (UTC) dada. */
export async function getFlowerOfTheDay(date = new Date()) {
  const all = await flowerRepository.findAll();
  const key = date.toISOString().slice(0, 10);
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const sorted = [...all].sort((a, b) => a.id.localeCompare(b.id));
  return { date: key, flower: toPublic(sorted[hash % sorted.length]) };
}

export async function getFlowersBySeason(season, hemisphere = 'north') {
  const all = await flowerRepository.findAll();
  return all.filter((f) => f.seasons[hemisphere].includes(season)).map(toSummary);
}

export async function compareFlowers(ids) {
  const flowers = await Promise.all(ids.map((id) => flowerRepository.findById(id)));
  return flowers.filter(Boolean).map(toPublic);
}

/** Flores para plantar y en flor en un mes concreto. */
export async function getMonthOverview(month, hemisphere = 'north') {
  const all = await flowerRepository.findAll();
  const plant = all.filter((f) => f.calendar[hemisphere].planting.includes(month)).map(toSummary);
  const bloom = all.filter((f) => f.calendar[hemisphere].bloom.includes(month)).map(toSummary);
  return { month, hemisphere, plant, bloom };
}

export async function getAllFlowers() {
  return flowerRepository.findAll();
}
