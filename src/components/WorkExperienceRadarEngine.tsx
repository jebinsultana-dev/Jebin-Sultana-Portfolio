import React, { useEffect, useRef, useState } from 'react';
import { Target, Search, Clapperboard, ShoppingBag, HeartHandshake, Zap, Sparkles } from 'lucide-react';

interface DisciplineHub {
  id: string;
  name: string;
  shortLabel: string;
  angle: number; // in radians
  distance: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  glow: string;
  problemSolved: string;
  metric: string;
}

export const WorkExperienceRadarEngine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredHub, setHoveredHub] = useState<DisciplineHub | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState(420);

  const hubs: DisciplineHub[] = [
    {
      id: 'seo',
      name: 'SEO & Content Strategy',
      shortLabel: 'Content & SEO',
      angle: 0.8, // Top-Right
      distance: 145,
      icon: Search,
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.5)',
      problemSolved: 'Clarifying technical complexities into high-ranking, readable guides without jargon bloat.',
      metric: '1000+ Articles Written & Edited',
    },
    {
      id: 'scripts',
      name: 'Scriptwriting & Storytelling',
      shortLabel: 'Video Scripts',
      angle: 2.3, // Top-Left
      distance: 145,
      icon: Clapperboard,
      color: '#f43f5e',
      glow: 'rgba(244, 63, 94, 0.5)',
      problemSolved: 'Connecting words on a page directly to audience attention across real estate and education.',
      metric: 'Hybrid Real Estate Production',
    },
    {
      id: 'ecom',
      name: 'E-commerce Operations',
      shortLabel: 'Shopify & Logistics',
      angle: 3.9, // Bottom-Left
      distance: 145,
      icon: ShoppingBag,
      color: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.5)',
      problemSolved: 'Resolving transit exceptions, order bottlenecks, and courier handoffs before issues escalate.',
      metric: 'Active Store Operations',
    },
    {
      id: 'cx',
      name: 'Customer Experience',
      shortLabel: 'Support & Retention',
      angle: 5.4, // Bottom-Right
      distance: 145,
      icon: HeartHandshake,
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.5)',
      problemSolved: 'Transforming customer friction into brand trust through empathetic, accurate communication.',
      metric: 'High-Volume Resolution',
    },
  ];

  // Canvas radar animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 460);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      setContainerWidth(width);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Pulse packets traveling along connecting cross-discipline arcs
    const packetCount = 18;
    const packets = Array.from({ length: packetCount }, (_, i) => ({
      fromIdx: i % 4,
      toIdx: (i + 1) % 4,
      progress: Math.random(),
      speed: 0.006 + Math.random() * 0.008,
      size: 2.2,
    }));

    let radarAngle = 0;
    let tick = 0;

    const render = () => {
      tick++;
      radarAngle += 0.012;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(1, Math.max(0.6, width / 440));

      // 1. Concentric Calibration Radar Rings
      const ringRadii = [40 * scale, 80 * scale, 115 * scale, 150 * scale];
      ringRadii.forEach((r, idx) => {
        ctx.strokeStyle = `rgba(51, 65, 85, ${0.35 - idx * 0.06})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs tick marks
        ctx.fillStyle = 'rgba(71, 85, 105, 0.4)';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          const tx = centerX + Math.cos(a) * r;
          const ty = centerY + Math.sin(a) * r;
          ctx.beginPath();
          ctx.arc(tx, ty, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 2. Sweeping Radar Beam (Problem Scanning Arc)
      if (isFinite(centerX) && isFinite(centerY)) {
        const beamGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 160 * scale);
        beamGrad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
        beamGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.15)');
        beamGrad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, 160 * scale, radarAngle, radarAngle + 0.5);
        ctx.closePath();
        ctx.fillStyle = beamGrad;
        ctx.fill();
        ctx.restore();
      }

      // 3. Connective Vectors between the 4 Discipline Hubs
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.25)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 4; i++) {
        const next = (i + 1) % 4;
        const d1 = hubs[i].distance * scale;
        const d2 = hubs[next].distance * scale;
        const x1 = centerX + Math.cos(hubs[i].angle) * d1;
        const y1 = centerY + Math.sin(hubs[i].angle) * d1;
        const x2 = centerX + Math.cos(hubs[next].angle) * d2;
        const y2 = centerY + Math.sin(hubs[next].angle) * d2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Connect to center core
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }

      // 4. Moving Pulses between Hubs (Active Cross-Pollination)
      packets.forEach(p => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const h1 = hubs[p.fromIdx];
        const h2 = hubs[p.toIdx];
        const d1 = h1.distance * scale;
        const d2 = h2.distance * scale;
        const x1 = centerX + Math.cos(h1.angle) * d1;
        const y1 = centerY + Math.sin(h1.angle) * d1;
        const x2 = centerX + Math.cos(h2.angle) * d2;
        const y2 = centerY + Math.sin(h2.angle) * d2;

        const px = x1 + (x2 - x1) * p.progress;
        const py = y1 + (y2 - y1) * p.progress;

        ctx.fillStyle = h1.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Glowing tail
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Central 5+ Years Core Glow
      const corePulse = Math.max(1, 26 + Math.sin(tick * 0.08) * 3);
      if (isFinite(centerX) && isFinite(centerY) && isFinite(corePulse)) {
        const coreGrad = ctx.createRadialGradient(centerX, centerY, 8, centerX, centerY, corePulse);
        coreGrad.addColorStop(0, '#f59e0b');
        coreGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.4)');
        coreGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, corePulse, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMouseOffset({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-square max-w-[480px] mx-auto select-none rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl p-4 flex items-center justify-center overflow-hidden"
      style={{
        transform: `perspective(900px) rotateX(${mouseOffset.y * -7}deg) rotateY(${mouseOffset.x * 7}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      title="Problem-Solving Radar: Hover discipline hubs to inspect capabilities"
    >
      {/* Background Animated Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Central 5+ Years Nucleus */}
      <div className="absolute z-20 flex flex-col items-center justify-center p-3 rounded-full bg-slate-950/95 border border-amber-400/60 shadow-xl shadow-amber-500/20 text-center pointer-events-none w-24 h-24">
        <Target className="w-4 h-4 text-amber-400 mb-0.5" />
        <span className="text-xs font-display font-extrabold text-white leading-none">5+ YEARS</span>
        <span className="text-[9px] font-mono text-amber-300 uppercase tracking-tighter mt-1">STANDARDS</span>
      </div>

      {/* 4 Orbiting Discipline Hub Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {hubs.map((hub) => {
          const scaleFactor = Math.min(1, Math.max(0.6, containerWidth / 440));
          const effectiveDist = hub.distance * scaleFactor;
          const x = Math.cos(hub.angle) * effectiveDist;
          const y = Math.sin(hub.angle) * effectiveDist;
          const isHovered = hoveredHub?.id === hub.id;
          const Icon = hub.icon;

          return (
            <div
              key={hub.id}
              className="absolute pointer-events-auto"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                zIndex: isHovered ? 40 : 25,
              }}
              onMouseEnter={() => setHoveredHub(hub)}
              onMouseLeave={() => setHoveredHub(null)}
            >
              <div
                className={`group flex items-center gap-2 p-2 px-3 rounded-2xl bg-slate-950/90 border transition-all duration-300 shadow-xl cursor-pointer ${
                  isHovered ? 'scale-115 ring-2 ring-offset-2 ring-offset-slate-950' : 'hover:scale-105'
                }`}
                style={{
                  borderColor: isHovered ? hub.color : 'rgba(255, 255, 255, 0.18)',
                  boxShadow: `0 0 20px ${hub.glow}`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${hub.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: hub.color }} />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-bold text-white leading-tight">
                    {hub.shortLabel}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">
                    Active
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hovered Discipline Detail Overlay Banner */}
      {hoveredHub ? (
        <div className="absolute bottom-3 left-4 right-4 z-40 pointer-events-none p-3.5 rounded-2xl bg-slate-950/95 border border-slate-700 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest font-semibold" style={{ color: hoveredHub.color }}>
              {hoveredHub.name}
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
              {hoveredHub.metric}
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-snug">
            {hoveredHub.problemSolved}
          </p>
        </div>
      ) : (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-[10px] font-mono text-slate-500 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
          Hover discipline nodes to inspect execution
        </div>
      )}
    </div>
  );
};
