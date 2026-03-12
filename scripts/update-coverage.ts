// scripts/update-coverage.ts
// Reads data/standards.db for framework/control counts.
// Reads data/extracted/*.json for per-source item counts.
// Reads sources.yml for update frequency per source.
// Generates data/coverage.json and updates COVERAGE.md counts.

import { createRequire } from 'node:module';
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const DATA_DIR = join(PROJECT_ROOT, 'data');
const EXTRACTED_DIR = join(DATA_DIR, 'extracted');
const DB_PATH = join(DATA_DIR, 'standards.db');
const COVERAGE_JSON = join(DATA_DIR, 'coverage.json');
const COVERAGE_MD = join(PROJECT_ROOT, 'COVERAGE.md');
const SOURCES_YML = join(PROJECT_ROOT, 'sources.yml');

// Map from framework DB id -> source id used in coverage.json
const FRAMEWORK_TO_SOURCE: Record<string, string> = {
  'anssi-rgs': 'anssi-rgs',
  'anssi-hygiene': 'anssi-hygiene',
  'anssi-secnumcloud': 'anssi-secnumcloud',
  'anssi-pgssi-s': 'anssi-pgssi-s',
  'cnil-securite': 'cnil-securite',
  'hds': 'hds',
  'anssi-ebios-rm': 'anssi-ebios-rm',
  'anssi-passi': 'anssi-passi',
  'anssi-pdis': 'anssi-pdis',
  'anssi-pris': 'anssi-pris',
  'anssi-bonnes-pratiques': 'anssi-bonnes-pratiques',
  'anssi-tls': 'anssi-tls',
  'anssi-journalisation': 'anssi-journalisation',
  'anssi-mots-de-passe': 'anssi-mots-de-passe',
  'anssi-active-directory': 'anssi-active-directory',
  'anssi-architecture': 'anssi-architecture',
  'anssi-dev-securise': 'anssi-dev-securise',
  'anssi-wifi': 'anssi-wifi',
  'anssi-iot': 'anssi-iot',
  'anssi-cloisonnement': 'anssi-cloisonnement',
  'anssi-crypto': 'anssi-crypto',
  'anssi-admin-si': 'anssi-admin-si',
  'lpm-oiv': 'lpm-oiv',
  'nis2-fr': 'nis2-fr',
  'cnil-rgpd-technique': 'cnil-rgpd-technique',
  'ii-901': 'ii-901',
  'acpr-it': 'acpr-it',
  'dora-fr': 'dora-fr',
  'dinum-cloud': 'dinum-cloud',
  'rgi': 'rgi',
  'ans-ci-sis': 'ans-ci-sis',
};

// Canonical source metadata — derived from sources.yml
interface SourceMeta {
  id: string;
  name: string;
  update_frequency: string;
  source_type: 'github' | 'pdf';
}

