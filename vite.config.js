import { defineConfig } from 'vite';

export default defineConfig({
  // Configure Vite to use relative paths for build outputs, 
  // which makes assets load correctly on GitHub Pages under any subpath.
  base: './',
});
