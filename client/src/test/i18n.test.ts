import { describe, it, expect } from 'vitest';
import esTranslations from '../locales/es.json';
import enTranslations from '../locales/en.json';

describe('Internationalization (i18n)', () => {
  it('should have Spanish translations', () => {
    expect(esTranslations).toBeDefined();
    expect(esTranslations.common).toBeDefined();
    expect(esTranslations.nav).toBeDefined();
    expect(esTranslations.hero).toBeDefined();
  });

  it('should have English translations', () => {
    expect(enTranslations).toBeDefined();
    expect(enTranslations.common).toBeDefined();
    expect(enTranslations.nav).toBeDefined();
    expect(enTranslations.hero).toBeDefined();
  });

  it('should have matching translation keys between ES and EN', () => {
    const esKeys = Object.keys(esTranslations);
    const enKeys = Object.keys(enTranslations);

    esKeys.forEach(key => {
      expect(enKeys).toContain(key);
    });
  });

  it('should have all navigation keys translated', () => {
    const navKeys = ['home', 'services', 'pricing', 'faq', 'contact', 'login', 'register', 'dashboard'];
    
    navKeys.forEach(key => {
      expect((esTranslations.nav as Record<string, string>)[key]).toBeDefined();
      expect((enTranslations.nav as Record<string, string>)[key]).toBeDefined();
    });
  });

  it('should have all common keys translated', () => {
    const commonKeys = ['loading', 'save', 'cancel', 'confirm', 'delete', 'edit', 'back', 'next'];
    
    commonKeys.forEach(key => {
      expect((esTranslations.common as Record<string, string>)[key]).toBeDefined();
      expect((enTranslations.common as Record<string, string>)[key]).toBeDefined();
    });
  });

  it('should have order status translations', () => {
    const statusKeys = ['pending', 'processing', 'paid', 'completed', 'cancelled'];
    
    statusKeys.forEach(key => {
      expect((esTranslations.dashboard.orders.status as Record<string, string>)[key]).toBeDefined();
      expect((enTranslations.dashboard.orders.status as Record<string, string>)[key]).toBeDefined();
    });
  });
});