// Minimal YAML parser for our simple sources.yml structure.
// sources.yml uses a list under "sources:" with name/refresh_frequency fields.
function parseSourcesYml(content: string): SourceMeta[] {
  const sources: SourceMeta[] = [];

  // Split into blocks by "  - name:" lines
  const blocks = content.split(/\n(?=  - name:)/);

  for (const block of blocks) {
    const nameMatch = block.match(/^\s*-?\s*name:\s*"([^"]+)"/m);
    const freqMatch = block.match(/refresh_frequency:\s*"([^"]+)"/m);
    const typeMatch = block.match(/source_type:\s*"?([^\s"]+)"?/m);
    if (!nameMatch) continue;

    const fullName = nameMatch[1];
    const freq = freqMatch ? freqMatch[1] : 'annual';
    const srcType = (typeMatch ? typeMatch[1] : 'pdf') as 'github' | 'pdf';

    // Determine source id from name
    let id = 'unknown';
    if (fullName.includes('RGS')) id = 'anssi-rgs';
    else if (fullName.includes('hygiene') || fullName.includes('Hygiene')) id = 'anssi-hygiene';
    else if (fullName.includes('SecNumCloud')) id = 'anssi-secnumcloud';
    else if (fullName.includes('PGSSI')) id = 'anssi-pgssi-s';
    else if (fullName.includes('CNIL') && fullName.includes('securite')) id = 'cnil-securite';
    else if (fullName.includes('HDS')) id = 'hds';
    else if (fullName.includes('EBIOS')) id = 'anssi-ebios-rm';
    else if (fullName.includes('PASSI')) id = 'anssi-passi';
    else if (fullName.includes('PDIS')) id = 'anssi-pdis';
    else if (fullName.includes('PRIS')) id = 'anssi-pris';
    else if (fullName.includes('bonnes pratiques')) id = 'anssi-bonnes-pratiques';
    else if (fullName.includes('TLS') || fullName.includes('tls')) id = 'anssi-tls';
    else if (fullName.includes('journalisation')) id = 'anssi-journalisation';
    else if (fullName.includes('mots de passe') || fullName.includes('multifacteur')) id = 'anssi-mots-de-passe';
    else if (fullName.includes('Active Directory')) id = 'anssi-active-directory';
    else if (fullName.includes('architectures')) id = 'anssi-architecture';
    else if (fullName.includes('developpement') || fullName.includes('programmation')) id = 'anssi-dev-securise';
    else if (fullName.includes('WiFi') || fullName.includes('wifi')) id = 'anssi-wifi';
    else if (fullName.includes('IoT') || fullName.includes('objets')) id = 'anssi-iot';
    else if (fullName.includes('cloisonnement')) id = 'anssi-cloisonnement';
    else if (fullName.includes('cryptographiques') || fullName.includes('Mecanismes')) id = 'anssi-crypto';
    else if (fullName.includes('administration')) id = 'anssi-admin-si';
    else if (fullName.includes('LPM') || fullName.includes('OIV')) id = 'lpm-oiv';
    else if (fullName.includes('NIS2')) id = 'nis2-fr';
    else if (fullName.includes('RGPD') || fullName.includes('CNIL')) id = 'cnil-rgpd-technique';
    else if (fullName.includes('II 901') || fullName.includes('901')) id = 'ii-901';
    else if (fullName.includes('ACPR')) id = 'acpr-it';
    else if (fullName.includes('DORA')) id = 'dora-fr';
    else if (fullName.includes('Cloud') && fullName.includes('DINUM')) id = 'dinum-cloud';
    else if (fullName.includes('RGI')) id = 'rgi';
    else if (fullName.includes('CI-SIS') || fullName.includes('Interoperabilite')) id = 'ans-ci-sis';

    sources.push({ id, name: fullName, update_frequency: freq, source_type: srcType });
  }

  return sources;
}

/**
 * Compute next_check_due from last_checked + update_frequency string.
 */
function computeNextCheck(lastChecked: string, frequency: string): string {
  const d = new Date(lastChecked);
  const freq = frequency.toLowerCase();

  if (freq === 'monthly') {
    d.setMonth(d.getMonth() + 1);
  } else if (freq === 'annual') {
    d.setFullYear(d.getFullYear() + 1);
  } else if (freq.includes('5-year') || freq.includes('5 year')) {
    d.setFullYear(d.getFullYear() + 5);
  } else if (freq.includes('year')) {
    const match = freq.match(/(\d+)/);
    const years = match ? parseInt(match[1], 10) : 1;
    d.setFullYear(d.getFullYear() + years);
  } else {
    // Default: annual
    d.setFullYear(d.getFullYear() + 1);
  }

  return d.toISOString().split('T')[0];
}

/**
 * Get last_checked from extracted JSON metadata.ingested_at, or today's date if missing.
 */
