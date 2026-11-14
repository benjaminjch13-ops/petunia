/**
 * Pasos del recorrido guiado.
 * - route: página donde se muestra el paso (se navega automáticamente).
 * - target: selector CSS del elemento a resaltar (null = paso centrado).
 */
export const TOUR_STEPS = [
  {
    id: 'bienvenida',
    route: '/',
    target: null,
    expression: 'excited',
    title: '¡Bienvenida a Petunia!',
    text: 'Soy Tuni y te acompañaré en un paseo rápido por el jardín digital. Puedes salir cuando quieras con «Saltar».',
  },
  {
    id: 'catalogo',
    route: '/catalogo',
    target: '[data-tour="catalog-grid"]',
    expression: 'happy',
    title: '1. Explora el catálogo',
    text: 'Aquí viven todas las especies documentadas. Cada tarjeta muestra su foto, nombre común, nombre científico y categoría.',
  },
  {
    id: 'buscar',
    route: '/catalogo',
    target: '[data-tour="search"]',
    expression: 'thinking',
    title: '2. Busca flores',
    text: 'Escribe un nombre común o científico. Los resultados se actualizan al instante, ¡aunque no pongas tildes!',
  },
  {
    id: 'filtros',
    route: '/catalogo',
    target: '[data-tour="filters"]',
    expression: 'wink',
    title: '3. Usa los filtros',
    text: 'Filtra por categoría, color, clima, temporada de floración, tipo de crecimiento y dificultad. Puedes combinarlos.',
  },
  {
    id: 'ficha',
    route: '/catalogo',
    target: '[data-tour="flower-card"]',
    expression: 'happy',
    title: '4. Consulta cada especie',
    text: 'Pulsa «Ver ficha» para abrir toda su información: origen, clima, temporadas, toxicidad y más. Con el corazón la guardas en favoritas.',
  },
  {
    id: 'cuidados',
    route: '/flor/rosa',
    target: '[data-tour="care"]',
    expression: 'excited',
    title: '5. Aprende sus cuidados',
    text: 'Cada ficha tiene una guía de cuidados: riego, luz, abono, poda, plagas y consejos para mantenerla sana.',
  },
  {
    id: 'especiales',
    route: '/',
    target: '[data-tour="specials"]',
    expression: 'wink',
    title: '6. Secciones especiales',
    text: 'Comparador, calendario de siembra, consejos, flores para regalar y recomendaciones por ambiente. ¡Explóralas cuando quieras!',
  },
  {
    id: 'fin',
    route: '/',
    target: null,
    expression: 'excited',
    title: '¡Listo para florecer!',
    text: 'Si necesitas ayuda, pulsa mi botón flotante en la esquina. Tengo consejos y curiosidades guardados para ti.',
  },
];
