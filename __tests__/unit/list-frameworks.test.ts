// __tests__/unit/list-frameworks.test.ts
import { describe, it, expect } from 'vitest';
import { handleListFrameworks } from '../../src/tools/list-frameworks.js';

describe('handleListFrameworks', () => {
  it('returns a Markdown table containing all 31 frameworks with control counts', () => {
    const result = handleListFrameworks();

    expect(result.isError).toBeFalsy();
    expect(result._meta).toBeDefined();

    const text = result.content[0].text;

    // Core framework IDs present (original 6)
    expect(text).toContain('anssi-rgs');
    expect(text).toContain('anssi-hygiene');
    expect(text).toContain('anssi-secnumcloud');
    expect(text).toContain('anssi-pgssi-s');
    expect(text).toContain('cnil-securite');
    expect(text).toContain('hds');

    // New frameworks present
    expect(text).toContain('anssi-ebios-rm');
    expect(text).toContain('anssi-passi');
    expect(text).toContain('lpm-oiv');
    expect(text).toContain('nis2-fr');
    expect(text).toContain('dora-fr');
    expect(text).toContain('ii-901');

    // Issuing bodies present
    expect(text).toContain('ANSSI');
    expect(text).toContain('CNIL');
    expect(text).toContain('ACPR');

    // Sectors present
    expect(text).toContain('government');
    expect(text).toContain('healthcare');
    expect(text).toContain('finance');

    // Markdown table structure
    expect(text).toContain('| ID |');
    expect(text).toContain('|');

    // 31 frameworks
    expect(text).toContain('31 frameworks');
  });
});
