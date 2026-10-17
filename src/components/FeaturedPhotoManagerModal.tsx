import React, { useState, useEffect, useRef } from 'react';
import { RabbitHoleArticle } from '../types';
import { getAllArticles } from '../utils/articleStorage';
import {
  saveBatchImages,
  saveCustomImage,
  deleteCustomImage,
  clearAllCustomImages,
  getAllCustomImages,
  syncAllIndexedDBImagesToServer,
} from '../utils/customImageStorage';
import { ARTICLE_IMAGE_MAP } from '../data/articleImageMap';
import {
  X,
  Upload,
  CheckCircle2,
  RotateCcw,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  FileCheck,
  Search,
  Save,
} from 'lucide-react';


interface FeaturedPhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Canonical matching rules for the first 18 dispatches based on filename and article title/lyrics
export const ARTICLE_PHOTO_MATCH_RULES: {
  slug: string;
  expectedFilename: string;
  keywords: string[];
}[] = [
  {
    slug: 'o-sahib-why-does-this-song-feel-so-divine',
    expectedFilename: 'Oh Sahib.png',
    keywords: ['oh sahib', 'o sahib', 'sahib', 'zain', 'zohaib', 'devdas'],
  },
  {
    slug: 'andaaz-e-karam-the-cruelty-of-loving-too-deeply',
    expectedFilename: 'Andaz e Karam.png',
    keywords: ['andaz', 'andaaz', 'karam', 'sethi'],
  },
  {
    slug: 'faasle-to-love-you-even-from-a-distance',
    expectedFilename: 'Faasle.png',
    keywords: ['faasle', 'fasle', 'kaavish', 'balouch', 'distance'],
  },
  {
    slug: 'amar-porano-jaha-chay-even-if-you-love-someone-else',
    expectedFilename: 'amaro porano jaha chay.png',
    keywords: ['amar porano', 'amaro porano', 'porano jaha', 'jaha chay', 'rabindra'],
  },
  {
    slug: 'jaao-pakhi-be-happy-but-please-dont-forget-me',
    expectedFilename: 'jao pakhi bolo tare.png',
    keywords: ['jao pakhi', 'jaao pakhi', 'bolo tare', 'pakhi'],
  },
  {
    slug: 'bonde-maya-lagaise-what-kind-of-magic-is-this',
    expectedFilename: 'maya.png',
    keywords: ['maya', 'bonde maya', 'lagaise', 'dewana'],
  },
  {
    slug: 'milon-hobe-koto-dine-the-one-my-heart-keeps-searching-for',
    expectedFilename: 'o prem je kore.png',
    keywords: ['o prem', 'prem je kore', 'sei jane', 'milon hobe', 'milon', 'lalon'],
  },
  {
    slug: 'tomay-hrid-majhare-rakhbo-i-wont-let-you-go',
    expectedFilename: 'jete chayle jete dibona.png',
    keywords: ['jete chayle', 'jete dibona', 'jete debona', 'hrid majhare', 'rakhbo', 'chere dile'],
  },
  {
    slug: 'tum-ho-when-someone-becomes-your-whole-world',
    expectedFilename: 'tum ho.png',
    keywords: ['tum ho', 'rockstar', 'ranbir'],
  },
  {
    slug: 'maula-mere-maula-when-love-becomes-a-form-of-prayer',
    expectedFilename: 'maula mere maula mere.png',
    keywords: ['maula mere', 'maula', 'anwar', 'kunal'],
  },
  {
    slug: 'tera-woh-pyaar-the-cruelest-goodbyes',
    expectedFilename: 'image.png',
    keywords: ['image', 'tera woh', 'tera woh pyaar', 'pyaar', 'pyar', 'azaan', 'momina', 'coke studio 9'],
  },
  {
    slug: 'bahir-bole-when-the-heart-cannot-make-up-its-mind',
    expectedFilename: 'bahire bole dure thakuk.png',
    keywords: ['bahir', 'bahire', 'dure thakuk', 'bhitore', 'vitor bole'],
  },
  {
    slug: 'the-cruelest-kind-of-gratitude-thank-you-for-breaking-me',
    expectedFilename: 'utshorgo.png',
    keywords: ['utshorgo', 'utsargo', 'arnob', 'gratitude', 'breaking me', 'bhelenge'],
  },
  {
    slug: 'chini-na-abar-bodhhoy-chini-the-strange-uncertainty-of-love',
    expectedFilename: 'Tomay valobashina.png',
    keywords: ['valobashina', 'bhalobashina', 'chini na', 'chini-na', 'bodhhoy'],
  },
  {
    slug: 'aaj-jaane-ki-zid-na-karo-if-we-meet-again',
    expectedFilename: 'dhoro jodi.png',
    keywords: ['dhoro jodi', 'dhoro', 'spandan', 'sandhya', 'shondhe', 'aaj jaane'],
  },
  {
    slug: 'what-is-special-about-the-vampire-diaries',
    expectedFilename: 'tvd.png',
    keywords: ['tvd', 'vampire', 'diaries', 'damon', 'stefan', 'elena', 'mystic falls'],
  },
  {
    slug: 'why-you-shouldnt-watch-the-mentalist',
    expectedFilename: 'mentalist.png',
    keywords: ['mentalist', 'the mentalist', 'patrick jane', 'red john'],
  },
  {
    slug: 'rewatch-wake-up-sid-even-after-the-100th-time',
    expectedFilename: 'Wake Up Sid.png',
    keywords: ['wake up sid', 'wake up', 'sid', 'konkona', 'aisha'],
  },
  {
    slug: 'bangladesh-bank-heist-the-details-that-made-me-keep-reading',
    expectedFilename: 'bangladesh bank heist.png',
    keywords: ['bangladesh', 'bank heist', 'heist', 'swift', 'cyber', 'typo'],
  },
];

