import React, { useState, useEffect } from 'react';
import { PageRoute, RabbitHoleArticle } from './types';
import { getArticleBySlug } from './utils/articleStorage';
import { syncAllIndexedDBImagesToServer } from './utils/customImageStorage';
import { Navbar } from './components/Navbar';
import { MotionCursor } from './components/MotionCursor';
import { GlobalMovingCar } from './components/GlobalMovingCar';
import { AuthorStatusBar } from './components/AuthorStatusBar';
import { HomePage } from './pages/HomePage';
import { WorkExperiencePage } from './pages/WorkExperiencePage';
import { RabbitHolesPage } from './pages/RabbitHolesPage';
import { RabbitHoleArticlePage } from './pages/RabbitHoleArticlePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedArticle, setSelectedArticle] = useState<RabbitHoleArticle | null>(null);

  // Automatically sync any user-uploaded photos from browser storage to project disk on preview launch
  useEffect(() => {
    syncAllIndexedDBImagesToServer().then((res) => {
      if (res.success && res.syncedCount > 0) {
        console.log(`[App AutoSync] Synced ${res.syncedCount} custom images from browser to project disk.`);
      }
    });
  }, []);

  // Sync with browser URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'work') {
        setCurrentPage('work');
      } else if (hash === 'rabbit-holes') {
        setCurrentPage('rabbit-holes');
      } else if (hash.startsWith('rabbit-hole/')) {
        const slug = hash.replace('rabbit-hole/', '');
        const found = getArticleBySlug(slug);
        if (found) {
          setSelectedArticle(found);
          setCurrentPage('rabbit-hole-article');
        } else {
          // If deleted or not found, fall back to rabbit-holes index
          setCurrentPage('rabbit-holes');
          window.location.hash = 'rabbit-holes';
        }
      } else if (hash === 'about') {
        setCurrentPage('home');
        setTimeout(() => {
          document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash === 'contact') {
        setTimeout(() => {
          document.getElementById('contact-footer')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Listen to article updates/deletes to keep selectedArticle in sync
  useEffect(() => {
    const handleArticleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ slug?: string; action?: string }>;
      if (selectedArticle) {
        if (customEvent.detail?.slug === selectedArticle.slug) {
          if (customEvent.detail.action === 'delete') {
            setSelectedArticle(null);
            setCurrentPage('rabbit-holes');
            window.location.hash = 'rabbit-holes';
          } else {
            const updated = getArticleBySlug(selectedArticle.slug);
            if (updated) {
              setSelectedArticle(updated);
            }
          }
        }
      }
    };

    window.addEventListener('rabbit-articles-updated', handleArticleUpdate);
    return () => window.removeEventListener('rabbit-articles-updated', handleArticleUpdate);
  }, [selectedArticle]);

  const navigateTo = (page: PageRoute, targetSectionId?: string) => {
    if (page === 'home') {
      if (targetSectionId) {
        if (currentPage !== 'home') {
          setCurrentPage('home');
          window.location.hash = targetSectionId === 'about-section' ? 'about' : 'contact';
          setTimeout(() => {
            document.getElementById(targetSectionId)?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } else {
          document.getElementById(targetSectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setCurrentPage('home');
        window.location.hash = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (page === 'work') {
      setCurrentPage('work');
      window.location.hash = 'work';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'rabbit-holes') {
      setCurrentPage('rabbit-holes');
      window.location.hash = 'rabbit-holes';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openArticle = (article: RabbitHoleArticle) => {
    setSelectedArticle(article);
    setCurrentPage('rabbit-hole-article');
    window.location.hash = `rabbit-hole/${article.slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-amber-400/20 selection:text-amber-200 overflow-x-hidden w-full max-w-full">
      {/* Custom Motion Cursor for Motionsite Feel */}
      <MotionCursor />

      {/* Global Animated Moving Courier Car across pages (hidden on article page for distraction-free reading) */}
      {currentPage !== 'rabbit-hole-article' && <GlobalMovingCar />}

      {/* Global Navigation */}
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      {/* Author Mode Status & Switcher */}
      <AuthorStatusBar />

      {/* Main Page View */}
      <main className="flex-1 w-full max-w-full min-w-0">
        {currentPage === 'home' && (
          <HomePage onNavigate={navigateTo} />
        )}

        {currentPage === 'work' && (
          <WorkExperiencePage onNavigate={navigateTo} />
        )}

        {currentPage === 'rabbit-holes' && (
          <RabbitHolesPage
            onNavigate={navigateTo}
            onSelectArticle={openArticle}
          />
        )}

        {currentPage === 'rabbit-hole-article' && selectedArticle && (
          <RabbitHoleArticlePage
            article={selectedArticle}
            onNavigate={navigateTo}
            onSelectArticle={openArticle}
          />
        )}
      </main>
    </div>
  );
}
