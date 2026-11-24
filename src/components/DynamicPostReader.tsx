import React, { useEffect, useState } from 'react';
import { Calendar, User, ArrowLeft, Heart, MessageCircle, Loader2, AlertCircle, Home } from 'lucide-react';
import { url } from '../lib/base';
import { getFeaturedImageUrl } from '../lib/wordpress';

interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  categories: number[];
  _embedded?: {
    author?: Array<{ id: number; name: string }>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
      media_details?: {
        sizes?: {
          large?: { source_url: string };
        };
      };
    }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

export default function DynamicPostReader() {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<WPPost | null>(null);
  const [isBlogRoute, setIsBlogRoute] = useState(false);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    // Analizar la ruta actual en el navegador
    const pathname = window.location.pathname;
    const blogMatch = pathname.match(/\/blog\/([^/?#]+)/i);

    if (blogMatch && blogMatch[1]) {
      const extractedSlug = decodeURIComponent(blogMatch[1]);
      setSlug(extractedSlug);
      setIsBlogRoute(true);

      // Cargar en vivo la entrada desde la API de WordPress
      fetch(`https://www.csm.fundelibertad.org/wp-json/wp/v2/posts?slug=${encodeURIComponent(extractedSlug)}&_embed=1`)
        .then((res) => {
          if (!res.ok) throw new Error('Error al consultar WordPress');
          return res.json();
        })
        .then((posts) => {
          if (Array.isArray(posts) && posts.length > 0) {
            setPost(posts[0]);
            document.title = `${posts[0].title.rendered} | FUNDELIBERTAD Blog`;
          } else {
            setPost(null);
          }
        })
        .catch((err) => {
          console.error('Error cargando entrada dinámica:', err);
          setPost(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setIsBlogRoute(false);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
        <p className="text-sm font-semibold text-slate-600">
          Cargando artículo de FUNDELIBERTAD...
        </p>
      </div>
    );
  }

  // Si no es una ruta de /blog/ o no se encontró en WordPress
  if (!post) {
    return (
      <div className="py-20 max-w-xl mx-auto text-center px-4 space-y-6">
        <div className="w-16 h-16 bg-sky-50 text-brand-primary rounded-3xl mx-auto flex items-center justify-center shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Página no encontrada (404)
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            {isBlogRoute
              ? `No se encontró ningún artículo publicado con el identificador "${slug}".`
              : 'El enlace que intentas abrir no existe o fue movido.'}
          </p>
        </div>
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <a
            href={url('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            Ir al Inicio
          </a>
          <a
            href={url('/actividades')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            Ver Actividades
          </a>
        </div>
      </div>
    );
  }

  // Extraer datos del post
  const rawTerms = post._embedded?.['wp:term']?.[0] || [];
  const categories = rawTerms
    .map((t) => t.name)
    .filter((n) => {
      const lower = n.toLowerCase();
      return lower !== 'uncategorized' && lower !== 'sin categoría' && lower !== 'sin categoria';
    });

  const isProject = categories.some((c) => c.toLowerCase().includes('proyecto'));
  const featuredImg = getFeaturedImageUrl(post);
  const authorName = post._embedded?.author?.[0]?.name || 'Fundelibertad';
  const dateStr = new Date(post.date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="py-12">
      {/* Header Article */}
      <header className="max-w-4xl mx-auto space-y-6 text-center">
        {categories.length > 0 && (
          <div className="flex items-center justify-center gap-2">
            {categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-sky-100 text-brand-primary text-xs font-bold uppercase tracking-wider"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <h1
          className="font-display font-black text-3xl sm:text-5xl text-brand-dark tracking-tight leading-tight"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 pt-2 border-b border-slate-200/60 pb-6">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            {dateStr}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <User className="w-4 h-4 text-slate-400" />
            Por {authorName}
          </span>
        </div>
      </header>

      {/* Featured Image */}
      {featuredImg && (
        <div className="w-full max-w-5xl mx-auto my-10 flex justify-center">
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 aspect-video max-h-[560px] flex items-center justify-center">
            <img
              src={featuredImg}
              alt={post.title.rendered}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="max-w-4xl mx-auto">
        <div
          className="wp-content bg-white p-6 sm:p-12 rounded-3xl shadow-xs border border-slate-100 text-slate-700 leading-relaxed text-base space-y-6"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* Botón Volver */}
        <div className="pt-8 pb-2 flex justify-start">
          <a
            href={isProject ? url('/proyectos') : url('/actividades')}
            onClick={(e) => {
              if (window.history.length > 1) {
                e.preventDefault();
                window.history.back();
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-primary transition-colors bg-white hover:bg-slate-50 px-5 py-2.5 rounded-xl shadow-xs border border-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a todas las entradas
          </a>
        </div>

        {/* Institutional Call To Action */}
        <div className="mt-12 bg-gradient-to-r from-sky-50 to-emerald-50 rounded-3xl p-8 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-display font-bold text-lg text-brand-dark">
              ¿Deseas apoyar nuestra labor comunitaria?
            </h3>
            <p className="text-xs text-slate-600">
              Cada donación nos permite defender derechos y brindar asesoría jurídica sin costo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-donation-modal'))}
              className="px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Heart className="w-4 h-4 fill-white" />
              Donar Ahora
            </button>
            <a
              href="https://wa.me/573002167822"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              Contactar
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

