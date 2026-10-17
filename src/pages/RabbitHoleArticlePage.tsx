import React, { useEffect, useState, useRef } from 'react';
import { RabbitHoleArticle, PageRoute } from '../types';
import { getAllArticles, updateArticle, deleteArticle } from '../utils/articleStorage';
import { useAuthorMode } from '../utils/authorAuth';
import { ContactFooter } from '../components/ContactFooter';
import { ArticleFeaturedCover } from '../components/ArticleFeaturedCover';
import { saveCustomImage } from '../utils/customImageStorage';
import { UpdateWritingModal } from '../components/UpdateWritingModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
  ArrowLeft,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Share2,
  Check,
  Camera,
  Edit3,
  Trash2,
  Sliders,
} from 'lucide-react';

interface RabbitHoleArticlePageProps {
  article: RabbitHoleArticle;
  onNavigate: (page: PageRoute) => void;
  onSelectArticle: (article: RabbitHoleArticle) => void;
}

// Lightweight parser for bold (**text**), italic (*text*), and markdown links ([text](url))
function renderFormattedText(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      // Link [text](url)
      parts.push(
        <a
          key={match.index}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-300 hover:text-purple-200 underline decoration-purple-500/50 hover:decoration-purple-300 transition-colors inline-flex items-center gap-1 font-medium"
        >
          <span>{match[2]}</span>
          <ExternalLink className="w-3 h-3 inline-block shrink-0" />
        </a>
      );
    } else if (match[4]) {
      // Bold **text**
      parts.push(
        <strong key={match.index} className="font-bold text-white">
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      // Italic *text*
      parts.push(
        <em key={match.index} className="italic text-purple-200">
          {match[5]}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

export const RabbitHoleArticlePage: React.FC<RabbitHoleArticlePageProps> = ({
  article,
  onNavigate,
  onSelectArticle,
}) => {
  const { isAuthor } = useAuthorMode();
  const [currentArticle, setCurrentArticle] = useState<RabbitHoleArticle>(article);
  const [copied, setCopied] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const articleContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setCurrentArticle(article);
    setReadingProgress(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.slug, article]);

  // Track scroll position across article content
  useEffect(() => {
    const updateReadingProgress = () => {
      if (!articleContentRef.current) return;
      const rect = articleContentRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) {
        setReadingProgress(rect.top <= 0 ? 100 : 0);
        return;
      }

      const scrolled = -rect.top;
      const percentage = Math.min(100, Math.max(0, (scrolled / totalScrollable) * 100));
      setReadingProgress(percentage);
    };

    updateReadingProgress();
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateReadingProgress);
      window.removeEventListener('resize', updateReadingProgress);
    };
  }, [currentArticle.slug]);

  // Read current live articles list
  const activeArticles = getAllArticles();
  const currentIndex = activeArticles.findIndex((a) => a.slug === currentArticle.slug);
  const nextArticle =
    activeArticles.length > 0
      ? activeArticles[(currentIndex + 1) % activeArticles.length]
      : null;
  const prevArticle =
    activeArticles.length > 0
      ? activeArticles[(currentIndex - 1 + activeArticles.length) % activeArticles.length]
      : null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveUpdate = (updated: RabbitHoleArticle) => {
    updateArticle(updated);
    setCurrentArticle(updated);
  };

  const handleConfirmDelete = (slug: string) => {
    deleteArticle(slug);
    onNavigate('rabbit-holes');
  };

  return (
    <article
      ref={articleContentRef}
      className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-purple-400/20 selection:text-purple-200 relative"
    >
      {/* Thin Reading Progress Bar at the top of the viewport */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] bg-slate-900/80 z-[60] pointer-events-none"
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      >
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-400 shadow-[0_0_10px_rgba(168,85,247,0.85)] transition-[width] duration-75 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Top Header & Breadcrumbs Sticky Bar */}
      <div className="pt-8 pb-5 border-b border-slate-800/80 bg-[#090d16]/95 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('rabbit-holes')}
              className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Rabbit Holes</span>
            </button>

            {readingProgress > 2 && (
              <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-purple-300/80 bg-purple-950/50 border border-purple-800/40 px-2 py-0.5 rounded-full">
                {Math.round(readingProgress)}% read
              </span>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Author-only buttons: Update & Delete */}
            {isAuthor && (
              <>
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 hover:text-white border border-purple-500/40 hover:border-purple-300 text-xs font-mono transition-all cursor-pointer active:scale-95 shadow-xs"
                  title="Update title, text, or sections"
                >
                  <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Update Writing</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 hover:border-rose-400 text-xs font-mono transition-all cursor-pointer active:scale-95 shadow-xs"
                  title="Delete this writing"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete This</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Copy link to article"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Article Hero - Clean Solid Distraction-Free Layout */}
      <section className="pt-12 pb-16 max-w-4xl mx-auto px-6">
        <div>
          {/* Metadata pill */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-purple-400 mb-4">
            <span>RABBIT HOLE #{currentArticle.number}</span>
            <span aria-hidden="true">·</span>
            {currentArticle.categories.join(' / ')}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight leading-[1.15] text-balance">
            {currentArticle.title}
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
            {currentArticle.tagline}
          </p>

          {/* Lead Typographic / Graphic Poster Banner */}
          <div className="mt-10 shadow-2xl">
            <ArticleFeaturedCover article={currentArticle} variant="hero" />

            {/* Direct Writing Actions Toolbar: only visible to Author */}
            {isAuthor && (
              <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl backdrop-blur-xs">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-semibold text-white">Writing Actions (Author Only):</span>
                  <span className="text-slate-500 hidden md:inline">
                    Edit content, swap featured image, or delete
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* 1. Update Writing Button */}
                  <button
                    type="button"
                    onClick={() => setIsUpdateModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs font-mono transition-all shadow-md shadow-purple-950/40 cursor-pointer active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Update Writing</span>
                  </button>

                  {/* 2. Replace Featured Photo Button */}
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-mono transition-all shadow-sm active:scale-95">
                    <Camera className="w-3.5 h-3.5 text-purple-400" />
                    <span>Replace Featured Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = async () => {
                          if (typeof reader.result === 'string') {
                            await saveCustomImage(currentArticle.slug, reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>

                  {/* 3. Delete This Button */}
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 hover:border-rose-400 text-xs font-mono transition-all cursor-pointer active:scale-95 shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete This</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Intro Prologue */}
          {currentArticle.intro && (
            <div className="mt-10 p-6 md:p-8 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-slate-200 text-base md:text-lg italic leading-relaxed">
              &quot;{renderFormattedText(currentArticle.intro)}&quot;
            </div>
          )}

          {/* Body Content Sections */}
          <div className="mt-12 space-y-12">
            {currentArticle.content.map((block, idx) => (
              <div key={idx} className="space-y-5">
                {block.heading && (
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white pt-4 border-t border-slate-800/60 first:border-t-0">
                    {block.heading}
                  </h2>
                )}

                {block.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-slate-300 text-base md:text-lg leading-relaxed">
                    {renderFormattedText(p)}
                  </p>
                ))}

                {block.pullQuote && (
                  <div className="my-8 py-4 px-6 border-l-2 border-purple-400 bg-slate-900/40 rounded-r-2xl">
                    <p className="text-lg md:text-xl font-display italic font-semibold text-purple-200">
                      “{renderFormattedText(block.pullQuote)}”
                    </p>
                  </div>
                )}

                {block.thoughtExercise && (
                  <div className="my-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-purple-400 uppercase mb-1">
                        CURIOUS DETOUR
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        {renderFormattedText(block.thoughtExercise)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* References & Sources (if present) */}
          {currentArticle.references && currentArticle.references.length > 0 && (
            <div className="mt-14 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-3">
                REFERENCES & HISTORICAL SOURCES
              </div>
              <ul className="space-y-2.5">
                {currentArticle.references.map((ref, rIdx) => (
                  <li key={rIdx}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-200 underline decoration-purple-500/50 hover:decoration-purple-300 text-sm md:text-base inline-flex items-center gap-1.5 transition-colors font-medium"
                    >
                      <span>{ref.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Concluding Thoughts */}
          {currentArticle.concludingThoughts && (
            <div className="mt-16 pt-10 border-t border-slate-800">
              <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2">
                CONCLUSION / WHERE IT LEFT ME
              </div>
              <p className="text-lg text-slate-200 leading-relaxed font-medium bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                {renderFormattedText(currentArticle.concludingThoughts)}
              </p>
            </div>
          )}

          {/* Bottom Writing Management Bar: only visible to Author */}
          {isAuthor && (
            <div className="mt-12 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-mono text-slate-400">
                Author Controls: Update or delete this writing
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 text-xs font-mono border border-purple-500/30 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Update Writing</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono border border-rose-500/20 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete This</span>
                </button>
              </div>
            </div>
          )}

          {/* Continuous Reading Navigation Footer */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {prevArticle && (
              <button
                type="button"
                onClick={() => onSelectArticle(prevArticle)}
                className="inline-flex items-center gap-3 p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 transition-all text-left group cursor-pointer flex-1"
              >
                <ArrowLeft className="w-4 h-4 text-purple-400 shrink-0 transform group-hover:-translate-x-1 transition-transform" />
                <div>
                  <div className="text-[11px] font-mono text-purple-400">PREVIOUS</div>
                  <div className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-1">
                    {prevArticle.title}
                  </div>
                </div>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('rabbit-holes')}
              className="text-xs font-mono text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Dispatches</span>
            </button>

            {nextArticle && (
              <button
                type="button"
                onClick={() => onSelectArticle(nextArticle)}
                className="inline-flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/40 transition-all text-left group cursor-pointer flex-1"
              >
                <div>
                  <div className="text-[11px] font-mono text-purple-400">NEXT</div>
                  <div className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-1">
                    {nextArticle.title}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 shrink-0 transform group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Shared Contact Footer */}
      <ContactFooter />

      {/* Update Writing Modal (Author Only) */}
      {isAuthor && (
        <UpdateWritingModal
          isOpen={isUpdateModalOpen}
          article={currentArticle}
          onClose={() => setIsUpdateModalOpen(false)}
          onSave={handleSaveUpdate}
        />
      )}

      {/* Delete This Confirmation Modal (Author Only) */}
      {isAuthor && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          article={currentArticle}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </article>
  );
};
