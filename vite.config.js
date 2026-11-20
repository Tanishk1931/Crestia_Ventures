import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Builds a single IIFE bundle + CSS straight into the static RCM page folder.
export default defineConfig({
  plugins: [react()],
  base: './',
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: resolve(__dirname, '../public_html/rcm'),
    emptyOutDir: false, // the folder also holds the static page; never wipe it
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/main.jsx'),
      formats: ['iife'],
      name: 'RCMServices',
      fileName: () => 'rcm-services.js',
      cssFileName: 'rcm-services',
    },
    rollupOptions: { output: { assetFileNames: 'rcm-services[extname]' } },
  },
});
