import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  root: resolve(__dirname),
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'vite-index.html'),
    },
  },
  server: {
    port: 5173,
    open: '/vite-index.html',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': resolve(__dirname, 'src'),
      '@app': resolve(__dirname, 'src/app'),
      '@modules': resolve(__dirname, 'src/modules'),
      '@shared': resolve(__dirname, 'src/shared'),
      '@data': resolve(__dirname, 'src/data'),
    },
  },
});
