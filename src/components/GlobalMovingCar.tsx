import React, { useEffect, useState, useRef } from 'react';

const MESSAGES = [
  'Purr-fect ride! Sunroof wide open 🐾✨',
  'Meow! Fast lanes & big tuna dreams 🐟💨',
  'Paws on the wheel, eyes on the road 🐱🚘',
  'Wind in my whiskers! 💨🐾',
  'Cruising in the white luxury whip 🚗🤍',
  'Chauffeur cat at your service! Meow~ 🕶️',
  'Sunroof cat says hello! *happy paw wave* 🐾',
];

export const GlobalMovingCar: React.FC = () => {
  const [posX, setPosX] = useState(-160); // in pixels
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [isBoosting, setIsBoosting] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [chassisBob, setChassisBob] = useState(0);
  const [hairBreeze, setHairBreeze] = useState(0);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const messageTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const screenWidth = window.innerWidth;
      const speed = isBoosting ? 260 : 78; // pixels per second

      setPosX((prev) => {
        let next = prev;
        if (direction === 'right') {
          next = prev + speed * dt;
          if (next > screenWidth + 160) {
            setDirection('left');
            return screenWidth + 140;
          }
        } else {
          next = prev - speed * dt;
          if (next < -180) {
            setDirection('right');
            return -160;
          }
        }
        return next;
      });

      // Animate wheels, chassis suspension, and cats' whiskers/ears fluttering in the breeze
      setWheelRotation((prev) => (prev + (isBoosting ? 28 : 9)) % 360);
      setChassisBob(Math.sin(currentTime * 0.014) * 1.2);
      setHairBreeze(Math.sin(currentTime * (isBoosting ? 0.035 : 0.018)) * 2.8);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [direction, isBoosting]);

  const handleCarClick = () => {
    // Playful speed boost and celebratory wind pop
    setIsBoosting(true);
    setTimeout(() => setIsBoosting(false), 2400);

    // Pick next playful status message
    const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setActiveMessage(randomMsg);

    if (messageTimeoutRef.current) {
      window.clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = window.setTimeout(() => {
      setActiveMessage(null);
    }, 3600);
  };

  return (
    <aside
      aria-label="Interactive luxury white car with cats inside and in the sunroof"
      className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none select-none h-20 sm:h-28 overflow-hidden"
    >
      {/* Sleek highway road line with illuminated amber & white road markers */}
      <div className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-[2px] bg-slate-800/90 shadow-[0_0_8px_rgba(255,255,255,0.25)]">
        <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(255,255,255,0.45)_20px,rgba(255,255,255,0.45)_40px)]" />
      </div>

      {/* The Animated Moving Luxury White Car with Cats */}
      <div
        className="absolute bottom-1.5 sm:bottom-2.5 pointer-events-auto cursor-pointer transition-transform duration-75 scale-[0.72] sm:scale-100 origin-bottom"
        style={{
          transform: `translateX(${posX}px) scaleX(${direction === 'right' ? 1 : -1})`,
        }}
        onClick={handleCarClick}
        title="Tap to speed up and watch the cats cruise!"
      >
        {/* Playful Floating Speech Bubble (counter-scales so text is never reversed) */}
        {activeMessage && (
          <div
            className="absolute -top-12 left-1/2 whitespace-nowrap px-3.5 py-1.5 rounded-full bg-slate-950/95 border border-amber-300/80 shadow-[0_4px_20px_rgba(0,0,0,0.6)] text-[11px] font-mono text-amber-200 backdrop-blur-md animate-bounce flex items-center gap-1.5 z-50"
            style={{
              transform: `translateX(-50%) scaleX(${direction === 'right' ? 1 : -1})`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>{activeMessage}</span>
          </div>
        )}

        {/* Crisp Laser Headlight Beam from Front */}
        <div
          className="absolute top-8 left-[105px] w-64 h-16 pointer-events-none opacity-60"
          style={{
            background: 'linear-gradient(to right, rgba(255, 255, 255, 0.85), rgba(224, 242, 254, 0.3), transparent)',
            clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 70%)',
          }}
        />

        {/* Boost Particle / Wind Streaks behind */}
        {isBoosting && (
          <div className="absolute top-10 -left-10 flex items-center gap-1.5 opacity-90 pointer-events-none">
            <span className="w-5 h-2 rounded-full bg-amber-300/80 blur-[1px] animate-pulse" />
            <span className="w-3 h-1.5 rounded-full bg-sky-300/80 blur-[1px]" />
            <span className="w-2 h-1 rounded-full bg-white/90" />
          </div>
        )}

        {/* The SVG Container with Suspension Bobbing */}
        <div
          className="relative transition-transform duration-75"
          style={{ transform: `translateY(${chassisBob}px)` }}
        >
          <svg
            width="124"
            height="62"
            viewBox="0 0 124 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.7)]"
          >
            <defs>
              {/* Pearl Metallic White Luxury Body Gradient */}
              <linearGradient id="pearl-white-body" x1="0" y1="20" x2="120" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="20%" stopColor="#f8fafc" />
                <stop offset="45%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>

              {/* Luxury Tinted Privacy Glass with Blue Sky Sheen */}
              <linearGradient id="tinted-glass" x1="34" y1="22" x2="80" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#090d16" stopOpacity="0.82" />
                <stop offset="50%" stopColor="#1e293b" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
              </linearGradient>

              {/* Specular Chrome Body Trim */}
              <linearGradient id="chrome-trim" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>

              {/* Ginger Sunroof Cat Fur Gradient */}
              <linearGradient id="ginger-fur" x1="48" y1="6" x2="65" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>

              {/* Calico / Cream Fur Gradient */}
              <linearGradient id="cream-fur" x1="33" y1="26" x2="42" y2="35" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>

              {/* Gold Collar / Bell Accent */}
              <linearGradient id="gold-metal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* Ground Contact Shadow */}
            <ellipse cx="60" cy="58" rx="55" ry="3" fill="#000000" fillOpacity="0.6" />

            {/* ============================================================== */}
            {/* === CATS INSIDE THE CABIN (VISIBLE THROUGH WINDOWS) === */}
            {/* ============================================================== */}

            {/* 1. BACKSEAT KITTEN (Peeking out rear window) */}
            <g>
              {/* Backseat kitten head */}
              <ellipse cx="37" cy="30.5" rx="3.5" ry="3.2" fill="url(#cream-fur)" />
              {/* Kitten Calico patch */}
              <path d="M35 28.5 C36 28 38 29 37.5 32 Z" fill="#ea580c" />
              {/* Kitten ears */}
              <path d="M34 29 L32.5 25.5 L36 27 Z" fill="#fde68a" />
              <path d="M34.2 28.5 L33.2 26.5 L35.5 27.5 Z" fill="#f43f5e" opacity="0.6" />
              <path d="M38.5 27.5 L41 25.5 L40 29 Z" fill="#fde68a" />
              <path d="M39 28 L40.5 26.5 L39.8 28.8 Z" fill="#f43f5e" opacity="0.6" />
              {/* Curious kitten eyes */}
              <circle cx="35.5" cy="30.5" r="0.8" fill="#0284c7" />
              <circle cx="38.5" cy="30.5" r="0.8" fill="#0284c7" />
              <circle cx="35.3" cy="30.3" r="0.25" fill="#ffffff" />
              <circle cx="38.3" cy="30.3" r="0.25" fill="#ffffff" />
              {/* Kitten pink nose */}
              <polygon points="37,31.6 36.5,31.1 37.5,31.1" fill="#f43f5e" />
            </g>

            {/* 2. DRIVER CAT (Steering at the wheel behind front windshield) */}
            <g>
              {/* Tuxedo cat body & head */}
              <ellipse cx="76.5" cy="31" rx="4.5" ry="3.8" fill="#0f172a" />
              <ellipse cx="77.5" cy="28" rx="3.8" ry="3.4" fill="#1e293b" />
              {/* White muzzle & chest bib */}
              <ellipse cx="77.5" cy="29.5" rx="2" ry="1.4" fill="#ffffff" />
              {/* Perky Driver Cat Ears */}
              <path d="M74.5 26.5 L73 22.5 L77 24.5 Z" fill="#1e293b" />
              <path d="M74.8 26 L74 23.5 L76.5 25 Z" fill="#f43f5e" opacity="0.6" />
              <path d="M78.5 24.5 L82 22.5 L81 26.5 Z" fill="#1e293b" />
              <path d="M79.2 25 L81.2 23.5 L80.5 26 Z" fill="#f43f5e" opacity="0.6" />
              {/* Focused emerald driver cat eyes */}
              <ellipse cx="76" cy="27.8" rx="0.8" ry="0.9" fill="#10b981" />
              <ellipse cx="79" cy="27.8" rx="0.8" ry="0.9" fill="#10b981" />
              <line x1="76" y1="27.2" x2="76" y2="28.4" stroke="#064e3b" strokeWidth="0.4" />
              <line x1="79" y1="27.2" x2="79" y2="28.4" stroke="#064e3b" strokeWidth="0.4" />
              <circle cx="75.8" cy="27.5" r="0.25" fill="#ffffff" />
              <circle cx="78.8" cy="27.5" r="0.25" fill="#ffffff" />
              {/* Driver Cat Whiskers */}
              <line x1="75.5" y1="29.2" x2="71.5" y2="28.5" stroke="#ffffff" strokeWidth="0.4" opacity="0.8" />
              <line x1="75.5" y1="30" x2="71" y2="30.5" stroke="#ffffff" strokeWidth="0.4" opacity="0.8" />
              <line x1="79.5" y1="29.2" x2="83.5" y2="28.5" stroke="#ffffff" strokeWidth="0.4" opacity="0.8" />
              <line x1="79.5" y1="30" x2="84" y2="30.5" stroke="#ffffff" strokeWidth="0.4" opacity="0.8" />
              {/* Steering Wheel */}
              <ellipse cx="82" cy="32" rx="2.4" ry="4" stroke="#64748b" strokeWidth="0.9" fill="none" />
              {/* Driver Cat Paws gripping steering wheel */}
              <ellipse cx="80.5" cy="31" rx="1.1" ry="0.9" fill="#ffffff" />
              <ellipse cx="82.8" cy="29.8" rx="1.1" ry="0.9" fill="#ffffff" />
            </g>

            {/* ============================================================== */}
            {/* === 3. THE CAT IN THE SUNROOF (STAR CAT LEANING OUT & WAVING) === */}
            {/* ============================================================== */}
            <g className="transition-transform duration-100">
              {/* Fluffy tail peeking up slightly behind in the breeze */}
              <path
                d={`M46 20 C${41 - hairBreeze} 17, ${38 - hairBreeze * 1.5} 12, ${42 - hairBreeze * 2} 8 C${44 - hairBreeze} 9, 46 14, 48 18 Z`}
                fill="url(#ginger-fur)"
              />
              {/* White tail tip */}
              <circle
                cx={41 - hairBreeze * 1.8}
                cy={8.5}
                r="1.8"
                fill="#ffffff"
              />

              {/* Ginger Tabby Torso in Sunroof */}
              <path
                d="M50 18 L48 27 L65 27 L63 18 C61 16, 52 16, 50 18 Z"
                fill="url(#ginger-fur)"
              />
              {/* White chest bib on sunroof cat */}
              <path
                d="M53.5 18 C53 22, 54 26, 56.5 27 C59 26, 60 22, 59.5 18 Z"
                fill="#ffffff"
              />

              {/* Chic Emerald Green Designer Collar with Gold Bell */}
              <path d="M52 19 Q56.5 21.5 61 19" stroke="#059669" strokeWidth="1.1" fill="none" />
              <circle cx="56.5" cy="21.5" r="1.3" fill="url(#gold-metal)" stroke="#92400e" strokeWidth="0.3" />
              <circle cx="56.5" cy="21.5" r="0.3" fill="#000000" />

              {/* Left Cat Paw Resting on the Sunroof Frame Lip */}
              <path
                d="M50 20 L44 24 L46 25.5 L52 22 Z"
                fill="url(#ginger-fur)"
              />
              {/* Soft white left paw with toe beans */}
              <ellipse cx="44" cy="24.5" rx="2.4" ry="1.6" fill="#ffffff" />
              <circle cx="43.2" cy="24" r="0.4" fill="#f472b6" />
              <circle cx="44" cy="23.8" r="0.4" fill="#f472b6" />
              <circle cx="44.8" cy="24.1" r="0.4" fill="#f472b6" />

              {/* Right Arm Happily Raised & Waving Out of the Sunroof */}
              <path
                d="M62 19 L69 13 L71.5 14.5 L65.5 21 Z"
                fill="url(#ginger-fur)"
              />
              {/* White waving cat paw with toe beans */}
              <ellipse
                cx="70.5"
                cy="12"
                rx="2.5"
                ry="2.4"
                fill="#ffffff"
                transform={`rotate(${hairBreeze * 4} 70.5 12)`}
              />
              {/* Cute little pink toe beans on waving paw */}
              <circle cx="69.8" cy="11.2" r="0.5" fill="#f472b6" transform={`rotate(${hairBreeze * 4} 70.5 12)`} />
              <circle cx="70.8" cy="10.8" r="0.5" fill="#f472b6" transform={`rotate(${hairBreeze * 4} 70.5 12)`} />
              <circle cx="71.7" cy="11.5" r="0.5" fill="#f472b6" transform={`rotate(${hairBreeze * 4} 70.5 12)`} />
              <ellipse cx="70.6" cy="12.6" rx="0.9" ry="0.7" fill="#f472b6" transform={`rotate(${hairBreeze * 4} 70.5 12)`} />

              {/* Sunroof Cat Neck & Head */}
              <ellipse cx="56.5" cy="12.5" rx="5.5" ry="5" fill="url(#ginger-fur)" />
              {/* Fluffy white cheeks */}
              <ellipse cx="53.5" cy="14" rx="2.5" ry="2" fill="#ffffff" />
              <ellipse cx="59.5" cy="14" rx="2.5" ry="2" fill="#ffffff" />

              {/* Pointed Cat Ears (animated with breeze) */}
              {/* Left Ear */}
              <path
                d={`M51 9.5 L${47 - hairBreeze * 0.4} 3 L55 6 Z`}
                fill="#ea580c"
              />
              <path
                d={`M51.5 8.8 L${48.5 - hairBreeze * 0.3} 4.2 L54.2 6.5 Z`}
                fill="#f472b6"
                opacity="0.75"
              />
              {/* Right Ear */}
              <path
                d={`M58 6 L${64 + hairBreeze * 0.4} 3 L62 9.5 Z`}
                fill="#ea580c"
              />
              <path
                d={`M58.8 6.5 L${63 + hairBreeze * 0.3} 4.2 L61.5 8.8 Z`}
                fill="#f472b6"
                opacity="0.75"
              />

              {/* Tabby forehead stripes */}
              <path d="M55.5 8 L56.5 10 L57.5 8" stroke="#c2410c" strokeWidth="0.6" strokeLinecap="round" fill="none" />
              <path d="M54.5 9 L56.5 11 L58.5 9" stroke="#c2410c" strokeWidth="0.5" strokeLinecap="round" fill="none" />

              {/* Chic Gold-Rim Sunglasses on Sunroof Cat */}
              <rect x="52.5" y="10.8" width="3.4" height="2.4" rx="0.9" fill="#0f172a" stroke="#d97706" strokeWidth="0.45" />
              <rect x="57.2" y="11" width="3.4" height="2.4" rx="0.9" fill="#0f172a" stroke="#d97706" strokeWidth="0.45" />
              <line x1="55.8" y1="11.8" x2="57.2" y2="11.8" stroke="#fbbf24" strokeWidth="0.6" />
              {/* Specular shine on shades */}
              <line x1="53.2" y1="11.4" x2="54.4" y2="11.4" stroke="#ffffff" strokeWidth="0.45" strokeLinecap="round" />
              <line x1="58" y1="11.6" x2="59.2" y2="11.6" stroke="#ffffff" strokeWidth="0.45" strokeLinecap="round" />

              {/* Cute Pink Nose */}
              <polygon points="56.5,14.2 55.7,13.4 57.3,13.4" fill="#f43f5e" />
              {/* Cat Mouth (Cute ':3' smile) */}
              <path d="M55.2 14.6 Q55.8 15.4 56.5 14.8 Q57.2 15.4 57.8 14.6" stroke="#be123c" strokeWidth="0.6" strokeLinecap="round" fill="none" />

              {/* Whiskers (Fluttering in the breeze) */}
              {/* Left Whiskers */}
              <line
                x1="53.5"
                y1="13.8"
                x2={46 - hairBreeze * 0.8}
                y2="12.5"
                stroke="#ffffff"
                strokeWidth="0.55"
                strokeLinecap="round"
              />
              <line
                x1="53"
                y1="14.6"
                x2={45.5 - hairBreeze * 0.9}
                y2="15.2"
                stroke="#ffffff"
                strokeWidth="0.55"
                strokeLinecap="round"
              />
              <line
                x1="53.5"
                y1="15.4"
                x2={47 - hairBreeze * 0.7}
                y2="17.2"
                stroke="#ffffff"
                strokeWidth="0.55"
                strokeLinecap="round"
              />
              {/* Right Whiskers */}
              <line
                x1="59.5"
                y1="13.8"
                x2={67 + hairBreeze * 0.8}
                y2="12.5"
                stroke="#ffffff"
                strokeWidth="0.55"
                strokeLinecap="round"
              />
              <line
                x1="60"
                y1="14.6"
                x2={67.5 + hairBreeze * 0.9}
                y2="15.2"
                stroke="#ffffff"
                strokeWidth="0.55"
                strokeLinecap="round"
              />
              <line
                x1="59.5"
                y1="15.4"
                x2={66 + hairBreeze * 0.7}
                y2="17.2"
                stroke="#ffffff"
                strokeWidth="0.55"
                strokeLinecap="round"
              />
            </g>

            {/* ============================================================== */}
            {/* === 4. THE EXPENSIVE WHITE CAR (ROOF, CABIN, & BODY) === */}
            {/* ============================================================== */}

            {/* Wide Open Panoramic Sunroof Aperture Well */}
            <rect x="41" y="25" width="27" height="3" rx="1.5" fill="#070a10" />

            {/* Open Sunroof Aerodynamic Glass Deflector (Tilted up) */}
            <polygon
              points="40,25.5 38,21.5 69,19.5 71,23"
              fill="#38bdf8"
              fillOpacity="0.3"
              stroke="#bae6fd"
              strokeWidth="0.6"
            />
            {/* Sunroof Specular Chrome Guide Rail */}
            <line x1="40" y1="25.5" x2="70" y2="23.5" stroke="#ffffff" strokeWidth="0.9" />

            {/* Luxury Grand Coupé Sweeping Roofline & Pillars */}
            <path
              d="M24 36 L39 25.5 L41 25.5 M70 23.5 L81 26.5 L93 36 Z"
              stroke="#e2e8f0"
              strokeWidth="1.3"
              fill="none"
            />

            {/* Front Windshield (Deep Privacy Tint with Light Gradient) */}
            <path
              d="M73 24.5 L92 36 L81 36 L69 24.5 Z"
              fill="url(#tinted-glass)"
            />

            {/* Frameless Side Windows with Fine Chrome Border */}
            <path
              d="M41 26.5 L67 24.5 L79 36 L29 36 C32 31.5, 36 28, 41 26.5 Z"
              fill="url(#tinted-glass)"
              stroke="#ffffff"
              strokeWidth="0.6"
            />
            {/* B-Pillar Gloss Shadow */}
            <line x1="56" y1="25.5" x2="56" y2="36" stroke="#090d16" strokeWidth="1.6" />

            {/* Backseat Kitten Paws resting on the rear window sill */}
            <ellipse cx="35" cy="35.5" rx="1.2" ry="0.9" fill="#ffffff" />
            <ellipse cx="38" cy="35.5" rx="1.2" ry="0.9" fill="#ffffff" />

            {/* === SCULPTED PEARL WHITE LUXURY BODYWORK === */}
            <path
              d="M9 46
                 C7.5 46, 6 44.5, 6 42
                 L7 38
                 C8 35.5, 10.5 34, 14 34
                 L27 34
                 C30.5 34, 34 32, 37 30.5
                 L43 27.5
                 C50 26.5, 68 25.5, 76 27
                 L92 32.5
                 C97 34, 103 35.5, 110 37.5
                 C114 38.5, 117 40.5, 118 42.5
                 L117.5 47
                 C117 49, 115 50.5, 110 50.5
                 L102 50.5
                 C102 43.5, 94.5 43.5, 94.5 50.5
                 L40 50.5
                 C40 43.5, 32.5 43.5, 32.5 50.5
                 L13.5 50.5
                 C11 50.5, 9 49, 9 46 Z"
              fill="url(#pearl-white-body)"
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />

            {/* High-End Gloss Body Reflection (Top Shoulder Line) */}
            <path
              d="M10 39.5 Q62 36 115 41"
              stroke="#ffffff"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />

            {/* Lower Chrome Side Skirt Aerodynamic Blade */}
            <path
              d="M13.5 49 L31.5 49 M41 49 L93.5 49 M103 49 L113 49"
              stroke="url(#chrome-trim)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Flush Integrated Luxury Door Handles */}
            <line x1="68" y1="36" x2="68" y2="47" stroke="#cbd5e1" strokeWidth="0.6" />
            <rect x="70" y="38.5" width="5" height="1.3" rx="0.65" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.45" />
            <rect x="47" y="38.5" width="5" height="1.3" rx="0.65" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.45" />

            {/* Front LED Matrix Laser Projector Headlight Assembly */}
            <path
              d="M108 37.5 L115 39.5 L111.5 42 L106 40 Z"
              fill="#ffffff"
              stroke="#93c5fd"
              strokeWidth="0.6"
            />
            {/* Twin Daytime Running Light (DRL) Jeweled Projectors */}
            <circle cx="109.5" cy="39.5" r="1.3" fill="#ffffff" />
            <circle cx="113" cy="40.3" r="1.3" fill="#7dd3fc" />

            {/* Sport Bumper Air Dam & Gloss Front Grille */}
            <path d="M113.5 42 L117 43 L115.5 48 L110 48 Z" fill="#090d16" />
            <line x1="113.5" y1="44" x2="117" y2="44" stroke="#94a3b8" strokeWidth="0.7" />
            <line x1="112.5" y1="46" x2="116" y2="46" stroke="#94a3b8" strokeWidth="0.7" />

            {/* Rear 3D OLED Taillight Ribbon */}
            <path
              d="M6.5 39 L12 39 L12 43 L8.5 43 L7 41 Z"
              fill="#ef4444"
              stroke="#fca5a5"
              strokeWidth="0.55"
            />
            {/* Dual Chrome Exhaust Tips */}
            <ellipse cx="6.5" cy="48.5" rx="2" ry="1.3" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.6" />
            <ellipse cx="8.5" cy="49" rx="1.5" ry="1" fill="#1e293b" />

            {/* ============================================================== */}
            {/* === 5. EXPENSIVE DIAMOND-CUT ALLOY WHEELS === */}
            {/* ============================================================== */}

            {/* FRONT ALLOY WHEEL */}
            <g>
              {/* Outer Performance Low-Profile Tire */}
              <circle cx="98" cy="50" r="8.2" fill="#090d16" stroke="#1e293b" strokeWidth="1" />
              {/* Ventilated Drilled Brake Disc */}
              <circle cx="98" cy="50" r="5.6" fill="#475569" />
              {/* Gold Performance Brake Caliper */}
              <path d="M96 46.8 A 5.5 5.5 0 0 1 100.8 46.8" stroke="#f59e0b" strokeWidth="2" fill="none" />
              {/* Polished Rim Lip */}
              <circle cx="98" cy="50" r="4.6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.65" />
              {/* Center Emblem Cap */}
              <circle cx="98" cy="50" r="1.8" fill="#0f172a" stroke="#ffffff" strokeWidth="0.5" />
              {/* Multi-Spoke Diamond-Cut Alloy Spokes */}
              <line
                x1="98"
                y1="44"
                x2="98"
                y2="56"
                stroke="#334155"
                strokeWidth="1.2"
                transform={`rotate(${wheelRotation} 98 50)`}
              />
              <line
                x1="92"
                y1="50"
                x2="104"
                y2="50"
                stroke="#334155"
                strokeWidth="1.2"
                transform={`rotate(${wheelRotation} 98 50)`}
              />
              <line
                x1="93.8"
                y1="45.8"
                x2="102.2"
                y2="54.2"
                stroke="#64748b"
                strokeWidth="0.9"
                transform={`rotate(${wheelRotation} 98 50)`}
              />
              <line
                x1="93.8"
                y1="54.2"
                x2="102.2"
                y2="45.8"
                stroke="#64748b"
                strokeWidth="0.9"
                transform={`rotate(${wheelRotation} 98 50)`}
              />
            </g>

            {/* REAR ALLOY WHEEL */}
            <g>
              {/* Outer Performance Low-Profile Tire */}
              <circle cx="36" cy="50" r="8.2" fill="#090d16" stroke="#1e293b" strokeWidth="1" />
              {/* Ventilated Drilled Brake Disc */}
              <circle cx="36" cy="50" r="5.6" fill="#475569" />
              {/* Gold Performance Brake Caliper */}
              <path d="M34 46.8 A 5.5 5.5 0 0 1 38.8 46.8" stroke="#f59e0b" strokeWidth="2" fill="none" />
              {/* Polished Rim Lip */}
              <circle cx="36" cy="50" r="4.6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.65" />
              {/* Center Emblem Cap */}
              <circle cx="36" cy="50" r="1.8" fill="#0f172a" stroke="#ffffff" strokeWidth="0.5" />
              {/* Multi-Spoke Diamond-Cut Alloy Spokes */}
              <line
                x1="36"
                y1="44"
                x2="36"
                y2="56"
                stroke="#334155"
                strokeWidth="1.2"
                transform={`rotate(${wheelRotation} 36 50)`}
              />
              <line
                x1="30"
                y1="50"
                x2="42"
                y2="50"
                stroke="#334155"
                strokeWidth="1.2"
                transform={`rotate(${wheelRotation} 36 50)`}
              />
              <line
                x1="31.8"
                y1="45.8"
                x2="40.2"
                y2="54.2"
                stroke="#64748b"
                strokeWidth="0.9"
                transform={`rotate(${wheelRotation} 36 50)`}
              />
              <line
                x1="31.8"
                y1="54.2"
                x2="40.2"
                y2="45.8"
                stroke="#64748b"
                strokeWidth="0.9"
                transform={`rotate(${wheelRotation} 36 50)`}
              />
            </g>
          </svg>
        </div>
      </div>
    </aside>
  );
};
