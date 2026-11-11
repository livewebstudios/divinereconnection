// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// LWS path rule: every internal reference in the built site is relative, so the
// site survives host moves. Source links already go through src/lib/url.ts;
// this catches what Astro itself emits ("/_astro/..." bundles, island URLs).
// Canonical and og: tags stay absolute. 404.html is skipped on purpose: Netlify
// serves it at any depth, so only root-relative links work there.
/** @returns {import('astro').AstroIntegration} */
function relativePaths() {
  return {
    name: 'lws-relative-paths',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        const files = (await readdir(root, { recursive: true })).map((f) => join(root, f));
        for (const file of files) {
          const rel = relative(root, file);
          if (file.endsWith('.html') && rel !== '404.html') {
            const depth = rel.split(sep).length - 1;
            const prefix = depth === 0 ? './' : '../'.repeat(depth);
            const html = await readFile(file, 'utf8');
            const out = html.replace(
              /(\s(?:href|src|srcset|poster|action|component-url|renderer-url|before-hydration-url)=")\/(?!\/)/g,
              `$1${prefix}`,
            );
            if (out !== html) await writeFile(file, out);
          } else if (file.endsWith('.css') && file.includes(`${sep}_astro${sep}`)) {
            const css = await readFile(file, 'utf8');
            const out = css.replace(/url\(\s*(['"]?)\/_astro\//g, 'url($1./');
            if (out !== css) await writeFile(file, out);
          }
        }
      },
    },
  };
}

export default defineConfig({
  site: 'https://divinereconnection.org',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
  integrations: [
    react(),
    sitemap({ filter: (page) => !page.includes('/admin/') && !page.includes('/404') }),
    relativePaths(),
  ],
  vite: {
    // Vite's preload helper writes root-relative "/_astro/" links for lazy
    // chunks. The imports themselves are relative, so preloading stays off.
    build: { modulePreload: false },
  },
});
