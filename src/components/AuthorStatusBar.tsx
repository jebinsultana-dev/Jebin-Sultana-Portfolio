import React, { useState, useEffect } from 'react';
import { useAuthorMode } from '../utils/authorAuth';
import { AuthorAccessModal } from './AuthorAccessModal';
import { syncAllIndexedDBImagesToServer, getAllCustomImages } from '../utils/customImageStorage';
import { ShieldCheck, Eye, EyeOff, Save, Check } from 'lucide-react';

export const AuthorStatusBar: React.FC = () => {
  const { isAuthenticated, isPublicPreview, setPublicPreview } = useAuthorMode();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customPhotoCount, setCustomPhotoCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  // Check if custom photos exist
  const checkCustomPhotos = async () => {
    const all = await getAllCustomImages();
    setCustomPhotoCount(Object.keys(all).length);
  };

  useEffect(() => {
    checkCustomPhotos();
    const handleUpdate = () => checkCustomPhotos();
    window.addEventListener('custom-images-updated', handleUpdate);
    return () => window.removeEventListener('custom-images-updated', handleUpdate);
  }, []);

  const handleSyncToProjectFiles = async () => {
    setIsSyncing(true);
    try {
      const res = await syncAllIndexedDBImagesToServer();
      if (res.success) {
        setJustSynced(true);
        setTimeout(() => setJustSynced(false), 3000);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Keyboard shortcut listener (Alt + E) to quickly open author access modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Only show the floating pill to authenticated owner / author
  if (!isAuthenticated) {
    return (
      <AuthorAccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    );
  }

  return (
    <>
      {/* Floating Author & Preview Switcher Pill */}
      <aside
        aria-label="Author preview controls"
        className="fixed bottom-4 left-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        <div className="flex flex-wrap items-center gap-2 p-1.5 pr-2.5 rounded-full bg-slate-900/95 border border-purple-500/40 text-xs font-mono text-slate-200 shadow-2xl backdrop-blur-md">
          {isPublicPreview ? (
            /* Mode 1: Public Preview is Active (Buttons are hidden) */
            <>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Public View (Buttons Hidden)</span>
              </div>

              <button
                type="button"
                onClick={() => setPublicPreview(false)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] transition-all cursor-pointer shadow-md active:scale-95"
                title="Switch back to Author Mode to show edit and delete buttons"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Back to Author Mode</span>
              </button>
            </>
          ) : (
            /* Mode 2: Author Mode is Active (Buttons are visible) */
            <>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 transition-colors cursor-pointer"
                title="Click to view author settings"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-[11px]">Author Mode Active</span>
              </button>

              {customPhotoCount > 0 && (
                <button
                  type="button"
                  onClick={handleSyncToProjectFiles}
                  disabled={isSyncing}
                  className="flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white px-2.5 py-1 rounded-full bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 transition-colors cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                  title="Save custom photos directly to project files so they appear on the published site"
                >
                  {justSynced ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Synced to Published Site!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isSyncing ? 'Syncing...' : `Save ${customPhotoCount} Photo${customPhotoCount > 1 ? 's' : ''} to Published Site`}</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => setPublicPreview(true)}
                className="flex items-center gap-1 text-[11px] text-slate-200 hover:text-white px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700/80 active:scale-95"
                title="Hide all update and delete buttons to preview as a public viewer"
              >
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Preview as Public</span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Author Access / Sign In Modal */}
      <AuthorAccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
