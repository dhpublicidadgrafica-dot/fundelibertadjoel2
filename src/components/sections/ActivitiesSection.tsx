/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Eye, X, ArrowRight, Search, RefreshCw } from 'lucide-react';
import { LATEST_ACTIVITIES } from '../../data';
import AdaptiveImage from '../AdaptiveImage';
import { url } from '../../lib/base';

export interface WPActivityItem {
  id: string | number;
  title: string;
  category: string;
  categories?: string[];
  description: string;
  content: string;
  image: string;
  slug?: string;
  date?: string;
}

interface ActivitiesSectionProps {
  wpActivities?: WPActivityItem[];
}

function resolveCategories(cats: string[], title: string = '') {
  const clean = cats.filter(c => c && c.toLowerCase() !== 'uncategorized' && c.toLowerCase() !== 'sin categoría');
  if (clean.length > 0) {
    const specific = clean.find(c => c.toLowerCase() !== 'actividades') || clean[0];
    return { primary: specific, all: clean };
  }
  const lower = title.toLowerCase();
  let inferred = 'Actividades';
  if (lower.includes('conversatorio')) inferred = 'Conversatorios';
  else if (lower.includes('jornada')) inferred = 'Jornadas';
  else if (lower.includes('taller')) inferred = 'Talleres';
  else if (lower.includes('asamblea')) inferred = 'Asambleas';
  else if (lower.includes('foro')) inferred = 'Foros';
  return { primary: inferred, all: [inferred, 'Actividades'] };
}

