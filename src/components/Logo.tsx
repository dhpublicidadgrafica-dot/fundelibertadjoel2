/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  lightText?: boolean;
}

export default function Logo({ className = "h-12 w-auto", showText = true, lightText = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3 select-none" id="fundelibertad-logo-wrapper">
      {/* High-fidelity custom SVG representing the exact logo design */}
      <svg
        viewBox="0 0 100 100"
        className={`${className} aspect-square shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="logo-svg-element"
      >
        {/* 1. Central Black Emblem Circle */}
        <circle cx="50" cy="42" r="22" fill="#0a0a0a" />

        {/* 2. Three White Figures inside the black circle looking up and raising arms */}
        {/* Left white figure */}
        <path
          d="M44.5 44.5 C40 43, 39 49, 44 54 C46 52, 47 48, 44.5 44.5 Z"
          fill="#ffffff"
        />
        <circle cx="43.5" cy="41" r="2.5" fill="#ffffff" />
        <circle cx="43.5" cy="41" r="1.1" fill="#0a0a0a" /> {/* Black dot head detail */}

        {/* Right white figure */}
        <path
          d="M55.5 44.5 C60 43, 61 49, 56 54 C54 52, 53 48, 55.5 44.5 Z"
          fill="#ffffff"
        />
        <circle cx="56.5" cy="41" r="2.5" fill="#ffffff" />
        <circle cx="56.5" cy="41" r="1.1" fill="#0a0a0a" /> {/* Black dot head detail */}

        {/* Center white figure */}
        <path
          d="M50 49 C47 49, 46 53, 46 57 C46 61, 50 62, 50 62 C50 62, 54 61, 54 57 C54 53, 53 49, 50 49 Z"
          fill="#ffffff"
        />
        <circle cx="50" cy="45.5" r="2.3" fill="#ffffff" />
        <circle cx="50" cy="45.5" r="1.0" fill="#0a0a0a" /> {/* Black dot head detail */}

        {/* 3. Red heart at the top of the black circle */}
        <path
          d="M50 34 C49.2 31.5, 46.5 31.5, 46.5 33.7 C46.5 36.3, 50 39, 50 39 C50 39, 53.5 36.3, 53.5 33.7 C53.5 31.5, 50.8 31.5, 50 34 Z"
          fill="#d9252c"
        />

        {/* 4. Laurel wreath (branches with leaves surrounding the black circle) */}
        {/* Left branch stem */}
        <path
          d="M27 41 C25 55, 36 66, 50 67"
          stroke="#2ca444"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Right branch stem */}
        <path
          d="M73 41 C75 55, 64 66, 50 67"
          stroke="#2ca444"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Laurel leaves (Left Branch) */}
        <path d="M26.5 39 C24 38, 28 35, 28.5 37.5 Z" fill="#2ca444" />
        <path d="M27.5 45 C25 44, 29 41, 29.5 43.5 Z" fill="#2ca444" />
        <path d="M30 51 C27.5 50, 31.5 47, 32 49.5 Z" fill="#2ca444" />
        <path d="M34.5 57 C32 56, 36 53, 36.5 55.5 Z" fill="#2ca444" />
        <path d="M40.5 62 C38 61, 42 58, 42.5 60.5 Z" fill="#2ca444" />
        <path d="M47.5 65 C45 64, 49 61, 49.5 63.5 Z" fill="#2ca444" />

        {/* Laurel leaves (Right Branch) */}
        <path d="M73.5 39 C76 38, 72 35, 71.5 37.5 Z" fill="#2ca444" />
        <path d="M72.5 45 C75 44, 71 41, 70.5 43.5 Z" fill="#2ca444" />
        <path d="M70 51 C72.5 50, 68.5 47, 68 49.5 Z" fill="#2ca444" />
        <path d="M65.5 57 C68 56, 64 53, 63.5 55.5 Z" fill="#2ca444" />
        <path d="M59.5 62 C62 61, 58 58, 57.5 60.5 Z" fill="#2ca444" />
        <path d="M52.5 65 C55 64, 51 61, 50.5 63.5 Z" fill="#2ca444" />

        {/* 5. Sky Blue flying peace doves flanking left and right */}
        {/* Left Dove */}
        <path
          d="M23.5 47.5 C21 44.5, 23 41.5, 24.5 43 C26.5 45, 25 49, 23.5 47.5 Z"
          fill="#2d88c4"
        />
        <path
          d="M21 48 C18.5 46.5, 21.5 44, 23 45.5 C24.5 47, 22.5 49, 21 48 Z"
          fill="#2d88c4"
        />
        
        {/* Right Dove */}
        <path
          d="M76.5 47.5 C79 44.5, 77 41.5, 75.5 43 C73.5 45, 75 49, 76.5 47.5 Z"
          fill="#2d88c4"
        />
        <path
          d="M79 48 C81.5 46.5, 78.5 44, 77 45.5 C75.5 47, 77.5 49, 79 48 Z"
          fill="#2d88c4"
        />

        {/* 6. Human Hands holding the wreath at the bottom */}
        {/* Left hand */}
        <path
          d="M22 55.5 C26 59.5, 39 59.5, 45.5 56.5 C41 55.5, 29 54, 22 55.5 Z"
          fill="#e5a97d"
        />
        {/* Right hand */}
        <path
          d="M78 55.5 C74 59.5, 61 59.5, 54.5 56.5 C59 55.5, 71 54, 78 55.5 Z"
          fill="#e5a97d"
        />
      </svg>

      {/* Branded texts representing the exact composition of the original horizontal logo */}
      {showText && (
        <div className="flex flex-col justify-center text-left" id="logo-text-block">
          <span 
            className={`font-serif font-extrabold tracking-[0.1em] leading-none text-lg sm:text-2xl md:text-3xl ${
              lightText ? 'text-white' : 'text-[#0a0a0a]'
            }`}
            style={{ fontFamily: '"Playfair Display", "Times New Roman", Georgia, serif' }}
          >
            FUNDELIBERTAD
          </span>
          <span 
            className={`text-[5px] sm:text-[7px] md:text-[8px] font-semibold uppercase tracking-[0.05em] sm:tracking-[0.1em] leading-none block mt-1.5 ${
              lightText ? 'text-sky-100/90' : 'text-slate-700'
            }`}
            style={{ fontFamily: '"Inter", "Helvetica", sans-serif' }}
          >
            FUNDACIÓN DE DERECHOS HUMANOS POR LA LIBERTAD Y LA VIDA
          </span>
        </div>
      )}
    </div>
  );
}
