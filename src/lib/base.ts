/**
 * Helper to generate correct URLs whether running on root domain or under GitHub Pages subpath (/fundelibertad/)
 */

export const BASE_URL = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export function url(path: string = ''): string {
  if (!path || path === '/') {
    return BASE_URL ? `${BASE_URL}/` : '/';
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
}
