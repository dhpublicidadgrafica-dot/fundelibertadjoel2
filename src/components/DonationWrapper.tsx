import React, { useState, useEffect } from 'react';
import DonationModal from './DonationModal';

export default function DonationWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-donation-modal', handleOpen);

    // Si la URL es /donar o contiene #donar, abrir automáticamente
    if (window.location.hash === '#donar' || window.location.pathname === '/donar') {
      setIsOpen(true);
    }

    // Interceptar clics globales en botones y enlaces de donación
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('button, a');
      if (!target) return;

      const id = target.getAttribute('id') || '';
      const href = target.getAttribute('href') || '';
      const text = target.textContent?.toLowerCase() || '';

      if (
        id.includes('donate') ||
        href === '#donar' ||
        href === '/donar' ||
        text.includes('donar ahora') ||
        text.includes('donar a la fundación')
      ) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('open-donation-modal', handleOpen);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}
