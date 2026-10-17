import React, { useState } from 'react';
import { PageRoute, RabbitHoleArticle, ArticleCategory } from '../types';
import { useArticles } from '../utils/articleStorage';
import { useAuthorMode } from '../utils/authorAuth';
import { ContactFooter } from '../components/ContactFooter';
import { Interactive3DCard } from '../components/Interactive3DCard';
import { HeroMotionBackground } from '../components/HeroMotionBackground';
import { ArticleFeaturedCover } from '../components/ArticleFeaturedCover';
import { FeaturedPhotoManagerModal } from '../components/FeaturedPhotoManagerModal';
import { UpdateWritingModal } from '../components/UpdateWritingModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Music,
  Film,
  Tv,
  Landmark,
  Layers,
  Camera,
  Edit3,
  Trash2,
  Plus,
  RotateCcw,
  Search,
  Save,
  Check,
} from 'lucide-react';
import { getAllCustomImages, syncAllIndexedDBImagesToServer } from '../utils/customImageStorage';


interface RabbitHolesPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectArticle: (article: RabbitHoleArticle) => void;
}

const BATCH_SIZE = 4;
type FilterCategory = 'All' | ArticleCategory;

interface CategoryTab {
  id: FilterCategory;
  label: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryTab[] = [
  { id: 'All', label: 'All Writings', icon: Layers },
  { id: 'Music', label: 'Music', icon: Music },
  { id: 'Movies', label: 'Movies', icon: Film },
  { id: 'Series', label: 'Series', icon: Tv },
  { id: 'Investigation', label: 'Investigation', icon: Search },
  { id: 'History', label: 'History', icon: Landmark },
];

export const RabbitHolesPage: React.FC<RabbitHolesPageProps> = ({
  onNavigate,
  onSelectArticle,
}) => {
  const { isAuthor } = useAuthorMode();
  const { articles, isModified, updateArticle, deleteArticle, restoreDefaultArticles } = useArticles();
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);
  const [articleToUpdate, setArticleToUpdate] = useState<RabbitHoleArticle | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<RabbitHoleArticle | null>(null);
  const [customPhotosCount, setCustomPhotosCount] = useState<number>(0);
  const [isSyncingPhotos, setIsSyncingPhotos] = useState<boolean>(false);
  const [syncedNotice, setSyncedNotice] = useState<boolean>(false);

  // Monitor custom photos in browser IndexedDB
  const checkPhotos = async () => {
    try {
      const all = await getAllCustomImages();
      setCustomPhotosCount(Object.keys(all).length);
    } catch {
      setCustomPhotosCount(0);
    }
  };

  React.useEffect(() => {
    checkPhotos();
    const handleUpdate = () => checkPhotos();
    window.addEventListener('custom-images-updated', handleUpdate);
    return () => window.removeEventListener('custom-images-updated', handleUpdate);
  }, []);

  const handleSyncPhotos = async () => {
    setIsSyncingPhotos(true);
    try {
      const res = await syncAllIndexedDBImagesToServer();
      if (res.success && res.syncedCount > 0) {
        setSyncedNotice(true);
        setTimeout(() => setSyncedNotice(false), 4000);
      }
    } finally {
      setIsSyncingPhotos(false);
    }
  };

  // Filter articles based on category
  const filteredArticles = selectedCategory === 'All'
    ? articles
    : articles.filter((article) => article.primaryCategory === selectedCategory);

  const visibleArticles = filteredArticles.slice(0, visibleCount);

  // Category counts
  const getCategoryCount = (catId: FilterCategory) => {
    if (catId === 'All') return articles.length;
    return articles.filter((a) => a.primaryCategory === catId).length;
  };

