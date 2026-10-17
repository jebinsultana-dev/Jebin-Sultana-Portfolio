import React, { useState, useEffect } from 'react';
import { RabbitHoleArticle } from '../types';
import { getCustomImage } from '../utils/customImageStorage';
import { ARTICLE_IMAGE_MAP } from '../data/articleImageMap';

interface ArticleFeaturedCoverProps {
  article: RabbitHoleArticle;
  variant?: 'card' | 'hero';
  className?: string;
}

export const ArticleFeaturedCover: React.FC<ArticleFeaturedCoverProps> = ({
  article,
  variant = 'card',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const isHero = variant === 'hero';

  // Reset error when article changes
  useEffect(() => {
    setImageError(false);
  }, [article.slug]);

  useEffect(() => {
    let isMounted = true;
    getCustomImage(article.slug).then((img) => {
      if (isMounted) setCustomImage(img);
    });

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug?: string }>;
      if (!customEvent.detail?.slug || customEvent.detail.slug === article.slug) {
        getCustomImage(article.slug).then((img) => {
          if (isMounted) {
            setCustomImage(img);
            setImageError(false);
          }
        });
      }
    };

    window.addEventListener('custom-images-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('custom-images-updated', handleUpdate);
    };
  }, [article.slug]);

  // Contextual photo URL: custom uploaded photo takes priority, then Vite bundled hashed asset, then public fallback
  const bundledAsset = ARTICLE_IMAGE_MAP[article.slug];
  const photoUrl = customImage || bundledAsset || article.image || `/images/featured/${article.slug}.jpg`;

  // Specific contextual photo attributions & captions
  const getPhotoContextLabel = (): string => {
    if (article.visualTheme?.headline && article.visualTheme?.badge) {
      return `${article.visualTheme.headline} · ${article.visualTheme.badge}`;
    }
    return `${article.title} · ${article.primaryCategory}`;
  };

  const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
    Music: {
      bg: 'bg-emerald-500/20 backdrop-blur-md',
      text: 'text-emerald-300',
      border: 'border-emerald-500/40',
    },
    Movies: {
      bg: 'bg-amber-500/20 backdrop-blur-md',
      text: 'text-amber-300',
      border: 'border-amber-500/40',
    },
    Series: {
      bg: 'bg-purple-500/20 backdrop-blur-md',
      text: 'text-purple-300',
      border: 'border-purple-500/40',
    },
    Investigation: {
      bg: 'bg-cyan-500/20 backdrop-blur-md',
      text: 'text-cyan-300',
      border: 'border-cyan-500/40',
    },
    History: {
      bg: 'bg-rose-500/20 backdrop-blur-md',
      text: 'text-rose-300',
      border: 'border-rose-500/40',
    },
  };

  const badgeStyle = categoryColorMap[article.primaryCategory] || {
    bg: 'bg-purple-500/20 backdrop-blur-md',
    text: 'text-purple-300',
    border: 'border-purple-500/40',
  };

  return (
    <div
      className={`relative w-full overflow-hidden select-none border border-slate-800/80 rounded-2xl bg-slate-950 ${
        isHero ? 'aspect-[16/9] md:aspect-[21/9]' : 'aspect-[16/10]'
      } ${className}`}
    >
      {/* Standard Contextual Photo */}
      {!imageError ? (
        <img
          src={photoUrl}
          alt={article.title}
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
          style={{
            background: `radial-gradient(circle at center, ${article.visualTheme?.accentColor || '#6366f1'}22 0%, #090d16 85%)`,
          }}
        >
          <div
            className="w-16 h-16 rounded-full mb-3 flex items-center justify-center border text-lg font-bold"
            style={{
              borderColor: `${article.visualTheme?.accentColor || '#a855f7'}40`,
              backgroundColor: `${article.visualTheme?.accentColor || '#a855f7'}20`,
              color: article.visualTheme?.accentColor || '#c084fc',
            }}
          >
            #{article.number}
          </div>
          {article.visualTheme?.nativeScript && (
            <p className="text-xl md:text-2xl font-serif text-white/90 mb-1 tracking-wide">
              {article.visualTheme.nativeScript}
            </p>
          )}
          <h4 className="text-xs md:text-sm font-semibold text-slate-200 line-clamp-1 max-w-xs">
            {article.visualTheme?.headline || article.title}
          </h4>
        </div>
      )}

      {/* Cinematic Vignette & Bottom Shadow */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Top Floating Badges */}
      <div className="absolute top-3 inset-x-3 md:top-4 md:inset-x-4 flex items-center justify-between gap-2 z-10">
        <span
          className={`px-2.5 py-1 rounded-md border font-mono text-[10px] md:text-xs font-semibold uppercase tracking-wider shadow-lg ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
        >
          {article.primaryCategory}
        </span>

        <span className="px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300 font-semibold shadow-md">
          #{article.number}
        </span>
      </div>

      {/* Bottom Contextual Legend / Caption */}
      <div className="absolute bottom-3 inset-x-3 md:bottom-4 md:inset-x-4 z-10 flex items-end justify-between gap-2">
        <div className="max-w-[85%]">
          <p className="text-[11px] md:text-xs font-mono text-slate-300/90 tracking-wide line-clamp-1 drop-shadow-md">
            {getPhotoContextLabel()}
          </p>
        </div>
        {isHero && article.visualTheme?.nativeScript && (
          <span className="text-[10px] md:text-xs font-mono text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-500/30">
            {article.visualTheme.nativeScript}
          </span>
        )}
      </div>
    </div>
  );
};
