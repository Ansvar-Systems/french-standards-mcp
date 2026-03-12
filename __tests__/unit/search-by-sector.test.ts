// __tests__/unit/search-by-sector.test.ts
import { describe, it, expect } from 'vitest';
import { handleSearchBySector } from '../../src/tools/search-by-sector.js';

describe('handleSearchBySector', () => {
  it('healthcare sector returns hds and anssi-pgssi-s', () => {
    const result = handleSearchBySector({ sector: 'healthcare' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    expect(text).toContain('hds');
    expect(text).toContain('anssi-pgssi-s');
  });

  it('finance sector returns anssi-secnumcloud, cnil-securite, and financial frameworks', () => {
    const result = handleSearchBySector({ sector: 'finance' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    expect(text).toContain('anssi-secnumcloud');
    expect(text).toContain('cnil-securite');
    expect(text).toContain('acpr-it');
    expect(text).toContain('dora-fr');
    // hds is healthcare-only
    expect(text).not.toContain('| hds |');
  });

  it('government sector returns anssi-rgs', () => {
    const result = handleSearchBySector({ sector: 'government' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    expect(text).toContain('anssi-rgs');
  });

  it('with query param returns matching controls within sector frameworks', () => {
    const result = handleSearchBySector({ sector: 'government', query: 'authentification' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Framework section must be present
    expect(text).toContain('anssi-rgs');

    // Controls section must be present with a match
    expect(text).toContain('anssi-rgs:');
  });

  it('unknown sector returns INVALID_INPUT', () => {
    const result = handleSearchBySector({ sector: 'unknown-sector-xyz' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('missing/empty sector returns INVALID_INPUT', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleSearchBySector({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('empty string sector returns INVALID_INPUT', () => {
    const result = handleSearchBySector({ sector: '' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });

  it('returns INVALID_INPUT for unrecognized sector', () => {
    // 'mining' is not a recognized sector
    const result = handleSearchBySector({ sector: 'mining' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
  });
});
