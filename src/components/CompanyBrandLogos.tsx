import React from 'react';

interface LogoProps {
  className?: string;
}

/**
 * 01. Graphic Design Eye (Image 1)
 * Green two-blade aperture swirl with central eye, dark pupil, and white specular dot
 */
export const GraphicDesignEyeLogo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Graphic Design Eye Logo"
  >
    <defs>
      <linearGradient id="gde-blade-top" x1="20" y1="10" x2="80" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
      <linearGradient id="gde-blade-bottom" x1="80" y1="90" x2="20" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
      <radialGradient id="gde-pupil" cx="48" cy="48" r="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4b5563" />
        <stop offset="70%" stopColor="#111827" />
        <stop offset="100%" stopColor="#030712" />
      </radialGradient>
    </defs>

    {/* Top Green Swirl Blade */}
    <path
      d="M50 0 C77.6 0 100 22.4 100 50 C100 62 95 72 87 80 C80 62 68 48 50 38 C32 48 20 62 13 80 C5 72 0 62 0 50 C0 22.4 22.4 0 50 0 Z"
      fill="url(#gde-blade-top)"
    />

    {/* Bottom Green Swirl Blade */}
    <path
      d="M50 100 C22.4 100 0 77.6 0 50 C0 38 5 28 13 20 C20 38 32 52 50 62 C68 52 80 38 87 20 C95 28 100 38 100 50 C100 77.6 77.6 100 50 100 Z"
      fill="url(#gde-blade-bottom)"
    />

    {/* Inner White Eye Sclera Opening */}
    <ellipse cx="50" cy="50" rx="22" ry="11" fill="#ffffff" />

    {/* Pupil / Iris */}
    <circle cx="50" cy="50" r="9" fill="url(#gde-pupil)" />

    {/* Specular White Dot */}
    <circle cx="53.5" cy="46.5" r="3" fill="#ffffff" />
  </svg>
);

/**
 * 02. Vivasoft Limited (Image 2)
 * Fluid wave ribbon: purple curve on left + cobalt blue looping wave on right
 */
export const VivasoftLogo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Vivasoft Limited Logo"
  >
    {/* Left Violet / Purple Curve */}
    <path
      d="M24 44 C28 40, 36 41, 41 49 C46 56, 42 63, 34 63 C26 63, 22 57, 24 44 Z"
      fill="#6366f1"
    />

    {/* Right Sweeping Blue Loop and Flick */}
    <path
      d="M39 40 C43 36, 49 37, 56 46 L64 57 C67 61, 71 61, 74 57 L78 50 L80 52 L73 63 C67 70, 59 70, 53 61 L45 49 C42 44, 38 43, 35 46 L33 43 C35 41, 37 40, 39 40 Z"
      fill="#2563eb"
    />
    <path
      d="M74 57 L85 44"
      stroke="#2563eb"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 03. YOKAI (Image 3)
 * Red horizontal top bar + White hollow square box on black
 */
export const YokaiLogo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="YOKAI Logo"
  >
    {/* Solid Black Canvas */}
    <rect width="100" height="100" rx="14" fill="#000000" />

    {/* Horizontal Red Top Bar */}
    <rect x="22" y="14" width="56" height="10" fill="#dc2626" />

    {/* White Square Outer Frame */}
    <rect x="22" y="32" width="56" height="54" fill="#ffffff" />

    {/* Inner Square Cutout (Hollow Black Center) */}
    <rect x="36" y="46" width="28" height="26" fill="#000000" />
  </svg>
);

/**
 * 04. Financfy (Image 4)
 * 3-bar financial growth chart + upward diagonal yellow/white arrow
 */
export const FinancfyLogo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Financfy Logo"
  >
    {/* Bar 1 (Left - Shortest) */}
    <rect x="20" y="67" width="15" height="15" fill="#f59e0b" />
    <polygon points="20,82 35,67 35,82" fill="#0e7490" />

    {/* Bar 2 (Middle) */}
    <rect x="39" y="49" width="15" height="18" fill="#f59e0b" />
    <rect x="39" y="67" width="15" height="15" fill="#0e7490" />
    <polygon points="39,67 54,52 54,67" fill="#0e7490" />

    {/* Bar 3 (Right - Tallest) */}
    <rect x="57" y="26" width="15" height="18" fill="#f59e0b" />
    <rect x="57" y="44" width="15" height="38" fill="#0e7490" />

    {/* Diagonal Arrow Shaft */}
    <path
      d="M20 79 L74 27"
      stroke="#ffffff"
      strokeWidth="5"
      strokeLinecap="square"
    />

    {/* Diagonal Arrow Head */}
    <polygon points="76,17 80,31 69,23" fill="#f59e0b" />
  </svg>
);

/**
 * 05. Apar's Classroom (Image 5)
 * Modern cornflower blue parabolic 'A' arch with inner curved bridge
 */
