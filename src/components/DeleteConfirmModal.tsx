import React from 'react';
import { RabbitHoleArticle } from '../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  article?: RabbitHoleArticle | null;
  articleTitle?: string;
  onClose: () => void;
  onConfirm?: () => void;
  onConfirmDelete?: (slug: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  article,
  articleTitle,
  onClose,
  onConfirm,
  onConfirmDelete,
}) => {
  if (!isOpen) return null;

  const displayTitle = article?.title || articleTitle || 'this article';
  const targetSlug = article?.slug;

  const handleConfirm = () => {
    if (onConfirmDelete && targetSlug) {
      onConfirmDelete(targetSlug);
    } else if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold font-display text-white mb-2">Delete Writing Piece?</h3>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Are you sure you want to remove <strong className="text-white">"{displayTitle}"</strong>?
          This will permanently delete this dispatch from your collection.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-900/30"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Writing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
