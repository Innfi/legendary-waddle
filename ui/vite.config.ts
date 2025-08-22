import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  // const env = loadEnv(mode, process.cwd(), '');
  // console.log(`env: ${process.env.VITE_BACKEND_URL}`);

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: import.meta.env.VITE_BACKEND_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
    },
  };
});
