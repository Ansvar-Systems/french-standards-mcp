// __tests__/unit/compare-controls.test.ts
import { describe, it, expect } from 'vitest';
import { handleCompareControls } from '../../src/tools/compare-controls.js';

describe('handleCompareControls', () => {
  it('compares controls across anssi-rgs and cnil-securite for "authentification"', () => {
    const result = handleCompareControls({
      query: 'authentification',
      framework_ids: ['anssi-rgs', 'cnil-securite'],
    });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Should have a section for each framework
    expect(text).toContain('anssi-rgs');
    expect(text).toContain('cnil-securite');

    // anssi-rgs controls match "authentification" in title_nl
    expect(text).toContain('AUTH');
    expect(text).toContain('authentification');
  });

  it('returns INVALID_INPUT for fewer than 2 frameworks', () => {
    const result = handleCompareControls({
      query: 'securite',
      framework_ids: ['anssi-rgs'],
    });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for empty framework_ids array', () => {
    const result = handleCompareControls({
      query: 'securite',
      framework_ids: [],
    });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('returns INVALID_INPUT for more than 4 frameworks', () => {
    const result = handleCompareControls({
      query: 'securite',
      framework_ids: ['anssi-rgs', 'cnil-securite', 'anssi-hygiene', 'hds', 'anssi-secnumcloud'],
    });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT when framework_ids is missing', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleCompareControls({ query: 'securite' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('returns INVALID_INPUT when query is missing', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleCompareControls({ framework_ids: ['anssi-rgs', 'cnil-securite'] });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('renders one markdown section per framework', () => {
    const result = handleCompareControls({
      query: 'securite',
      framework_ids: ['anssi-rgs', 'anssi-hygiene'],
    });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Section headers for each framework
    expect(text).toMatch(/##\s+anssi-rgs/);
    expect(text).toMatch(/##\s+anssi-hygiene/);
  });
});
