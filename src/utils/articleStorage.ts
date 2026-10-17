import { useState, useEffect, useCallback } from 'react';
import { RabbitHoleArticle } from '../types';
import { rabbitHolesArticles } from '../data/rabbitHolesArticles';

const STORAGE_KEY = 'jebin_rabbit_holes_articles_v1';
const EVENT_NAME = 'rabbit-articles-updated';

/**
 * Check if the stored articles differ from the default static articles
 */
export function isArticlesModified(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Retrieve all active articles (from localStorage if modified, otherwise default static data)
 */
export function getAllArticles(): RabbitHoleArticle[] {
  if (typeof window === 'undefined') {
    return rabbitHolesArticles;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return rabbitHolesArticles;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
        .filter((item) => item && item.slug !== 'should-you-hate-hitler')
        .map((item) => {
        const canonical = rabbitHolesArticles.find((c) => c.slug === item.slug);
        if (
          canonical &&
          (item.slug === 'tum-ho-when-someone-becomes-your-whole-world' ||
            item.slug === 'maula-mere-maula-when-love-becomes-a-form-of-prayer' ||
            item.slug === 'bangladesh-bank-heist-the-details-that-made-me-keep-reading')
        ) {
          return {
            ...item,
            primaryCategory: canonical.primaryCategory,
            categories: canonical.categories,
            visualTheme: {
              ...item.visualTheme,
              badge: canonical.visualTheme?.badge || item.visualTheme?.badge,
            },
          };
        }
        return item;
      });
    }
    return rabbitHolesArticles;
  } catch (err) {
    console.error('Failed to parse articles from localStorage:', err);
    return rabbitHolesArticles;
  }
}

/**
 * Retrieve a single article by its unique slug
 */
export function getArticleBySlug(slug: string): RabbitHoleArticle | undefined {
  const articles = getAllArticles();
  return articles.find((article) => article.slug === slug);
}

/**
 * Update an existing article, or append it if it's new
 */
export function updateArticle(updatedArticle: RabbitHoleArticle): void {
  try {
    const articles = getAllArticles();
    const existingIndex = articles.findIndex((a) => a.slug === updatedArticle.slug);

    let nextArticles: RabbitHoleArticle[];
    if (existingIndex >= 0) {
      nextArticles = [...articles];
      nextArticles[existingIndex] = updatedArticle;
    } else {
      nextArticles = [updatedArticle, ...articles];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextArticles));
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, {
        detail: { slug: updatedArticle.slug, action: 'update', article: updatedArticle },
      })
    );
  } catch (err) {
    console.error('Failed to save updated article to localStorage:', err);
  }
}

/**
 * Delete an article by slug
 */
export function deleteArticle(slug: string): void {
  try {
    const articles = getAllArticles();
    const nextArticles = articles.filter((a) => a.slug !== slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextArticles));
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, {
        detail: { slug, action: 'delete' },
      })
    );
  } catch (err) {
    console.error('Failed to delete article from localStorage:', err);
  }
}

/**
 * Restore articles back to original default dataset
 */
export function restoreDefaultArticles(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, {
        detail: { action: 'restore' },
      })
    );
  } catch (err) {
    console.error('Failed to reset articles in localStorage:', err);
  }
}

/**
 * Custom React hook for subscribing to articles state with reactivity across updates/deletions
 */
export function useArticles() {
  const [articles, setArticles] = useState<RabbitHoleArticle[]>(() => getAllArticles());
  const [isModified, setIsModified] = useState<boolean>(() => isArticlesModified());

  const refresh = useCallback(() => {
    setArticles(getAllArticles());
    setIsModified(isArticlesModified());
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdate = () => {
      refresh();
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refresh]);

  return {
    articles,
    isModified,
    updateArticle,
    deleteArticle,
    restoreDefaultArticles,
  };
}
