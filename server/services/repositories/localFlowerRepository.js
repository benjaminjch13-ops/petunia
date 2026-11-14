import rawFlowers from '../../data/flowers/index.js';
import { createFlower } from '../../models/Flower.js';

/**
 * Repositorio basado en archivos locales (server/data/flowers).
 * Implementa la interfaz común de repositorios:
 *   - findAll(): Promise<Flower[]>
 *   - findById(id): Promise<Flower | null>
 *   - count(): Promise<number>
 */
export class LocalFlowerRepository {
  constructor(records = rawFlowers) {
    const flowers = records.map(createFlower);
    const ids = new Set();
    for (const flower of flowers) {
      if (ids.has(flower.id)) throw new Error(`ID de flor duplicado: ${flower.id}`);
      ids.add(flower.id);
    }
    this.flowers = flowers;
    this.byId = new Map(flowers.map((flower) => [flower.id, flower]));
  }

  async findAll() {
    return this.flowers;
  }

  async findById(id) {
    return this.byId.get(id) ?? null;
  }

  async count() {
    return this.flowers.length;
  }
}
