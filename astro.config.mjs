// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://drilonrecica.github.io',
  base: '/', // Set to '/<repo>/' if deploying to a project page
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), sitemap({
    // Forwarding pages for URLs that moved to recica.dev stay out of the sitemap.
    filter: (page) => !['/cv/', '/work/deutsche-bahn/', '/work/qisara/'].some((path) => page.endsWith(path))
  })]
});
