import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import esTranslations from '../locales/es.json';
import enTranslations from '../locales/en.json';
import caTranslations from '../locales/ca.json';
import frTranslations from '../locales/fr.json';
import deTranslations from '../locales/de.json';
import itTranslations from '../locales/it.json';
import ptTranslations from '../locales/pt.json';

const resources = {
  es: { translation: esTranslations },
  en: { translation: enTranslations },
  ca: { translation: caTranslations },
  fr: { translation: frTranslations },
  de: { translation: deTranslations },
  it: { translation: itTranslations },
  pt: { translation: ptTranslations }
};

export const supportedLanguages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'ca', name: 'Català' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' }
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      convertDetectedLanguage: (lng: string) => {
        // Map language codes to supported languages
        if (lng.startsWith('ca')) return 'ca';
        if (lng.startsWith('en')) return 'en';
        if (lng.startsWith('fr')) return 'fr';
        if (lng.startsWith('de')) return 'de';
        if (lng.startsWith('it')) return 'it';
        if (lng.startsWith('pt')) return 'pt';
        if (lng.startsWith('es')) return 'es';
        return 'es'; // Default to Spanish
      }
    }
  });

const localeMap: Record<string, string> = {
  es: 'es-ES',
  en: 'en-US',
  ca: 'ca-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-PT',
};

export function getLocale(): string {
  return localeMap[i18n.language] || localeMap['es'];
}

export function formatDate(
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return '-';
  const defaultOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date(date).toLocaleDateString(getLocale(), options || defaultOptions);
}

export function formatDateShort(date: string | Date | null | undefined): string {
  return formatDate(date, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateLong(date: string | Date | null | undefined): string {
  return formatDate(date, { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateCompact(date: string | Date | null | undefined): string {
  return formatDate(date, { day: 'numeric', month: 'short' });
}

export default i18n;
