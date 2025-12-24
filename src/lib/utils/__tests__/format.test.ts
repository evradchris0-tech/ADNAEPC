import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPhoneNumber,
  formatPercentage,
  formatNumber,
  truncate,
} from '../format';

describe('formatCurrency', () => {
  it('should format XAF currency in French', () => {
    const result = formatCurrency(1000, 'fr');
    expect(result).toContain('1');
    expect(result.replace(/\s/g, '')).toContain('000');
    // Accept either XAF or FCFA (locale-dependent)
    expect(result).toMatch(/XAF|FCFA/);
  });

  it('should format XAF currency in English', () => {
    const result = formatCurrency(1000, 'en');
    expect(result).toContain('1');
    expect(result.replace(/\s/g, '')).toContain('000');
  });

  it('should format large amounts with thousand separators', () => {
    const result = formatCurrency(1000000, 'fr');
    expect(result).toBeDefined();
    expect(result.replace(/\s/g, '')).toContain('1000000');
  });

  it('should handle zero', () => {
    const result = formatCurrency(0, 'fr');
    expect(result).toContain('0');
  });

  it('should handle negative amounts', () => {
    const result = formatCurrency(-500, 'fr');
    expect(result).toContain('500');
  });

  it('should handle decimals by rounding', () => {
    const result = formatCurrency(1234.56, 'fr');
    expect(result).toBeDefined();
    // Should not contain decimals (max 0 fraction digits)
    expect(result).not.toContain(',56');
  });
});

describe('formatPhoneNumber', () => {
  it('should format 9-digit Cameroonian phone number', () => {
    const result = formatPhoneNumber('612345678');
    expect(result).toBe('+237 6 12 34 56 78');
  });

  it('should format phone number with +237 prefix', () => {
    const result = formatPhoneNumber('+237612345678');
    expect(result).toBe('+237 6 12 34 56 78');
  });

  it('should format phone number with 237 prefix', () => {
    const result = formatPhoneNumber('237612345678');
    expect(result).toBe('+237 6 12 34 56 78');
  });

  it('should return as-is for invalid formats', () => {
    const result = formatPhoneNumber('123456');
    expect(result).toBe('123456');
  });

  it('should handle phone with spaces', () => {
    const result = formatPhoneNumber('6 12 34 56 78');
    expect(result).toBe('+237 6 12 34 56 78');
  });
});

describe('formatPercentage', () => {
  it('should format percentage with default decimals', () => {
    expect(formatPercentage(75.5)).toBe('75.5%');
  });

  it('should format percentage with custom decimals', () => {
    expect(formatPercentage(75.567, 2)).toBe('75.57%');
  });

  it('should format 100%', () => {
    expect(formatPercentage(100)).toBe('100.0%');
  });

  it('should format 0%', () => {
    expect(formatPercentage(0)).toBe('0.0%');
  });

  it('should handle negative percentages', () => {
    expect(formatPercentage(-10.5)).toBe('-10.5%');
  });
});

describe('formatNumber', () => {
  it('should format number with thousand separators (French)', () => {
    const result = formatNumber(1000, 'fr-FR');
    expect(result).toMatch(/1[\s\u00A0]000/); // French uses non-breaking space
  });

  it('should format large numbers', () => {
    const result = formatNumber(1000000, 'fr-FR');
    expect(result.replace(/\s/g, '')).toContain('1000000');
  });

  it('should handle zero', () => {
    expect(formatNumber(0, 'fr-FR')).toBe('0');
  });
});

describe('truncate', () => {
  it('should truncate long text', () => {
    const text = 'This is a very long text that needs to be truncated';
    const result = truncate(text, 20);
    expect(result).toBe('This is a very long ...');
    expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
  });

  it('should not truncate short text', () => {
    const text = 'Short text';
    const result = truncate(text, 20);
    expect(result).toBe('Short text');
  });

  it('should handle exact length', () => {
    const text = 'Exactly twenty chars';
    const result = truncate(text, 20);
    expect(result).toBe('Exactly twenty chars');
  });
});
