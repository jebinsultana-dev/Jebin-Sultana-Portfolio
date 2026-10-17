import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Sparkles, Moon, Sun, Flame, BookOpen, Coffee, Lightbulb } from 'lucide-react';
import { PageRoute } from '../types';
import heroWriterImg from '../assets/images/hero_motionsite_writer_1791652154496.jpg';

interface AliveHeroStageProps {
  onNavigate: (page: PageRoute) => void;
  onScrollToContact: () => void;
}

export const AliveHeroStage: React.FC<AliveHeroStageProps> = ({
  onNavigate,
  onScrollToContact,
}) => {
  // Theme / Atmosphere Mode (like the video sample: Tranquility / Twilight / Golden Hour)
  const [atmosphere, setAtmosphere] = useState<'twilight' | 'golden' | 'midnight'>('twilight');

  // Interactive desk hotspot triggers
  const [lanternLit, setLanternLit] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [steamParticles, setSteamParticles] = useState<{ id: number; y: number; x: number; opacity: number }[]>([]);

  // Mouse Parallax for the diorama
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  // Parallax tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({ x, y });
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  // Rising steam effect for coffee mug
  useEffect(() => {
    const interval = setInterval(() => {
      setSteamParticles((prev) => {
        const next = prev
          .map((p) => ({ ...p, y: p.y - 1.5, opacity: p.opacity - 0.04 }))
          .filter((p) => p.opacity > 0);
        if (next.length < 5) {
          next.push({
            id: Date.now() + Math.random(),
            y: 0,
            x: (Math.random() - 0.5) * 8,
            opacity: 0.8,
          });
        }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-8 pb-16 md:py-20 border-b border-slate-800/80 bg-gradient-to-b from-[#060911] via-[#090d16] to-[#060911] overflow-hidden">
      {/* Background ambient lighting matching active atmosphere */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
          atmosphere === 'twilight'
            ? 'bg-indigo-600/15'
            : atmosphere === 'golden'
            ? 'bg-amber-500/15'
            : 'bg-emerald-600/10'
        }`}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: CRYSTAL-CLEAR STRUCTURED CONTENT & CTAS */}
          <div className="lg:col-span-7 space-y-6">
            {/* Atmosphere Selector Tabs (Like the motion video reference) */}
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-900/90 border border-slate-800 w-fit backdrop-blur-md shadow-lg">
              <span className="text-[11px] font-mono text-slate-400 pl-2 pr-1">Atmosphere:</span>
              <button
                type="button"
                onClick={() => setAtmosphere('twilight')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  atmosphere === 'twilight'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-3 h-3 text-indigo-400" />
                <span>Twilight</span>
              </button>

              <button
                type="button"
                onClick={() => setAtmosphere('golden')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  atmosphere === 'golden'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-3 h-3 text-amber-400" />
                <span>Golden Hour</span>
              </button>

              <button
                type="button"
                onClick={() => setAtmosphere('midnight')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  atmosphere === 'midnight'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Midnight Ops</span>
              </button>
            </div>

            {/* Header Label */}
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase pt-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>JEBIN SULTANA · WRITING × OPERATIONS</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.08] text-balance">
              Good words. <br />
              Smooth operations. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">
                Very little guesswork.
              </span>
            </h1>

            {/* Introduction Copy */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              I'm Jebin Sultana, a content professional and e-commerce operations specialist with 5+ years of professional experience in content creation, customer experience, and digital operations.
            </p>

            {/* Two Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('work')}
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-400/20 active:scale-95 cursor-pointer"
              >
                <span>Check what I've done</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                type="button"
                onClick={onScrollToContact}
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-semibold text-sm border border-slate-700/80 hover:border-slate-500 transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <span>Contact Me</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 transition-colors" />
              </button>
            </div>

            {/* Supporting Line */}
            <p className="text-xs font-mono text-slate-400 pt-1">
              A little scrolling may lead somewhere interesting.
            </p>

            {/* Live Operational Capability Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
              <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Shopify & Pathao Operations</span>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>SEO Content & Editorial</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ALIVE, STRUCTURED MOTION DIORAMA STAGE */}
          <div className="lg:col-span-5 relative">
            <div
              ref={stageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative rounded-3xl p-3 bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-slate-700/80 shadow-2xl backdrop-blur-xl overflow-hidden group select-none"
            >
              {/* Top Window Bar */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-slate-300 font-medium">jebin-workspace.motion</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Interactive Live Stage</span>
                </div>
              </div>

              {/* Diorama Screen */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 mt-2">
                {/* Layer 1: Illustrated Scene with Mouse Parallax Shift */}
                <div
                  className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out will-change-transform"
                  style={{
                    transform: `scale(1.06) translate3d(${parallax.x * -10}px, ${parallax.y * -8}px, 0)`,
                  }}
                >
                  <img
                    src={heroWriterImg}
                    alt="Jebin Sultana Living Workspace"
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      atmosphere === 'twilight'
                        ? 'filter brightness-[0.95] contrast-[1.05]'
                        : atmosphere === 'golden'
                        ? 'filter brightness-[1.08] sepia-[0.2]'
                        : 'filter brightness-[0.88] hue-rotate-[40deg]'
                    }`}
                  />
                </div>

                {/* Layer 2: Animated Lantern Glow (Interactive Click) */}
                <div
                  className={`absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full pointer-events-none transition-opacity duration-500 ${
                    lanternLit ? 'opacity-90 bg-amber-400/25 blur-2xl' : 'opacity-20 bg-amber-600/10 blur-xl'
                  }`}
                />

                {/* Layer 3: Interactive Hotspot 1 — Lantern Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setLanternLit(!lanternLit);
                    setActiveHotspot('Lantern toggled: Adjusting workspace warmth');
                  }}
                  className="absolute top-[49%] left-[51%] -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-amber-400/20 hover:bg-amber-400/40 border border-amber-300/60 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
                  title="Click to toggle desk lantern warmth"
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                </button>

                {/* Hotspot 2 — Stacked Books / Research Notes */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveHotspot('“Every project has a story. The goal is clarity without losing technical depth.”');
                  }}
                  className="absolute top-[64%] left-[32%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-sky-500/25 hover:bg-sky-500/45 border border-sky-300/60 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90"
                  title="Click to inspect research notebooks"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-200" />
                </button>

                {/* Hotspot 3 — Steam from Coffee Mug */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveHotspot('Fueling: Fresh cup brewed for deep editorial focus');
                  }}
                  className="absolute top-[59%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500/25 hover:bg-purple-500/45 border border-purple-300/60 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90 relative"
                  title="Click coffee mug"
                >
                  <Coffee className="w-3.5 h-3.5 text-purple-200" />
                  {/* Rising steam particles */}
                  {steamParticles.map((p) => (
                    <span
                      key={p.id}
                      className="absolute w-1.5 h-1.5 rounded-full bg-white/70 blur-[0.5px] pointer-events-none"
                      style={{
                        transform: `translate(${p.x}px, ${p.y - 12}px)`,
                        opacity: p.opacity,
                      }}
                    />
                  ))}
                </button>

                {/* Floating Interactive Micro-toast in Diorama */}
                {activeHotspot && (
                  <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-xl bg-slate-950/90 border border-amber-400/40 backdrop-blur-md text-xs text-amber-200 flex items-start gap-2 shadow-2xl animate-in fade-in duration-200">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 text-[11px] font-mono leading-relaxed">
                      {activeHotspot}
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveHotspot(null)}
                      className="text-slate-400 hover:text-white text-xs ml-1 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Diorama Caption & Hotspot Prompts */}
              <div className="mt-2.5 px-2 py-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Tap glowing icons to interact with the desk</span>
                <span className="text-amber-400 font-semibold">Parallax 3D Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
