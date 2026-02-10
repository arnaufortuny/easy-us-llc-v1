import { describe, it, expect } from 'vitest';

const { sanitizeHtml, sanitizeObject, validateEmail, validatePhone, validatePassword, getPasswordRequirements } = await import('../lib/security');

describe('sanitizeHtml', () => {
  it('escapes HTML tags', () => {
    expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });

  it('escapes ampersands', () => {
    expect(sanitizeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('escapes backticks', () => {
    expect(sanitizeHtml('`code`')).toBe('&#96;code&#96;');
  });

  it('handles empty and null input', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(null as any)).toBe('');
    expect(sanitizeHtml(undefined as any)).toBe('');
  });

  it('trims whitespace', () => {
    expect(sanitizeHtml('  hello  ')).toBe('hello');
  });

  it('handles normal text without modification beyond trim', () => {
    expect(sanitizeHtml('Hello World')).toBe('Hello World');
  });
});

describe('sanitizeObject', () => {
  it('sanitizes specified fields', () => {
    const obj = { name: '<b>Bold</b>', age: 25, email: 'test@test.com' };
    const sanitized = sanitizeObject(obj, ['name']);
    expect(sanitized.name).toBe('&lt;b&gt;Bold&lt;&#x2F;b&gt;');
    expect(sanitized.age).toBe(25);
    expect(sanitized.email).toBe('test@test.com');
  });

  it('does not modify original object', () => {
    const obj = { name: '<script>' };
    const sanitized = sanitizeObject(obj, ['name']);
    expect(obj.name).toBe('<script>');
    expect(sanitized.name).not.toBe('<script>');
  });
});

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@domain.co')).toBe(true);
    expect(validateEmail('test@sub.domain.org')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user@.com')).toBe(false);
  });

  it('rejects emails exceeding 254 characters', () => {
    const longEmail = 'a'.repeat(246) + '@test.com';
    expect(validateEmail(longEmail)).toBe(false);
  });
});

describe('validatePhone', () => {
  it('accepts valid phone numbers', () => {
    expect(validatePhone('+1 (555) 123-4567')).toBe(true);
    expect(validatePhone('+34 612 345 678')).toBe(true);
    expect(validatePhone('555-1234')).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    expect(validatePhone('12345')).toBe(false);
    expect(validatePhone('abcdefgh')).toBe(false);
    expect(validatePhone('123456789012345678901')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('accepts strong passwords', () => {
    const result = validatePassword('MyP@ssw0rd!');
    expect(result.valid).toBe(true);
  });

  it('rejects short passwords', () => {
    const result = validatePassword('Ab1!');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('8');
  });

  it('rejects passwords without uppercase', () => {
    const result = validatePassword('myp@ssw0rd!');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('mayúscula');
  });

  it('rejects passwords without lowercase', () => {
    const result = validatePassword('MYP@SSW0RD!');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('minúscula');
  });

  it('rejects passwords without numbers', () => {
    const result = validatePassword('MyP@ssword!');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('número');
  });

  it('rejects passwords without special characters', () => {
    const result = validatePassword('MyPassw0rd');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('símbolo');
  });

  it('rejects passwords over 128 characters', () => {
    const result = validatePassword('A'.repeat(100) + 'a1!' + 'B'.repeat(30));
    expect(result.valid).toBe(false);
    expect(result.message).toContain('larga');
  });

  it('getPasswordRequirements returns all rules', () => {
    const reqs = getPasswordRequirements();
    expect(reqs).toHaveLength(5);
    expect(reqs.some(r => r.includes('8'))).toBe(true);
  });
});
