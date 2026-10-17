export type PageRoute = 'home' | 'work' | 'rabbit-holes' | 'rabbit-hole-article';

export interface WritingSample {
  id: string;
  number: string;
  formatLabel: string;
  title: string;
  client: string;
  role: string;
  approach: string;
  link?: string;
  status?: 'published' | 'pending';
}

export interface VideoSample {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  videoUrl?: string;
  platform: string;
  duration?: string;
  highlight?: string;
}

export interface CompanyRole {
  id: string;
  name: string;
  shortName: string;
  role: string;
  period?: string;
  highlight?: boolean;
  accentColor: string;
  badge?: string;
  description?: string;
}

export type ArticleCategory = 'Music' | 'Movies' | 'Series' | 'Investigation' | 'History';

export interface ArticleVisualTheme {
  themeStyle:
    | 'lyric-poster'
    | 'ghazal-gold'
    | 'minimal-distance'
    | 'rabindra-vintage'
    | 'folk-bird'
    | 'baul-mystic'
    | 'lalon-mandala'
    | 'folk-terracotta'
    | 'cinematic-rock'
    | 'sufi-halo'
    | 'acoustic-stars'
    | 'split-mind'
    | 'kintsugi-gold'
    | 'urban-rain'
    | 'midnight-ghazal'
    | 'gothic-noir'
    | 'mentalist-red'
    | 'indie-cinema'
    | 'cyber-terminal'
    | 'archival-time';
  accentColor: string;
  secondaryColor?: string;
  badge: string;
  headline: string;
  subtitle?: string;
  quote?: string;
  nativeScript?: string;
  motif?: 'soundwave' | 'vinyl' | 'calligraphy' | 'bird' | 'compass' | 'flame' | 'film' | 'grid' | 'code' | 'newspaper';
}

export interface RabbitHoleArticle {
  slug: string;
  number: string;
  title: string;
  primaryCategory: ArticleCategory;
  categories: string[];
  tagline: string;
  readTime: string;
  image?: string;
  visualTheme: ArticleVisualTheme;
  intro: string;
  content: {
    heading?: string;
    paragraphs: string[];
    pullQuote?: string;
    thoughtExercise?: string;
  }[];
  references?: {
    title: string;
    url: string;
  }[];
  concludingThoughts: string;
}
