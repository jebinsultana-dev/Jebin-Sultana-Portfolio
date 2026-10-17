import React, { useState } from 'react';
import { PenTool, PackageCheck, Compass, CheckCircle2, ArrowRight, Sparkles, Layers } from 'lucide-react';

interface HeroShowcaseProps {
  onExploreWork?: () => void;
  onExploreCuriosity?: () => void;
}

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({
  onExploreWork,
  onExploreCuriosity,
}) => {
  const [activeTab, setActiveTab] = useState<'writing' | 'operations' | 'curiosity'>('writing');

  return (
    <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden">
      {/* Ambient background glow based on active tab */}
      <div
        className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          activeTab === 'writing'
            ? 'bg-sky-500/10'
            : activeTab === 'operations'
            ? 'bg-amber-500/10'
            : 'bg-purple-500/10'
        }`}
      />

      <div>
        {/* Header with interactive segmented mode switcher */}
        <div className="flex items-center justify-between gap-2 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="ml-2 text-xs font-mono text-slate-400">overview.workspace</span>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            5+ YRS EXP
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 my-6 bg-slate-950/80 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab('writing')}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'writing'
                ? 'bg-slate-850 text-sky-300 border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Writing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('operations')}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'operations'
                ? 'bg-slate-850 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Operations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('curiosity')}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'curiosity'
                ? 'bg-slate-850 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Curiosity
          </button>
        </div>

        {/* Content based on Active Tab */}
        {activeTab === 'writing' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Content Strategy & Writing</h3>
                <p className="text-xs font-mono text-slate-400">Articles · Technical SEO · Video Scripts</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              "Making complicated things easier to understand, from SDLC architecture and AI agents to real estate storytelling."
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <div className="font-mono text-sky-400 text-[11px] mb-0.5">EXPERIENCE</div>
                <div className="text-slate-200 font-semibold">30+ Websites · 1000+ Articles</div>
                <div className="text-[11px] text-slate-400">Tech, SEO & Case Studies</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <div className="font-mono text-sky-400 text-[11px] mb-0.5">PROGRESSION</div>
                <div className="text-slate-200 font-semibold">Junior → Senior Editor</div>
                <div className="text-[11px] text-slate-400">Graphic Design Eye</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'operations' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">E-Commerce & Digital Ops</h3>
                <p className="text-xs font-mono text-slate-400">Shopify · Pathao Logistics · Support</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              "Keeping messy processes under control and figuring out what needs fixing before it becomes everyone's problem."
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <div className="font-mono text-amber-400 text-[11px] mb-0.5">ACTIVE ROLE</div>
                <div className="text-slate-200 font-semibold">YOKAI Clothing BD</div>
                <div className="text-[11px] text-slate-400">Operations & CX Executive</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <div className="font-mono text-amber-400 text-[11px] mb-0.5">EXPERIENCE</div>
                <div className="text-slate-200 font-semibold">Apar's Classroom</div>
                <div className="text-[11px] text-slate-400">Student Support & Ops</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curiosity' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Rabbit Holes & Research</h3>
                <p className="text-xs font-mono text-slate-400">Cinema · History · Philosophy · Music</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              "One question can turn into twenty open tabs, three unexpected connections, and a suspicious amount of research."
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <div className="font-mono text-purple-400 text-[11px] mb-0.5">ONGOING ARCHIVE</div>
                <div className="text-slate-200 font-semibold">Open Investigations</div>
                <div className="text-[11px] text-slate-400">Philosophy, Culture & Ideas</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
                <div className="font-mono text-purple-400 text-[11px] mb-0.5">ETHOS</div>
                <div className="text-slate-200 font-semibold">Serious Ambition</div>
                <div className="text-[11px] text-slate-400">Developing personality</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer verification check */}
      <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Curated Standard & Clarity</span>
        </span>
        <span>Dhaka, Bangladesh</span>
      </div>
    </div>
  );
};
