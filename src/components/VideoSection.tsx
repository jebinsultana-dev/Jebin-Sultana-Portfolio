import React from 'react';
import { videoSamples } from '../data/videoSamples';
import { Video, Play, ExternalLink } from 'lucide-react';
import { Interactive3DCard } from './Interactive3DCard';

export const VideoSection: React.FC = () => {
  return (
    <div id="video-section" className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6 md:p-8 transition-all space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-2">
            <Video className="w-4 h-4" />
            <span>SCRIPTWRITING & AUDIOVISUAL</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            Scriptwriting & Video Production
          </h3>
          <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
            Concepts, treatments, character arcs, visual storytelling cues, and voiceover scripts designed for high retention.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {videoSamples.map((sample) => (
          <Interactive3DCard
            key={sample.id}
            intensity={6}
            className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  {sample.category}
                </span>
                <span className="text-xs font-mono text-slate-500">#{sample.number}</span>
              </div>

              <h4 className="text-base font-bold text-white mb-2 leading-snug">{sample.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{sample.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-amber-300">{sample.highlight}</span>
              <span>{sample.duration}</span>
            </div>
          </Interactive3DCard>
        ))}
      </div>
    </div>
  );
};
