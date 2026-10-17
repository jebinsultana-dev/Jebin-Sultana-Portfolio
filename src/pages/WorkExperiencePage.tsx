import React from 'react';
import { PageRoute } from '../types';
import { companyRoles } from '../data/companyData';
import { HeroMotionBackground } from '../components/HeroMotionBackground';
import { ContactFooter } from '../components/ContactFooter';
import { WritingSection } from '../components/WritingSection';
import { EcommerceSection } from '../components/EcommerceSection';
import { VideoSection } from '../components/VideoSection';
import { Interactive3DCard } from '../components/Interactive3DCard';
import { Briefcase, ArrowLeft, Calendar, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface WorkExperiencePageProps {
  onNavigate: (page: PageRoute) => void;
}

export const WorkExperiencePage: React.FC<WorkExperiencePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-amber-400/20 selection:text-amber-200">
      {/* Header Section */}
      <section className="relative pt-16 md:pt-24 pb-16 overflow-hidden border-b border-slate-800">
        <HeroMotionBackground theme="work" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </button>

          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-sky-400 uppercase">
            <Briefcase className="w-4 h-4" />
            <span>5+ YEARS OF MULTIDISCIPLINARY WORK</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
            Work Experience & Portfolios
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl">
            A track record combining precision operations, strategic copywriting, scriptwriting, and customer experience. Here is the work, the structure, and the proof.
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Roles Timeline */}
        <section className="space-y-6">
          <div className="text-xs font-mono tracking-wider text-slate-400 uppercase">
            CAREER CHRONICLE
          </div>

          <div className="space-y-4">
            {companyRoles.map((role) => (
              <Interactive3DCard
                key={role.id}
                intensity={4}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
                  <div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 mr-2">
                      {role.badge}
                    </span>
                    <h3 className="text-lg font-bold text-white inline">{role.name}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{role.period}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-sm font-semibold text-amber-300 mb-1">{role.role}</div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{role.description}</p>
                </div>
              </Interactive3DCard>
            ))}
          </div>
        </section>

        {/* E-Commerce Operations */}
        <EcommerceSection />

        {/* Writing Samples */}
        <WritingSection isExpandedDefault={true} />

        {/* Video / Scripts */}
        <VideoSection />
      </div>

      <ContactFooter />
    </div>
  );
};