export function findArticleSlugForFileName(
  filename: string,
  articles: RabbitHoleArticle[]
): string | null {
  const normalized = filename.toLowerCase().replace(/\.[^/.]+$/, '').trim();

  // 1. Direct keyword rules
  for (const rule of ARTICLE_PHOTO_MATCH_RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw.toLowerCase()))) {
      const match = articles.find((a) => a.slug === rule.slug);
      if (match) return match.slug;
    }
  }

  // 2. Exact match against expected filenames
  for (const rule of ARTICLE_PHOTO_MATCH_RULES) {
    const expectedBase = rule.expectedFilename.toLowerCase().replace(/\.[^/.]+$/, '');
    if (normalized === expectedBase || normalized.includes(expectedBase) || expectedBase.includes(normalized)) {
      const match = articles.find((a) => a.slug === rule.slug);
      if (match) return match.slug;
    }
  }

  // 3. Fallback match on slug and title tokens
  for (const article of articles) {
    const slugWords = article.slug.split('-').filter((w) => w.length > 3);
    const titleWords = article.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const allWords = [...slugWords, ...titleWords];
    if (allWords.some((w) => normalized.includes(w))) {
      return article.slug;
    }
  }

  return null;
}

export const FeaturedPhotoManagerModal: React.FC<FeaturedPhotoManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [customMap, setCustomMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [matchDetails, setMatchDetails] = useState<{ filename: string; articleTitle: string; slug: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const singleInputRef = useRef<HTMLInputElement>(null);
  const [selectedSlotSlug, setSelectedSlotSlug] = useState<string | null>(null);

  // Load existing custom images
  const loadCustomImages = async () => {
    const all = await getAllCustomImages();
    setCustomMap(all);
  };

  useEffect(() => {
    if (isOpen) {
      loadCustomImages();
      setStatusMessage(null);
      setMatchDetails([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeArticles = getAllArticles();
  const serialTargetArticles = activeArticles.slice(0, 18);

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  };

  // Smart Matching batch selection: Matches uploaded image files by filename to article title & keywords
  const handleBatchFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setLoading(true);
    setStatusMessage('Matching images to articles by file name and title...');

    try {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));

      if (fileArray.length === 0) {
        setStatusMessage('No valid image files found.');
        setLoading(false);
        return;
      }

      const assignedSlugs = new Set<string>();
      const batchToSave: { slug: string; dataUrl: string }[] = [];
      const successfulMatches: { filename: string; articleTitle: string; slug: string }[] = [];
      const unmatchedFiles: File[] = [];

      // Step 1: Match files with explicit title/keyword rules
      for (const file of fileArray) {
        const matchedSlug = findArticleSlugForFileName(file.name, activeArticles);
        if (matchedSlug && !assignedSlugs.has(matchedSlug)) {
          assignedSlugs.add(matchedSlug);
          const dataUrl = await fileToDataUrl(file);
          batchToSave.push({ slug: matchedSlug, dataUrl });
          const article = activeArticles.find((a) => a.slug === matchedSlug);
          successfulMatches.push({
            filename: file.name,
            articleTitle: article ? `#${article.number} ${article.title}` : matchedSlug,
            slug: matchedSlug,
          });
        } else {
          unmatchedFiles.push(file);
        }
      }

      // Step 2: For any remaining unassigned files, assign in serial order to remaining empty slots in first 18
      const remainingTargetArticles = serialTargetArticles.filter((a) => !assignedSlugs.has(a.slug));
      for (let i = 0; i < unmatchedFiles.length && i < remainingTargetArticles.length; i++) {
        const file = unmatchedFiles[i];
        const article = remainingTargetArticles[i];
        assignedSlugs.add(article.slug);
        const dataUrl = await fileToDataUrl(file);
        batchToSave.push({ slug: article.slug, dataUrl });
        successfulMatches.push({
          filename: file.name,
          articleTitle: `#${article.number} ${article.title} (Sequential)`,
          slug: article.slug,
        });
      }

      await saveBatchImages(batchToSave);
      await loadCustomImages();
      setMatchDetails(successfulMatches);

      setStatusMessage(
        `Successfully matched and applied ${batchToSave.length} featured image${
          batchToSave.length > 1 ? 's' : ''
        } by article title and file name!`
      );
    } catch (err) {
      console.error(err);
      setStatusMessage('Error processing images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle single slot file replacement
  const handleSingleSlotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSlotSlug) return;
    setLoading(true);

    try {
      const dataUrl = await fileToDataUrl(file);
      await saveCustomImage(selectedSlotSlug, dataUrl);
      await loadCustomImages();
      const article = activeArticles.find((a) => a.slug === selectedSlotSlug);
      setStatusMessage(`Updated cover photo for: ${article ? article.title : selectedSlotSlug}`);
    } catch (err) {
      console.error(err);
      setStatusMessage('Error saving image.');
    } finally {
      setLoading(false);
      setSelectedSlotSlug(null);
      if (singleInputRef.current) singleInputRef.current.value = '';
    }
  };

  const [isSyncing, setIsSyncing] = useState(false);
  const handleSyncToProjectFiles = async () => {
    setIsSyncing(true);
    setStatusMessage('Saving custom photos directly into project files for published site...');
    try {
      const res = await syncAllIndexedDBImagesToServer();
      if (res.success && res.syncedCount > 0) {
        setStatusMessage(`Successfully saved ${res.syncedCount} photo${res.syncedCount > 1 ? 's' : ''} to project files! They will be permanently live on your published site.`);
      } else if (res.syncedCount === 0) {
        setStatusMessage('No custom photos to sync. All articles are using default project images.');
      } else {
        setStatusMessage('Photos saved locally. Ready for publishing.');
      }
    } catch {
      setStatusMessage('Error syncing photos to project files.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResetSlot = async (slug: string) => {
    await deleteCustomImage(slug);
    await loadCustomImages();
    setStatusMessage('Reverted photo to default cover.');
  };

  const handleResetAll = async () => {
    if (window.confirm('Reset all custom photos back to default bundled images?')) {
      await clearAllCustomImages();
      await loadCustomImages();
      setMatchDetails([]);
      setStatusMessage('All photos reset to default.');
    }
  };

  const customCount = Object.keys(customMap).length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-manager-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        className="relative w-full max-w-4xl bg-[#0d121f] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 id="photo-manager-title" className="text-lg font-bold text-white flex items-center gap-2">
                Featured Photo Manager
                {customCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {customCount} custom photo{customCount > 1 ? 's' : ''} active
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Smart Name-to-Title Matching for Articles 01 through 18
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status Message */}
          {statusMessage && (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs sm:text-sm flex items-start gap-3">
              <Sparkles className="w-5 h-5 flex-shrink-0 text-purple-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">{statusMessage}</p>
                {matchDetails.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-purple-500/20 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono">
                    {matchDetails.map((m, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-purple-300/90 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-white truncate font-semibold">{m.filename}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-purple-300 truncate">{m.articleTitle}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Drag & Drop Batch Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) {
                handleBatchFiles(e.dataTransfer.files);
              }
            }}
            className="border-2 border-dashed border-purple-500/40 hover:border-purple-400/80 bg-purple-950/20 hover:bg-purple-950/30 transition-all rounded-2xl p-6 text-center cursor-pointer group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleBatchFiles(e.target.files);
                }
              }}
            />
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/20 group-hover:scale-110 transition-transform flex items-center justify-center text-purple-400">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Select or Drop Your 18 Photos Here (Smart Title Matching)
            </h3>
            <p className="text-xs text-slate-400 font-mono max-w-lg mx-auto mb-3 leading-relaxed">
              Drop all 18 photos in any order! The engine automatically inspects each image file name (e.g. <span className="text-purple-300 font-semibold">Wake Up Sid.png</span>, <span className="text-purple-300 font-semibold">mentalist.png</span>, <span className="text-purple-300 font-semibold">tvd.png</span>, <span className="text-purple-300 font-semibold">dhoro jodi.png</span>, <span className="text-purple-300 font-semibold">Tomay valobashina.png</span>, <span className="text-purple-300 font-semibold">utshorgo.png</span>) and maps it to the exact corresponding article.
            </p>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-medium shadow-lg shadow-purple-900/40 transition-all">
              <Upload className="w-4 h-4" />
              Browse 18 Photos From Device
            </span>
          </div>

          {/* Hidden single input */}
          <input
            ref={singleInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSingleSlotUpload}
          />

          {/* Serial Slot Mapping */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                  Matched Articles & Image Assignment
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Each slot shows its title and expected file name
                </p>
              </div>
              {customCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset all to default
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeArticles.map((article, idx) => {
                const isSerialTarget = idx < 18;
                const isCustom = Boolean(customMap[article.slug]);
                const rule = ARTICLE_PHOTO_MATCH_RULES.find((r) => r.slug === article.slug);
                const bundledAsset = ARTICLE_IMAGE_MAP[article.slug];
                const currentSrc =
                  customMap[article.slug] || bundledAsset || article.image || `/images/featured/${article.slug}.jpg`;

                return (
                  <div
                    key={article.slug}
                    className={`p-3 rounded-2xl border flex items-center gap-3 transition-colors ${
                      isCustom
                        ? 'bg-purple-950/40 border-purple-500/50 shadow-md'
                        : isSerialTarget
                        ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/20 border-slate-800/40 opacity-80'
                    }`}
                  >
                    {/* Thumbnail preview */}
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0 relative group">
                      <img
                        src={currentSrc}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isCustom && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shadow">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold">
                          #{article.number}
                        </span>
                        {rule && (
                          <span className="text-[10px] font-mono text-purple-300/90 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-500/30 truncate">
                            {rule.expectedFilename}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-white truncate" title={article.title}>
                        {article.title}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {isCustom ? (
                          <span className="text-emerald-400 font-medium">Custom Match Active</span>
                        ) : (
                          'Default Cover'
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        title="Upload/replace photo for this writing"
                        onClick={() => {
                          setSelectedSlotSlug(article.slug);
                          singleInputRef.current?.click();
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                      >
                        Change
                      </button>
                      {isCustom && (
                        <button
                          type="button"
                          title="Reset to default"
                          onClick={() => handleResetSlot(article.slug)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Title-matched photos update live across all cards & detail pages.</span>
          </div>

          <div className="flex items-center gap-2.5">
            {customCount > 0 && (
              <button
                type="button"
                onClick={handleSyncToProjectFiles}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs font-mono transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
                title="Saves all custom images directly to project public folder so they are permanently included in the published build"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSyncing ? 'Saving to Project...' : 'Commit to Published Site'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs font-mono transition-colors shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
