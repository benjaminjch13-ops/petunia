export const MAIN_LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/favoritos', label: 'Favoritas' },
  { to: '/acerca', label: 'Acerca de' },
];

/** Secciones especiales (menú «Explorar», inicio y pie de página). */
export const SPECIAL_SECTIONS = [
  { to: '/comparar', label: 'Comparador', emoji: '⚖️', description: 'Compara hasta tres flores lado a lado.' },
  { to: '/calendario', label: 'Calendario', emoji: '🗓️', description: 'Qué plantar y qué florece cada mes.' },
  { to: '/consejos', label: 'Consejos', emoji: '💡', description: 'Riego, luz, suelo, poda y plagas.' },
  { to: '/regalar', label: 'Para regalar', emoji: '🎁', description: 'Flores ideales para cada ocasión.' },
  { to: '/ambientes', label: 'Por ambiente', emoji: '🏡', description: 'Interior, balcón, sombra, estanque…' },
];

export const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const HEMISPHERE_LABELS = { north: 'Hemisferio norte', south: 'Hemisferio sur' };

export const DIFFICULTY_LABELS = { facil: 'Fácil', intermedio: 'Intermedio', avanzado: 'Avanzado' };
export const LIGHT_LABELS = { alta: 'Mucha luz', media: 'Luz media', baja: 'Poca luz' };
