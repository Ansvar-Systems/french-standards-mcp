// src/tools/list-sources.ts
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { successResponse } from '../response-meta.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface SourceEntry {
  id: string;
  authority: string;
  name: string;
  retrieval_method: string;
  license: string;
  url?: string;
}

const FALLBACK_SOURCES: SourceEntry[] = [
  {
    id: 'ANSSI-RGS',
    authority: 'Agence nationale de la securite des systemes d\'information (ANSSI)',
    name: 'Referentiel General de Securite (RGS) v2.0',
    retrieval_method: 'Static download (PDF)',
    license: 'Public sector publication',
    url: 'https://www.ssi.gouv.fr/entreprise/reglementation/confiance-numerique/le-referentiel-general-de-securite-rgs/',
  },
  {
    id: 'ANSSI-Hygiene',
    authority: 'Agence nationale de la securite des systemes d\'information (ANSSI)',
    name: 'Guide d\'hygiene informatique',
    retrieval_method: 'Static download (PDF)',
    license: 'Public sector publication',
    url: 'https://www.ssi.gouv.fr/guide/guide-dhygiene-informatique/',
  },
  {
    id: 'SecNumCloud',
    authority: 'Agence nationale de la securite des systemes d\'information (ANSSI)',
    name: 'Referentiel SecNumCloud v3.2',
    retrieval_method: 'Static download (PDF)',
    license: 'Public sector publication',
    url: 'https://www.ssi.gouv.fr/entreprise/qualifications/prestataires-de-services-de-confiance-qualifies/prestataires-de-service-dinformatique-en-nuage-secnumcloud/',
  },
  {
    id: 'PGSSI-S',
    authority: 'Agence du Numerique en Sante (ANS)',
    name: 'Politique Generale de Securite des Systemes d\'Information de Sante (PGSSI-S)',
    retrieval_method: 'Static download (PDF)',
    license: 'Public sector publication',
    url: 'https://esante.gouv.fr/produits-services/pgssi-s',
  },
  {
    id: 'CNIL',
    authority: 'Commission Nationale de l\'Informatique et des Libertes (CNIL)',
    name: 'Guide de la securite des donnees personnelles',
    retrieval_method: 'Static download (PDF/HTML)',
    license: 'Public sector publication',
    url: 'https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles',
  },
  {
    id: 'HDS',
    authority: 'Agence du Numerique en Sante (ANS)',
    name: 'Certification Hebergeurs de Donnees de Sante (HDS)',
    retrieval_method: 'Static download (PDF)',
    license: 'Public sector publication',
    url: 'https://esante.gouv.fr/produits-services/hds',
  },
];

export function handleListSources() {
  let sources: SourceEntry[] = FALLBACK_SOURCES;

  const sourcesPath = join(__dirname, '..', '..', 'sources.yml');
  if (existsSync(sourcesPath)) {
    try {
      const raw = readFileSync(sourcesPath, 'utf-8');
      void raw; // file read but not parsed without yaml dep
    } catch {
      // Ignore read errors — use fallback
    }
  }

  const lines: string[] = [];

  lines.push('## Data Sources');
  lines.push('');
  lines.push(
    'This MCP server aggregates French cybersecurity standards from the following authoritative sources:'
  );
  lines.push('');
  lines.push('| ID | Authority | Standard / Document | Retrieval method | License |');
  lines.push('|----|-----------|---------------------|-----------------|---------|');

  for (const src of sources) {
    const nameCell = src.url ? `[${src.name}](${src.url})` : src.name;
    lines.push(`| ${src.id} | ${src.authority} | ${nameCell} | ${src.retrieval_method} | ${src.license} |`);
  }

  lines.push('');
  lines.push(`**Total sources:** ${sources.length}`);
  lines.push('');
  lines.push(
    '> All data is extracted from public authoritative documents published by ANSSI, CNIL, and ANS. ' +
    'This tool is a reference aid — verify critical compliance decisions against the originals.'
  );

  return successResponse(lines.join('\n'));
}
