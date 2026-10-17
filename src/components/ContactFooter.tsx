import React from 'react';
import { Mail, Linkedin, Facebook, Instagram, ArrowUpRight, Sparkles, Send } from 'lucide-react';

export const ContactFooter: React.FC = () => {
  return (
    <footer id="contact-footer" className="relative border-t border-slate-800 bg-[#070b12] py-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LET'S CONNECT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            Interested in working together or just talking shop?
          </h2>

          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Whether you have a content strategy puzzle, an e-commerce operation to streamline, or an obscure theory about a song, feel free to reach out.
          </p>
        </div>

        {/* Email Direct Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4 max-w-lg mx-auto shadow-xl backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>

          <div>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              DIRECT INBOX
            </div>
            <a
              href="mailto:jebin.sultana.work@gmail.com"
              className="text-lg sm:text-xl font-bold text-white hover:text-amber-300 transition-colors inline-flex items-center gap-2 group"
            >
              <span>jebin.sultana.work@gmail.com</span>
              <Send className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Social Links Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="https://www.linkedin.com/in/jebinsultana/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-sm font-medium text-slate-200 hover:text-white transition-all group hover:border-sky-500/40"
          >
            <Linkedin className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </a>

          <a
            href="https://www.facebook.com/jebinsultanaa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-sm font-medium text-slate-200 hover:text-white transition-all group hover:border-blue-500/40"
          >
            <Facebook className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span>Facebook</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </a>

          <a
            href="https://www.instagram.com/me.jebs/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-sm font-medium text-slate-200 hover:text-white transition-all group hover:border-pink-500/40"
          >
            <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
            <span>Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </a>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-10 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
          <div>© {new Date().getFullYear()} Jebin Sultana. All rights reserved.</div>
          <div>Built with deliberate curiosity & zero guesswork.</div>
        </div>
      </div>
    </footer>
  );
};
