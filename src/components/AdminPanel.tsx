import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Search, GraduationCap, Heart, Scale, 
  CheckCircle, Clock, AlertTriangle, Download, 
  Printer, TrendingUp, RefreshCw, BarChart3, ShieldCheck
} from 'lucide-react';
import { Donation, InternshipApplication, HumanRightsReport, LegalConsultation, ContactMessage, DonationStats } from '../types';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'donations' | 'consultations' | 'reports' | 'internships' | 'contacts'>('donations');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter states for Donations
  const [freqFilter, setFreqFilter] = useState<'all' | 'one-time' | 'recurring'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'denied' | 'refunded'>('all');

  // Backend Stats
  const [stats, setStats] = useState<DonationStats>({
    totalRaised: 125000000,
    goal: 0,
    totalDonationsCount: 315,
    averageDonation: 396825,
    recentDonors: [],
    monthlyData: [
      { month: 'Ene', amount: 3200000, count: 24 },
      { month: 'Feb', amount: 4100000, count: 30 },
      { month: 'Mar', amount: 3800000, count: 28 },
      { month: 'Abr', amount: 5400000, count: 42 },
      { month: 'May', amount: 6200000, count: 50 },
      { month: 'Jun', amount: 7800000, count: 65 },
      { month: 'Jul', amount: 12350000, count: 76 },
    ],
    annualData: [
      { year: '2024', amount: 38500000, count: 290 },
      { year: '2025', amount: 64200000, count: 480 },
      { year: '2026', amount: 73350000, count: 391 },
    ]
  });

  // Data lists
  const [donations, setDonations] = useState<Donation[]>([]);
  const [internships, setInternships] = useState<InternshipApplication[]>([]);
  const [reports, setReports] = useState<HumanRightsReport[]>([]);
  const [consultations, setConsultations] = useState<LegalConsultation[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);

  // Load backend and local data
  const loadData = async () => {
    // 1. Fetch statistics from API
    try {
      const statsRes = await fetch('/api/statistics');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (e) {
      // fallback
    }

    // 2. Fetch donations from API
    try {
      const donRes = await fetch('/api/donations');
      if (donRes.ok) {
        const donData = await donRes.json();
        setDonations(donData);
      } else {
        const local = localStorage.getItem('fundelibertad_donations');
        setDonations(local ? JSON.parse(local) : []);
      }
    } catch (e) {
      const local = localStorage.getItem('fundelibertad_donations');
      setDonations(local ? JSON.parse(local) : []);
    }

    // Load local storage items
    const localInternships = localStorage.getItem('fundelibertad_internships');
    const localReports = localStorage.getItem('fundelibertad_reports');
    const localConsultations = localStorage.getItem('fundelibertad_consultations');
    const localContacts = localStorage.getItem('fundelibertad_contacts');

    setInternships(localInternships ? JSON.parse(localInternships) : []);
    setReports(localReports ? JSON.parse(localReports) : []);
    setConsultations(localConsultations ? JSON.parse(localConsultations) : []);
    setContacts(localContacts ? JSON.parse(localContacts) : []);
  };

  useEffect(() => {
    loadData();

    const handleStorageUpdate = () => {
      loadData();
    };

    window.addEventListener('storage_update', handleStorageUpdate);
    return () => window.removeEventListener('storage_update', handleStorageUpdate);
  }, [refreshTrigger]);

  // Export CSV / Excel
  const exportToExcel = () => {
    if (donations.length === 0) {
      alert('No hay registros de donaciones para exportar.');
      return;
    }

    const headers = ['ID', 'Nombre', 'Correo', 'Monto COP', 'Frecuencia', 'Método', 'Estado', 'Fecha', 'País', 'Ciudad'];
    const rows = donations.map(d => [
      d.id,
      `"${d.name.replace(/"/g, '""')}"`,
      d.email,
      d.amount,
      d.type,
      d.paymentMethod,
      d.status,
      d.date,
      d.country || '',
      d.city || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Donaciones_Fundelibertad_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
      case 'resolved':
      case 'processed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Completado
          </span>
        );
      case 'pending':
      case 'investigating':
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3 text-amber-600" />
            Pendiente
          </span>
        );
      case 'denied':
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-800 border border-red-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            {status === 'refunded' ? 'Reembolsado' : 'Rechazado'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  // Filtered Donations
  const filteredDonations = donations.filter(d => {
    const matchesSearch = 
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.country && d.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.city && d.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFreq = freqFilter === 'all' || d.type === freqFilter;
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;

    return matchesSearch && matchesFreq && matchesStatus;
  });

  return (
    <div className="space-y-8 font-sans" id="admin-dashboard-root">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 p-6 sm:p-8 rounded-3xl text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold tracking-wider uppercase border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Panel de Administración y Control Financiero
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl tracking-tight">
              Módulo de Donaciones y Transparencia
            </h1>
            <p className="text-xs sm:text-sm text-sky-200/90 max-w-xl leading-relaxed">
              Gestión centralizada de aportes en pesos colombianos (COP), informes de recaudación, exportación de reportes y radicación de solicitudes.
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Fundación Fundelibertad • Nit: 900.497.212-2
            </p>
          </div>

          {/* Global Actions */}
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              id="admin-refresh-data-btn"
              onClick={() => {
                setRefreshTrigger(p => p + 1);
                loadData();
              }}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-white/10"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sincronizar
            </button>
            <button
              id="admin-export-excel-btn"
              onClick={exportToExcel}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-900/30"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar Excel (CSV)
            </button>
            <button
              id="admin-print-pdf-btn"
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-sky-900/30"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir Reporte
            </button>
          </div>
        </div>
      </div>

      {/* RECAUDACIÓN TOTAL CARDS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block mb-1">
              RECAUDACIÓN INSTITUCIONAL
            </span>
            <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">
              Aportes de Solidaridad por la Paz y los DDHH
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 font-medium block">Total Recaudado a la Fecha:</span>
            <span className="font-display font-black text-3xl sm:text-4xl text-emerald-600 tracking-tight">
              ${stats.totalRaised.toLocaleString('es-CO')} COP
            </span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Aportes</span>
            <p className="font-display font-extrabold text-2xl text-slate-900">{stats.totalDonationsCount}</p>
            <span className="text-[10px] text-emerald-600 font-medium">Transacciones recibidas</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Promedio / Donante</span>
            <p className="font-display font-extrabold text-2xl text-slate-900">${stats.averageDonation.toLocaleString('es-CO')} COP</p>
            <span className="text-[10px] text-sky-600 font-medium">Ticket promedio</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Último Mes</span>
            <p className="font-display font-extrabold text-2xl text-slate-900">${(stats.monthlyData[stats.monthlyData.length - 1]?.amount || 0).toLocaleString('es-CO')} COP</p>
            <span className="text-[10px] text-emerald-600 font-medium">Julio 2026</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pasarela de Pagos</span>
            <p className="font-display font-extrabold text-xl text-slate-900">Tarjetas de Crédito / Débito</p>
            <span className="text-[10px] text-slate-500 font-medium">Transacciones en COP con SSL</span>
          </div>
        </div>
      </div>

      {/* GRÁFICOS DE RECAUDACIÓN MENSUAL Y ANUAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-600" /> Recaudación Mensual (COP)
            </h3>
            <span className="text-xs text-slate-400 font-medium">Año 2026</span>
          </div>

          {/* Visual CSS Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
            {stats.monthlyData.map((item, idx) => {
              const maxVal = Math.max(...stats.monthlyData.map(m => m.amount), 10000000);
              const heightPct = Math.max(10, Math.round((item.amount / maxVal) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[9px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${item.amount.toLocaleString('es-CO')}
                  </div>
                  <div className="w-full max-w-[36px] bg-sky-100 group-hover:bg-sky-500 transition-all rounded-t-lg relative overflow-hidden" style={{ height: `${heightPct}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-600 to-sky-400" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Annual Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Histórico Anual
            </h3>
            <span className="text-xs text-slate-400 font-medium">2024 - 2026</span>
          </div>

          <div className="space-y-4 pt-2">
            {stats.annualData.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{item.year}</span>
                  <span className="text-emerald-700">${item.amount.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${Math.min(100, (item.amount / 80000000) * 100)}%` }} 
                  />
                </div>
                <span className="text-[10px] text-slate-400">{item.count} donantes registrados</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLES & PORTAL TABS */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* TABS HEADER */}
        <div className="flex flex-wrap border-b border-slate-100 bg-slate-50/80 p-2 gap-1" id="admin-main-tabs">
          <button
            id="tab-donations-main"
            onClick={() => { setActiveTab('donations'); setSearchTerm(''); }}
            className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'donations' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-brand-red fill-brand-red" />
            Donaciones Recibidas ({donations.length})
          </button>

          <button
            id="tab-consultations-main"
            onClick={() => { setActiveTab('consultations'); setSearchTerm(''); }}
            className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'consultations' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-600" />
            Asesorías de Ley ({consultations.length})
          </button>

          <button
            id="tab-reports-main"
            onClick={() => { setActiveTab('reports'); setSearchTerm(''); }}
            className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'reports' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Denuncias DDHH ({reports.length})
          </button>

          <button
            id="tab-internships-main"
            onClick={() => { setActiveTab('internships'); setSearchTerm(''); }}
            className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'internships' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Pasantías ({internships.length})
          </button>

          <button
            id="tab-contacts-main"
            onClick={() => { setActiveTab('contacts'); setSearchTerm(''); }}
            className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'contacts' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" />
            Mensajes ({contacts.length})
          </button>
        </div>

        {/* DONATIONS FILTERS AND SEARCH */}
        {activeTab === 'donations' && (
          <div className="p-4 sm:p-5 bg-slate-50/50 border-b border-slate-100 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search Bar */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="donations-search-field"
                  type="text"
                  placeholder="Buscar por nombre, correo, ID transacción, ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-sky-500 font-medium"
                />
              </div>

              {/* Freq filter */}
              <div>
                <select
                  id="donations-freq-filter"
                  value={freqFilter}
                  onChange={(e) => setFreqFilter(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="all">Frecuencia: Todas</option>
                  <option value="one-time">Una sola vez</option>
                  <option value="recurring">Recurrente (Mensual)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: DONATIONS TABLE */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          {activeTab === 'donations' && (
            <div className="space-y-4">
              {filteredDonations.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <Heart className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600">No se encontraron donaciones con los filtros seleccionados</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse" id="donations-table">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-4">Transacción ID</th>
                      <th className="py-3 px-4">Donante</th>
                      <th className="py-3 px-4">Monto (COP)</th>
                      <th className="py-3 px-4">Frecuencia</th>
                      <th className="py-3 px-4">Método</th>
                      <th className="py-3 px-4">Ubicación</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Fecha</th>
                      <th className="py-3 px-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredDonations.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-sky-900">{item.id}</td>
                        <td className="py-3.5 px-4">
                          <strong className="block text-slate-900 font-bold">{item.name}</strong>
                          <span className="text-[11px] text-slate-400">{item.email}</span>
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900 text-sm">${item.amount.toLocaleString('es-CO')} COP</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${item.type === 'recurring' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'}`}>
                            {item.type === 'recurring' ? 'Mensual' : 'Única'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 capitalize font-semibold">Tarjeta</td>
                        <td className="py-3.5 px-4 text-slate-500">{item.city ? `${item.city}, ${item.country}` : item.country || 'Colombia'}</td>
                        <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono">{item.date}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            id={`receipt-btn-${item.id}`}
                            onClick={() => window.print()}
                            className="px-2.5 py-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-all"
                          >
                            Recibo
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* CONSULTATIONS */}
          {activeTab === 'consultations' && (
            <div className="space-y-4">
              {consultations.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-emerald-800">{item.id}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <h4 className="font-bold text-slate-900">{item.clientName}</h4>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              {reports.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-amber-800">{item.id}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <h4 className="font-bold text-slate-900">{item.subject}</h4>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* INTERNSHIPS */}
          {activeTab === 'internships' && (
            <div className="space-y-4">
              {internships.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-blue-800">{item.id}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <h4 className="font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-600">{item.university} - {item.career}</p>
                </div>
              ))}
            </div>
          )}

          {/* CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              {contacts.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 space-y-2">
                  <h4 className="font-bold text-slate-900">{item.name} ({item.email})</h4>
                  <p className="text-xs text-slate-600">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
