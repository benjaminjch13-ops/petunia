import {
  CATEGORIES, COLORS, CLIMATES, SEASONS, GROWTH_TYPES, DIFFICULTIES, LIFECYCLES,
  ENVIRONMENTS, PET_TOXICITY, EDIBILITY,
} from '../models/taxonomy.js';
import { getAllFlowers } from './flowerService.js';
import { TIPS, CURIOSITIES } from '../data/tips.js';

const withCounts = (list, flowers, getValues) =>
  list.map((item) => ({ ...item, count: flowers.filter((f) => getValues(f).includes(item.id)).length }));

export async function getMeta() {
  const flowers = await getAllFlowers();
  return {
    stats: {
      totalFlowers: flowers.length,
      families: new Set(flowers.map((f) => f.family)).size,
    },
    categories: withCounts(CATEGORIES, flowers, (f) => f.categories),
    colors: withCounts(COLORS, flowers, (f) => f.colors),
    climates: withCounts(CLIMATES, flowers, (f) => f.climates),
    seasons: SEASONS,
    growthTypes: withCounts(GROWTH_TYPES, flowers, (f) => [f.growthType]),
    difficulties: withCounts(DIFFICULTIES, flowers, (f) => [f.difficulty]),
    lifecycles: LIFECYCLES,
    environments: withCounts(ENVIRONMENTS, flowers, (f) => f.environments),
    petToxicity: PET_TOXICITY,
    edibility: EDIBILITY,
  };
}

export function getTips({ topic } = {}) {
  const tips = topic ? TIPS.filter((t) => t.topic === topic) : TIPS;
  return { tips, curiosities: CURIOSITIES, topics: [...new Set(TIPS.map((t) => t.topic))] };
}

export function getRandomTip(type = 'tip') {
  const pool = type === 'curiosity' ? CURIOSITIES : TIPS;
  return pool[Math.floor(Math.random() * pool.length)];
}
