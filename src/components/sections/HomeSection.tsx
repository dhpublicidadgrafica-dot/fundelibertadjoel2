/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Scale, Users, ShieldAlert, ArrowRight, MessageSquare, Award, PlayCircle, Quote, Sparkles, ChevronRight } from 'lucide-react';
import { IMPACT_STATS, SERVICES_LIST, TESTIMONIALS, LATEST_ACTIVITIES } from '../../data';
import Logo from '../Logo';

import pasantiasImageSrc from '../../assets/images/pasantias_students_1782495066851.jpg';
import denunciasImageSrc from '../../assets/images/denuncias_documento_handover_1782495219494.jpg';
import asesoriasImageSrc from '../../assets/images/asesorias_legales_consultation_1782495362476.jpg';
import AdaptiveImage from '../AdaptiveImage';
import type { WPActivityItem } from './ActivitiesSection';
import { url } from '../../lib/base';

const getWordExcerpt = (textOrHtml: string, maxWords: number = 50): string => {
  if (!textOrHtml) return '';
  const plain = textOrHtml
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

  const words = plain.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return plain;
  return words.slice(0, maxWords).join(' ') + '...';
};

interface HomeSectionProps {
  onNavigate?: (page: string, subSection?: string) => void;
  onDonateClick?: () => void;
  initialProjects?: WPActivityItem[];
}

