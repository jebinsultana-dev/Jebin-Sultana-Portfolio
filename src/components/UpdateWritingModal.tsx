import React, { useState, useEffect, useRef } from 'react';
import { RabbitHoleArticle, ArticleCategory } from '../types';
import { getCustomImage, saveCustomImage, deleteCustomImage } from '../utils/customImageStorage';
import { ARTICLE_IMAGE_MAP } from '../data/articleImageMap';
import {
  X,
  Save,
  Camera,
  RotateCcw,
  Plus,
  Trash2,
  FileText,
  Sparkles,
  Layers,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

interface UpdateWritingModalProps {
  isOpen: boolean;
  article: RabbitHoleArticle | null;
  onClose: () => void;
  onSave: (updated: RabbitHoleArticle) => void;
}

export const UpdateWritingModal: React.FC<UpdateWritingModalProps> = ({
  isOpen,
  article,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'content' | 'photo'>('basics');
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [primaryCategory, setPrimaryCategory] = useState<ArticleCategory>('Music');
  const [categoriesText, setCategoriesText] = useState('');
  const [intro, setIntro] = useState('');
  const [concludingThoughts, setConcludingThoughts] = useState('');
  const [sections, setSections] = useState<
    {
      heading: string;
      paragraphsText: string;
      pullQuote: string;
      thoughtExercise: string;
    }[]
  >([]);

  // Photo management state
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form whenever modal opens with article
  useEffect(() => {
    if (isOpen && article) {
      setTitle(article.title);
      setTagline(article.tagline || '');
      setPrimaryCategory(article.primaryCategory);
      setCategoriesText(article.categories.join(', '));
      setIntro(article.intro || '');
      setConcludingThoughts(article.concludingThoughts || '');

      setSections(
        article.content.map((b) => ({
          heading: b.heading || '',
          paragraphsText: b.paragraphs.join('\n\n'),
          pullQuote: b.pullQuote || '',
          thoughtExercise: b.thoughtExercise || '',
        }))
      );

      // Load custom photo if exists
      getCustomImage(article.slug).then((img) => {
        const bundled = ARTICLE_IMAGE_MAP[article.slug];
        setCustomPhotoUrl(img);
        setPreviewPhotoUrl(img || bundled || article.image || `/images/featured/${article.slug}.jpg`);
      });

      setActiveTab('basics');
      setPhotoChanged(false);
      setSavedNotice(false);
    }
  }, [isOpen, article]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !article) return null;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewPhotoUrl(reader.result);
        setPhotoChanged(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = async () => {
    await deleteCustomImage(article.slug);
    const bundled = ARTICLE_IMAGE_MAP[article.slug];
    setCustomPhotoUrl(null);
    setPreviewPhotoUrl(bundled || article.image || `/images/featured/${article.slug}.jpg`);
    setPhotoChanged(false);
  };

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      {
        heading: `Section ${prev.length + 1}`,
        paragraphsText: '',
        pullQuote: '',
        thoughtExercise: '',
      },
    ]);
  };

  const handleRemoveSection = (idx: number) => {
    setSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateSection = (
    idx: number,
    field: 'heading' | 'paragraphsText' | 'pullQuote' | 'thoughtExercise',
    val: string
  ) => {
    setSections((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Parse categories
    const cats = categoriesText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    // Parse sections
    const formattedContent = sections.map((s) => ({
      heading: s.heading.trim() || undefined,
      paragraphs: s.paragraphsText
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean),
      pullQuote: s.pullQuote.trim() || undefined,
      thoughtExercise: s.thoughtExercise.trim() || undefined,
    }));

    // If photo was changed to a new dataUrl, save it
    if (photoChanged && previewPhotoUrl && previewPhotoUrl.startsWith('data:')) {
      await saveCustomImage(article.slug, previewPhotoUrl);
    }

    const updated: RabbitHoleArticle = {
      ...article,
      title: title.trim() || article.title,
      tagline: tagline.trim() || article.tagline,
      primaryCategory,
      categories: cats.length > 0 ? cats : [primaryCategory],
      readTime: article.readTime || '',
      intro: intro.trim(),
      concludingThoughts: concludingThoughts.trim(),
      content: formattedContent.length > 0 ? formattedContent : article.content,
      visualTheme: {
        ...article.visualTheme,
        headline: title.trim().split(':')[0] || article.visualTheme.headline,
      },
    };

    onSave(updated);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-writing-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      <div
        className="w-full max-w-3xl my-auto rounded-3xl bg-[#090d18] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>WRITING EDITOR · #{article.number}</span>
            </div>
            <h2 id="update-writing-title" className="text-xl sm:text-2xl font-display font-bold text-white">
              Update Writing
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-6 shrink-0 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('basics')}
            className={`py-3 px-4 text-xs font-mono border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'basics'
                ? 'border-purple-400 text-purple-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Title & Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`py-3 px-4 text-xs font-mono border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'content'
                ? 'border-purple-400 text-purple-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sections & Body Content ({sections.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`py-3 px-4 text-xs font-mono border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'photo'
                ? 'border-purple-400 text-purple-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Featured Photo</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 grow">
          {/* TAB 1: BASICS */}
          {activeTab === 'basics' && (
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wide">
                  Writing Title <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. O Sahib: The Architecture of Yearning"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-medium"
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wide">
                  Tagline / Subheading
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="One sentence summary of the inquiry"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                />
              </div>

              {/* Primary Category */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wide">
                  Primary Category
                </label>
                <select
                  value={primaryCategory}
                  onChange={(e) => setPrimaryCategory(e.target.value as ArticleCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                >
                  <option value="Music">Music</option>
                  <option value="Movies">Movies</option>
                  <option value="Series">Series</option>
                  <option value="Investigation">Investigation</option>
                  <option value="History">History</option>
                </select>
              </div>

              {/* Category tags */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wide">
                  Sub-categories & Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={categoriesText}
                  onChange={(e) => setCategoriesText(e.target.value)}
                  placeholder="e.g. Music, Lyrical Analysis, Baul, Philosophy"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                />
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  These appear as breadcrumb tags above the title and in search filters.
                </p>
              </div>

              {/* Intro / Prologue */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wide">
                  Opening Intro Quote / Prologue
                </label>
                <textarea
                  rows={4}
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="The introductory paragraph displayed in quotes..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 leading-relaxed"
                />
              </div>

              {/* Concluding Thoughts */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wide">
                  Concluding Thoughts / Reflection
                </label>
                <textarea
                  rows={3}
                  value={concludingThoughts}
                  onChange={(e) => setConcludingThoughts(e.target.value)}
                  placeholder="Final takeaway or lingering question..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SECTIONS & CONTENT */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono text-slate-400">
                  Each section can have a heading, body paragraphs (separate paragraphs with a blank line), an optional pull quote, and a curious detour prompt.
                </p>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 text-xs font-mono transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              {sections.map((section, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 relative"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-mono text-purple-400 font-semibold">
                      SECTION {idx + 1}
                    </span>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="text-xs font-mono text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) => handleUpdateSection(idx, 'heading', e.target.value)}
                      placeholder="e.g. The Acoustic Weight of Memory"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Paragraphs (Separate paragraphs with an empty line)
                    </label>
                    <textarea
                      rows={5}
                      value={section.paragraphsText}
                      onChange={(e) => handleUpdateSection(idx, 'paragraphsText', e.target.value)}
                      placeholder="Write your paragraphs here. Supports **bold**, *italic*, and [links](https://...)..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-purple-400 leading-relaxed font-normal"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Pull Quote (Optional highlight)
                      </label>
                      <input
                        type="text"
                        value={section.pullQuote}
                        onChange={(e) => handleUpdateSection(idx, 'pullQuote', e.target.value)}
                        placeholder="Quoted standout line..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-purple-200 text-xs focus:outline-none focus:border-purple-400 italic"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Curious Detour / Thought Exercise (Optional)
                      </label>
                      <input
                        type="text"
                        value={section.thoughtExercise}
                        onChange={(e) => handleUpdateSection(idx, 'thoughtExercise', e.target.value)}
                        placeholder="Prompt question for the reader..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: FEATURED PHOTO */}
          {activeTab === 'photo' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-xs font-mono text-purple-300">
                You can upload a custom featured photo directly for this writing. It will be stored in your browser storage and shown on both the collection card and the article reading page.
              </div>

              {/* Photo Preview */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 p-2">
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                  {previewPhotoUrl ? (
                    <img
                      src={previewPhotoUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={() => setPreviewPhotoUrl(null)}
                    />
                  ) : (
                    <div className="text-center p-6 text-slate-500 font-mono text-xs">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                      <span>No custom photo currently applied</span>
                    </div>
                  )}

                  {photoChanged && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-emerald-500/90 text-white font-mono text-xs shadow-lg flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>New Photo Selected</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload & Reset Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono transition-colors shadow-md cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload / Replace Photo</span>
                </button>

                {(customPhotoUrl || photoChanged) && (
                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    <span>Reset to Default Cover</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Footer Save & Actions Bar */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-400">
              {savedNotice ? (
                <span className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Changes saved successfully!</span>
                </span>
              ) : (
                <span>Rabbit Hole #{article.number}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs font-mono transition-all shadow-lg shadow-purple-950/60 active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
