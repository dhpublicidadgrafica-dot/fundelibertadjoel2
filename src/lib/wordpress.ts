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

export const DEFAULT_FALLBACK_IMAGES = {
  actividades: 'https://lh3.googleusercontent.com/d/1mzMGHUgDdHcX8hpf8DTMLIs2Dv53CCsd',
  proyectos: 'https://lh3.googleusercontent.com/d/11y3-Zw7P020zrMq6cakM0RrvsjrFlzW5',
  programas: 'https://lh3.googleusercontent.com/d/1VOAa3Fwpv9QvlaDHN7PP8mWY-jYImtzN',
};

/**
 * Helper para determinar la imagen predeterminada de una entrada según su categoría
 */
export function getDefaultImageForPost(post: WPPost | any): string {
  const cats = getPostCategories(post);
  const catsLower = cats.map(c => c.toLowerCase());

  if (catsLower.some(c => c.includes('proyecto'))) {
    return DEFAULT_FALLBACK_IMAGES.proyectos;
  }
  if (catsLower.some(c => 
    c.includes('asesoria') || c.includes('asesoría') || 
    c.includes('juridica') || c.includes('jurídica') || 
    c.includes('legal') || c.includes('informe') || 
    c.includes('denuncia') || c.includes('ddhh') || 
    c.includes('practica') || c.includes('práctica') || 
    c.includes('pasantia') || c.includes('pasantía') ||
    c.includes('programa')
  )) {
    return DEFAULT_FALLBACK_IMAGES.programas;
  }
  return DEFAULT_FALLBACK_IMAGES.actividades;
}

/**
 * Helper unificado para extraer la URL de la imagen de una entrada:
 * 1. Imagen destacada oficial de WordPress (_embedded['wp:featuredmedia'][0])
 * 2. Si no tiene imagen destacada, busca la primera imagen dentro del contenido HTML
 * 3. Si se pasa un fallback explícito, lo usa
 * 4. Si no, usa el fallback correspondiente a la categoría de la entrada
 * Esto garantiza que la imagen de la CARD y la del DETALLE siempre sean exactamente la misma.
 */
export function getFeaturedImageUrl(post: WPPost | any, fallback?: string): string {
  // 1. Featured Media de WordPress
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const mediaUrl = media?.source_url || media?.media_details?.sizes?.large?.source_url || media?.media_details?.sizes?.full?.source_url;
  if (mediaUrl) return mediaUrl;

  // 2. Primera imagen en el contenido de la entrada
  if (post.content?.rendered) {
    const match = post.content.rendered.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  // 3. Fallback explícito
  if (fallback) return fallback;

  // 4. Fallback inteligente según categoría
  return getDefaultImageForPost(post);
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
