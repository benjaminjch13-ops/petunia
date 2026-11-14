import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`🌸 API de Petunia escuchando en http://localhost:${config.port}/api`);
});
