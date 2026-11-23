import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // En Vercel corre en la raíz '/', en GitHub Pages usa '/fundelibertadjoel2'
  base: process.env.VERCEL ? '/' : (process.env.ASTRO_BASE || '/fundelibertadjoel2'),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
