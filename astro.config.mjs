
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const base =
  process.env.GITHUB_ACTIONS === 'true'
    ? '/yashtechcctv'
    : '/';

export default defineConfig({
  site: 'https://fzfalcon.github.io',
  base,
  output: 'static',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  }
});
