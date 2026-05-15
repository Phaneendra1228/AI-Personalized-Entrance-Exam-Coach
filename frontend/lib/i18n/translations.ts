import { en } from './en';
import { hi } from './hi';
import { te } from './te';
import { ta } from './ta';
import { mr } from './mr';
import { bn } from './bn';

export type SupportedLocale = 'en' | 'hi' | 'te' | 'ta' | 'mr' | 'bn';

export const LANGUAGES: { code: SupportedLocale; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
    { code: 'bn', label: 'বাংলা', flag: '🇮🇳' },
];

export const translations: Record<SupportedLocale, Record<string, unknown>> = { en, hi, te, ta, mr, bn };
