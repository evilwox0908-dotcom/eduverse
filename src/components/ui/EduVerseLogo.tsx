import React from 'react';

export interface EduVerseLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'mark' | 'badge';
  className?: string;
  showSubtitle?: boolean;
}

export const EduVerseLogo: React.FC<EduVerseLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  showSubtitle = true,
}) => {
  // Dimensions map
  const dimensions = {
    xs: { iconSize: 24, textSize: 'text-sm', subSize: 'text-[7px]' },
    sm: { iconSize: 32, textSize: 'text-base', subSize: 'text-[8px]' },
    md: { iconSize: 40, textSize: 'text-xl', subSize: 'text-[9px]' },
    lg: { iconSize: 52, textSize: 'text-2xl', subSize: 'text-[11px]' },
    xl: { iconSize: 72, textSize: 'text-3xl', subSize: 'text-xs' },
    '2xl': { iconSize: 96, textSize: 'text-4xl', subSize: 'text-sm' },
  }[size];

  // Pure SVG official symbol rendering matching the exact official brand asset
  const renderOfficialSymbol = () => (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full object-contain"
      aria-hidden="true"
    >
      <circle cx="250" cy="250" r="240" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3" />
      <g fill="#0A0A0A" transform="translate(0, -15)">
        {/* Cap top */}
        <polygon points="250,60 365,120 250,180 135,120" />
        {/* Cap band */}
        <path d="M185,145 C185,145 205,172 250,172 C295,172 315,145 315,145 L315,165 C315,192 285,204 250,204 C215,204 185,192 185,165 Z" />
        {/* Cap Tassel */}
        <path d="M345,128 L345,192 Q345,200 340,206 L350,206 Q345,200 345,192 Z" />
        <polygon points="338,206 352,206 348,245 342,245" />
        <circle cx="345" cy="128" r="4" />
        {/* 'E' Mark */}
        <path d="M190,192 C190,192 220,140 295,150 L295,185 C245,178 228,212 228,232 L305,232 L305,270 L228,270 C228,298 248,322 295,312 L295,352 C220,362 190,308 190,250 Z" />
        {/* Open Book Pages */}
        <path d="M250,345 C215,315 160,305 110,315 L110,395 C160,385 215,400 250,430 Z" />
        <path d="M250,370 C218,345 165,340 120,350 L120,410 C165,400 218,415 250,445 Z" opacity="0.88" />
        <path d="M250,395 C220,375 170,370 130,380 L130,425 C170,418 220,430 250,460 Z" opacity="0.75" />
        <path d="M250,345 C285,315 340,305 390,315 L390,395 C340,385 285,400 250,430 Z" />
        <path d="M250,370 C282,345 335,340 380,350 L380,410 C335,400 282,415 250,445 Z" opacity="0.88" />
        <path d="M250,395 C280,375 330,370 370,380 L370,425 C330,418 280,430 250,460 Z" opacity="0.75" />
      </g>
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center justify-center rounded-full bg-white shadow-xs border border-slate-200 p-0.5 ${className}`} style={{ width: dimensions.iconSize, height: dimensions.iconSize }}>
        {renderOfficialSymbol()}
      </div>
    );
  }

  if (variant === 'mark') {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: dimensions.iconSize, height: dimensions.iconSize }}
      >
        {renderOfficialSymbol()}
      </div>
    );
  }

  // Full variant: Symbol + Typography & Official Brand Slogan
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <div
        className="relative shrink-0 rounded-full bg-white shadow-2xs border border-slate-200/80 p-0.5"
        style={{ width: dimensions.iconSize, height: dimensions.iconSize }}
      >
        {renderOfficialSymbol()}
      </div>
      <div className="flex flex-col select-none">
        <div className={`font-black tracking-tight text-slate-900 leading-none ${dimensions.textSize}`}>
          EDU<span className="text-blue-600">VERSE</span>
        </div>
        {showSubtitle && (
          <div className={`font-bold tracking-widest text-slate-400 uppercase mt-0.5 ${dimensions.subSize}`}>
            LEARN. COMPETE. ACHIEVE.
          </div>
        )}
      </div>
    </div>
  );
};
