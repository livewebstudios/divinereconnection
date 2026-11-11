// LWS path rule: internal links are always relative to the current page.
// rel('about/', Astro.url) from "/" gives "./about/", from "/services/prayer/" gives "../../about/".
export function rel(path: string, current: URL): string {
  const clean0 = path.replace(/^\.?\//, '');
  // 404.html is served by Netlify at any depth, so relative links cannot work
  // there. This is the one page that uses root-relative links.
  if (/^\/404\/?$/.test(current.pathname)) return '/' + clean0;
  const parts = current.pathname.split('/').filter(Boolean);
  // "/404" (no trailing slash) is a file at the root, not a folder.
  const depth = current.pathname.endsWith('/') ? parts.length : Math.max(parts.length - 1, 0);
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  const clean = path.replace(/^\.?\//, '');
  return clean === '' ? prefix : prefix + clean;
}

export function isCurrent(path: string, current: URL): boolean {
  const clean = '/' + path.replace(/^\.?\//, '');
  if (clean === '/') return current.pathname === '/';
  return current.pathname.startsWith(clean);
}
