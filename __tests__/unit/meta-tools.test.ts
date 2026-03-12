// __tests__/unit/meta-tools.test.ts
import { describe, it, expect } from 'vitest';
import { handleAbout } from '../../src/tools/about.js';
import { handleListSources } from '../../src/tools/list-sources.js';
import { handleCheckDataFreshness } from '../../src/tools/check-data-freshness.js';

describe('meta-tools', () => {
  it('about returns server metadata with _meta', () => {
    const result = handleAbout();
    const text = result.content[0].text;
    expect(text).toContain('French Standards MCP');
    expect(text).toContain('domain_intelligence');
    expect(text).toContain('Ansvar MCP Network');
    expect(result._meta).toBeDefined();
  });

  it('list_sources returns all 6 sources', () => {
    const result = handleListSources();
    const text = result.content[0].text;
    expect(text).toContain('ANSSI-RGS');
    expect(text).toContain('ANSSI-Hygiene');
    expect(text).toContain('SecNumCloud');
    expect(text).toContain('PGSSI-S');
    expect(text).toContain('CNIL');
    expect(text).toContain('HDS');
    expect(result._meta).toBeDefined();
  });

  it('check_data_freshness returns a freshness report', () => {
    const result = handleCheckDataFreshness();
    const text = result.content[0].text;
    expect(text).toContain('Data Freshness Report');
    expect(result._meta).toBeDefined();
  });
});
