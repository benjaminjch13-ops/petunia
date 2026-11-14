import * as metaService from '../services/metaService.js';

/** GET /api/meta — taxonomía, filtros disponibles y estadísticas. */
export async function getMeta(req, res) {
  res.json({ data: await metaService.getMeta() });
}

/** GET /api/tips?topic= — consejos botánicos y curiosidades. */
export function getTips(req, res) {
  res.json({ data: metaService.getTips({ topic: req.query.topic }) });
}

/** GET /api/tips/random?type=tip|curiosity */
export function getRandomTip(req, res) {
  const type = req.query.type === 'curiosity' ? 'curiosity' : 'tip';
  res.json({ data: metaService.getRandomTip(type) });
}

/** GET /api/health */
export function health(req, res) {
  res.json({ status: 'ok', service: 'petunia-api', time: new Date().toISOString() });
}