export const AparsClassroomLogo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Apar's Classroom Logo"
  >
    {/* Outer Parabolic Arch 'A' */}
    <path
      d="M50 16 C67 16, 84 37, 85 88 L75 88 C74 44, 62 26, 50 26 C38 26, 26 44, 25 88 L15 88 C16 37, 33 16, 50 16 Z"
      fill="#3b82f6"
    />

    {/* Inner Curved Crossbar Bridge */}
    <path
      d="M28 82 C38 71, 62 71, 72 82 C65 67, 35 67, 28 82 Z"
      fill="#2563eb"
      opacity="0.95"
    />
  </svg>
);

/**
 * 06. Webisoft (Image 6)
 * Bold black stencil 'W' mark on terracotta red background with '®'
 */
export const WebisoftLogo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Webisoft Logo"
  >
    {/* Terracotta / Burnt Orange Container */}
    <rect width="100" height="100" rx="14" fill="#e05038" />

    {/* Left Diagonal Bar */}
    <polygon points="16,30 29,30 45,74 32,74" fill="#000000" />

    {/* Right Stencil Block & Stem */}
    <polygon points="39,30 52,30 67,74 54,74" fill="#000000" />
    <polygon points="65,30 80,30 80,58 67,58" fill="#000000" />

    {/* Registered Trademark ® */}
    <circle cx="78" cy="70" r="3.5" stroke="#000000" strokeWidth="0.8" fill="none" />
    <text
      x="78"
      y="71.5"
      textAnchor="middle"
      fontSize="3.5"
      fontWeight="bold"
      fill="#000000"
      fontFamily="sans-serif"
    >
      R
    </text>
  </svg>
);

/**
 * 07. Gyanpeon (Image 7)
 * Open books, feather quill pen, and Bengali title "জ্ঞানপিয়ন" in royal indigo
 */
export const GyanpeonLogo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Gyanpeon Logo"
  >
    {/* Stacked Open Book Pages */}
    <path
      d="M30 45 L42 22 L62 38 L50 60 Z"
      stroke="#4338ca"
      strokeWidth="2.5"
      strokeLinejoin="round"
      fill="#ffffff"
    />
    <path
      d="M34 40 L46 17 L66 33 L54 55 Z"
      stroke="#4338ca"
      strokeWidth="2"
      fill="#ffffff"
    />

    {/* Quill Pen */}
    <path
      d="M50 58 C53 48, 59 36, 68 30 C64 36, 61 46, 52 62 Z"
      fill="#4338ca"
    />
    <line x1="50" y1="60" x2="48" y2="65" stroke="#4338ca" strokeWidth="2" strokeLinecap="round" />

    {/* Bengali Typography "জ্ঞানপিয়ন" */}
    <rect x="12" y="66" width="76" height="24" rx="4" fill="#4338ca" />
    <text
      x="50"
      y="83"
      textAnchor="middle"
      fill="#ffffff"
      fontSize="13"
      fontWeight="900"
      fontFamily="'Hind Siliguri', 'Kalpurush', sans-serif"
      letterSpacing="0.5"
    >
      জ্ঞানপিয়ন
    </text>
  </svg>
);

/**
 * 08. KBN Production Ltd. (Image 8)
 * Bold white "KBN" lockup + "Production Ltd" on vibrant royal blue background
 */
export const KbnProductionLogo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="KBN Production Ltd Logo"
  >
    {/* Royal Blue Canvas */}
    <rect width="100" height="100" rx="14" fill="#3b49df" />

    {/* "KBN" Bold Typography */}
    <text
      x="50"
      y="56"
      textAnchor="middle"
      fill="#ffffff"
      fontSize="27"
      fontWeight="900"
      fontFamily="'Outfit', -apple-system, sans-serif"
      letterSpacing="-1"
    >
      KBN
    </text>

    {/* "Production Ltd" Text */}
    <text
      x="50"
      y="74"
      textAnchor="middle"
      fill="#ffffff"
      fontSize="7.5"
      fontWeight="600"
      fontFamily="'Plus Jakarta Sans', sans-serif"
      letterSpacing="0.2"
    >
      Production Ltd
    </text>
  </svg>
);

export const renderCompanyLogo = (companyId: string, className?: string) => {
  switch (companyId) {
    case 'gde':
      return <GraphicDesignEyeLogo className={className} />;
    case 'vivasoft':
      return <VivasoftLogo className={className} />;
    case 'yokai':
      return <YokaiLogo className={className} />;
    case 'financfy':
      return <FinancfyLogo className={className} />;
    case 'apars':
      return <AparsClassroomLogo className={className} />;
    case 'webisoft':
      return <WebisoftLogo className={className} />;
    case 'gyanpeon':
      return <GyanpeonLogo className={className} />;
    case 'kbn':
      return <KbnProductionLogo className={className} />;
    default:
      return null;
  }
};
