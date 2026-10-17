import React, { useState, useEffect } from 'react';
import { useAuthorMode, verifyPasscode } from '../utils/authorAuth';
import { Unlock, ShieldCheck, Eye, EyeOff, X, KeyRound, Sparkles, LogOut } from 'lucide-react';

interface AuthorAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthorAccessModal: React.FC<AuthorAccessModalProps> = ({ isOpen, onClose }) => {
  const {
    isAuthenticated,
    isAuthor,
    isPublicPreview,
    setPublicPreview,
    enableAuthorMode,
    disableAuthorMode,
  } = useAuthorMode();
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPasscode(passcode)) {
      enableAuthorMode();
      onClose();
    } else {
      setErrorMsg('Incorrect passcode. Please enter your author passcode (e.g. jebs or 5).');
    }
  };

  const handleTogglePreview = () => {
    setPublicPreview(!isPublicPreview);
    onClose();
  };

  const handleSignOut = () => {
    disableAuthorMode();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="author-access-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-[#0b0f1a] border border-purple-500/30 p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {isAuthenticated ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <KeyRound className="w-5 h-5 text-purple-400" />
            )}
          </div>
          <div>
            <div className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
              AUTHOR SETTINGS
            </div>
            <h3 id="author-access-title" className="text-lg font-display font-bold text-white">
              {isAuthenticated ? 'Owner Controls' : 'Owner Sign-In'}
            </h3>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-slate-400">Current View Status:</div>
              <div className="text-sm font-semibold flex items-center gap-2">
                {isPublicPreview ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-amber-300">Public View (Edit Buttons Hidden)</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-300">Author Mode (Edit Buttons Visible)</span>
                  </>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isPublicPreview
                ? 'All Update, Delete, and Upload buttons are currently hidden so you can experience the site exactly as public visitors do.'
                : 'All Update Writing, Delete This, and Replace Photo buttons are currently visible for your editing.'}
            </p>

            <div className="pt-2 flex flex-col gap-2">
              {/* Primary Toggle View Button */}
              <button
                type="button"
                onClick={handleTogglePreview}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {isPublicPreview ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Return to Author Mode</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 text-amber-300" />
                    <span>Preview as Public Viewer</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors py-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock & Sign Out</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUnlock} className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your passcode to enable editing and deletion controls.
            </p>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1.5 uppercase">
                Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg(null);
                }}
                autoFocus
                placeholder="Enter author passcode (e.g. jebs or 5)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-400 font-mono"
              />
              {errorMsg && (
                <p className="text-[11px] font-mono text-rose-400 mt-1.5">{errorMsg}</p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-mono transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock Author Mode</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