function getLastChecked(extractedData: {
  metadata?: { ingested_at?: string };
}): string {
  if (extractedData.metadata?.ingested_at) {
    return extractedData.metadata.ingested_at.split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}

async function main(): Promise<void> {
  console.log('Update Coverage — French Standards MCP');
  console.log('=======================================');

  mkdirSync(DATA_DIR, { recursive: true });

  // Load sources.yml
  if (!existsSync(SOURCES_YML)) {
    console.error(`ERROR: sources.yml not found at ${SOURCES_YML}`);
    process.exit(1);
  }
  const sourcesYmlContent = readFileSync(SOURCES_YML, 'utf-8');
  const sourcesMeta = parseSourcesYml(sourcesYmlContent);
  console.log(`Loaded ${sourcesMeta.length} sources from sources.yml`);

  const sourcesMetaById = Object.fromEntries(sourcesMeta.map((s) => [s.id, s]));

  // Read DB for framework/control counts
  if (!existsSync(DB_PATH)) {
    console.error(`ERROR: Database not found at ${DB_PATH}. Run npm run build:db first.`);
    process.exit(1);
  }

  const require = createRequire(import.meta.url);
  const { Database } = require('@ansvar/mcp-sqlite');
  const db = new Database(DB_PATH, { readonly: true });

  const frameworkCount = (
    db.prepare('SELECT count(*) as cnt FROM frameworks').get() as { cnt: number }
  ).cnt;
  const controlCount = (
    db.prepare('SELECT count(*) as cnt FROM controls').get() as { cnt: number }
  ).cnt;

  console.log(`DB: ${frameworkCount} frameworks, ${controlCount} controls`);

  // Read extracted JSON files for per-source item counts and ingest dates
  if (!existsSync(EXTRACTED_DIR)) {
    console.error(`ERROR: data/extracted/ not found. Run ingest scripts first.`);
    db.close();
    process.exit(1);
  }

  const jsonFiles = readdirSync(EXTRACTED_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort();

  // Build per-source stats from extracted JSON
  interface ExtractedData {
    framework: { id: string };
    controls: unknown[];
    metadata?: { ingested_at?: string };
  }

  const extractedByFrameworkId: Record<
    string,
    { itemCount: number; lastChecked: string }
  > = {};

  for (const fname of jsonFiles) {
    const filePath = join(EXTRACTED_DIR, fname);
    const data = JSON.parse(readFileSync(filePath, 'utf-8')) as ExtractedData;
    const fwId = data.framework.id;
    extractedByFrameworkId[fwId] = {
      itemCount: data.controls.length,
      lastChecked: getLastChecked(data),
    };
  }

  // Get tool list from src/tools/ directory
  const toolsDir = join(PROJECT_ROOT, 'src', 'tools');
  const toolFiles = existsSync(toolsDir)
    ? readdirSync(toolsDir)
        .filter((f) => f.endsWith('.ts'))
        .map((f) =>
          f
            .replace('.ts', '')
            .replace(/-([a-z])/g, (_, c: string) => '_' + c)
        )
    : [];

  db.close();

  // Build sources array for coverage.json
  interface CoverageSource {
    id: string;
    name: string;
    item_count: number;
    last_checked: string;
    update_frequency: string;
    next_check_due: string;
  }

  const coverageSources: CoverageSource[] = [];

  for (const [frameworkId, sourceId] of Object.entries(FRAMEWORK_TO_SOURCE)) {
    const extracted = extractedByFrameworkId[frameworkId];
    const meta = sourcesMetaById[sourceId];

    if (!extracted) {
      console.warn(`  WARNING: No extracted data for framework ${frameworkId}`);
      continue;
    }

    const updateFreq = meta?.update_frequency ?? 'annual';
    const nextCheck = computeNextCheck(extracted.lastChecked, updateFreq);

    coverageSources.push({
      id: sourceId,
      name: meta?.name ?? sourceId,
      item_count: extracted.itemCount,
      last_checked: extracted.lastChecked,
      update_frequency: updateFreq,
      next_check_due: nextCheck,
    });
  }

  // Sort by id for determinism
  coverageSources.sort((a, b) => a.id.localeCompare(b.id));

  const generatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  const coverage = {
    mcp_name: 'french-standards-mcp',
    generated_at: generatedAt,
    summary: {
      frameworks: frameworkCount,
      controls: controlCount,
      tools: toolFiles.length,
    },
    sources: coverageSources,
    tools: toolFiles,
  };

  writeFileSync(COVERAGE_JSON, JSON.stringify(coverage, null, 2), 'utf-8');
  console.log(`\nWritten: ${COVERAGE_JSON}`);
  console.log(`  frameworks: ${frameworkCount}`);
  console.log(`  controls: ${controlCount}`);
  console.log(`  tools: ${toolFiles.length}`);
  console.log(`  sources: ${coverageSources.length}`);

  // Update COVERAGE.md — replace the "Total:" line with actual counts
  if (existsSync(COVERAGE_MD)) {
    let mdContent = readFileSync(COVERAGE_MD, 'utf-8');

    // Update the summary totals line
    const totalControls = coverageSources.reduce((sum, s) => sum + s.item_count, 0);
    const newTotalLine = `**Total:** ${toolFiles.length} tools, ${totalControls} controls/requirements, database built from ${coverageSources.length} authoritative French sources.`;
    mdContent = mdContent.replace(
      /\*\*Total:\*\*[^\n]+/,
      newTotalLine
    );

    // Update "Last verified" date
    const today = new Date().toISOString().split('T')[0];
    mdContent = mdContent.replace(
      /> Last verified: \S+/,
      `> Last verified: ${today}`
    );

    writeFileSync(COVERAGE_MD, mdContent, 'utf-8');
    console.log(`Updated: ${COVERAGE_MD}`);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
