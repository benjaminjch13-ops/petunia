import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// El archivo .env vive en la raíz del proyecto (compartido con el servidor).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '..', '');
  // Variable propia para no confundirse con PORT (algunas herramientas la fijan para Vite).
  const apiTarget = env.API_PROXY_TARGET || 'http://127.0.0.1:4000';

  return {
    plugins: [react()],
    envDir: '..',
    server: {
      port: 5173,
      proxy: {
        // 127.0.0.1 evita problemas de resolución IPv6 de "localhost" en Windows.
        '/api': { target: apiTarget, changeOrigin: true },
      },
    },
  };
});
