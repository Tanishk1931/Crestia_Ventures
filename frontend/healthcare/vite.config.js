import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: './',
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: resolve(projectDir, '../../deployment/godaddy/public_html/medical'),
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: resolve(projectDir, 'src/MedicalChoices.jsx'),
      formats: ['iife'],
      name: 'MedicalChoices',
      fileName: () => 'medical-cards.js',
      cssFileName: 'medical-cards',
    },
    rollupOptions: { output: { assetFileNames: 'medical-cards[extname]' } },
  },
});
