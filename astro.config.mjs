import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages project-site base. Local development and custom-domain builds use '/'.
const base = process.env.GITHUB_ACTIONS === 'true' ? '/yashtechcctv' : '/';

export default defineConfig({
  site: 'https://fzfalcon.github.io',
  base,
  output: 'static',
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] }
});
