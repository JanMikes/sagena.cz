'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocaleContextType {
  alternateLocaleUrl: string | null;
  setAlternateLocaleUrl: (url: string | null) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  alternateLocaleUrl: null,
  setAlternateLocaleUrl: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [alternateLocaleUrl, setAlternateLocaleUrl] = useState<string | null>(null);

  return (
    <LocaleContext.Provider value={{ alternateLocaleUrl, setAlternateLocaleUrl }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  return useContext(LocaleContext);
}

/**
 * Component to set the alternate locale URL from page data
 * Include this in your page component to set the correct language switcher URL
 */
export function SetAlternateLocaleUrl({ url }: { url: string | null }) {
  const { setAlternateLocaleUrl } = useLocaleContext();

  useEffect(() => {
    setAlternateLocaleUrl(url);
    return () => setAlternateLocaleUrl(null);
  }, [url, setAlternateLocaleUrl]);

  return null;
}
