export const WP_API_URL = 'https://www.csm.fundelibertad.org/wp-json/wp/v2';

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  categories: number[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      avatar_urls?: Record<string, string>;
    }>;
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text?: string;
      media_details?: {
        sizes?: {
          medium?: { source_url: string };
          large?: { source_url: string };
          thumbnail?: { source_url: string };
        };
      };
    }>;
    'wp:term'?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
      }>
    >;
  };
}

export interface WPCategory {
  id: number;
  count: number;
  name: string;
  slug: string;
}

/**
 * Obtiene todas las entradas publicadas desde WordPress con campos incrustados (_embed)
 */
export async function getPosts(perPage = 10, page = 1): Promise<WPPost[]> {
  try {
    const res = await fetch(`${WP_API_URL}/posts?_embed=1&per_page=${perPage}&page=${page}`);
    if (!res.ok) {
      console.error(`Error fetching posts: ${res.statusText}`);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch posts from WordPress API:', error);
    return [];
  }
}

/**
 * Obtiene una entrada específica por su slug
 */
export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(`${WP_API_URL}/posts?slug=${encodeURIComponent(slug)}&_embed=1`);
    if (!res.ok) return null;
    const posts: WPPost[] = await res.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Failed to fetch post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Obtiene las categorías de WordPress
 */
export async function getCategories(): Promise<WPCategory[]> {
  try {
    const res = await fetch(`${WP_API_URL}/categories?hide_empty=false`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

/**
 * Obtiene entradas de una categoría específica por su slug (ej: 'actividades')
 * Incluye automáticamente cualquier subcategoría hija creada bajo ella.
 */
export async function getPostsByCategory(categorySlug: string, perPage = 30): Promise<WPPost[]> {
  try {
    const cats = await getCategories();
    const targetCat = cats.find(c => c.slug.toLowerCase() === categorySlug.toLowerCase());
    if (targetCat) {
      // Incluir también cualquier subcategoría cuya categoría padre sea esta
      const childCats = cats.filter(c => c.parent === targetCat.id);
      const catIds = [targetCat.id, ...childCats.map(c => c.id)].join(',');
      const res = await fetch(`${WP_API_URL}/posts?categories=${catIds}&_embed=1&per_page=${perPage}`);
      if (res.ok) {
        const posts = await res.json();
        if (posts.length > 0) return posts;
      }
    }

    // Fallback: buscar en todas las entradas si el filtro de API no arrojó resultados
    const all = await getPosts(perPage);
    return all.filter(p => {
      const terms = p._embedded?.['wp:term']?.[0] || [];
      return terms.some(t => 
        t.slug.toLowerCase().includes(categorySlug.toLowerCase()) || 
        t.name.toLowerCase().includes(categorySlug.toLowerCase())
      );
    });
  } catch (error) {
    console.error(`Error fetching posts for category ${categorySlug}:`, error);
    return [];
  }
}

/**
 * Helper para extraer la URL de la imagen destacada
 */
export function getFeaturedImageUrl(post: WPPost, fallback = '/fundelibertad-logo.png'): string {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  return media?.source_url || media?.media_details?.sizes?.large?.source_url || fallback;
}

/**
 * Helper para extraer el autor
 */
export function getAuthorName(post: WPPost, fallback = 'Fundelibertad'): string {
  return post._embedded?.author?.[0]?.name || fallback;
}

/**
 * Helper para verificar si una entrada tiene al menos una categoría válida
 * (excluye 'Uncategorized', 'Sin categoría', y la entrada de prueba 'Hello world!')
 */
export function hasValidCategory(post: WPPost): boolean {
  if (post.slug === 'hello-world' || post.id === 1) return false;
  const categories = getPostCategories(post);
  return categories.some(cat => {
    const lower = cat.trim().toLowerCase();
    return lower !== 'uncategorized' && lower !== 'sin categoría' && lower !== 'sin categoria';
  });
}

/**
 * Helper para extraer los nombres de categorías válidas
 */
export function getPostCategories(post: WPPost): string[] {
  const terms = post._embedded?.['wp:term']?.[0];
  if (!terms || !Array.isArray(terms)) return [];
  return terms
    .map(term => term.name)
    .filter(name => {
      const lower = name.trim().toLowerCase();
      return lower !== 'uncategorized' && lower !== 'sin categoría' && lower !== 'sin categoria';
    });
}
