// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://drilonrecica.github.io',
  base: '/', // Set to '/<repo>/' if deploying to a project page
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()]
});