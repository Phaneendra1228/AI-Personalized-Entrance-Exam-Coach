'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, LANGUAGES } from '@/lib/i18n/translations';
import type { SupportedLocale } from '@/lib/i18n/translations';

interface LanguageContextType {
    locale: SupportedLocale;
    setLocale: (l: SupportedLocale) => void;
    t: (key: string) => string;
    languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<SupportedLocale>('en');

    useEffect(() => {
        const saved = localStorage.getItem('lf-lang') as SupportedLocale | null;
        if (saved && translations[saved]) setLocaleState(saved);
    }, []);

    const setLocale = (l: SupportedLocale) => {
        setLocaleState(l);
        localStorage.setItem('lf-lang', l);
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let val: Record<string, unknown> | string | undefined = translations[locale];
        for (const k of keys) {
            if (typeof val === 'object' && val !== null && k in val) {
                val = val[k] as Record<string, unknown> | string;
            } else {
                val = undefined;
                break;
            }
        }
        if (typeof val === 'string') return val;
        // fallback to English
        let fallback: Record<string, unknown> | string | undefined = translations['en'];
        for (const k of keys) {
            if (typeof fallback === 'object' && fallback !== null && k in fallback) {
                fallback = fallback[k] as Record<string, unknown> | string;
            } else {
                fallback = undefined;
                break;
            }
        }
        return typeof fallback === 'string' ? fallback : key;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t, languages: LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useTranslation must be used within LanguageProvider');
    return ctx;
}
