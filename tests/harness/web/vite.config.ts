import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..', '..', '..');
const pluginAssets = path.join(repoRoot, 'skills', 'apple-web', 'assets');
const themeScriptPath = path.join(pluginAssets, 'lib', 'theme-script.ts');
const anchorImporter = path.join(here, 'package.json');

function extractThemeInitScript(): string {
  const src = fs.readFileSync(themeScriptPath, 'utf8');
  const m = src.match(/export const CF_THEME_INIT_SCRIPT = `([\s\S]*?)`;/);
  if (!m) throw new Error('Missing CF_THEME_INIT_SCRIPT');
  return m[1];
}

const resolveOutOfTreeDeps: Plugin = {
  name: 'resolve-scratch-node-modules',
  async resolveId(source, importer, options) {
    if (
      importer &&
      !source.startsWith('.') &&
      !source.startsWith('/') &&
      !path.isAbsolute(source) &&
      !source.startsWith('@/') &&
      !importer.startsWith(here)
    ) {
      return this.resolve(source, anchorImporter, { ...options, skipSelf: true });
    }
    return null;
  },
};

export default defineConfig({
  plugins: [
    resolveOutOfTreeDeps,
    react(),
    tailwindcss(),
    {
      name: 'inject-cf-theme-script',
      transformIndexHtml(html) {
        const initJs = extractThemeInitScript();
        const probeJs = `window.__FIRST_PAINT_THEME__=document.documentElement.dataset.theme;window.__FIRST_PAINT_TRANSPARENCY__=document.documentElement.dataset.transparency;window.__FIRST_PAINT_CONTRAST__=document.documentElement.dataset.contrast;`;
        return html.replace('<!--CF_THEME_SCRIPT-->', `<script>${initJs}</script>\n<script>${probeJs}</script>`);
      },
    },
  ],
  resolve: {
    alias: {
      '@/lib/cupertino': path.join(pluginAssets, 'lib'),
      '@/components/apple': path.join(pluginAssets, 'components', 'apple'),
      '@/styles/cupertino': path.join(here, 'src', 'styles', 'cupertino'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
});
