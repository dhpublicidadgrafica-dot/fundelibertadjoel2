/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, Megaphone, HeartHandshake, Briefcase, FileText, Fingerprint, 
  Baby, BookOpen, TrendingUp, Calculator, ShieldCheck, GraduationCap, 
  Award, Users, FileSignature, AlertCircle, Gavel, FolderKanban, History, 
  HelpCircle
} from 'lucide-react';
import { SERVICES_LIST } from '../../data';
import type { Service } from '../../types';

interface ServicesSectionProps {
  onPageChange?: (page: string, subSection?: string) => void;
}

export default function ServicesSection({ onPageChange }: ServicesSectionProps = {}) {
  // Inicializado siempre en 'all' para mostrar todos los servicios al cargar por primera vez
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Mapeo de nombre de icono a elemento Lucide React
  const getServiceIcon = (name: string) => {
    const props = { className: "w-6 h-6 shrink-0" };
    switch (name) {
      case 'Megaphone': return <Megaphone {...props} className={`${props.className} text-brand-primary`} />;
      case 'HeartHandshake': return <HeartHandshake {...props} className={`${props.className} text-indigo-600`} />;
      case 'Scale': return <Scale {...props} className={`${props.className} text-emerald-600`} />;
      case 'Briefcase': return <Briefcase {...props} className={`${props.className} text-blue-600`} />;
      case 'FileText': return <FileText {...props} className={`${props.className} text-slate-600`} />;
      case 'Fingerprint': return <Fingerprint {...props} className={`${props.className} text-red-600`} />;
      case 'Baby': return <Baby {...props} className={`${props.className} text-purple-600`} />;
      case 'BookOpen': return <BookOpen {...props} className={`${props.className} text-brand-primary`} />;
      case 'TrendingUp': return <TrendingUp {...props} className={`${props.className} text-amber-600`} />;
      case 'Calculator': return <Calculator {...props} className={`${props.className} text-teal-600`} />;
      case 'ShieldCheck': return <ShieldCheck {...props} className={`${props.className} text-emerald-700`} />;
      case 'GraduationCap': return <GraduationCap {...props} className={`${props.className} text-sky-600`} />;
      case 'Award': return <Award {...props} className={`${props.className} text-orange-600`} />;
      case 'Users': return <Users {...props} className={`${props.className} text-indigo-600`} />;
      case 'FileSignature': return <FileSignature {...props} className={`${props.className} text-purple-700`} />;
      case 'AlertCircle': return <AlertCircle {...props} className={`${props.className} text-amber-600`} />;
      case 'Gavel': return <Gavel {...props} className={`${props.className} text-brand-dark`} />;
      case 'FolderKanban': return <FolderKanban {...props} className={`${props.className} text-slate-700`} />;
      case 'History': return <History {...props} className={`${props.className} text-brand-red`} />;
      default: return <HelpCircle {...props} className={`${props.className} text-slate-500`} />;
    }
  };

  const categories = [
    { label: 'Todos los Servicios', id: 'all' },
    { label: 'Defensa de DDHH', id: 'human-rights' },
    { label: 'Asesoría de Ley', id: 'legal' },
    { label: 'Apoyo Social', id: 'social' },
    { label: 'Académico', id: 'academic' }
  ];

  // Filtrado de servicios: al cargar por primera vez (filterCategory === 'all' y searchTerm === '') muestra los 19 servicios
  const filteredServices = SERVICES_LIST.filter((srv) => {
    const matchesCategory = filterCategory === 'all' || srv.category === filterCategory;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term ||
      srv.title.toLowerCase().includes(term) ||
      srv.description.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16 font-sans text-left" id="services-section-container">
      {/* Introduction banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xs space-y-4">
        <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">Nuestras Capacidades</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight leading-none">
          Asesoría Integral y Defensa Legal Comunitaria
        </h1>
        <div className="w-16 h-1 bg-brand-green rounded-full" />
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Ofrecemos un catálogo profesional de 19 especialidades de orientación gratuita. Nuestro equipo de abogados comunitarios, pasantes certificados y consultores senior te acompañan para hacer valer tus derechos fundamentales, laborales y de familia ante el Estado y entidades privadas.
        </p>
      </div>

      {/* Filter Category & Search Bar (Exacto al diseño de las capturas) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4" id="services-filter-bar">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2" id="services-tabs">
          {categories.map((cat) => (
            <button
              id={`cat-${cat.id}-btn`}
              key={cat.id}
              onClick={() => {
                setFilterCategory(cat.id);
              }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative w-full lg:max-w-xs">
          <input
            id="services-search-input"
            type="text"
            placeholder="Buscar asesoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="space-y-6">
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-xs space-y-3">
            <p className="text-slate-500 text-sm">
              No se encontraron asesorías con ese criterio de búsqueda.
            </p>
            <button
              onClick={() => { setFilterCategory('all'); setSearchTerm(''); }}
              className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
            >
              Ver todos los servicios
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="services-cards-grid">
            <AnimatePresence initial={false} mode="popLayout">
              {filteredServices.map((srv) => (
                <motion.div
                  id={`srv-card-${srv.id}`}
                  data-category={srv.category}
                  layout
                  key={srv.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="service-card bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    {/* Top line Icon + Label */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                        {getServiceIcon(srv.iconName)}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-100">
                        {srv.category === 'human-rights' ? 'DDHH' : srv.category === 'academic' ? 'ACADÉMICO' : srv.category === 'legal' ? 'DERECHO' : 'SOCIAL'}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-sky-700">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Trust banner */}
      <div className="bg-sky-50/50 rounded-2xl p-6 border border-sky-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div>
          <h4 className="font-display font-bold text-sm text-slate-950">Atención Directa</h4>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">Sin intermediarios ni costos asociados. Tu información está resguardada confidencialmente.</p>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-sky-100 md:pl-6">
          <h4 className="font-display font-bold text-sm text-slate-950">Respaldado Constitucionalmente</h4>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">Todas las solicitudes y tutelas redactadas son radicadas formalmente en los juzgados de Medellín.</p>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-sky-100 md:pl-6">
          <h4 className="font-display font-bold text-sm text-slate-950">Pasantías Avaladas</h4>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">Los practicantes de derecho y psicología operan con supervisión directa de consultores senior habilitados.</p>
        </div>
      </div>
    </div>
  );
}