export default function ActivitiesSection({ wpActivities = [] }: ActivitiesSectionProps) {
  const [activities, setActivities] = useState<WPActivityItem[]>(wpActivities);
  const [selectedActivity, setSelectedActivity] = useState<WPActivityItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sincronización en tiempo real desde WordPress:
  // Al cargar y cada vez que el usuario vuelve a enfocar esta pestaña tras crear o editar una entrada
  useEffect(() => {
    let isMounted = true;

    const fetchLiveWordPressActivities = async () => {
      try {
        setIsSyncing(true);
        const res = await fetch('https://www.csm.fundelibertad.org/wp-json/wp/v2/posts?_embed=1&per_page=50');
        if (!res.ok) return;
        const rawPosts = await res.json();
        if (!Array.isArray(rawPosts) || !isMounted) return;

        // REGLA: Entrada que no tenga categorías válidas NO se muestra en ningún lado
        const filteredPosts = rawPosts.filter((post: any) => {
          if (post.slug === 'hello-world' || post.id === 1) return false;
          const terms: any[] = post._embedded?.['wp:term']?.[0] || [];
          const validTerms = terms.filter((t: any) => {
            const name = (t.name || '').toLowerCase();
            const slug = (t.slug || '').toLowerCase();
            return name !== 'uncategorized' && name !== 'sin categoría' && slug !== 'uncategorized';
          });
          if (validTerms.length === 0) return false;
          const isProject = validTerms.some((t: any) => t.name.toLowerCase().includes('proyecto') || t.slug.toLowerCase().includes('proyecto'));
          return !isProject;
        });

        const mapped: WPActivityItem[] = filteredPosts.map((post: any) => {
          const terms: any[] = post._embedded?.['wp:term']?.[0] || [];
          const catNames = terms
            .map((t: any) => t.name)
            .filter((name: string) => {
              const lower = name.toLowerCase();
              return lower !== 'uncategorized' && lower !== 'sin categoría';
            });
          const specificCat = catNames.find(c => c.toLowerCase() !== 'actividades') || catNames[0] || 'Actividades';
          const media = post._embedded?.['wp:featuredmedia']?.[0];
          const featuredImg = media?.source_url || media?.media_details?.sizes?.large?.source_url || 'https://lh3.googleusercontent.com/d/1mzMGHUgDdHcX8hpf8DTMLIs2Dv53CCsd';
          const dateStr = new Date(post.date).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          return {
            id: `wp-${post.id}`,
            title: post.title.rendered,
            category: specificCat,
            categories: catNames,
            description: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').trim(),
            content: post.content.rendered,
            image: featuredImg,
            slug: post.slug,
            date: dateStr,
          };
        });

        if (isMounted && mapped.length > 0) {
          setActivities(mapped);
        }
      } catch (e) {
        // En caso de error de red, mantiene los datos existentes
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    fetchLiveWordPressActivities();

    // Re-sincronizar automáticamente cuando el usuario regresa a la pestaña
    const handleFocus = () => {
      fetchLiveWordPressActivities();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Lista de actividades (WordPress en vivo o muestra predeterminada)
  const activitiesList = activities.length > 0 ? activities : (LATEST_ACTIVITIES as WPActivityItem[]);

  // Extraer dinámicamente todas las categorías que se vayan creando en las entradas
  const availableCategories = useMemo(() => {
    const catsSet = new Set<string>();
    activitiesList.forEach((act) => {
      if (act.categories && Array.isArray(act.categories) && act.categories.length > 0) {
        act.categories.forEach((c) => {
          if (c && c.trim()) catsSet.add(c.trim());
        });
      } else if (act.category && act.category.trim()) {
        catsSet.add(act.category.trim());
      }
    });
    return Array.from(catsSet);
  }, [activitiesList]);

  // Filtrado reactivo e instantáneo según categoría y búsqueda
  const filteredActivities = useMemo(() => {
    return activitiesList.filter((act) => {
      const actCats = act.categories && act.categories.length > 0 ? act.categories : [act.category];
      
      // Filtro de categoría
      const matchesCategory =
        selectedCategory === 'all' ||
        actCats.some((c) => c.toLowerCase() === selectedCategory.toLowerCase());

      // Filtro de búsqueda
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        act.title.toLowerCase().includes(query) ||
        act.description.toLowerCase().includes(query) ||
        actCats.some((c) => c.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [activitiesList, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10 pb-16 font-sans text-left animate-fade-in" id="activities-section-container">
      {/* Introduction banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xs space-y-4">
        <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">Novedades</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight leading-none">
          Memoria Institucional y Actividades Recientes
        </h1>
        <div className="w-16 h-1 bg-brand-green rounded-full" />
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Sigue el pulso diario de nuestra fundación. Conoce los detalles de los foros, asambleas, conversatorios y actividades comunitarias gestionadas directamente desde nuestro panel de WordPress.
        </p>
      </div>

      {/* Interactive Category Filter Pills and Search (Idéntico a Servicios) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="activities-filter-bar">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2" id="activities-category-filters">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            Todas las Actividades
          </button>

          {availableCategories.map((cat) => {
            const count = activitiesList.filter((a) => {
              const cats = a.categories && a.categories.length > 0 ? a.categories : [a.category];
              return cats.some((c) => c.toLowerCase() === cat.toLowerCase());
            }).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat} {count > 1 ? `(${count})` : ''}
              </button>
            );
          })}
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar actividad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of articles */}
      <div className="space-y-6">
        {filteredActivities.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
            <p className="text-slate-500 text-sm">
              No se encontraron actividades en esta categoría o criterio de búsqueda.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
            >
              Ver todas las actividades
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="activities-list-grid">
            {filteredActivities.map((act) => (
              <div
                id={`activity-full-${act.id}`}
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden text-left flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  <div className="h-52 bg-slate-100 border-b border-slate-100 overflow-hidden relative flex items-center justify-center">
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 text-slate-800 border border-slate-200/80 shadow-xs px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider z-20">
                      {act.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-display font-bold text-sm text-slate-900 leading-snug group-hover:text-sky-800 transition-colors">
                      {act.title}
                    </h3>
                    <div
                      className="text-xs text-slate-500 leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: act.description }}
                    />
                    {act.date && (
                      <p className="text-[10px] text-slate-400 font-mono pt-1">
                        {act.date}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedActivity(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              id="activity-backdrop"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl z-10 border border-slate-100 flex flex-col max-h-[85vh]"
              id="activity-modal-content"
            >
              {/* Cover Image */}
              <AdaptiveImage
                src={selectedActivity.image}
                alt={selectedActivity.title}
                containerClassName="h-64 sm:h-72 relative bg-white border-b border-slate-100 shrink-0 flex items-center justify-center overflow-hidden"
              >
                <button
                  id="close-activity-btn"
                  onClick={() => setSelectedActivity(null)}
                  className="absolute right-4 top-4 p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 rounded-full transition-all z-20 cursor-pointer shadow-md border border-slate-200/80"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 z-20">
                  <span className="text-[10px] bg-sky-600 text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    {selectedActivity.category}
                  </span>
                </div>
              </AdaptiveImage>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6 md:p-8 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-display font-black text-lg md:text-xl text-slate-900 leading-snug">
                    {selectedActivity.title}
                  </h3>
                  {selectedActivity.date && (
                    <p className="text-xs text-slate-400">
                      Publicado: {selectedActivity.date}
                    </p>
                  )}
                </div>

                <div
                  className="text-xs text-slate-700 leading-relaxed font-sans space-y-4 pt-4 border-t border-slate-100"
                  dangerouslySetInnerHTML={{ __html: selectedActivity.content || selectedActivity.description }}
                />
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                {selectedActivity.slug ? (
                  <a
                    href={url(`/blog/${selectedActivity.slug}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
                  >
                    Ver artículo completo en el Blog
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                ) : <div />}
                <button
                  id="activity-modal-close-btn"
                  onClick={() => setSelectedActivity(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Cerrar Artículo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
