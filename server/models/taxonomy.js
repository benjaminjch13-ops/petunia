/**
 * Taxonomía del catálogo: fuente única de verdad para categorías,
 * filtros y etiquetas. El cliente la consume desde GET /api/meta.
 */

export const CATEGORIES = [
  { id: 'tropicales', name: 'Flores tropicales', emoji: '🌺', description: 'Especies de climas cálidos y húmedos, de colores intensos.' },
  { id: 'silvestres', name: 'Flores silvestres', emoji: '🌼', description: 'Flores que crecen de forma espontánea en campos, montañas y praderas.' },
  { id: 'exoticas', name: 'Flores exóticas', emoji: '🏵️', description: 'Especies poco comunes o sorprendentes por su forma y origen.' },
  { id: 'ornamentales', name: 'Flores ornamentales', emoji: '💐', description: 'Cultivadas por su belleza en jardines, macetas y arreglos.' },
  { id: 'jardin', name: 'Flores de jardín', emoji: '🌷', description: 'Clásicas de arriates, borduras y huertos.' },
  { id: 'aromaticas', name: 'Flores aromáticas', emoji: '🌸', description: 'Flores apreciadas por su perfume.' },
  { id: 'interior', name: 'Flores de interior', emoji: '🏠', description: 'Se adaptan bien a la vida dentro de casa.' },
  { id: 'exterior', name: 'Flores de exterior', emoji: '🌻', description: 'Prosperan al aire libre, en jardines y terrazas.' },
  { id: 'acuaticas', name: 'Flores acuáticas', emoji: '💧', description: 'Viven en estanques, lagos y aguas tranquilas.' },
  { id: 'temporada', name: 'Flores de temporada', emoji: '🍂', description: 'Asociadas a una estación concreta del año.' },
  { id: 'perennes', name: 'Flores perennes', emoji: '♾️', description: 'Viven más de dos años y florecen temporada tras temporada.' },
  { id: 'anuales', name: 'Flores anuales', emoji: '🌱', description: 'Completan su ciclo de vida en un solo año.' },
];

export const COLORS = [
  { id: 'rojo', name: 'Rojo', hex: '#D9534F' },
  { id: 'rosa', name: 'Rosa', hex: '#E8AAB8' },
  { id: 'blanco', name: 'Blanco', hex: '#FFFFFF' },
  { id: 'amarillo', name: 'Amarillo', hex: '#F3D98B' },
  { id: 'naranja', name: 'Naranja', hex: '#F0A35E' },
  { id: 'morado', name: 'Morado', hex: '#9B7BB8' },
  { id: 'azul', name: 'Azul', hex: '#7FA7D9' },
  { id: 'verde', name: 'Verde', hex: '#A8B5A0' },
];

export const CLIMATES = [
  { id: 'tropical', name: 'Tropical' },
  { id: 'tropical-montana', name: 'Tropical de montaña' },
  { id: 'subtropical', name: 'Subtropical' },
  { id: 'mediterraneo', name: 'Mediterráneo' },
  { id: 'templado', name: 'Templado' },
  { id: 'arido', name: 'Árido / desértico' },
  { id: 'alpino', name: 'Alpino / frío' },
];

export const SEASONS = [
  { id: 'primavera', name: 'Primavera' },
  { id: 'verano', name: 'Verano' },
  { id: 'otono', name: 'Otoño' },
  { id: 'invierno', name: 'Invierno' },
];

export const GROWTH_TYPES = [
  { id: 'arbusto', name: 'Arbusto' },
  { id: 'arbol', name: 'Árbol pequeño' },
  { id: 'herbacea', name: 'Herbácea' },
  { id: 'bulbosa', name: 'Bulbosa' },
  { id: 'tuberosa', name: 'Tuberosa / rizomatosa' },
  { id: 'trepadora', name: 'Trepadora' },
  { id: 'epifita', name: 'Epífita' },
  { id: 'acuatica', name: 'Acuática' },
  { id: 'suculenta', name: 'Suculenta' },
];

export const DIFFICULTIES = [
  { id: 'facil', name: 'Fácil' },
  { id: 'intermedio', name: 'Intermedio' },
  { id: 'avanzado', name: 'Avanzado' },
];

export const LIFECYCLES = [
  { id: 'anual', name: 'Anual' },
  { id: 'bienal', name: 'Bienal' },
  { id: 'perenne', name: 'Perenne' },
];

export const ENVIRONMENTS = [
  { id: 'interior-luminoso', name: 'Interior luminoso', emoji: '🌤️', description: 'Cerca de una ventana con mucha luz indirecta.' },
  { id: 'interior-sombra', name: 'Interior con poca luz', emoji: '🛋️', description: 'Habitaciones con luz suave o lejos de las ventanas.' },
  { id: 'balcon-soleado', name: 'Balcón o terraza soleada', emoji: '☀️', description: 'Macetas a pleno sol durante buena parte del día.' },
  { id: 'jardin-soleado', name: 'Jardín soleado', emoji: '🌞', description: 'Arriates y borduras con al menos 6 horas de sol.' },
  { id: 'jardin-sombra', name: 'Jardín de semisombra', emoji: '🌳', description: 'Bajo árboles o con sol solo por la mañana.' },
  { id: 'jardin-seco', name: 'Jardín seco o rocalla', emoji: '🌵', description: 'Suelos pobres, mucho drenaje y poco riego.' },
  { id: 'pradera', name: 'Pradera para polinizadores', emoji: '🐝', description: 'Rincones naturales que atraen abejas y mariposas.' },
  { id: 'estanque', name: 'Estanque o fuente', emoji: '🐸', description: 'Aguas tranquilas y soleadas.' },
];

export const PET_TOXICITY = {
  toxica: 'Tóxica para mascotas',
  'no-toxica': 'No tóxica para mascotas',
  'sin-datos': 'Sin datos verificados',
};

export const EDIBILITY = {
  si: 'Uso comestible documentado',
  no: 'No comestible',
  'sin-datos': 'Sin uso comestible documentado',
};

export const HEMISPHERES = ['north', 'south'];

const ids = (list) => list.map((item) => item.id);

export const ALLOWED = Object.freeze({
  category: ids(CATEGORIES),
  color: ids(COLORS),
  climate: ids(CLIMATES),
  season: ids(SEASONS),
  growth: ids(GROWTH_TYPES),
  difficulty: ids(DIFFICULTIES),
  lifecycle: ids(LIFECYCLES),
  environment: ids(ENVIRONMENTS),
  hemisphere: HEMISPHERES,
  sort: ['relevance', 'name', '-name', 'difficulty', '-difficulty'],
});
