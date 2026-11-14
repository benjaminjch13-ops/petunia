/**
 * Consejos botánicos generales y curiosidades.
 * Son recomendaciones de jardinería ampliamente aceptadas; cada especie
 * tiene además sus cuidados específicos en su ficha.
 */
export const TIPS = [
  { id: 'riego-manana', topic: 'Riego', icon: '💧', title: 'Riega temprano', text: 'Regar por la mañana reduce la evaporación y permite que las hojas se sequen durante el día, lo que disminuye el riesgo de hongos.' },
  { id: 'riego-dedo', topic: 'Riego', icon: '👆', title: 'La prueba del dedo', text: 'Antes de regar una maceta, introduce un dedo unos 2–3 cm en el sustrato. Si está húmedo, espera: el exceso de riego mata más plantas que la sequía.' },
  { id: 'riego-profundo', topic: 'Riego', icon: '🌊', title: 'Riegos profundos y espaciados', text: 'En el jardín, es mejor regar a fondo y con menos frecuencia que poco y a diario: así las raíces crecen más profundas y resistentes.' },
  { id: 'drenaje', topic: 'Suelo', icon: '⛰️', title: 'Drenaje ante todo', text: 'Usa macetas con agujeros y no dejes agua acumulada en el plato. Las raíces necesitan oxígeno además de agua.' },
  { id: 'acolchado', topic: 'Suelo', icon: '🍂', title: 'Acolchado', text: 'Una capa de corteza, paja u hojas secas sobre el suelo conserva la humedad, protege las raíces de temperaturas extremas y frena las malas hierbas.' },
  { id: 'compost', topic: 'Suelo', icon: '🐛', title: 'Materia orgánica', text: 'Incorporar compost mejora la estructura de casi cualquier suelo: suelta los arcillosos y ayuda a los arenosos a retener agua.' },
  { id: 'luz-orientacion', topic: 'Luz', icon: '☀️', title: 'Conoce tu luz', text: 'En el hemisferio norte, las ventanas orientadas al sur reciben más luz; en el hemisferio sur, las orientadas al norte. Las orientadas al este dan un sol suave de mañana.' },
  { id: 'luz-indirecta', topic: 'Luz', icon: '🌤️', title: '¿Qué es luz indirecta?', text: 'Es un lugar muy iluminado donde el sol no toca directamente las hojas, por ejemplo, a uno o dos metros de una ventana luminosa o tras una cortina fina.' },
  { id: 'luz-girar', topic: 'Luz', icon: '🔄', title: 'Gira tus macetas', text: 'Las plantas de interior se inclinan hacia la luz. Girarlas un cuarto de vuelta cada semana o dos mantiene un crecimiento equilibrado.' },
  { id: 'poda-flores', topic: 'Poda', icon: '✂️', title: 'Retira las flores marchitas', text: 'Quitar las flores secas evita que la planta gaste energía en producir semillas y en muchas especies estimula nuevas flores.' },
  { id: 'poda-herramientas', topic: 'Poda', icon: '🧼', title: 'Herramientas limpias', text: 'Desinfecta tijeras y podadoras entre plantas (por ejemplo, con alcohol) para no transmitir enfermedades.' },
  { id: 'plagas-revisar', topic: 'Plagas', icon: '🔍', title: 'Revisa el envés', text: 'Muchas plagas, como el pulgón, la mosca blanca o la araña roja, se esconden bajo las hojas. Detectarlas pronto facilita su control.' },
  { id: 'plagas-aliados', topic: 'Plagas', icon: '🐞', title: 'Fauna aliada', text: 'Mariquitas, crisopas y sírfidos se alimentan de pulgones. Evitar insecticidas de amplio espectro ayuda a que te echen una mano.' },
  { id: 'plagas-aislar', topic: 'Plagas', icon: '🚧', title: 'Cuarentena para las nuevas', text: 'Mantén separada una planta recién comprada durante una o dos semanas para comprobar que no trae plagas.' },
  { id: 'interior-humedad', topic: 'Interior', icon: '💦', title: 'Humedad para tropicales', text: 'Agrupar plantas o colocarlas sobre una bandeja con guijarros y agua (sin que la maceta toque el agua) aumenta la humedad a su alrededor.' },
  { id: 'interior-calefaccion', topic: 'Interior', icon: '🔥', title: 'Lejos de radiadores', text: 'La calefacción y el aire acondicionado resecan el ambiente y provocan puntas marrones y caída de botones.' },
  { id: 'mascotas', topic: 'Seguridad', icon: '🐾', title: 'Mascotas y plantas', text: 'Antes de llevar una planta a casa, consulta si es tóxica para tus mascotas (por ejemplo, en la lista de la ASPCA). Ante una ingestión, contacta con tu veterinario.' },
  { id: 'comestibles', topic: 'Seguridad', icon: '🥗', title: 'Flores comestibles', text: 'Consume solo flores identificadas con seguridad, cultivadas sin pesticidas y nunca de floristería, que suelen estar tratadas.' },
  { id: 'invasoras', topic: 'Seguridad', icon: '🌍', title: 'Cuidado con las invasoras', text: 'Algunas plantas ornamentales se vuelven invasoras fuera de su región de origen. Consulta las normas locales antes de plantar cerca de espacios naturales.' },
];

export const CURIOSITIES = [
  { id: 'vernalizacion', text: '¿Sabías que algunas flores, como el tulipán, necesitan pasar por un periodo de frío para florecer? A esto se le llama vernalización.' },
  { id: 'pascua-bracteas', text: 'Lo rojo de la flor de Pascua no son pétalos: son hojas modificadas llamadas brácteas.' },
  { id: 'loto-semillas', text: 'Se han hecho germinar semillas de loto de alrededor de 1 300 años de antigüedad.' },
  { id: 'girasol-fibonacci', text: 'Las semillas del girasol se ordenan en espirales que siguen la sucesión de Fibonacci.' },
  { id: 'orquideas-familia', text: 'Las orquídeas forman una de las familias de plantas con flor más grandes del mundo: más de 25 000 especies.' },
  { id: 'vainilla', text: 'La vainilla proviene de una orquídea: Vanilla planifolia, originaria de México y Centroamérica.' },
  { id: 'hortensia-ph', text: 'Muchas hortensias son azules en suelos ácidos y rosas en suelos alcalinos.' },
  { id: 'monja-blanca', text: 'La monja blanca, una orquídea de los bosques nubosos, es la flor nacional de Guatemala desde 1934.' },
  { id: 'vid-jade', text: 'La vid de jade de Filipinas tiene flores turquesa y la polinizan murciélagos.' },
  { id: 'protea', text: 'La protea rey puede rebrotar después de un incendio gracias a un órgano subterráneo llamado lignotubérculo.' },
  { id: 'efecto-loto', text: 'Las hojas del loto repelen el agua y se limpian solas: es el famoso «efecto loto».' },
  { id: 'amapola-semillas', text: 'Las semillas de amapola pueden esperar décadas en el suelo hasta que alguien remueva la tierra.' },
  { id: 'plumeria-engano', text: 'La plumeria perfuma la noche para atraer polillas, pero no les ofrece néctar.' },
  { id: 'azafran', text: 'El azafrán, la especia más cara del mundo, son los estigmas de una flor: Crocus sativus.' },
  { id: 'colibries', text: 'Muchas flores tubulares y rojas, como las heliconias, están adaptadas a la polinización por colibríes.' },
];
