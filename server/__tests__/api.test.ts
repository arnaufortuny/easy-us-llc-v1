import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCached, setCache, invalidateCache, invalidateCachePrefix } from '../lib/cache';
import { compressImage } from '../lib/image-compress';
import { generate8DigitId, generateOrderCode, getStatePrefix, generateDocumentId, formatOrderDisplay } from '../lib/id-generator';
import { insertOrderSchema, insertLlcApplicationSchema } from '../../shared/schema';

describe('Cache utility', () => {
  beforeEach(() => {
    invalidateCachePrefix('');
  });

  it('returns null for missing keys', () => {
    expect(getCached('nonexistent')).toBeNull();
  });

  it('stores and retrieves data', () => {
    setCache('test-key', { hello: 'world' }, 60000);
    expect(getCached('test-key')).toEqual({ hello: 'world' });
  });

  it('stores and retrieves primitive values', () => {
    setCache('num-key', 42, 60000);
    expect(getCached('num-key')).toBe(42);

    setCache('str-key', 'hello', 60000);
    expect(getCached('str-key')).toBe('hello');
  });

  it('stores and retrieves arrays', () => {
    setCache('arr-key', [1, 2, 3], 60000);
    expect(getCached('arr-key')).toEqual([1, 2, 3]);
  });

  it('expires entries after TTL', async () => {
    setCache('expire-test', 'data', 50);
    await new Promise(r => setTimeout(r, 100));
    expect(getCached('expire-test')).toBeNull();
  });

  it('does not expire entries before TTL', () => {
    setCache('no-expire', 'data', 60000);
    expect(getCached('no-expire')).toBe('data');
  });

  it('invalidates specific key', () => {
    setCache('to-delete', 'data', 60000);
    invalidateCache('to-delete');
    expect(getCached('to-delete')).toBeNull();
  });

  it('invalidating non-existent key does not throw', () => {
    expect(() => invalidateCache('does-not-exist')).not.toThrow();
  });

  it('invalidates by prefix', () => {
    setCache('prefix:a', 'data1', 60000);
    setCache('prefix:b', 'data2', 60000);
    setCache('other:c', 'data3', 60000);
    invalidateCachePrefix('prefix:');
    expect(getCached('prefix:a')).toBeNull();
    expect(getCached('prefix:b')).toBeNull();
    expect(getCached('other:c')).toEqual('data3');
  });

  it('overwrites existing cache entry', () => {
    setCache('overwrite-key', 'first', 60000);
    setCache('overwrite-key', 'second', 60000);
    expect(getCached('overwrite-key')).toBe('second');
  });
});

describe('Image compression', () => {
  it('returns buffer unchanged for PDF files', async () => {
    const buf = Buffer.from('fake-pdf-content');
    const result = await compressImage(buf, 'document.pdf');
    expect(result).toBe(buf);
  });

  it('returns buffer unchanged for unknown extensions', async () => {
    const buf = Buffer.from('some-data');
    const result = await compressImage(buf, 'file.xyz');
    expect(result).toBe(buf);
  });

  it('returns buffer unchanged for .docx files', async () => {
    const buf = Buffer.from('word-doc-data');
    const result = await compressImage(buf, 'report.docx');
    expect(result).toBe(buf);
  });

  it('handles empty filename gracefully', async () => {
    const buf = Buffer.from('data');
    const result = await compressImage(buf, '');
    expect(result).toBe(buf);
  });

  it('handles filename without extension', async () => {
    const buf = Buffer.from('data');
    const result = await compressImage(buf, 'noextension');
    expect(result).toBe(buf);
  });
});

