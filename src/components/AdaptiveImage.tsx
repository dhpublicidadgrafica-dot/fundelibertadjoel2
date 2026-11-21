/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

export interface AdaptiveImageProps {
  src: string | any;
  alt: string;
  containerClassName?: string;
  imgClassName?: string;
  hoverZoom?: boolean;
  priority?: boolean;
  children?: React.ReactNode;
}

/**
 * AdaptiveImage displays any image of any size or aspect ratio
 * (square, vertical flyer, horizontal banner, high-res photo) completely
 * in its natural proportions without cropping (object-contain) on a clean
 * pure white background without dark margins or vignettes.
 */
export default function AdaptiveImage({
  src,
  alt,
  containerClassName = 'h-52 w-full',
  imgClassName = '',
  hoverZoom = true,
  priority = false,
  children,
}: AdaptiveImageProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = typeof src === 'string' ? src : src?.src || '';

  return (
    <div
      className={`relative overflow-hidden bg-white flex items-center justify-center select-none ${containerClassName}`}
    >
      {/* Main crisp image - fits 100% complete without cropping, maintaining original aspect ratio */}
      {!hasError && resolvedSrc ? (
        <img
          src={resolvedSrc}
          alt={alt}
          onError={() => setHasError(true)}
          className={`relative z-10 max-h-full max-w-full w-auto h-auto object-contain p-2 transition-transform duration-500 ${
            hoverZoom ? 'group-hover:scale-105' : ''
          } ${imgClassName}`}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center text-slate-400 gap-1.5 w-full h-full bg-slate-50">
          <ImageOff className="w-8 h-8 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 max-w-[200px] truncate">{alt || 'FUNDELIBERTAD'}</span>
        </div>
      )}

      {/* Child elements (badges, labels, buttons) */}
      {children}
    </div>
  );
}
