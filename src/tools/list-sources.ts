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
  // ANSSI Core
  { id: 'ANSSI-RGS', authority: 'ANSSI', name: 'Referentiel General de Securite (RGS) v2.0', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/entreprise/reglementation/confiance-numerique/le-referentiel-general-de-securite-rgs/' },
  { id: 'ANSSI-Hygiene', authority: 'ANSSI', name: 'Guide d\'hygiene informatique', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/guide-dhygiene-informatique/' },
  { id: 'SecNumCloud', authority: 'ANSSI', name: 'Referentiel SecNumCloud v3.2', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/entreprise/qualifications/prestataires-de-services-de-confiance-qualifies/prestataires-de-service-dinformatique-en-nuage-secnumcloud/' },
  { id: 'ANSSI-EBIOS-RM', authority: 'ANSSI', name: 'EBIOS Risk Manager v1.0', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/la-methode-ebios-risk-manager-le-guide/' },
  { id: 'ANSSI-PASSI', authority: 'ANSSI', name: 'Referentiel PASSI (prestataires d\'audit) v2.1', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/entreprise/qualifications/prestataires-de-services-de-confiance-qualifies/prestataires-daudit-de-la-securite-des-systemes-dinformation-passi/' },
  { id: 'ANSSI-PDIS', authority: 'ANSSI', name: 'Referentiel PDIS (prestataires de detection) v2.0', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/entreprise/qualifications/prestataires-de-services-de-confiance-qualifies/prestataires-de-detection-des-incidents-de-securite-pdis/' },
  { id: 'ANSSI-PRIS', authority: 'ANSSI', name: 'Referentiel PRIS (prestataires de reponse) v2.0', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/entreprise/qualifications/prestataires-de-services-de-confiance-qualifies/prestataires-de-reponse-aux-incidents-de-securite-pris/' },
  { id: 'ANSSI-Bonnes-Pratiques', authority: 'ANSSI', name: 'Guide des bonnes pratiques de l\'informatique (12 regles)', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/guide-des-bonnes-pratiques-de-linformatique/' },
  // ANSSI Technical Guides
  { id: 'ANSSI-TLS', authority: 'ANSSI', name: 'Recommandations de securite relatives a TLS', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/recommandations-de-securite-relatives-a-tls/' },
  { id: 'ANSSI-Journalisation', authority: 'ANSSI', name: 'Recommandations pour la journalisation', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/recommandations-de-securite-pour-la-journalisation/' },
  { id: 'ANSSI-Mots-de-passe', authority: 'ANSSI', name: 'Recommandations mots de passe et AMF', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/recommandations-relatives-a-lauthentification-multifacteur-et-aux-mots-de-passe/' },
  { id: 'ANSSI-Active-Directory', authority: 'ANSSI', name: 'Recommandations Active Directory', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/recommandations-de-securite-relatives-a-active-directory/' },
  { id: 'ANSSI-Architecture', authority: 'ANSSI', name: 'Recommandations architectures sensibles', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/recommandations-pour-les-architectures-des-systemes-dinformation-sensibles-ou-diffusion-restreinte/' },
  { id: 'ANSSI-Dev-Securise', authority: 'ANSSI', name: 'Guide de developpement securise', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/regles-de-programmation-pour-le-developpement-securise-de-logiciels-en-langage-c/' },
  { id: 'ANSSI-WiFi', authority: 'ANSSI', name: 'Recommandations reseaux WiFi', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/recommandations-de-securite-relatives-aux-reseaux-wifi/' },
  { id: 'ANSSI-IoT', authority: 'ANSSI', name: 'Recommandations dispositifs IoT', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/recommandations-de-securite-pour-les-dispositifs-de-linternet-des-objets/' },
  { id: 'ANSSI-Cloisonnement', authority: 'ANSSI', name: 'Recommandations cloisonnement systeme', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/recommandations-pour-la-mise-en-place-de-cloisonnement-systeme/' },
  { id: 'ANSSI-Crypto', authority: 'ANSSI', name: 'Mecanismes cryptographiques', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/mecanismes-cryptographiques/' },
  { id: 'ANSSI-Admin-SI', authority: 'ANSSI', name: 'Administration securisee des SI', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/guide/recommandations-relatives-a-ladministration-securisee-des-systemes-dinformation/' },
  // Regulatory
  { id: 'LPM-OIV', authority: 'Republique francaise / SGDSN / ANSSI', name: 'Loi de Programmation Militaire - OIV', retrieval_method: 'Static download (PDF/HTML)', license: 'Public law (Legifrance)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000028338825' },
  { id: 'NIS2-FR', authority: 'Republique francaise / ANSSI', name: 'Transposition francaise de NIS2', retrieval_method: 'Static download (PDF/HTML)', license: 'Public law (Legifrance)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049566498' },
  { id: 'CNIL-RGPD', authority: 'CNIL', name: 'Mesures techniques RGPD', retrieval_method: 'Static download (PDF/HTML)', license: 'Public sector publication', url: 'https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on' },
  { id: 'II-901', authority: 'SGDSN', name: 'Instruction Interministerielle 901 (DR)', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://www.ssi.gouv.fr/administration/reglementation/protection-des-systemes-dinformations/instruction-interministerielle-n-901/' },
  { id: 'DINUM-Cloud', authority: 'DINUM', name: 'Doctrine Cloud de l\'Etat', retrieval_method: 'Static download (PDF/HTML)', license: 'Public sector publication', url: 'https://www.numerique.gouv.fr/services/cloud/doctrine/' },
  { id: 'RGI', authority: 'DINUM', name: 'Referentiel General d\'Interoperabilite', retrieval_method: 'Static download (PDF/HTML)', license: 'Public sector publication', url: 'https://www.numerique.gouv.fr/publications/interoperabilite/' },
  // Healthcare
  { id: 'PGSSI-S', authority: 'ANS', name: 'Politique Generale SSI Sante (PGSSI-S)', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://esante.gouv.fr/produits-services/pgssi-s' },
  { id: 'HDS', authority: 'ANS', name: 'Certification Hebergeurs de Donnees de Sante (HDS)', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://esante.gouv.fr/produits-services/hds' },
  { id: 'ANS-CI-SIS', authority: 'ANS', name: 'Cadre d\'Interoperabilite des SI de Sante (CI-SIS)', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://esante.gouv.fr/produits-services/ci-sis' },
  // Data Protection
  { id: 'CNIL', authority: 'CNIL', name: 'Guide de la securite des donnees personnelles', retrieval_method: 'Static download (PDF/HTML)', license: 'Public sector publication', url: 'https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles' },
  // Financial
  { id: 'ACPR-IT', authority: 'ACPR / Banque de France', name: 'Exigences risques informatiques', retrieval_method: 'Static download (PDF)', license: 'Public sector publication', url: 'https://acpr.banque-france.fr/page-sommaire/risques-lies-aux-systemes-dinformation' },
  { id: 'DORA-FR', authority: 'ACPR / AMF', name: 'DORA - Resilience operationnelle numerique', retrieval_method: 'Static download (PDF/HTML)', license: 'EU public law', url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32022R2554' },
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