describe('ID generator', () => {
  describe('generate8DigitId', () => {
    it('generates an 8-digit string', () => {
      const id = generate8DigitId();
      expect(id).toHaveLength(8);
      expect(/^\d{8}$/.test(id)).toBe(true);
    });

    it('generates numeric-only IDs', () => {
      for (let i = 0; i < 20; i++) {
        const id = generate8DigitId();
        expect(Number(id)).toBeGreaterThanOrEqual(10000000);
        expect(Number(id)).toBeLessThan(100000000);
      }
    });

    it('generates unique IDs (100 samples)', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generate8DigitId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('getStatePrefix', () => {
    it('returns NM for New Mexico', () => {
      expect(getStatePrefix('New Mexico')).toBe('NM');
    });

    it('returns WY for Wyoming (case insensitive)', () => {
      expect(getStatePrefix('wyoming')).toBe('WY');
      expect(getStatePrefix('Wyoming')).toBe('WY');
    });

    it('returns DE for Delaware', () => {
      expect(getStatePrefix('Delaware')).toBe('DE');
    });

    it('returns US for unknown states', () => {
      expect(getStatePrefix('California')).toBe('US');
      expect(getStatePrefix('unknown')).toBe('US');
    });
  });

  describe('generateOrderCode', () => {
    it('generates code with state prefix and 8 digits', () => {
      const code = generateOrderCode('New Mexico');
      expect(code).toMatch(/^NM-\d{8}$/);
    });

    it('generates code with WY prefix for Wyoming', () => {
      const code = generateOrderCode('Wyoming');
      expect(code).toMatch(/^WY-\d{8}$/);
    });

    it('generates code with US prefix for unknown state', () => {
      const code = generateOrderCode('Texas');
      expect(code).toMatch(/^US-\d{8}$/);
    });
  });

  describe('generateDocumentId', () => {
    it('generates an 8-digit string', () => {
      const id = generateDocumentId();
      expect(id).toHaveLength(8);
      expect(/^\d{8}$/.test(id)).toBe(true);
    });
  });

  describe('formatOrderDisplay', () => {
    it('returns the request code when provided', () => {
      expect(formatOrderDisplay('NM-12345678')).toBe('NM-12345678');
    });

    it('returns N/A for null', () => {
      expect(formatOrderDisplay(null)).toBe('N/A');
    });

    it('returns N/A for undefined', () => {
      expect(formatOrderDisplay(undefined)).toBe('N/A');
    });
  });
});

describe('Validation schemas', () => {
  describe('insertOrderSchema', () => {
    it('accepts valid order data', () => {
      const validOrder = {
        userId: 'user-123',
        productId: 1,
        status: 'pending',
        amount: 5000,
        currency: 'EUR',
      };
      const result = insertOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it('rejects order without userId', () => {
      const invalidOrder = {
        productId: 1,
        amount: 5000,
      };
      const result = insertOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('rejects order without productId', () => {
      const invalidOrder = {
        userId: 'user-123',
        amount: 5000,
      };
      const result = insertOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('rejects order without amount', () => {
      const invalidOrder = {
        userId: 'user-123',
        productId: 1,
      };
      const result = insertOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('accepts order with optional discount fields', () => {
      const orderWithDiscount = {
        userId: 'user-123',
        productId: 1,
        amount: 5000,
        currency: 'EUR',
        discountCode: 'SAVE10',
        discountAmount: 500,
        originalAmount: 5500,
      };
      const result = insertOrderSchema.safeParse(orderWithDiscount);
      expect(result.success).toBe(true);
    });
  });

  describe('insertLlcApplicationSchema', () => {
    it('accepts valid LLC application data', () => {
      const validApp = {
        orderId: 1,
        ownerFullName: 'John Doe',
        ownerEmail: 'john@example.com',
        companyName: 'Test LLC',
        state: 'New Mexico',
      };
      const result = insertLlcApplicationSchema.safeParse(validApp);
      expect(result.success).toBe(true);
    });

    it('rejects LLC application without orderId', () => {
      const invalidApp = {
        ownerFullName: 'John Doe',
        ownerEmail: 'john@example.com',
      };
      const result = insertLlcApplicationSchema.safeParse(invalidApp);
      expect(result.success).toBe(false);
    });

    it('accepts minimal LLC application with only orderId', () => {
      const minimalApp = {
        orderId: 1,
      };
      const result = insertLlcApplicationSchema.safeParse(minimalApp);
      expect(result.success).toBe(true);
    });

    it('accepts LLC application with all consent fields', () => {
      const appWithConsent = {
        orderId: 1,
        dataProcessingConsent: true,
        termsConsent: true,
        ageConfirmation: true,
      };
      const result = insertLlcApplicationSchema.safeParse(appWithConsent);
      expect(result.success).toBe(true);
    });
  });

  describe('Email validation patterns', () => {
    it('validates proper email format in order data', () => {
      const withEmail = {
        orderId: 1,
        ownerEmail: 'test@example.com',
      };
      const result = insertLlcApplicationSchema.safeParse(withEmail);
      expect(result.success).toBe(true);
    });

    it('accepts null email in LLC application (optional field)', () => {
      const withNullEmail = {
        orderId: 1,
        ownerEmail: null,
      };
      const result = insertLlcApplicationSchema.safeParse(withNullEmail);
      expect(result.success).toBe(true);
    });
  });
});
