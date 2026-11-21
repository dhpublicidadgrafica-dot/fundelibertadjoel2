/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2, Heart, ExternalLink, Calendar, Compass, Search } from 'lucide-react';
import { ContactMessage } from '../../types';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<ContactMessage | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newMsg: ContactMessage = {
        id: 'MSG-' + Math.floor(Math.random() * 100000),
        name,
        email,
        subject: subject || 'Consulta General',
        message,
        date: new Date().toISOString().split('T')[0]
      };

      // Save to localStorage
      const existing = localStorage.getItem('fundelibertad_contacts');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newMsg);
      localStorage.setItem('fundelibertad_contacts', JSON.stringify(list));

      // Trigger custom storage event
      window.dispatchEvent(new Event('storage_update'));

      setIsSubmitting(false);
      setSubmittedMessage(newMsg);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };


  return (
    <div className="space-y-16 pb-16 font-sans text-left" id="contact-section-container">
      {/* Introduction banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xs space-y-4">
        <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block">Contacto</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-dark tracking-tight leading-none">
          Estamos a tu Servicio en Medellín
        </h1>
        <div className="w-16 h-1 bg-brand-green rounded-full" />
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          ¿Tienes dudas sobre cómo unirte como voluntario, deseas realizar un aporte empresarial, o requieres asesoría legal gratuita? Envíanos tu mensaje, escríbenos directamente a WhatsApp o visítanos en nuestra oficina principal en el Barrio El Rodeo de la Comuna 15 Guayabal.
        </p>
      </div>

      {/* Grid: Form + Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form: 7 Cols */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8 space-y-6">
          <h3 className="font-display font-bold text-base text-slate-900 border-l-2 border-brand-green pl-2.5">
            Canal de Mensajería Institucional
          </h3>

          {!submittedMessage ? (
            <form onSubmit={handleContactSubmit} className="space-y-4" id="contact-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nombre Completo</label>
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Carolina Restrepo"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="carolina@ejemplo.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Asunto de la Consulta</label>
                <input
                  id="contact-subject-input"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ej: Deseo ser voluntario / Información sobre donaciones"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Mensaje</label>
                <textarea
                  id="contact-message-textarea"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe aquí tu mensaje institucional detalladamente..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs font-sans leading-relaxed"
                />
              </div>

              <button
                id="submit-contact-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-brand-primary hover:bg-blue-800 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando Mensaje...' : 'Enviar Mensaje de Contacto'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 text-center space-y-4" id="contact-success">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-green mx-auto border border-emerald-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display font-bold text-lg text-emerald-900">¡Mensaje Enviado Exitosamente!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Gracias <span className="font-semibold text-slate-900">{submittedMessage.name}</span>. Tu mensaje con asunto <span className="italic font-medium">"{submittedMessage.subject}"</span> ha sido catalogado. Un voluntario te responderá al correo provisto en breve.
                </p>
              </div>
              <button
                id="reset-contact-btn"
                onClick={() => setSubmittedMessage(null)}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer"
              >
                Enviar Otro Mensaje
              </button>
            </div>
          )}
        </div>

        {/* Info Cards: 5 Cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: WhatsApp */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 p-6 flex items-start gap-4 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 fill-white" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">En línea</span>
              <h4 className="font-display font-bold text-sm text-slate-900">Contacto Directo WhatsApp</h4>
              <p className="text-xs text-slate-500 leading-normal mb-2.5">Recibe asesoría o respuestas rápidas en tu teléfono.</p>
              <a
                id="contact-whatsapp-btn"
                href="https://wa.me/573002167822?text=Hola%20FUNDELIBERTAD%2C%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20o%20solicitar%20asesor%C3%ADa."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm"
              >
                Chatear +57 300 216 7822
              </a>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-start gap-4 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-slate-900">Correo Institucional</h4>
              <p className="text-xs text-slate-500 leading-normal">Escríbenos para convenios universitarios o informes gubernamentales.</p>
              <a href="mailto:info@fundelibertad.org" className="text-xs font-mono font-bold text-brand-primary hover:underline block pt-1.5">
                info@fundelibertad.org
              </a>
            </div>
          </div>

          {/* Card 3: Address & Hours */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-start gap-4 shadow-xs">
            <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-slate-900">Sede Principal Guayabal</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calle 1A #55-39, Barrio El Rodeo<br />
                Comuna 15 Guayabal, Medellín, Colombia
              </p>
              <div className="pt-2 flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>Lunes a Viernes: 8:00 AM - 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styled Interactive Vector Map Component */}
      <section className="space-y-4" id="map-section">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-brand-green" />
          <h3 className="font-display font-bold text-lg text-brand-dark uppercase tracking-wide">Ubicación de la Sede en Guayabal</h3>
        </div>

        {/* Vector Map Wrapper */}
        <div className="relative rounded-3xl bg-slate-950 border border-slate-800 text-white p-6 md:p-8 overflow-hidden shadow-xl min-h-[350px] flex flex-col justify-between">
          {/* Conceptual stylized grid background representing streets */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Radial radar rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-sky-500/20 animate-pulse pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-sky-500/10 pointer-events-none" />

          {/* Map metadata labels */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping" />
                <span className="font-display font-bold text-sm text-white">Sede FUNDELIBERTAD Medellín</span>
              </div>
              <p className="text-[11px] text-slate-400">Calle 1A #55-39 - Medellin - Colombia</p>
            </div>
            
            <a
              id="google-maps-navigation-link"
              href="https://www.google.com/maps/search/?api=1&query=Calle+1A+%2355-39,+Medellin,+Colombia"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              Cómo llegar (Google Maps)
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Map Vector Mock Coordinates */}
          <div className="relative z-10 flex flex-col items-center justify-center py-10 space-y-3">
            <div className="w-14 h-14 rounded-full bg-brand-green/30 flex items-center justify-center animate-bounce text-white shadow-lg border border-brand-green">
              <MapPin className="w-7 h-7 text-white fill-brand-green" />
            </div>
            
            <div className="text-center space-y-1 bg-slate-900/90 p-4 rounded-xl border border-slate-800/80 max-w-xs backdrop-blur-xs shadow-md">
              <span className="text-[9px] font-mono font-bold text-sky-400 block uppercase tracking-widest">Coordenadas de Acceso</span>
              <p className="font-mono text-xs font-bold text-white">6.2162° N, 75.5925° W</p>
              <p className="text-[10px] text-slate-400 leading-normal pt-1 border-t border-slate-800 mt-1">A tres cuadras de la Avenida Guayabal, sector El Rodeo.</p>
            </div>
          </div>

          {/* Compass grid coordinates */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Zona Sur-Occidental Medellín</span>
            <span>Estación Aguacatala (Ruta Alimentadora C15)</span>
          </div>
        </div>
      </section>
    </div>
  );
}
