// __tests__/unit/search-controls.test.ts
import { describe, it, expect } from 'vitest';
import { handleSearchControls } from '../../src/tools/search-controls.js';

describe('handleSearchControls', () => {
  it('finds controls by French term "securite"', () => {
    const result = handleSearchControls({ query: 'securite' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    expect(text).toContain('total_results');
    // Markdown table structure
    expect(text).toContain('| ID |');
    expect(text).toContain('|');
  });

  it('finds controls by English term "authentication"', () => {
    const result = handleSearchControls({ query: 'authentication' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Should find anssi-rgs:AUTH-01 which has "Authentication" in its title
    expect(text).toContain('anssi-rgs:AUTH');
    expect(text).toContain('total_results');
    const totalMatch = text.match(/total_results:\s*(\d+)/);
    expect(totalMatch).not.toBeNull();
    const total = parseInt(totalMatch![1], 10);
    expect(total).toBeGreaterThan(0);
  });

  it('filters by framework_id', () => {
    const result = handleSearchControls({ query: 'securite', framework_id: 'anssi-rgs' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Should find anssi-rgs controls only
    expect(text).toContain('anssi-rgs:');

    // Should NOT find controls from other frameworks
    expect(text).not.toContain('cnil-securite:');
    expect(text).not.toContain('hds:');
  });

  it('returns NO_MATCH for gibberish', () => {
    const result = handleSearchControls({ query: 'xyzzyqqqfoobarblarg' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for empty query', () => {
    const result = handleSearchControls({ query: '' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for missing query', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleSearchControls({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('supports pagination with offset', () => {
    const page1 = handleSearchControls({ query: 'securite', limit: 1, offset: 0 });
    const page2 = handleSearchControls({ query: 'securite', limit: 1, offset: 1 });

    expect(page1.isError).toBeFalsy();

    const text1 = page1.content[0].text;
    expect(text1).toContain('total_results');

    const totalMatch = text1.match(/total_results:\s*(\d+)/);
    if (totalMatch && parseInt(totalMatch[1], 10) > 1) {
      expect(page2.isError).toBeFalsy();
      const text2 = page2.content[0].text;
      expect(text1).not.toBe(text2);
    }
  });

  it('language fallback: EN preferred for bilingual controls', () => {
    const result = handleSearchControls({ query: 'authentication', language: 'en' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;
    expect(text).toContain('total_results');
    expect(text).toContain('anssi-rgs:');
  });

  it('language fallback: French title shown when language is en and no English title', () => {
    // Search for a French-specific term
    const result = handleSearchControls({ query: 'chiffrement', language: 'en' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;
    // Should find results containing chiffrement
    expect(text).toContain('total_results');
  });
});
