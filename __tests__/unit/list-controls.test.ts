// __tests__/unit/list-controls.test.ts
import { describe, it, expect } from 'vitest';
import { handleListControls } from '../../src/tools/list-controls.js';

describe('handleListControls', () => {
  it('lists all controls for anssi-rgs with total_results count', () => {
    const result = handleListControls({ framework_id: 'anssi-rgs' });

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Should have total_results
    expect(text).toContain('total_results:');

    // First anssi-rgs control present
    expect(text).toContain('anssi-rgs:AUTH-01');

    // Markdown table structure
    expect(text).toContain('| ID |');
    expect(text).toContain('|');
  });

  it('filters controls by category', () => {
    const result = handleListControls({ framework_id: 'anssi-rgs', category: 'Authentification' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // Authentification controls present
    expect(text).toContain('anssi-rgs:AUTH');
    // Should not contain governance controls
    expect(text).not.toContain('anssi-rgs:GOV');
  });

  it('filters controls by level', () => {
    const result = handleListControls({ framework_id: 'anssi-hygiene', level: 'Standard' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;
    expect(text).toContain('anssi-hygiene:');
  });

  it('returns INVALID_INPUT for missing framework_id', () => {
    // @ts-expect-error -- intentional missing arg for test
    const result = handleListControls({});

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('INVALID_INPUT');
    expect(result._meta).toBeDefined();
  });

  it('returns NO_MATCH for unknown framework', () => {
    const result = handleListControls({ framework_id: 'nonexistent-framework' });

    expect(result.isError).toBe(true);
    expect(result._error_type).toBe('NO_MATCH');
    expect(result._meta).toBeDefined();
  });

  it('paginates results via limit and offset', () => {
    const page1 = handleListControls({ framework_id: 'anssi-rgs', limit: 1, offset: 0 });
    const page2 = handleListControls({ framework_id: 'anssi-rgs', limit: 1, offset: 1 });

    expect(page1.isError).toBeFalsy();
    expect(page2.isError).toBeFalsy();

    const text1 = page1.content[0].text;
    const text2 = page2.content[0].text;

    // Both pages report total_results
    expect(text1).toContain('total_results:');
    expect(text2).toContain('total_results:');

    // The two pages return different controls
    expect(text1).not.toBe(text2);
  });

  it('prefers English title when language is en', () => {
    const result = handleListControls({ framework_id: 'anssi-rgs', language: 'en' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // English title present
    expect(text).toContain('Authentication level determination');
  });

  it('defaults to French titles', () => {
    const result = handleListControls({ framework_id: 'anssi-rgs' });

    expect(result.isError).toBeFalsy();

    const text = result.content[0].text;

    // French title_nl
    expect(text).toContain('Determination du niveau');
  });
});
