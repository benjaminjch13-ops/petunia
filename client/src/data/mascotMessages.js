/**
 * Textos de Tuni, la mascota de Petunia.
 * Los consejos y curiosidades botánicas provienen de la API (/api/tips);
 * aquí solo están los mensajes de interfaz y los contextuales.
 */
export const MASCOT_NAME = 'Tuni';

export const WELCOME_MESSAGE = '¡Hola! Soy Tuni, tu compañera de jardín. ¿Quieres que te enseñe cómo funciona Petunia?';

export const GREETINGS = [
  '¡Hola! Soy tu compañera de jardín. ¿Buscamos una flor nueva para descubrir?',
  '¡Qué alegría verte de nuevo! ¿Qué flor exploramos hoy?',
  'Psst… ¿ya viste la flor del día? ¡Está preciosa!',
];

/** Mensaje según la página actual. */
export const ROUTE_MESSAGES = {
  '/': '¡Bienvenida al jardín! Usa el buscador o explora las categorías.',
  '/catalogo': 'Combina filtros de color, clima y temporada para encontrar tu flor ideal.',
  '/favoritos': 'Aquí guardo tus flores favoritas, incluso si cierras el navegador.',
  '/comparar': 'Compara hasta tres flores lado a lado: luz, riego, dificultad…',
  '/calendario': 'Cambia de hemisferio: ¡las temporadas se invierten entre el norte y el sur!',
  '/consejos': 'Pequeños hábitos, plantas felices. ¡Echa un vistazo a estos consejos!',
  '/regalar': 'Antes de regalar, revisa si la flor es segura para las mascotas de esa persona.',
  '/ambientes': 'Dime dónde vivirá tu planta y te diré cuál elegir.',
  '/acerca': 'Te cuento de dónde viene la información de Petunia.',
};

/** Mensajes según la luz que necesita la flor que se está viendo. */
export const LIGHT_MESSAGES = {
  alta: (name) => `¡${name} necesita mucha luz! Te muestro cómo cuidarla en la guía de cuidados.`,
  media: (name) => `${name} prefiere luz brillante pero sin sol directo fuerte. ¡Mira sus cuidados!`,
  baja: (name) => `${name} tolera rincones con poca luz. ¡Ideal para interiores tranquilos!`,
};

export const TOXIC_MESSAGE = (name) => `Ojo: ${name} es tóxica para mascotas. Ubícala fuera de su alcance.`;

export const EXPRESSIONS = ['happy', 'excited', 'wink', 'surprised', 'thinking', 'sleepy'];
