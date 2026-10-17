import React from 'react';
import { PageRoute } from '../types';
import { HeroMotionBackground } from '../components/HeroMotionBackground';
import { ContactFooter } from '../components/ContactFooter';
import { Interactive3DCard } from '../components/Interactive3DCard';
import { ArrowUpRight, Compass, Sparkles, BookOpen, Layers, Terminal, GraduationCap, Target, Cpu, User, Hash, Linkedin, Facebook, Instagram, Link2 } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageRoute, targetSectionId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const scrollToContact = () => {
    const el = document.getElementById('contact-footer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-amber-400/20 selection:text-amber-200">
      {/* SECTION 01 — HERO */}
      <section className="relative pt-16 md:pt-28 pb-20 md:pb-32 overflow-hidden border-b border-slate-800/80">
        {/* Animated Peaceful Sky Motion Background */}
        <HeroMotionBackground theme="home" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-7">
          {/* Header Label */}
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
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

          {/* Introduction */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            I'm Jebin Sultana, a content professional and e-commerce operations specialist with 5+ years of professional experience in content creation, customer experience, and digital operations.
          </p>

          {/* Two Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('work')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-400/20 active:scale-95"
            >
              <span>Check what I've done</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/80 transition-all hover:border-slate-600 active:scale-95"
            >
              <span>Contact Me</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Supporting Line */}
          <p className="text-xs font-mono text-slate-500 pt-1">
            A little scrolling may lead somewhere interesting.
          </p>
        </div>
      </section>

      {/* SECTION 02 — ABOUT */}
      <section id="about-section" className="py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto px-6">
          {/* Section Label */}
          <div className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-3">
            A LITTLE ABOUT ME
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight text-balance">
            Professionally, I have my life together. <br />
            <span className="text-slate-400">The rest is an ongoing investigation.</span>
          </h2>

          {/* Full Copy: Section 1 */}
          <div className="mt-10 space-y-5 text-slate-300 text-base md:text-lg leading-relaxed">
            <p>
              I'm Jebin Sultana. I write, edit, work with e-commerce operations, and have a habit of getting curious about things that were absolutely not on today's agenda.
            </p>
            <p>
              For over 5 years, I've worked across content, communication, customer experience, and digital operations. I like making complicated things easier to understand, keeping messy processes under control, and figuring out what needs fixing before it becomes everyone's problem.
            </p>
            <p className="italic text-slate-200">
              I enjoy making sense of things. I also enjoy making absolutely no sense, recreationally.
            </p>
          </div>

          {/* Profile Snapshot & Academic Dossier */}
          <div className="mt-12 p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
                <User className="w-3.5 h-3.5" />
                <span>PROFILE SNAPSHOT</span>
              </div>
              <span className="text-xs font-mono text-slate-500">2025–2029 · DIU</span>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400 mb-1">FULL NAME</div>
                <div className="text-base font-bold text-white">Jebin Sultana</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400 mb-1">NICKNAME</div>
                <div className="text-base font-bold text-amber-300">Jebs</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-purple-400" />
                  <span>FAVORITE NUMBER</span>
                </div>
                <div className="text-base font-bold text-purple-300">5</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-sky-400" />
                  <span>EDUCATION</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 leading-snug">
                  B.Sc. in Software Engineering
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Daffodil International University (DIU), 2025–2029
                </div>
              </div>
            </div>

            {/* Detailed Profile Rows: Research Interests, Current Focus, Long-Term Goal, Connect */}
            <div className="space-y-4 pt-2">
              {/* Research Interests */}
              <div className="p-4 md:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>RESEARCH INTERESTS</span>
                </div>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                  Distributed Systems and Machine Learning Systems (ML Systems), with an interest in scalable AI infrastructure and high-performance computing.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Distributed Systems', 'ML Systems', 'Scalable AI Infrastructure', 'High-Performance Computing'].map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-purple-950/50 border border-purple-500/30 text-purple-300"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Focus */}
              <div className="p-4 md:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CURRENT FOCUS</span>
                </div>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                  Strengthening software engineering and computer science fundamentals, maintaining academic excellence, and building a strong foundation in Distributed Systems and ML Systems while balancing university studies and professional work.
                </p>
              </div>

              {/* Long-Term Goal */}
              <div className="p-4 md:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-mono text-sky-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>LONG-TERM GOAL</span>
                </div>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed">
                  To become a high-impact engineer specializing in Distributed Systems and ML Systems, contribute to scalable AI infrastructure, pursue international research opportunities through a master’s degree and potentially a PhD, build a successful business, and achieve financial independence.
                </p>
              </div>

              {/* Connect */}
              <div className="p-4 md:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" />
                  <span>CONNECT</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://www.linkedin.com/in/jebinsultana/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-sm font-medium text-slate-200 hover:text-white transition-all group hover:border-sky-500/50"
                  >
                    <Linkedin className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                  </a>

                  <a
                    href="https://www.facebook.com/jebinsultanaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-sm font-medium text-slate-200 hover:text-white transition-all group hover:border-blue-500/50"
                  >
                    <Facebook className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span>Facebook</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                  </a>

                  <a
                    href="https://www.instagram.com/me.jebs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-sm font-medium text-slate-200 hover:text-white transition-all group hover:border-pink-500/50"
                  >
                    <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                    <span>Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* A few things you'll probably figure out about me (Interactive 3D Bento Cards) */}
          <div className="mt-16 pt-12 border-t border-slate-800/80">
            <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-8">
              A few things you'll probably figure out about me.
            </h3>

            <div className="space-y-6">
              {/* Point 1 */}
              <Interactive3DCard intensity={6} className="p-6 md:p-8 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-2">
                  <Compass className="w-4 h-4" />
                  <span>INVESTIGATION 01</span>
                </div>
                <h4 className="text-lg md:text-xl font-bold text-white mb-3">
                  My curiosity has terrible boundaries.
                </h4>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  One question can turn into twenty open tabs, three unexpected connections, and a suspicious amount of research. I like understanding how things work, why people think the way they do, and what happens when two unrelated ideas collide.
                </p>
              </Interactive3DCard>

              {/* Point 2 */}
              <Interactive3DCard intensity={6} className="p-6 md:p-8 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>INVESTIGATION 02</span>
                </div>
                <h4 className="text-lg md:text-xl font-bold text-white mb-3">
                  I appreciate competence. And people who can make me laugh.
                </h4>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  I care about doing good work, communicating clearly, and paying attention to details. Outside work, give me a sharp mind, ridiculous humor, and a conversation that takes an unexpected turn. Small talk and I have agreed to remain acquaintances.
                </p>
              </Interactive3DCard>

              {/* Point 3 */}
              <Interactive3DCard intensity={6} className="p-6 md:p-8 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-2">
                  <Layers className="w-4 h-4" />
                  <span>INVESTIGATION 03</span>
                </div>
                <h4 className="text-lg md:text-xl font-bold text-white mb-3">
                  I refuse to be just one thing.
                </h4>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Words, systems, human behavior, technology, and whatever catches my attention next. I'm interested in the connections between things, not just the boxes they're supposed to fit into. My career has already crossed a few different lanes. I suspect it won't stop there.
                </p>
              </Interactive3DCard>
            </div>
          </div>

          {/* Anyway, back to being useful */}
          <div className="mt-16 pt-12 border-t border-slate-800/80 space-y-6 text-slate-300 text-base md:text-lg leading-relaxed">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              PRAGMATISM & CRAFT
            </div>
            <h3 className="text-2xl font-display font-bold text-white">
              Anyway, back to being useful.
            </h3>
            <p>
              I bring curiosity to the thinking, care to the details, and a professional work ethic to the execution. Whether I'm shaping a piece of content or helping an online store keep things moving, I want the work to make sense, serve a purpose, and actually get done.
            </p>
            <p>
              I'm building my skills, exploring new territory, and seeing how far I can take this combination of interests.
            </p>
            <div className="p-5 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-200 text-base font-medium">
              The ambition is serious. The personality is a developing situation.
            </div>
          </div>
        </div>
      </section>

      {/* Shared Contact Footer */}
      <ContactFooter />
    </div>
  );
};
