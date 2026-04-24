import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2017',
    chunkSizeWarningLimit: 2500,
  },
  server: {
    open: true,
  },
});
