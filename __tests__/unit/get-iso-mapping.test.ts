// __tests__/unit/get-iso-mapping.test.ts
import { describe, it, expect } from 'vitest';
import { handleGetIsoMapping } from '../../src/tools/get-iso-mapping.js';

describe('handleGetIsoMapping', () => {
  it('finds French controls mapped to ISO 8.5', () => {
    const result = handleGetIsoMapping({ iso_control: '8.5' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // anssi-rgs AUTH controls with iso_mapping="8.5" must appear
    expect(text).toContain('anssi-rgs:AUTH');

    // Should show the ISO control in the heading
    expect(text).toContain('8.5');

    // Markdown table structure
    expect(text).toContain('| ID |');
    expect(text).toContain('|');
  });

  it('finds controls mapped to ISO 8.24', () => {
    const result = handleGetIsoMapping({ iso_control: '8.24' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Multiple frameworks map to 8.24 (encryption-related)
    expect(text).toContain('8.24');

    // Markdown table structure
    expect(text).toContain('| ID |');
    expect(text).toContain('|');
  });

  it('returns NO_MATCH for unmapped ISO control', () => {
    const result = handleGetIsoMapping({ iso_control: '99.99' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('returns INVALID_INPUT for missing iso_control param', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleGetIsoMapping({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });
});
