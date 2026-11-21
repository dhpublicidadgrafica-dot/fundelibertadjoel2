import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, Lock, QrCode
} from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [receiveNews, setReceiveNews] = useState<boolean>(true);
  const [acceptPrivacy, setAcceptPrivacy] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto" id="donation-modal-root">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
          id="donation-backdrop"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl z-10 border border-slate-200/80 my-auto"
          id="donation-modal-window"
        >
          {/* HEADER BRANDING */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-start gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-sky-400/30">
                      Canal Institucional de Donaciones
                    </span>
                    <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Cuenta Oficial
                    </span>
                  </div>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight mt-1">
                    Apoya la Paz y los Derechos Humanos
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Fundación Fundelibertad • Nit: 900.497.212-2
                  </p>
                </div>
              </div>

              <button
                id="close-donation-modal-btn"
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MAIN MODAL BODY */}
          <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* BLOQUE CÓDIGO QR Y DATOS BANCARIOS */}
            <div className="space-y-4" id="donation-qr-code-section">
              <div className="text-center space-y-1.5">
                <span className="bg-sky-100 text-sky-900 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-sky-700" /> CÓDIGO QR Y TRANSFERENCIA DIRECTA
                </span>
                <h3 className="font-display font-extrabold text-base sm:text-xl text-slate-900">
                  Escanea y Realiza tu Aporte
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Puedes realizar tu donación mediante tu aplicación bancaria (Nequi, Bancolombia, Daviplata o Transfiya) escaneando el código QR institucional.
                </p>
              </div>

              {/* QR DISPLAY CARD - CENTERED */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 p-6 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col items-center justify-center text-center">
                
                {/* SVG / IMAGE QR CODE CONTAINER */}
                <div className="relative bg-white p-4 sm:p-5 rounded-2xl shadow-lg shrink-0 flex flex-col items-center justify-center border-4 border-slate-800">
                  {/* Corner Accents */}
                  <div className="w-4 h-4 border-t-2 border-l-2 border-sky-500 absolute -top-2 -left-2" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-sky-500 absolute -top-2 -right-2" />
                  <div className="w-4 h-4 border-b-2 border-l-2 border-sky-500 absolute -bottom-2 -left-2" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-sky-500 absolute -bottom-2 -right-2" />

                  {/* Image QR Code */}
                  <img 
                    src="https://lh3.googleusercontent.com/d/1PNcF0uNgCOHdHMeRHLYVO8KjRg7qoNzA" 
                    alt="Código QR de Donación" 
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* OPCIONES DE NOTICIAS Y PRIVACIDAD EN LA PARTE INFERIOR */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600 font-sans">
              <label className="flex items-start sm:items-center gap-2.5 cursor-pointer">
                <input
                  id="chk-receive-news"
                  type="checkbox"
                  checked={receiveNews}
                  onChange={(e) => setReceiveNews(e.target.checked)}
                  className="w-4 h-4 mt-0.5 sm:mt-0 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span>Deseo recibir noticias e informes periódicos de la Fundación.</span>
              </label>

              <label className="flex items-start sm:items-center gap-2.5 cursor-pointer">
                <input
                  id="chk-accept-privacy"
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  className="w-4 h-4 mt-0.5 sm:mt-0 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                />
                <span>
                  Acepto la <a href="/contacto" target="_blank" className="text-sky-700 underline font-semibold">Política de Privacidad</a> y tratamiento de datos personales.
                </span>
              </label>
            </div>

            {/* TRUST & SECURITY BANNER */}
            <div className="flex items-start gap-2.5 text-[11px] text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong className="text-slate-700">Garantía de Transparencia:</strong> Escanea el código QR desde tu aplicación bancaria preferida para realizar tu aporte directo a la Fundación Fundelibertad.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

