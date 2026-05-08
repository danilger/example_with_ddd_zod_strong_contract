import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@repo/contract': path.resolve(rootDir, '../contract/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/posts': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
