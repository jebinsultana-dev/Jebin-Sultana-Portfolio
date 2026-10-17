import React, { useState } from 'react';
import { writingSamples } from '../data/writingSamples';
import { ChevronDown, ChevronUp, ExternalLink, BookOpen, Layers } from 'lucide-react';
import { Interactive3DCard } from './Interactive3DCard';

interface WritingSectionProps {
  isExpandedDefault?: boolean;
}

export const WritingSection: React.FC<WritingSectionProps> = ({ isExpandedDefault = false }) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedDefault);
  const [visibleCount, setVisibleCount] = useState(6);

  const totalSamples = writingSamples.length;
  const currentSamples = writingSamples.slice(0, visibleCount);
  const hasMore = visibleCount < totalSamples;
  const canShowLess = visibleCount > 6;

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, totalSamples));
  };

  const handleShowLess = () => {
    setVisibleCount(6);
  };

  return (
    <div id="writing-section" className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6 md:p-8 transition-all">
      {/* Category Card Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400 mb-2">
            <span>Research</span>
            <span aria-hidden="true">·</span>
            <span>SEO</span>
            <span aria-hidden="true">·</span>
            <span>Content Strategy</span>
            <span aria-hidden="true">·</span>
            <span>Editing</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
            Writing & Content
          </h3>
          <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
            Articles, SEO content, service pages, landing pages, technical writing, glossaries, and editing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsExpanded(!isExpanded);
            if (!isExpanded && visibleCount < 3) setVisibleCount(3);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 border border-sky-500/30 transition-all shrink-0 active:scale-95 shadow-sm cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>{isExpanded ? 'Collapse Writing Samples' : 'Explore Writing & Content Samples'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Inline Samples */}
      {isExpanded && (
        <div className="mt-8 pt-2 animate-in fade-in duration-300">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
            <p className="text-slate-300 font-medium">
              A selection of published work across SEO, technical writing, and content strategy.
            </p>
            <div className="font-mono text-slate-400 shrink-0">
              Showing {visibleCount} of {totalSamples} curated samples
            </div>
          </div>

          {/* Sample Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentSamples.map((sample) => (
              <Interactive3DCard
                key={sample.id}
                intensity={8}
                className="rounded-2xl p-6 bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-md group"
              >
                <div>
                  {/* Category / Format Label & Number */}
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-3 font-mono">
                    <span className="text-sky-400 font-medium">{sample.formatLabel}</span>
                    <span className="text-slate-500">{sample.number}</span>
                  </div>

                  {/* Article Title */}
                  <h4 className="text-lg font-display font-bold text-white group-hover:text-sky-200 transition-colors leading-snug">
                    {sample.title}
                  </h4>

                  {/* Client & Role */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="text-slate-200 font-medium">{sample.client}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">{sample.role}</span>
                  </div>

                  {/* How I Approached Note */}
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                    <span className="text-slate-400 font-medium block mb-1">How I approached:</span>
                    {sample.approach}
                  </div>
                </div>

                {/* Direct Link */}
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  {sample.link ? (
                    <a
                      href={sample.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                    >
                      <span>Read original article</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500">
                      <span>Article link pending</span>
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-slate-400">
                    {sample.client}
                  </span>
                </div>
              </Interactive3DCard>
            ))}
          </div>

          {/* Show More & Show Less Inline Controls */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {hasMore && (
              <button
                type="button"
                onClick={handleShowMore}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 transition-all shadow-md active:scale-95"
              >
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Show More ({totalSamples - visibleCount} remaining)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}

            {canShowLess && (
              <button
                type="button"
                onClick={handleShowLess}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-sm border border-slate-800 transition-all active:scale-95"
              >
                <span>Show Less</span>
                <ChevronUp className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
