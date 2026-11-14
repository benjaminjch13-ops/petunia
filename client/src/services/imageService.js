/**
 * Fotografías reales desde Wikipedia / Wikimedia Commons.
 * Usa la API REST pública de Wikipedia (con CORS) y guarda en caché
 * los resultados en memoria y en localStorage.
 */
const WIKI_API = 'https://en.wikipedia.org/api/rest_v1/page';
const CACHE_KEY = 'petunia:image-cache:v1';
const memory = new Map();

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeCache(title, value) {
  try {
    const cache = readCache();
    cache[title] = value;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* almacenamiento no disponible: se ignora */
  }
}

const inflight = new Map();

/** Devuelve { src, thumb, pageUrl } o null si no hay imagen. */
export async function getFlowerImage(title) {
  if (!title) return null;
  if (memory.has(title)) return memory.get(title);
  const cached = readCache()[title];
  if (cached !== undefined) {
    memory.set(title, cached);
    return cached;
  }
  if (inflight.has(title)) return inflight.get(title);

  const request = fetch(`${WIKI_API}/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const image = data?.thumbnail?.source
        ? {
          thumb: data.thumbnail.source,
          src: data.originalimage?.source || data.thumbnail.source,
          pageUrl: data.content_urls?.desktop?.page,
        }
        : null;
      memory.set(title, image);
      writeCache(title, image);
      return image;
    })
    .catch(() => null)
    .finally(() => inflight.delete(title));

  inflight.set(title, request);
  return request;
}

/** Galería: imágenes del artículo de Wikipedia (hasta `limit`). */
export async function getFlowerGallery(title, limit = 6) {
  if (!title) return [];
  try {
    const res = await fetch(`${WIKI_API}/media-list/${encodeURIComponent(title.replace(/ /g, '_'))}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || [])
      .filter((item) => item.type === 'image' && item.srcset?.length && !/\.svg$/i.test(item.title || '') && !/map|distribution|range/i.test(item.title || ''))
      .slice(0, limit)
      .map((item) => {
        const src = item.srcset[item.srcset.length - 1].src;
        return {
          src: src.startsWith('//') ? `https:${src}` : src,
          caption: item.caption?.text || '',
          title: item.title,
        };
      });
  } catch {
    return [];
  }
}
