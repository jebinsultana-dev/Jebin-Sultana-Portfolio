import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute, targetSectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageRoute, sectionId?: string) => {
    setMobileMenuOpen(false);
    onNavigate(page, sectionId);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#090d16]/90 border-b border-white/10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="group flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1 cursor-pointer shrink-0"
          aria-label="Jebin Sultana Home"
        >
          <span className="font-editorial font-bold text-2xl tracking-wide text-white group-hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
            JS
          </span>
          <span className="inline-block text-xs font-mono text-slate-400 border-l border-white/15 pl-2.5 whitespace-nowrap">
            Jebin Sultana
          </span>
        </button>

        {/* Zone 2: Desktop Nav Links (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-300">
          <button
            type="button"
            onClick={() => handleNavClick('work')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              currentPage === 'work'
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                : 'hover:text-amber-200'
            }`}
          >
            Work & Experience
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('rabbit-holes')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
              currentPage === 'rabbit-holes' || currentPage === 'rabbit-hole-article'
                ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-400'
                : 'hover:text-purple-200'
            }`}
          >
            Rabbit Holes
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('home', 'about-section')}
            className="whitespace-nowrap shrink-0 hover:text-amber-200 transition-colors py-1 cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Zone 3: Desktop CTA */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('home', 'contact-footer')}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 active:scale-95 transition-all rounded-full whitespace-nowrap shrink-0 shadow-lg shadow-amber-500/20 hover:shadow-amber-400/35 cursor-pointer"
          >
            Say Hello ↗
          </button>
        </div>

        {/* Mobile Action Controls: Say Hello + Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavClick('home', 'contact-footer')}
            className="px-3 py-1.5 text-[11px] font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 active:scale-95 transition-all rounded-full whitespace-nowrap shadow-md cursor-pointer"
          >
            Say Hello
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#090d16]/98 backdrop-blur-2xl px-5 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => handleNavClick('work')}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentPage === 'work'
                  ? 'bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span>Work & Experience</span>
              <span className="text-xs font-mono text-slate-500">5+ yrs</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('rabbit-holes')}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                currentPage === 'rabbit-holes' || currentPage === 'rabbit-hole-article'
                  ? 'bg-purple-500/15 text-purple-300 font-semibold border border-purple-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <span>Rabbit Holes</span>
              <span className="text-xs font-mono text-purple-400">Writings</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('home', 'about-section')}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900/60 transition-colors cursor-pointer"
            >
              <span>About Jebin</span>
              <span className="text-xs font-mono text-slate-500">DIU · 2025–29</span>
            </button>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => handleNavClick('home', 'contact-footer')}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <span>Get in Touch / Say Hello</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
