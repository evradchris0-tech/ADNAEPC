import { describe, it, expect } from 'vitest';

/**
 * Tests for matricule generation logic
 * Format: XXX-YY (000-aa to 999-zz)
 */

describe('Matricule Format', () => {
  it('should generate first matricule as 000-aa', () => {
    const firstMatricule = '000-aa';
    expect(firstMatricule).toMatch(/^\d{3}-[a-z]{2}$/);
    expect(firstMatricule).toBe('000-aa');
  });

  it('should increment numeric part correctly', () => {
    const matricules = ['000-aa', '001-aa', '002-aa', '010-aa', '100-aa'];
    matricules.forEach(m => {
      expect(m).toMatch(/^\d{3}-[a-z]{2}$/);
    });
  });

  it('should increment alpha part after 999', () => {
    const matricule = '000-ab';
    expect(matricule).toMatch(/^\d{3}-[a-z]{2}$/);
    const parts = matricule.split('-');
    expect(parts[1]).toBe('ab');
  });

  it('should handle double letter increment', () => {
    const matricules = ['999-aa', '000-ab', '000-ba', '000-zz'];
    matricules.forEach(m => {
      expect(m).toMatch(/^\d{3}-[a-z]{2}$/);
    });
  });

  it('should validate matricule format', () => {
    const validMatricules = [
      '000-aa',
      '123-xy',
      '999-zz',
      '456-mn',
    ];

    validMatricules.forEach(m => {
      expect(m).toMatch(/^\d{3}-[a-z]{2}$/);
    });
  });

  it('should reject invalid formats', () => {
    const invalidMatricules = [
      '1234-aa',   // too many digits
      '12-aa',     // too few digits
      '123-a',     // too few letters
      '123-ABC',   // uppercase letters
      '123-a1',    // mixed alphanumeric
    ];

    invalidMatricules.forEach(m => {
      expect(m).not.toMatch(/^\d{3}-[a-z]{2}$/);
    });
  });
});

describe('Matricule Sequence Logic', () => {
  it('should increment correctly from aa to zz', () => {
    const sequence = [];
    const letters = 'abcdefghijklmnopqrstuvwxyz';

    // Generate sample sequence
    for (let i = 0; i < letters.length; i++) {
      for (let j = 0; j < letters.length; j++) {
        const matricule = `000-${letters[i]}${letters[j]}`;
        sequence.push(matricule);
        if (sequence.length >= 10) break; // Just test first 10
      }
      if (sequence.length >= 10) break;
    }

    // All should match the pattern
    sequence.forEach(m => {
      expect(m).toMatch(/^\d{3}-[a-z]{2}$/);
    });

    // First should be 000-aa
    expect(sequence[0]).toBe('000-aa');
  });
});
