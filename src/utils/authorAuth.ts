import { useState, useEffect } from 'react';

const AUTH_KEY = 'jebin_portfolio_author_authenticated';
const PREVIEW_KEY = 'jebin_portfolio_public_preview_mode';
const AUTH_EVENT = 'author-auth-changed';

const VALID_PASSCODES = ['jebs', '5', 'jebin', 'author', 'jebin2024', 'rabbit'];

export function verifyPasscode(code: string): boolean {
  if (!code) return false;
  return VALID_PASSCODES.includes(code.trim().toLowerCase());
}

export function isAuthorAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_KEY) === 'true';
}

export function isPublicPreviewActive(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(PREVIEW_KEY) === 'true';
}

export function useAuthorMode() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isAuthorAuthenticated());
  const [isPublicPreview, setIsPublicPreviewState] = useState<boolean>(() => isPublicPreviewActive());

  const isAuthor = isAuthenticated && !isPublicPreview;

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(isAuthorAuthenticated());
      setIsPublicPreviewState(isPublicPreviewActive());
    };

    window.addEventListener(AUTH_EVENT, handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_EVENT, handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const enableAuthorMode = () => {
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.removeItem(PREVIEW_KEY);
    setIsAuthenticated(true);
    setIsPublicPreviewState(false);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT));
  };

  const disableAuthorMode = () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(PREVIEW_KEY);
    setIsAuthenticated(false);
    setIsPublicPreviewState(false);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT));
  };

  const setPublicPreview = (val: boolean) => {
    if (val) {
      localStorage.setItem(PREVIEW_KEY, 'true');
    } else {
      localStorage.removeItem(PREVIEW_KEY);
    }
    setIsPublicPreviewState(val);
    window.dispatchEvent(new CustomEvent(AUTH_EVENT));
  };

  return {
    isAuthenticated,
    isAuthor,
    isPublicPreview,
    setPublicPreview,
    enableAuthorMode,
    disableAuthorMode,
  };
}