export default function HomeSection({ onNavigate, onDonateClick, initialProjects = [] }: HomeSectionProps = {}) {
  const [projects, setProjects] = useState<WPActivityItem[]>(initialProjects);

  // Sincronización en vivo desde WordPress para los 8 últimos proyectos
  useEffect(() => {
    let isMounted = true;

    const fetchLiveWordPressProjects = async () => {
      try {
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
        }).slice(0, 3); // REGLA: Siempre los 3 últimos proyectos colocados, sin rellenar con mocks

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
            categories: catNames,
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
      } catch (err) {
        console.error('Error sincronizando proyectos en Home:', err);
      }
    };

    fetchLiveWordPressProjects();
    window.addEventListener('focus', fetchLiveWordPressProjects);
    return () => {
      isMounted = false;
      window.removeEventListener('focus', fetchLiveWordPressProjects);
    };
  }, []);

  const handleDonate = () => {
    if (onDonateClick) {
      onDonateClick();
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-donation-modal'));
    }
  };

  const navigateTo = (page: string, subSection?: string) => {
    if (onNavigate) {
      onNavigate(page, subSection);
      return;
    }
    if (typeof window === 'undefined') return;
    if (page === 'home') window.location.href = url('/');
    else if (page === 'about') window.location.href = url('/nosotros');
    else if (page === 'services') window.location.href = url('/servicios');
    else if (page === 'projects') window.location.href = url('/proyectos');
    else if (page === 'activities') window.location.href = url('/actividades');
    else if (page === 'contact') window.location.href = url('/contacto');
    else if (page === 'blog') window.location.href = url('/blog');
    else if (page === 'programs') {
      if (subSection === 'reports') window.location.href = url('/programas/informes-denuncias-ddhh');
      else if (subSection === 'legal') window.location.href = url('/programas/asesoria-juridica-comunitaria');
      else window.location.href = url('/programas/practicas-pasantias');
    } else {
      window.location.href = url(`/${page}`);
    }
  };

  // Get icons dynamically based on string names
  const getIcon = (name: string) => {
    switch (name) {
      case 'Calendar': return <Award className="w-8 h-8 text-sky-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-8 h-8 text-emerald-600" />;
      case 'Users': return <Users className="w-8 h-8 text-indigo-600" />;
      case 'UserCheck': return <Scale className="w-8 h-8 text-brand-red" />;
      default: return <Sparkles className="w-8 h-8 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-24 pb-16" id="home-section-container">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-[#3B82C1] text-white min-h-[550px] flex items-center shadow-xl border border-[#3B82C1]/20" id="hero-banner">
        {/* Background Image with elegant overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/d/1mzMGHUgDdHcX8hpf8DTMLIs2Dv53CCsd"
            alt="FUNDELIBERTAD Paz y Derechos Humanos en Colombia"
            className="w-full h-full object-cover object-center opacity-65 scale-102"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14324f]/90 via-[#3B82C1]/60 to-[#14324f]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14324f]/70 via-transparent to-[#14324f]/20" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 py-16 md:py-24 text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/35 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>15+ Años de Impacto en Medellín</span>
            </motion.div>
          </div>

          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-serif font-black text-3xl sm:text-6xl md:text-7xl tracking-tight leading-tight sm:leading-none text-white drop-shadow-sm"
            >
              FUNDELIBERTAD
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="font-display font-bold text-sm sm:text-xl md:text-2xl text-emerald-300 tracking-wide leading-snug"
            >
              Fundación de Derechos Humanos por la Libertad y la Vida
            </motion.p>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed"
          >
            Trabajamos por el bienestar y mejor calidad de vida de nuestra sociedad. Defendemos la dignidad, promovemos la reconciliación y brindamos herramientas de empoderamiento a las comunidades vulnerables de la Comuna 15 Guayabal.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center gap-3.5 pt-4"
            id="hero-actions"
          >
            <button
              id="hero-donate-btn"
              onClick={handleDonate}
              className="px-6 py-3.5 bg-brand-red hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg shadow-red-950/50 hover:shadow-red-500/30 transition-all flex items-center gap-2 cursor-pointer text-sm"
            >
              <Heart className="w-4 h-4 fill-white" />
              Donar Ahora
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="space-y-8" id="stats-section">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">Nuestras Cifras</span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-brand-dark tracking-tight">
            Impacto Real de Corazón Comunitario
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {IMPACT_STATS.map((stat, index) => (
            <motion.div
              id={`stat-card-${stat.id}`}
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4 hover:shadow-md transition-shadow group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                {getIcon(stat.iconName)}
              </div>
              <div className="space-y-1">
                <p className="font-display font-black text-3xl text-brand-dark">{stat.value}</p>
                <p className="font-bold text-xs text-slate-800 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PROGRAMS PREVIEW */}
      <section className="space-y-8" id="featured-programs">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">Nuestros Programas</span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-brand-dark tracking-tight">
            Programas Humanitarios de Impacto
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Program 1: Pasantías y Prácticas */}
          <div
            id="program-card-internships"
            onClick={() => navigateTo('programs', 'internships')}
            className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden text-left flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div>
              <div className="w-full h-48 sm:h-56 relative overflow-hidden bg-slate-100 border-b border-slate-100">
                <img
                  src={typeof pasantiasImageSrc === 'string' ? pasantiasImageSrc : (pasantiasImageSrc as any)?.src || pasantiasImageSrc}
                  alt="Pasantías y Prácticas"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-brand-green text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider z-20 shadow-xs">
                  Educación y Liderazgo
                </span>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-950 leading-tight group-hover:text-sky-700 transition-colors">
                  Pasantías y Prácticas
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Convenio de formación y prácticas profesionales para estudiantes de bachillerato y universitarios con un impacto transformador.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <span className="text-xs text-brand-green font-semibold inline-flex items-center gap-1 group">
                Saber más
                <ChevronRightIcon />
              </span>
            </div>
          </div>

          {/* Program 2: Denuncias Ciudadanas */}
          <div
            id="program-card-reports"
            onClick={() => navigateTo('programs', 'reports')}
            className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden text-left flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div>
              <div className="w-full h-48 sm:h-56 relative overflow-hidden bg-slate-100 border-b border-slate-100">
                <img
                  src={typeof denunciasImageSrc === 'string' ? denunciasImageSrc : (denunciasImageSrc as any)?.src || denunciasImageSrc}
                  alt="Denuncias Ciudadanas"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-amber-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider z-20 shadow-xs">
                  Derechos Humanos
                </span>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-950 leading-tight group-hover:text-amber-700 transition-colors">
                  Denuncias Ciudadanas
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Canal de radicación confidencial y seguro para alertar sobre presuntas vulneraciones a los derechos fundamentales y recibir acompañamiento ético y jurídico.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <span className="text-xs text-amber-600 font-semibold inline-flex items-center gap-1 group">
                Reportar incidente
                <ChevronRightIcon />
              </span>
            </div>
          </div>

          {/* Program 3: Asesorías Legales */}
          <div
            id="program-card-legal"
            onClick={() => navigateTo('programs', 'legal')}
            className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden text-left flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div>
              <div className="w-full h-48 sm:h-56 relative overflow-hidden bg-slate-100 border-b border-slate-100">
                <img
                  src={typeof asesoriasImageSrc === 'string' ? asesoriasImageSrc : (asesoriasImageSrc as any)?.src || asesoriasImageSrc}
                  alt="Asesorías Legales"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-brand-primary text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider z-20 shadow-xs">
                  Justicia y Paz
                </span>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-display font-bold text-lg text-slate-950 leading-tight group-hover:text-blue-700 transition-colors">
                  Asesorías Legales
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Consultoría jurídica gratuita en derecho civil, laboral, penal, de familia, pensiones y constitucional para personas de escasos recursos en Medellín.
                </p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <span className="text-xs text-brand-primary font-semibold inline-flex items-center gap-1 group">
                Radicar consulta
                <ChevronRightIcon />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      <section className="space-y-8" id="testimonials">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">Voces de Esperanza</span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-brand-dark tracking-tight">
            Testimonios de Nuestra Comunidad
          </h2>
          <div className="w-16 h-1 bg-brand-green mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t) => (
            <div
              id={`testimonial-${t.id}`}
              key={t.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between text-left relative"
            >
              <div className="absolute top-4 right-4 text-sky-100">
                <Quote className="w-10 h-10 rotate-180" />
              </div>
              
              <div className="space-y-3 relative z-10">
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-50 mt-4 shrink-0">
                <img
                  src={t.avatar}
                  alt={t.name || "Testimonio"}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                {(t.name || t.role) && (
                  <div>
                    {t.name && <h4 className="font-bold text-xs text-slate-900">{t.name}</h4>}
                    {t.role && <p className="text-[10px] text-slate-400 font-medium">{t.role}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. NUESTROS PROYECTOS */}
      <section className="space-y-8" id="nuestros-proyectos">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div className="space-y-1.5 text-left">
            <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">Iniciativas</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark tracking-tight">
              Nuestros Proyectos de Impacto
            </h2>
          </div>
          <a
            id="view-all-projects-btn"
            href={url('/proyectos')}
            className="text-xs font-bold text-brand-primary hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            Ver todos los proyectos
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
            <p className="text-sm text-slate-500 font-medium">No hay proyectos publicados actualmente en WordPress.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                id={`project-card-${proj.id}`}
                key={proj.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden text-left flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => {
                  window.location.href = proj.slug ? url(`/blog/${proj.slug}`) : url('/proyectos');
                }}
              >
                <div>
                  <div className="w-full h-48 relative overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-sky-50 text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                      {proj.category || 'Proyecto'}
                    </span>
                    <h3 
                      className="font-display font-bold text-sm sm:text-base text-slate-900 leading-snug group-hover:text-sky-700 transition-colors line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: proj.title }}
                    />
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {getWordExcerpt(proj.content || proj.description, 50)}
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <a
                    href={proj.slug ? url(`/blog/${proj.slug}`) : url('/proyectos')}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all duration-200 group/btn w-fit cursor-pointer"
                  >
                    <span>Leer más</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. DONATION HERO BANNER SECTION */}
      <section className="bg-gradient-to-br from-brand-red to-red-800 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl" id="donation-banner-block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent)]" />
        <div className="absolute right-10 top-10 opacity-5">
          <Heart className="w-56 h-56 fill-white text-white" />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <Heart className="w-12 h-12 fill-white text-white mx-auto animate-pulse" />
          <h2 className="font-display font-black text-2xl sm:text-4xl tracking-tight leading-none">
            Únete a la Causa de Paz y Justicia
          </h2>
          <p className="text-sm sm:text-base text-red-100 max-w-md mx-auto leading-relaxed">
            Tu generosidad permite sostener el consultorio jurídico, financiar programas de liderazgo infantil y alertar violaciones de Derechos Humanos en Medellín.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              id="banner-donate-now-btn"
              onClick={handleDonate}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-brand-red font-extrabold rounded-xl text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Donar Ahora (Código QR / Transferencia)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Micro helper component for chevron right icon
function ChevronRightIcon() {
  return <ChevronRight className="w-4.5 h-4.5" />;
}
