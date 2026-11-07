import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [tailwindcss(), {
    name: 'valver-hero-development',
    apply: 'serve',
    transformIndexHtml(html) {
      return html
        .replace(/<script src="\.\/assets\/runtime\/hero-parallax\.js[^\"]*" defer><\/script>/, '')
        .replace(/<link rel="stylesheet" href="\.\/assets\/runtime\/hero-parallax\.css[^\"]*">/, '')
        .replace('</body>', '<script type="module" src="/src/hero.tsx"></script></body>');
    },
  }],
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  publicDir: false,
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: 'assets/runtime',
    emptyOutDir: false,
    target: 'es2020',
    lib: {
      entry: 'src/hero.tsx',
      name: 'ValverHero',
      formats: ['iife'],
      fileName: () => 'hero-parallax.js',
      cssFileName: 'hero-parallax',
    },
  },
});
