import { config } from '../../config/index.js';
import { LocalFlowerRepository } from './localFlowerRepository.js';

/**
 * Fábrica de repositorios. Para integrar una base de datos o una fuente
 * botánica externa, crea un nuevo repositorio con la misma interfaz
 * (findAll, findById, count) y regístralo aquí.
 */
const factories = {
  local: () => new LocalFlowerRepository(),
  // mongo: () => new MongoFlowerRepository(config.mongoUri),
  // powo: () => new PowoFlowerRepository(),
};

export function createFlowerRepository(source = config.dataSource) {
  const factory = factories[source];
  if (!factory) {
    throw new Error(`Fuente de datos desconocida: "${source}". Opciones: ${Object.keys(factories).join(', ')}`);
  }
  return factory();
}

export const flowerRepository = createFlowerRepository();
