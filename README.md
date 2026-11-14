# 🌸 PETUNIA — Enciclopedia digital de flores

Petunia es una plataforma web interactiva para **descubrir flores de todo el mundo, conocer sus
características y aprender a cultivarlas**. Combina un catálogo botánico con búsqueda y filtros,
fichas detalladas por especie, herramientas (comparador, calendario, consejos…) y a **Tuni**, una
mascota ilustrada que guía a cada visitante.

> «Descubre la belleza de cada flor y aprende a hacerla florecer».

---

## ✨ Funcionalidades

| Área | Qué incluye |
| --- | --- |
| **Inicio** | Logo, menú, buscador con sugerencias, bienvenida, mascota, flor del día, destacadas, 12 categorías, descubrimiento aleatorio, secciones especiales y acceso al catálogo. |
| **Catálogo** | 33 especies iniciales (tropicales, silvestres, exóticas, acuáticas, desérticas, de interior…). Búsqueda en vivo sin tildes, filtros combinables por categoría, color, clima, temporada (por hemisferio), tipo de crecimiento, dificultad, interior y seguridad para mascotas. Orden y filtros sincronizados con la URL. |
| **Ficha de especie** | Información general, características físicas, colores, simbolismo, curiosidades; ambiente y crecimiento; plantación vs. floración con calendario por hemisferio; guía de cuidados (riego, luz, abono, poda, plagas, enfermedades, consejos); toxicidad para mascotas, uso comestible (solo si está documentado), vida aproximada; galería de fotos y fuentes. |
| **Mascota Tuni** | Personaje SVG original con 6 expresiones y 6 poses animadas. Botón flotante con panel de ayuda (consejos, curiosidades, flor sorpresa, flor del día), bienvenida en la primera visita, mensajes contextuales por página y por especie (luz, toxicidad). |
| **Recorrido guiado** | 8 pasos que navegan solos entre páginas y resaltan la interfaz: catálogo, búsqueda, filtros, fichas, cuidados y secciones especiales. Teclado: ← → y Esc. |
| **Extras** | Favoritas persistentes (localStorage), comparador de hasta 3 flores, calendario anual de plantación/floración, consejos botánicos, flores para regalar (con aviso de mascotas) y recomendaciones por ambiente. |
| **UX** | Diseño responsive (móvil, tablet, escritorio), carga progresiva de imágenes, esqueletos de carga, animaciones suaves, estados vacíos y de error, accesibilidad (roles ARIA, foco visible, `prefers-reduced-motion`). |

---

## 🧱 Tecnologías

- **Frontend:** React 18, React Router 6, Vite 6, CSS3 (sin frameworks).
- **Backend:** Node.js (≥ 18), Express 4, API REST.
- **Datos:** archivos JavaScript estructurados y validados por un modelo, con una capa de
  repositorio preparada para cambiar a base de datos.
- **Imágenes:** fotografías reales de Wikipedia / Wikimedia Commons (API pública REST), con caché.

---

## 🚀 Instalación y ejecución

Requisitos: **Node.js 18 o superior** y npm.

```bash
# 1. Instalar dependencias (raíz, servidor y cliente)
npm run install:all

# 2. Crear el archivo de entorno
cp .env.example .env        # En Windows (PowerShell): Copy-Item .env.example .env

# 3. Arrancar backend y frontend a la vez
npm run dev
```

- Frontend: <http://localhost:5173>
- API: <http://localhost:4000/api> (Vite redirige `/api` al servidor en desarrollo)

### Ejecutar por separado

```bash
npm run dev:server   # API Express con recarga automática (node --watch)
npm run dev:client   # Vite + React
```

### Producción

```bash
npm run build                 # Compila el cliente en client/dist
NODE_ENV=production npm start # Express sirve la API y el frontend compilado en el puerto PORT
```

### Pruebas de la API

```bash
npm test   # 9 pruebas con node:test (listado, búsqueda, filtros, hemisferios, comparador…)
```

### Variables de entorno (`.env`)

| Variable | Uso | Valor por defecto |
| --- | --- | --- |
| `PORT` | Puerto de la API | `4000` |
| `CLIENT_ORIGIN` | Origen permitido por CORS | `http://localhost:5173` |
| `NODE_ENV` | `development` / `production` | `development` |
| `DATA_SOURCE` | Repositorio de datos (`local`) | `local` |
| `VITE_API_URL` | URL base de la API en el navegador | `/api` |
| `API_PROXY_TARGET` | Destino del proxy de Vite | `http://127.0.0.1:4000` |

---

## 🗂️ Estructura del proyecto

