/**
 * Catálogo inicial de PETUNIA.
 *
 * Cada archivo agrupa especies por afinidad para facilitar su mantenimiento;
 * las categorías reales de cada flor están en su propiedad `categories`.
 *
 * Para añadir una especie nueva:
 *   1. Copia la estructura de un registro existente en el archivo más afín
 *      (o crea uno nuevo e impórtalo aquí).
 *   2. Usa solo valores definidos en server/models/taxonomy.js.
 *   3. Expresa los meses (1–12) para el hemisferio norte; el modelo calcula
 *      automáticamente el hemisferio sur cuando hemisphereDependent es true.
 *   4. Indica "sin-datos" en toxicidad o comestibilidad cuando no exista una
 *      fuente fiable. No inventes datos.
 *   5. Ejecuta `npm test` en /server: el modelo valida todos los registros.
 */
import tropicales from './tropicales.js';
import exoticas from './exoticas.js';
import jardin from './jardin.js';
import aromaticas from './aromaticas.js';
import interior from './interior.js';
import silvestres from './silvestres.js';
import acuaticas from './acuaticas.js';
import desierto from './desierto.js';
import anuales from './anuales.js';

export default [
  ...jardin,
  ...tropicales,
  ...exoticas,
  ...aromaticas,
  ...interior,
  ...silvestres,
  ...acuaticas,
  ...desierto,
  ...anuales,
];
