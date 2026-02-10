import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createLogger } from '../lib/logger';

describe('Logger', () => {
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates logger with context', () => {
    const log = createLogger('test');
    log.info('hello');
    expect(consoleSpy.log).toHaveBeenCalledOnce();
    const msg = consoleSpy.log.mock.calls[0][0];
    expect(msg).toContain('[test]');
    expect(msg).toContain('hello');
    expect(msg).toContain('[INFO]');
  });

  it('includes timestamp in ISO format', () => {
    const log = createLogger('test');
    log.info('msg');
    const msg = consoleSpy.log.mock.calls[0][0];
    expect(msg).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('logs at different levels', () => {
    const log = createLogger('test');
    log.debug('debug msg');
    log.info('info msg');
    log.warn('warn msg');
    log.error('error msg', new Error('test'));

    expect(consoleSpy.log).toHaveBeenCalledTimes(2);
    expect(consoleSpy.warn).toHaveBeenCalledOnce();
    expect(consoleSpy.error).toHaveBeenCalledOnce();
  });

  it('includes data in JSON format', () => {
    const log = createLogger('test');
    log.info('with data', { userId: '123', action: 'login' });
    const msg = consoleSpy.log.mock.calls[0][0];
    expect(msg).toContain('"userId":"123"');
    expect(msg).toContain('"action":"login"');
  });

  it('redacts sensitive data', () => {
    const log = createLogger('test');
    log.info('sensitive', { password: 'secret123', token: 'abc', name: 'visible' });
    const msg = consoleSpy.log.mock.calls[0][0];
    expect(msg).toContain('[REDACTED]');
    expect(msg).not.toContain('secret123');
    expect(msg).not.toContain('"token":"abc"');
    expect(msg).toContain('"name":"visible"');
  });

  it('handles error objects correctly', () => {
    const log = createLogger('test');
    const err = new Error('something broke');
    log.error('operation failed', err);
    const msg = consoleSpy.error.mock.calls[0][0];
    expect(msg).toContain('something broke');
    expect(msg).toContain('[ERROR]');
  });

  it('handles non-Error error values', () => {
    const log = createLogger('test');
    log.error('string error', 'just a string');
    const msg = consoleSpy.error.mock.calls[0][0];
    expect(msg).toContain('just a string');
  });
});
