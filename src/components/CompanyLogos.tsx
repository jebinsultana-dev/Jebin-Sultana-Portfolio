import React, { useState } from 'react';
import { companies } from '../data/companyData';
import { CompanyRole } from '../types';
import { Sparkles, Briefcase } from 'lucide-react';
import { Interactive3DCard } from './Interactive3DCard';
import { renderCompanyLogo } from './CompanyBrandLogos';

export const CompanyLogos: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyRole | null>(null);
  const [hoveredCompanyId, setHoveredCompanyId] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono tracking-widest text-amber-400 uppercase mb-2">
              COMPANIES & ROLES
            </div>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight">
              A few familiar names. Not the whole story.
            </h2>
            <p className="mt-3 text-slate-400 text-sm md:text-base max-w-xl">
              Some companies and teams I've worked with, and a few I'm still working with. Hover or tap to see the role behind each one.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 shrink-0 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive · Tap/Hover to inspect role</span>
          </div>
        </div>

        {/* Company Grid with 3D Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {companies.map((comp) => {
            const isHovered = hoveredCompanyId === comp.id;
            const isSelected = selectedCompany?.id === comp.id;
            const isActive = isHovered || isSelected;

            return (
              <div
                key={comp.id}
                onMouseEnter={() => setHoveredCompanyId(comp.id)}
                onMouseLeave={() => setHoveredCompanyId(null)}
                onClick={() => setSelectedCompany(comp)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCompany(comp);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${comp.name}: ${comp.role}`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl"
              >
                <Interactive3DCard
                  intensity={10}
                  className="h-full p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between bg-slate-900/60 border-slate-800/80 hover:border-slate-700/90 hover:bg-slate-900/90"
                >
                  <div>
                    {/* Header: Official Brand Logo & Role Icon */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      {/* Official Company Logo with Main Brand Color Backdrop */}
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center p-2.5 border transition-all duration-300 group-hover:scale-105 shrink-0"
                        style={{
                          backgroundColor: `${comp.accentColor}12`,
                          borderColor: `${comp.accentColor}45`,
                          boxShadow: `0 4px 20px ${comp.accentColor}25`,
                        }}
                      >
                        {renderCompanyLogo(comp.id, 'w-9 h-9')}
                      </div>

                      <Briefcase className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                    </div>

                    {/* Company Name with Main Brand Accent Pip */}
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: comp.accentColor }}
                      />
                      <h3 className="font-display font-bold text-base text-white">
                        {comp.name}
                      </h3>
                    </div>
                  </div>

                  {/* Role Container: Revealed on interaction, with default preview for accessibility */}
                  <div className="mt-5 pt-3 border-t border-slate-800/60">
                    <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                      Role Behind It
                    </div>
                    <div
                      className="text-sm font-medium transition-colors duration-200"
                      style={{
                        color: isActive ? comp.accentColor : '#cbd5e1',
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      {comp.role}
                    </div>

                    {/* Additional context tooltip on click/hover */}
                    <div className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {comp.description}
                    </div>
                  </div>
                </Interactive3DCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
