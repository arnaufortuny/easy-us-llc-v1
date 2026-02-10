import { describe, it, expect, beforeAll } from 'vitest';

process.env.ENCRYPTION_KEY = 'test_encryption_key_32_chars_ok!';

const { encrypt, decrypt, encryptBuffer, decryptBuffer, generateFileHash, verifyFileIntegrity, encryptSensitiveField, decryptSensitiveField, maskSensitiveData, isEncrypted, encryptFileWithMetadata, decryptFileWithVerification } = await import('../utils/encryption');

describe('Encryption - Text', () => {
  it('encrypts and decrypts text correctly', () => {
    const original = 'Hello, World!';
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it('produces different ciphertexts for same input (random IV)', () => {
    const text = 'test data';
    const enc1 = encrypt(text);
    const enc2 = encrypt(text);
    expect(enc1).not.toBe(enc2);
    expect(decrypt(enc1)).toBe(text);
    expect(decrypt(enc2)).toBe(text);
  });

  it('handles empty string', () => {
    expect(encrypt('')).toBe('');
    expect(decrypt('')).toBe('');
  });

  it('handles unicode characters', () => {
    const unicode = '¡Hola! 日本語 🔒';
    const encrypted = encrypt(unicode);
    expect(decrypt(encrypted)).toBe(unicode);
  });

  it('handles very long strings', () => {
    const long = 'A'.repeat(10000);
    const encrypted = encrypt(long);
    expect(decrypt(encrypted)).toBe(long);
  });

  it('returns original text when decrypting invalid format', () => {
    expect(decrypt('not-encrypted')).toBe('not-encrypted');
    expect(decrypt('invalid')).toBe('invalid');
  });
});

describe('Encryption - Sensitive Fields', () => {
  it('encrypts and decrypts sensitive field', () => {
    const ssn = '123-45-6789';
    const encrypted = encryptSensitiveField(ssn);
    expect(encrypted).not.toBe(ssn);
    expect(encrypted).toBeTruthy();
    const decrypted = decryptSensitiveField(encrypted!);
    expect(decrypted).toBe(ssn);
  });

  it('handles null and undefined', () => {
    expect(encryptSensitiveField(null)).toBeNull();
    expect(encryptSensitiveField(undefined)).toBeNull();
    expect(decryptSensitiveField(null)).toBeNull();
    expect(decryptSensitiveField(undefined)).toBeNull();
  });

  it('handles empty string', () => {
    expect(encryptSensitiveField('')).toBeNull();
    expect(encryptSensitiveField('  ')).toBeNull();
  });
});

describe('Encryption - Buffer', () => {
  it('encrypts and decrypts buffer', () => {
    const original = Buffer.from('PDF document content here');
    const { encrypted, iv } = encryptBuffer(original);
    const decrypted = decryptBuffer(encrypted, iv);
    expect(decrypted.toString()).toBe(original.toString());
  });

  it('handles empty buffer', () => {
    const original = Buffer.alloc(0);
    const { encrypted, iv } = encryptBuffer(original);
    const decrypted = decryptBuffer(encrypted, iv);
    expect(decrypted.length).toBe(0);
  });

  it('handles binary data', () => {
    const original = Buffer.from([0, 1, 2, 255, 128, 64]);
    const { encrypted, iv } = encryptBuffer(original);
    const decrypted = decryptBuffer(encrypted, iv);
    expect(Buffer.compare(decrypted, original)).toBe(0);
  });
});

describe('File Integrity', () => {
  it('generates consistent hash', () => {
    const buffer = Buffer.from('test content');
    const hash1 = generateFileHash(buffer);
    const hash2 = generateFileHash(buffer);
    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[a-f0-9]{64}$/);
  });

  it('different content produces different hash', () => {
    const hash1 = generateFileHash(Buffer.from('content A'));
    const hash2 = generateFileHash(Buffer.from('content B'));
    expect(hash1).not.toBe(hash2);
  });

  it('verifies file integrity correctly', () => {
    const buffer = Buffer.from('important document');
    const hash = generateFileHash(buffer);
    expect(verifyFileIntegrity(buffer, hash)).toBe(true);
    expect(verifyFileIntegrity(Buffer.from('tampered'), hash)).toBe(false);
  });

  it('encrypts with metadata and decrypts with verification', () => {
    const original = Buffer.from('classified file content');
    const { encryptedBuffer, metadata } = encryptFileWithMetadata(original);
    expect(metadata.iv).toMatch(/^[a-f0-9]{32}$/);
    expect(metadata.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(metadata.originalSize).toBe(original.length);

    const { buffer, verified } = decryptFileWithVerification(encryptedBuffer, metadata);
    expect(verified).toBe(true);
    expect(buffer.toString()).toBe(original.toString());
  });
});

describe('Error Handling', () => {
  it('decrypt returns original text on corrupt ciphertext', () => {
    const result = decrypt('abcdef0123456789abcdef0123456789:invalidhex');
    expect(result).toBe('abcdef0123456789abcdef0123456789:invalidhex');
  });

  it('decryptBuffer throws on invalid IV', () => {
    const buffer = Buffer.from('data');
    expect(() => decryptBuffer(buffer, 'invalidiv')).toThrow();
  });

  it('decryptFileWithVerification detects tampered data', () => {
    const original = Buffer.from('original content');
    const { encryptedBuffer, metadata } = encryptFileWithMetadata(original);
    const different = Buffer.from('different content!!');
    const { encryptedBuffer: tamperedBuffer } = encryptFileWithMetadata(different);
    const result = decryptFileWithVerification(tamperedBuffer, metadata);
    expect(result.verified).toBe(false);
  });
});

describe('Utility Functions', () => {
  it('masks sensitive data correctly', () => {
    expect(maskSensitiveData('1234567890', 4)).toBe('******7890');
    expect(maskSensitiveData('ABC', 4)).toBe('****');
    expect(maskSensitiveData('', 4)).toBe('****');
  });

  it('detects encrypted text', () => {
    const encrypted = encrypt('test');
    expect(isEncrypted(encrypted)).toBe(true);
    expect(isEncrypted('plain text')).toBe(false);
    expect(isEncrypted('')).toBe(false);
    expect(isEncrypted('abc:def')).toBe(false);
  });
});