```
petunia/
├── client/                         # Frontend React (Vite)
│   ├── public/
│   │   ├── images/                 # Logo (PNG transparente + original)
│   │   ├── icons/                  # Favicon
│   │   └── mascot/                 # Tuni exportada en SVG
│   ├── src/
│   │   ├── assets/                 # Notas sobre recursos gráficos
│   │   ├── components/             # Navbar, Footer, FlowerCard, FlowerFilters, SearchBar,
│   │   │                           # Mascot, MascotHelper, GuidedTour, FlowerImage, Badges,
│   │   │                           # MonthStrip, CompareTray, States, Loader…
│   │   ├── context/                # Favoritas, comparador, preferencias, mascota
│   │   ├── data/                   # Textos de Tuni, pasos del recorrido, navegación
│   │   ├── hooks/                  # useApi, useMeta, useLocalStorage, useDebounce, useInView…
│   │   ├── pages/                  # Home, Catalog, FlowerDetails, Favorites, Compare,
│   │   │                           # Calendar, Tips, Gifts, Environments, About, NotFound
│   │   ├── services/               # api.js, flowerService.js, imageService.js
│   │   ├── styles/                 # variables, global, animations, layout, components,
│   │   │                           # cards, mascot, pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
│
├── server/                         # Backend Node.js + Express
│   ├── config/                     # Configuración y variables de entorno
│   ├── controllers/                # flowerController, metaController
│   ├── data/
│   │   ├── flowers/                # Catálogo por grupos (jardin, tropicales, exoticas…)
│   │   └── tips.js                 # Consejos y curiosidades
│   ├── middleware/                 # Errores, logger, validación de filtros
│   ├── models/                     # Flower (validación + campos derivados), taxonomy
│   ├── routes/                     # /api, /api/flowers
│   ├── services/                   # Lógica de negocio + repositories/
│   ├── tests/                      # Pruebas de la API
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json                    # Scripts para ambos proyectos
└── README.md
```

---

## 🔌 API REST

Todas las respuestas tienen la forma `{ data, meta? }`; los errores, `{ error: { status, message } }`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/flowers` | Todas las flores. Filtros: `q`, `category`, `color`, `climate`, `season` + `hemisphere`, `growth`, `difficulty`, `environment`, `lifecycle`, `indoor`, `outdoor`, `giftable`, `featured`, `petSafe`, `ids`, `sort`, `page`, `limit`. Valores múltiples separados por comas. |
| GET | `/api/flowers/:id` | Ficha completa de una flor. |
| GET | `/api/flowers/:id/related` | Flores con categorías en común. |
| GET | `/api/flowers/search?q=` | Búsqueda por nombre común, alternativo o científico (ignora tildes). |
| GET | `/api/flowers/category/:category` | Filtrar por categoría. |
| GET | `/api/flowers/climate/:climate` | Filtrar por clima. |
| GET | `/api/flowers/season/:season?hemisphere=` | Flores que florecen en una estación (norte/sur). |
| GET | `/api/flowers/month/:month?hemisphere=` | Qué plantar y qué florece en un mes. |
| GET | `/api/flowers/featured` | Flores destacadas. |
| GET | `/api/flowers/random?exclude=&category=` | Flor aleatoria. |
| GET | `/api/flowers/daily` | Flor del día (determinista por fecha). |
| GET | `/api/flowers/compare?ids=a,b,c` | Comparar 2–3 flores. |
| GET | `/api/meta` | Taxonomía, recuentos y estadísticas. |
| GET | `/api/tips`, `/api/tips/random?type=tip\|curiosity` | Consejos y curiosidades. |
| GET | `/api/health` | Estado del servicio. |

Ejemplo: `GET /api/flowers?color=azul,morado&climate=templado&season=verano&hemisphere=south`

---

## 🌱 Añadir nuevas especies

1. Copia un registro existente en `server/data/flowers/` (o crea un archivo nuevo e impórtalo en `index.js`).
2. Usa solo valores definidos en `server/models/taxonomy.js` (categorías, colores, climas…).
3. Indica los meses (1–12) **para el hemisferio norte**. Con `hemisphereDependent: true` el modelo
   calcula automáticamente el calendario del sur; usa `false` para especies tropicales poco estacionales.
4. Si no hay fuente fiable sobre toxicidad o uso comestible, usa `"sin-datos"`. **No inventes datos.**
5. Añade `wikiTitle` (título del artículo de Wikipedia en inglés) para obtener fotografías.
6. Ejecuta `npm test`: el modelo valida todos los registros al arrancar.

### Integrar una base de datos o una fuente externa

La API no accede a los datos directamente, sino a través de un **repositorio**
(`server/services/repositories/`). Para usar MongoDB, PostgreSQL o una fuente botánica externa,
crea una clase con `findAll()`, `findById(id)` y `count()`, regístrala en
`repositories/index.js` y cambia `DATA_SOURCE` en `.env`. Controladores, rutas y frontend no cambian.

---

## 📚 Fuentes y rigor de la información

- **Taxonomía y distribución:** Plants of the World Online (Royal Botanic Gardens, Kew).
- **Toxicidad para mascotas:** ASPCA Animal Poison Control.
- **Fotografías:** Wikipedia / Wikimedia Commons (licencias libres; la autoría está en cada archivo).
- **Cultivo:** referencias hortícolas generales (RHS, Missouri Botanical Garden).

Cada ficha enlaza sus fuentes. El contenido es **divulgativo**: los calendarios y cuidados son
orientativos y varían según clima, altitud y variedad. Petunia **no afirma contener todas las
especies del planeta**: es un catálogo en crecimiento. Ante una posible intoxicación de personas o
animales, consulta de inmediato a un profesional sanitario o veterinario.

---

## 🐾 Conoce a Tuni

Tuni es una pequeña flor de pétalos rosa pastel, cara color crema, hojas como brazos y una maceta
rosa. Tiene expresiones (feliz, emocionada, guiño, sorpresa, pensativa, dormilona) y poses
(reposo, saludo, salto, señalar, celebrar). Es un SVG original en `client/src/components/Mascot.jsx`.
