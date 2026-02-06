import { describe, it, expect } from 'vitest';
import esTranslations from '../locales/es.json';
import enTranslations from '../locales/en.json';
import caTranslations from '../locales/ca.json';
import frTranslations from '../locales/fr.json';
import deTranslations from '../locales/de.json';

const allTranslations = {
  es: esTranslations,
  en: enTranslations,
  ca: caTranslations,
  fr: frTranslations,
  de: deTranslations,
};

function getKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const k in obj) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getKeys(obj[k] as Record<string, unknown>, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

describe('Internationalization (i18n)', () => {
  const langs = ['es', 'en', 'ca', 'fr', 'de'] as const;

  langs.forEach(lang => {
    it(`should have ${lang} translations with required sections`, () => {
      const t = allTranslations[lang];
      expect(t).toBeDefined();
      expect(t.common).toBeDefined();
      expect(t.nav).toBeDefined();
      expect(t.hero).toBeDefined();
    });
  });

  it('should have matching top-level keys across all languages', () => {
    const enKeys = Object.keys(enTranslations).sort();
    langs.forEach(lang => {
      if (lang === 'en') return;
      const langKeys = Object.keys(allTranslations[lang]).sort();
      expect(langKeys).toEqual(enKeys);
    });
  });

  it('should have matching key count across all languages', () => {
    const enKeyCount = getKeys(enTranslations as Record<string, unknown>).length;
    langs.forEach(lang => {
      if (lang === 'en') return;
      const langKeyCount = getKeys(allTranslations[lang] as Record<string, unknown>).length;
      expect(langKeyCount).toBe(enKeyCount);
    });
  });

  it('should have all navigation keys translated in all languages', () => {
    const navKeys = ['home', 'services', 'pricing', 'faq', 'contact', 'login', 'register', 'dashboard'];
    
    langs.forEach(lang => {
      navKeys.forEach(key => {
        expect((allTranslations[lang].nav as Record<string, string>)[key]).toBeDefined();
      });
    });
  });

  it('should have all common keys translated in all languages', () => {
    const commonKeys = ['loading', 'save', 'cancel', 'confirm', 'delete', 'edit', 'back', 'next'];
    
    langs.forEach(lang => {
      commonKeys.forEach(key => {
        expect((allTranslations[lang].common as Record<string, string>)[key]).toBeDefined();
      });
    });
  });

  it('should have order status translations in all languages', () => {
    const statusKeys = ['pending', 'processing', 'paid', 'completed', 'cancelled'];
    
    langs.forEach(lang => {
      statusKeys.forEach(key => {
        expect((allTranslations[lang].dashboard.orders.status as Record<string, string>)[key]).toBeDefined();
      });
    });
  });
});
