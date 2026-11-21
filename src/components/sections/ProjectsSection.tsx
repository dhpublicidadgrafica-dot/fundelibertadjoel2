/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Eye, X, ArrowRight, Search } from 'lucide-react';
import { PROJECTS_LIST } from '../../data';
import AdaptiveImage from '../AdaptiveImage';
import type { WPActivityItem } from './ActivitiesSection';

interface ProjectsSectionProps {
  wpProjects?: WPActivityItem[];
}

const PROJECT_KEYWORDS = ['kung fu', 'proyecto', 'fútbol', 'futbol', 'humanización', 'humanizacion', 'inglés', 'ingles', 'escuela de paz'];

export default function ProjectsSection({ wpProjects = [] }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<WPActivityItem[]>(wpProjects);
  const [selectedProject, setSelectedProject] = useState<WPActivityItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Proyectos institucionales por defecto
  const defaultProjects: WPActivityItem[] = useMemo(() => {
    return PROJECTS_LIST.map((p, idx) => ({
      id: p.id || `proj-${idx}`,
      title: p.title,
      category: 'Proyectos',
      categories: ['Proyectos'],
      description: p.description,
      content: p.longDescription || p.description,
      image: typeof p.image === 'string' ? p.image : (p.image as any)?.src || 'https://lh3.googleusercontent.com/d/11y3-Zw7P020zrMq6cakM0RrvsjrFlzW5',
      date: p.impactMetrics || 'Proyecto Activo',
    }));
  }, []);

  // Sincronización en tiempo real desde WordPress para Proyectos
  useEffect(() => {
    let isMounted = true;

    const fetchLiveWordPressProjects = async () => {
      try {
        setIsSyncing(true);
        const res = await fetch('https://www.csm.fundelibertad.org/wp-json/wp/v2/posts?_embed=1&per_page=50');
        if (!res.ok) return;
        const rawPosts = await res.json();
        if (!Array.isArray(rawPosts) || !isMounted) return;

        // REGLA: Entrada que no tenga categorías válidas NO se muestra en ningún lado
        // Filtrar entradas que tengan categoría válida de 'proyectos'
        const projectPosts = rawPosts.filter((post: any) => {
          if (post.slug === 'hello-world' || post.id === 1) return false;
          const terms: any[] = post._embedded?.['wp:term']?.[0] || [];
          const validTerms = terms.filter((t: any) => {
            const name = (t.name || '').toLowerCase();
            const slug = (t.slug || '').toLowerCase();
            return name !== 'uncategorized' && name !== 'sin categoría' && slug !== 'uncategorized';
          });
          if (validTerms.length === 0) return false;
          return validTerms.some((t: any) => 
            t.slug.toLowerCase().includes('proyecto') || 
            t.name.toLowerCase().includes('proyecto')
          );
        });

        const mapped: WPActivityItem[] = projectPosts.map((post: any) => {
          const terms: any[] = post._embedded?.['wp:term']?.[0] || [];
          const catNames = terms.map(t => t.name).filter(c => c.toLowerCase() !== 'uncategorized' && c.toLowerCase() !== 'sin categoría');
          const specificCat = catNames.find(c => c.toLowerCase() !== 'proyectos') || catNames[0] || 'Proyectos';
          const media = post._embedded?.['wp:featuredmedia']?.[0];
          const featuredImg = media?.source_url || media?.media_details?.sizes?.large?.source_url || 'https://lh3.googleusercontent.com/d/11y3-Zw7P020zrMq6cakM0RrvsjrFlzW5';
          const dateStr = new Date(post.date).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          return {
            id: `wp-${post.id}`,
            title: post.title.rendered,
            category: specificCat,
            categories: catNames.length > 0 ? catNames : ['Proyectos'],
            description: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').trim(),
            content: post.content.rendered,
            image: featuredImg,
            slug: post.slug,
            date: dateStr,
          };
        });

        if (isMounted && mapped.length > 0) {
          setProjects(mapped);
        }
      } catch (e) {
        // En caso de fallo de conexión
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };

    fetchLiveWordPressProjects();

    const handleFocus = () => {
      fetchLiveWordPressProjects();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Lista activa: fusiona proyectos de WordPress y los predeterminados que aún no hayan sido creados en WP
  const projectsList = useMemo(() => {
    if (projects.length === 0) return defaultProjects;
    
    // Filtrar los institucionales que ya existen en WordPress por título similar
    const remainingDefaults = defaultProjects.filter(dp => 
      !projects.some(wp => wp.title.toLowerCase().includes(dp.title.toLowerCase()) || dp.title.toLowerCase().includes(wp.title.toLowerCase()))
    );

    return [...projects, ...remainingDefaults];
  }, [projects, defaultProjects]);

  // Extraer dinámicamente todas las categorías presentes
  const availableCategories = useMemo(() => {
    const catsSet = new Set<string>();
    projectsList.forEach((proj) => {
      if (proj.categories && Array.isArray(proj.categories) && proj.categories.length > 0) {
        proj.categories.forEach((c) => {
          if (c && c.trim()) catsSet.add(c.trim());
        });
      } else if (proj.category && proj.category.trim()) {
        catsSet.add(proj.category.trim());
      }
    });
    return Array.from(catsSet);
  }, [projectsList]);

  // Filtrado reactivo e instantáneo según categoría y búsqueda
  const filteredProjects = useMemo(() => {
    return projectsList.filter((proj) => {
      const projCats = proj.categories && proj.categories.length > 0 ? proj.categories : [proj.category];

      // Filtro de categoría
      const matchesCategory =
        selectedCategory === 'all' ||
        projCats.some((c) => c.toLowerCase() === selectedCategory.toLowerCase());

      // Filtro de búsqueda
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        proj.title.toLowerCase().includes(query) ||
        proj.description.toLowerCase().includes(query) ||
        projCats.some((c) => c.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [projectsList, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10 pb-16 font-sans text-left animate-fade-in" id="projects-section-container">
      {/* Introduction banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xs space-y-4">
        <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">Nuestra Labor</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight leading-none">
          Proyectos e Iniciativas Comunitarias de Paz
        </h1>
        <div className="w-16 h-1 bg-brand-green rounded-full" />
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          En FUNDELIBERTAD materializamos la defensa de derechos mediante programas directos en el territorio. Conoce nuestras grandes iniciativas orientadas a desmantelar la violencia urbana, promover la educación solidaria, fortalecer la economía comunitaria y proteger la vida de niños y jóvenes vulnerables en la Comuna 15 de Medellín.
        </p>
      </div>

      {/* Interactive Category Filter Pills and Search (Idéntico a Actividades y Servicios) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" id="projects-filter-bar">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2" id="projects-category-filters">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            Todos los Proyectos
          </button>

          {availableCategories.map((cat) => {
            const count = projectsList.filter((p) => {
              const cats = p.categories && p.categories.length > 0 ? p.categories : [p.category];
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
            placeholder="Buscar proyecto..."
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

      {/* Grid of project cards */}
      <div className="space-y-6">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
            <p className="text-slate-500 text-sm">
              No se encontraron proyectos en esta categoría o criterio de búsqueda.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
            >
              Ver todos los proyectos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="projects-list-grid">
            {filteredProjects.map((proj) => (
              <div
                id={`project-card-${proj.id}`}
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden text-left flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-300 group"
              >
                <div>
                  <AdaptiveImage
                    src={proj.image}
                    alt={proj.title}
                    containerClassName="h-52 bg-white border-b border-slate-100 overflow-hidden relative flex items-center justify-center"
                  >
                    <span className="absolute top-3 left-3 bg-white/95 text-slate-800 border border-slate-200/80 shadow-xs px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider z-20">
                      {proj.category}
                    </span>
                  </AdaptiveImage>
                  <div className="p-5 space-y-2">
                    <h3 className="font-display font-bold text-sm text-slate-900 leading-snug group-hover:text-sky-800 transition-colors">
                      {proj.title}
                    </h3>
                    <div
                      className="text-xs text-slate-500 leading-relaxed line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: proj.description }}
                    />
                    {proj.date && (
                      <p className="text-[10px] text-slate-400 font-mono pt-1">
                        {proj.date}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              id="project-backdrop"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl z-10 border border-slate-100 flex flex-col max-h-[85vh]"
              id="project-modal-content"
            >
              {/* Cover Image */}
              <AdaptiveImage
                src={selectedProject.image}
                alt={selectedProject.title}
                containerClassName="h-64 sm:h-72 relative bg-white border-b border-slate-100 shrink-0 flex items-center justify-center overflow-hidden"
              >
                <button
                  id="close-project-btn"
                  onClick={() => setSelectedProject(null)}
                  className="absolute right-4 top-4 p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 rounded-full transition-all z-20 cursor-pointer shadow-md border border-slate-200/80"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 z-20">
                  <span className="text-[10px] bg-sky-600 text-white font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    {selectedProject.category}
                  </span>
                </div>
              </AdaptiveImage>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6 md:p-8 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-display font-black text-lg md:text-xl text-slate-900 leading-snug">
                    {selectedProject.title}
                  </h3>
                  {selectedProject.date && (
                    <p className="text-xs text-slate-400">
                      {selectedProject.date}
                    </p>
                  )}
                </div>

                <div
                  className="text-xs text-slate-700 leading-relaxed font-sans space-y-4 pt-4 border-t border-slate-100"
                  dangerouslySetInnerHTML={{ __html: selectedProject.content || selectedProject.description }}
                />
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                {selectedProject.slug ? (
                  <a
                    href={`/blog/${selectedProject.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
                  >
                    Ver artículo completo en el Blog
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                ) : <div />}
                <button
                  id="project-modal-close-btn"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Cerrar Proyecto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
