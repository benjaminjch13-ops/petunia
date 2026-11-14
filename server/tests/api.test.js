import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
const { createApp } = await import('../app.js');

let server;
let base;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
});

after(() => server.close());

const get = async (path) => {
  const res = await fetch(base + path);
  return { status: res.status, body: await res.json() };
};

test('lista todas las flores', async () => {
  const { status, body } = await get('/flowers');
  assert.equal(status, 200);
  assert.ok(body.data.length >= 30);
  assert.equal(body.meta.total, body.data.length);
});

test('obtiene una flor por id y devuelve 404 si no existe', async () => {
  const ok = await get('/flowers/rosa');
  assert.equal(ok.status, 200);
  assert.equal(ok.body.data.scientificName.startsWith('Rosa'), true);
  const missing = await get('/flowers/no-existe');
  assert.equal(missing.status, 404);
});

test('busca ignorando tildes', async () => {
  const { body } = await get('/flowers/search?q=tulipan');
  assert.equal(body.data[0].id, 'tulipan');
});

test('filtra por categoría, clima y color', async () => {
  const cat = await get('/flowers/category/acuaticas');
  assert.ok(cat.body.data.every((f) => f.categories.includes('acuaticas')));
  const climate = await get('/flowers/climate/alpino');
  assert.ok(climate.body.data.some((f) => f.id === 'edelweiss'));
  const color = await get('/flowers?color=azul');
  assert.ok(color.body.data.every((f) => f.colors.includes('azul')));
});

test('rechaza filtros no válidos', async () => {
  const { status } = await get('/flowers?color=fucsia');
  assert.equal(status, 400);
});

test('temporada respeta el hemisferio', async () => {
  const north = await get('/flowers/season/primavera?hemisphere=north');
  const south = await get('/flowers/season/primavera?hemisphere=south');
  assert.ok(north.body.data.some((f) => f.id === 'tulipan'));
  assert.ok(south.body.data.some((f) => f.id === 'tulipan'));
  const tulip = north.body.data.find((f) => f.id === 'tulipan');
  assert.deepEqual(tulip.calendar.south.bloom, [9, 10, 11]);
});

test('destacadas, aleatoria y flor del día', async () => {
  const featured = await get('/flowers/featured');
  assert.ok(featured.body.data.every((f) => f.featured));
  const random = await get('/flowers/random?exclude=rosa');
  assert.notEqual(random.body.data.id, 'rosa');
  const d1 = await get('/flowers/daily');
  const d2 = await get('/flowers/daily');
  assert.equal(d1.body.data.id, d2.body.data.id);
});

test('compara entre 2 y 3 flores', async () => {
  const ok = await get('/flowers/compare?ids=rosa,lavanda');
  assert.equal(ok.body.data.length, 2);
  const bad = await get('/flowers/compare?ids=rosa');
  assert.equal(bad.status, 400);
});

test('meta y consejos', async () => {
  const meta = await get('/meta');
  assert.equal(meta.body.data.categories.length, 12);
  assert.ok(meta.body.data.categories.every((c) => c.count > 0));
  const tips = await get('/tips');
  assert.ok(tips.body.data.tips.length > 0);
});