  const handleCategoryChange = (cat: FilterCategory) => {
    setSelectedCategory(cat);
    setVisibleCount(BATCH_SIZE);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredArticles.length));
  };

  const handleShowLess = () => {
    setVisibleCount(BATCH_SIZE);
    const gridSection = document.getElementById('curated-dispatches');
    if (gridSection) {
      gridSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddNewWriting = () => {
    const newNum = String(articles.length + 1).padStart(2, '0');
    const blankArticle: RabbitHoleArticle = {
      slug: `custom-writing-${Date.now()}`,
      number: newNum,
      title: 'New Writing Inquiry',
      primaryCategory: 'Music',
      categories: ['Music', 'Essay'],
      tagline: 'Summary of what makes this topic fascinating',
      readTime: '5 min read',
      intro: 'The premise or thought that started this rabbit hole...',
      content: [
        {
          heading: 'The Core Theme',
          paragraphs: [
            'Start your inquiry here with background observations and analysis.',
          ],
          pullQuote: 'A memorable insight from this inquiry.',
          thoughtExercise: 'What makes this topic resonate so deeply?',
        },
      ],
      concludingThoughts: 'Final conclusion and where it left your thinking.',
      visualTheme: {
        themeStyle: 'lyric-poster',
        accentColor: '#a855f7',
        badge: 'WRITING',
        headline: 'New Inquiry',
      },
    };
    setArticleToUpdate(blankArticle);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 selection:bg-purple-400/20 selection:text-purple-200">
      {/* Introduction Hero Section */}
      <section className="pt-12 md:pt-20 pb-16 md:pb-24 border-b border-slate-800/80 relative overflow-hidden">
        {/* Animated Peaceful Cosmic Sky Motion Background */}
        <HeroMotionBackground theme="rabbit-holes" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>

          {/* Section label */}
          <div className="text-xs font-mono tracking-widest text-purple-400 uppercase mb-3">
            RABBIT HOLES / AN ONGOING COLLECTION
          </div>

          {/* Heading with emphasis on 'investigate' */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1] text-balance">
            Things I found interesting enough to{' '}
            <span className="italic underline decoration-purple-400/60 underline-offset-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-200 to-pink-300">
              investigate
            </span>
            .
          </h1>

          {/* Supporting line */}
          <p className="mt-4 text-sm font-mono text-slate-400 max-w-2xl">
            No particular order. Just things I found interesting enough to investigate instead of minding my own business.
          </p>

          {/* Full Introduction Copy in Bespoke Glass Card */}
          <div className="mt-10 p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/90 text-slate-300 text-base md:text-lg leading-relaxed space-y-5 shadow-2xl backdrop-blur-xs">
            <p>
              I get curious at the worst possible times. The night before an exam, during a walk, while looking at the sky, or when I should probably be doing something more useful. One minute, I&apos;m listening to a song. The next, I&apos;m researching its lyrics, questioning human nature, or trying to understand some scientific theory. How did we get here? No idea. Haha!
            </p>
            <p>
              Rabbit Holes is where I keep those thoughts. Politics, philosophy, science, technology, music, and whatever else sends me down another research spiral. I write about things I find interesting, questions I can&apos;t answer, and ideas I can&apos;t stop thinking about.
            </p>
            <p>
              No particular agenda. I&apos;m not trying to prove a point, change anyone&apos;s mind, or pretend I have everything figured out. Sometimes I&apos;ll reach a conclusion. Sometimes I&apos;ll find three new questions and make the situation worse. Haha.
            </p>
            <p className="font-medium text-purple-300">
              It&apos;s curiosity, basically. I follow it, write down what I find, and leave it here. If you find something interesting in it too, even better.
            </p>
          </div>
        </div>
      </section>

      {/* Article Collection Section */}
      <section id="curated-dispatches" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header & Category Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-slate-800/80">
            <div>
              <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-1.5">
                CURATED DISPATCHES & ESSAYS
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white">
                Investigations & Reviews
              </h2>
              <p className="text-xs md:text-sm font-mono text-slate-400 mt-1">
                Explore deep-dives across music lyrical analysis, cinema, television psychology, and cyber investigation.
              </p>
            </div>

            {/* Direct List Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.filter((cat) => cat.id === 'All' || getCategoryCount(cat.id) > 0).map((cat) => {
                const Icon = cat.icon;
                const count = getCategoryCount(cat.id);
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white font-semibold shadow-lg shadow-purple-950/60 border border-purple-400'
                        : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-200' : 'text-slate-400'}`} />
                    <span>{cat.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        isActive
                          ? 'bg-purple-800/80 text-purple-200'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collection Status Indicator & Quick Management Tools (Management tools only for Author) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs font-mono text-slate-400 mb-8 p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                Filter:{' '}
                <span className="text-purple-300 font-semibold">
                  {selectedCategory === 'All' ? 'All Writings' : selectedCategory}
                </span>
              </div>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <div>
                Showing {visibleArticles.length} of {filteredArticles.length} {filteredArticles.length === 1 ? 'dispatch' : 'dispatches'}
              </div>
              {isAuthor && isModified && (
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px]">
                  Custom Edits Active
                </span>
              )}
            </div>

            {/* Author-only actions */}
            {isAuthor && (
              <div className="flex flex-wrap items-center gap-2">
                {/* Add New Writing Button */}
                <button
                  type="button"
                  onClick={handleAddNewWriting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono transition-all shadow-md cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Writing</span>
                </button>

                {/* Upload / Manage Photos Button */}
                <button
                  type="button"
                  onClick={() => setIsPhotoManagerOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 hover:border-purple-400 text-xs font-mono transition-all shadow-md cursor-pointer group"
                >
                  <Camera className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span>Upload Photos</span>
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/40 text-[10px] text-purple-100 font-bold">18 Slots</span>
                </button>

                {/* Save to Published Site Button */}
                {customPhotosCount > 0 && (
                  <button
                    type="button"
                    onClick={handleSyncPhotos}
                    disabled={isSyncingPhotos}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono transition-all shadow-md cursor-pointer disabled:opacity-50"
                    title="Write your manual photos directly into project files so they appear on the published site"
                  >
                    {syncedNotice ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Saved to Project Files!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 text-white" />
                        <span>{isSyncingPhotos ? 'Saving...' : `Save ${customPhotosCount} Photo${customPhotosCount > 1 ? 's' : ''} to Published Site`}</span>
                      </>
                    )}
                  </button>
                )}


                {/* Restore Default Button (if modified) */}
                {isModified && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Reset all writings and restore default articles?')) {
                        restoreDefaultArticles();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition-all cursor-pointer"
                    title="Restore original 20 writings"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Restore Originals</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4 Cards at a time Responsive Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleArticles.map((article) => (
              <div
                key={article.slug}
                onClick={() => onSelectArticle(article)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectArticle(article);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Read article: ${article.title}`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-3xl group cursor-pointer"
              >
                <Interactive3DCard
                  intensity={8}
                  className="h-full rounded-3xl bg-slate-900/70 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-purple-500/40 hover:bg-slate-900/90 transition-all duration-300 shadow-xl"
                >
                  <div>
                    {/* Creative Typographic / Graffiti Featured Cover */}
                    <div className="relative overflow-hidden bg-slate-950 p-2">
                      <ArticleFeaturedCover
                        article={article}
                        variant="card"
                        className="group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>

                    {/* Metadata & Title */}
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-purple-400 mb-2">
                        {article.categories.map((cat, i) => (
                          <React.Fragment key={cat}>
                            <span>{cat}</span>
                            {i < article.categories.length - 1 && <span aria-hidden="true">/</span>}
                          </React.Fragment>
                        ))}
                      </div>

                      <h3 className="text-lg font-display font-bold text-white group-hover:text-purple-200 transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="mt-3 text-xs md:text-sm text-slate-400 leading-relaxed line-clamp-3">
                        {article.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions & Read Affordance Footer */}
                  <div className="p-6 pt-0">
                    {isAuthor ? (
                      /* Author View: shows Update and Delete buttons */
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setArticleToUpdate(article);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-purple-600/30 text-slate-300 hover:text-purple-200 border border-slate-700/80 hover:border-purple-400 text-[11px] font-mono transition-colors cursor-pointer"
                            title="Update Writing"
                          >
                            <Edit3 className="w-3 h-3 text-purple-400" />
                            <span>Update</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setArticleToDelete(article);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-rose-500/25 text-slate-300 hover:text-rose-200 border border-slate-700/80 hover:border-rose-400 text-[11px] font-mono transition-colors cursor-pointer"
                            title="Delete This"
                          >
                            <Trash2 className="w-3 h-3 text-rose-400" />
                            <span>Delete</span>
                          </button>
                        </div>

                        <div className="flex items-center text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                          <span className="hidden sm:inline">Read</span>
                          <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    ) : (
                      /* Public General Viewer View: Clean read link only */
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                        <span>Read full inquiry</span>
                        <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    )}
                  </div>
                </Interactive3DCard>
              </div>
            ))}
          </div>

          {/* Show More Button after each 4 cards */}
          {visibleCount < filteredArticles.length ? (
            <div className="mt-14 flex flex-col items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleShowMore}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 hover:text-white border border-purple-500/40 hover:border-purple-400 font-mono text-sm tracking-wide transition-all shadow-xl shadow-purple-950/40 active:scale-95 group cursor-pointer"
              >
                <span>Show more</span>
                <ChevronDown className="w-4 h-4 text-purple-300 group-hover:translate-y-0.5 transition-transform" />
              </button>
              <span className="text-xs font-mono text-slate-500">
                Showing {visibleArticles.length} of {filteredArticles.length} dispatches in {selectedCategory === 'All' ? 'All Writings' : selectedCategory}
              </span>
            </div>
          ) : (
            filteredArticles.length > BATCH_SIZE && (
              <div className="mt-14 flex flex-col items-center justify-center gap-3">
                <div className="text-xs font-mono text-purple-300/80 bg-purple-950/30 border border-purple-500/20 px-4 py-2 rounded-xl">
                  All {filteredArticles.length} dispatches displayed in {selectedCategory === 'All' ? 'All Writings' : selectedCategory}
                </div>
                <button
                  type="button"
                  onClick={handleShowLess}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors pt-1 cursor-pointer"
                >
                  <span>Show less (display first 4)</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          )}
        </div>
      </section>

      {/* Shared Contact Footer */}
      <ContactFooter />

      {/* Author-only Modals */}
      {isAuthor && (
        <>
          {/* Featured Photo Manager Modal */}
          <FeaturedPhotoManagerModal
            isOpen={isPhotoManagerOpen}
            onClose={() => setIsPhotoManagerOpen(false)}
          />

          {/* Update Writing Modal */}
          <UpdateWritingModal
            isOpen={!!articleToUpdate}
            article={articleToUpdate}
            onClose={() => setArticleToUpdate(null)}
            onSave={(updated) => {
              updateArticle(updated);
            }}
          />

          {/* Delete This Confirmation Modal */}
          <DeleteConfirmModal
            isOpen={!!articleToDelete}
            article={articleToDelete}
            onClose={() => setArticleToDelete(null)}
            onConfirmDelete={(slug) => {
              deleteArticle(slug);
            }}
          />
        </>
      )}
    </div>
  );
};
