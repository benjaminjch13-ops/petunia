import { ALLOWED } from './taxonomy.js';

/**
 * Modelo Flower.
 * Valida los registros crudos de /data, calcula campos derivados
 * (calendario por hemisferio, estaciones, fuentes, texto de búsqueda)
 * y expone vistas "resumen" y "pública" para la API.
 *
 * Al migrar a una base de datos, este módulo puede convertirse en un
 * esquema (Mongoose, Prisma, etc.) conservando la misma forma de salida.
 */

const REQUIRED_FIELDS = [
  'id', 'commonName', 'scientificName', 'family', 'categories', 'colors', 'climates',
  'growthType', 'lifecycle', 'difficulty', 'bloomMonths', 'plantingMonths',
  'shortDescription', 'description', 'origin', 'environment', 'planting', 'care', 'extra',
];

const ENUM_ARRAY_FIELDS = { categories: 'category', colors: 'color', climates: 'climate', environments: 'environment' };
const ENUM_FIELDS = { growthType: 'growth', difficulty: 'difficulty', lifecycle: 'lifecycle' };

const NORTH_SEASON = { 12: 'invierno', 1: 'invierno', 2: 'invierno', 3: 'primavera', 4: 'primavera', 5: 'primavera', 6: 'verano', 7: 'verano', 8: 'verano', 9: 'otono', 10: 'otono', 11: 'otono' };
const OPPOSITE = { invierno: 'verano', verano: 'invierno', primavera: 'otono', otono: 'primavera' };

export const DIFFICULTY_ORDER = { facil: 1, intermedio: 2, avanzado: 3 };

export function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** Desplaza un mes seis posiciones (equivalencia norte ↔ sur). */
const shiftMonth = (month) => ((month + 5) % 12) + 1;

const seasonOf = (month, hemisphere) =>
  hemisphere === 'north' ? NORTH_SEASON[month] : OPPOSITE[NORTH_SEASON[month]];

const unique = (list) => [...new Set(list)];
const sortMonths = (list) => [...list].sort((a, b) => a - b);

function monthsToSeasons(months, hemisphere) {
  return unique(months.map((m) => seasonOf(m, hemisphere)));
}

function buildSources(raw) {
  const sources = [
    {
      name: 'Plants of the World Online (Royal Botanic Gardens, Kew) — taxonomía y distribución',
      url: `https://powo.science.kew.org/results?q=${encodeURIComponent(raw.scientificName.split(' (')[0])}`,
    },
  ];
  if (raw.wikiTitle) {
    sources.push({
      name: 'Wikipedia — artículo de referencia y fotografías (Wikimedia Commons)',
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(raw.wikiTitle.replace(/ /g, '_'))}`,
    });
  }
  if (raw.extra?.petToxicity?.status !== 'sin-datos') {
    sources.push({
      name: 'ASPCA — Lista de plantas tóxicas y no tóxicas para mascotas',
      url: 'https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants',
    });
  }
  return [...sources, ...(raw.sources || [])];
}

export class ValidationError extends Error {}

export function validateFlower(raw) {
  const missing = REQUIRED_FIELDS.filter((field) => raw[field] === undefined || raw[field] === null);
  if (missing.length) {
    throw new ValidationError(`Flor "${raw.id ?? '?'}": faltan campos obligatorios: ${missing.join(', ')}`);
  }
  for (const [field, key] of Object.entries(ENUM_ARRAY_FIELDS)) {
    const invalid = (raw[field] || []).filter((value) => !ALLOWED[key].includes(value));
    if (invalid.length) throw new ValidationError(`Flor "${raw.id}": valores no válidos en ${field}: ${invalid.join(', ')}`);
  }
  for (const [field, key] of Object.entries(ENUM_FIELDS)) {
    if (!ALLOWED[key].includes(raw[field])) throw new ValidationError(`Flor "${raw.id}": ${field} no válido (${raw[field]})`);
  }
  for (const field of ['bloomMonths', 'plantingMonths']) {
    if (!raw[field].every((m) => Number.isInteger(m) && m >= 1 && m <= 12)) {
      throw new ValidationError(`Flor "${raw.id}": ${field} debe contener meses entre 1 y 12`);
    }
  }
  return true;
}

/** Crea una flor inmutable con todos los campos derivados. */
export function createFlower(raw) {
  validateFlower(raw);

  const dependent = raw.hemisphereDependent !== false;
  const north = { bloom: sortMonths(raw.bloomMonths), planting: sortMonths(raw.plantingMonths) };
  const south = dependent
    ? { bloom: sortMonths(north.bloom.map(shiftMonth)), planting: sortMonths(north.planting.map(shiftMonth)) }
    : { ...north };

  const searchText = normalizeText(
    [raw.commonName, ...(raw.otherNames || []), raw.scientificName, raw.family, raw.origin].join(' '),
  );

  return Object.freeze({
    otherNames: [],
    environments: [],
    featured: false,
    giftable: false,
    ...raw,
    hemisphereDependent: dependent,
    calendar: { north, south },
    seasons: {
      north: monthsToSeasons(north.bloom, 'north'),
      south: monthsToSeasons(south.bloom, 'south'),
    },
    sources: buildSources(raw),
    _search: searchText,
    _name: normalizeText(raw.commonName),
  });
}

/** Vista ligera para tarjetas y listados. */
export function toSummary(flower) {
  return {
    id: flower.id,
    commonName: flower.commonName,
    scientificName: flower.scientificName,
    family: flower.family,
    wikiTitle: flower.wikiTitle,
    categories: flower.categories,
    colors: flower.colors,
    climates: flower.climates,
    growthType: flower.growthType,
    lifecycle: flower.lifecycle,
    difficulty: flower.difficulty,
    lightLevel: flower.lightLevel,
    environments: flower.environments,
    featured: flower.featured,
    giftable: flower.giftable,
    giftNote: flower.giftNote,
    shortDescription: flower.shortDescription,
    indoor: flower.extra.indoor,
    outdoor: flower.extra.outdoor,
    petToxicity: flower.extra.petToxicity.status,
    hemisphereDependent: flower.hemisphereDependent,
    calendar: flower.calendar,
    seasons: flower.seasons,
  };
}

/** Ficha completa sin campos internos. */
export function toPublic(flower) {
  // eslint-disable-next-line no-unused-vars
  const { _search, _name, ...rest } = flower;
  return rest;
}
