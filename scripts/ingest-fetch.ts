// scripts/ingest-fetch.ts
// Orchestrates running all French standards ingestion scripts.
// All sources are PDF-based with embedded data — no network fetch required.
// Runs each sub-script via execFileSync and prints a summary.

import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface FetchResult {
  script: string;
  source: string;
  success: boolean;
  error?: string;
  durationMs: number;
}

const INGESTION_SCRIPTS: { script: string; source: string }[] = [
  { script: join(__dirname, 'ingest-anssi-rgs.ts'), source: 'ANSSI RGS v2.0' },
  { script: join(__dirname, 'ingest-anssi-hygiene.ts'), source: 'ANSSI Hygiene Guide' },
  { script: join(__dirname, 'ingest-remaining-frameworks.ts'), source: 'SecNumCloud, PGSSI-S, CNIL, HDS' },
  { script: join(__dirname, 'expand-frameworks.ts'), source: 'Framework expansions (SecNumCloud, CNIL, PGSSI-S, HDS)' },
  { script: join(__dirname, 'expand-rgs-hygiene.ts'), source: 'Framework expansions (RGS, Hygiene)' },
];

function runScript(scriptPath: string): { success: boolean; error?: string; durationMs: number } {
  const start = Date.now();
  try {
    execFileSync(
      process.execPath,
      ['--import', 'tsx', scriptPath],
      {
        stdio: 'inherit',
        timeout: 120_000,
      }
    );
    return { success: true, durationMs: Date.now() - start };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg, durationMs: Date.now() - start };
  }
}

async function main(): Promise<void> {
  console.log('Ingest Fetch — French Standards MCP');
  console.log('====================================');
  console.log(`Running ${INGESTION_SCRIPTS.length} ingestion scripts`);
  console.log('');

  const results: FetchResult[] = [];

  for (const { script, source } of INGESTION_SCRIPTS) {
    console.log(`--- Ingesting: ${source} ---`);
    const result = runScript(script);
    results.push({ script, source, ...result });
    console.log('');
  }

  // Summary
  console.log('=============================');
  console.log('Ingestion Summary');
  console.log('=============================');

  const succeeded = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  for (const r of results) {
    const status = r.success ? 'OK' : 'FAILED';
    const duration = (r.durationMs / 1000).toFixed(1);
    console.log(`  [${status}] ${r.source} (${duration}s)`);
    if (!r.success && r.error) {
      console.log(`         ${r.error.split('\n')[0]}`);
    }
  }

  console.log('');
  console.log(`Result: ${succeeded.length}/${INGESTION_SCRIPTS.length} scripts completed successfully`);

  if (failed.length > 0) {
    console.error(`\n${failed.length} script(s) failed. Check output above.`);
    process.exit(1);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
