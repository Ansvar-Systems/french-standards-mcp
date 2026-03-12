// scripts/ingest-new-frameworks.ts
// Generates data for all new French cybersecurity frameworks.
// Run: node --import tsx scripts/ingest-new-frameworks.ts

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
mkdirSync(DATA_DIR, { recursive: true });

interface Control {
  control_number: string;
  title: string | null;
  title_nl: string;
  description: string | null;
  description_nl: string;
  category: string;
  subcategory: string | null;
  level: string | null;
  iso_mapping: string | null;
  implementation_guidance: string | null;
  verification_guidance: string | null;
  source_url: string;
}

interface FrameworkData {
  framework: {
    id: string;
    name: string;
    name_nl: string;
    issuing_body: string;
    version: string;
    effective_date: string;
    scope: string;
    scope_sectors: string[];
    structure_description: string;
    source_url: string;
    license: string;
    language: string;
  };
  controls: Control[];
  metadata: {
    ingested_at: string;
    total_controls: number;
  };
}

function c(num: string, titleEn: string, titleFr: string, descEn: string, descFr: string, cat: string, subcat: string | null, iso: string | null, url: string, level?: string | null): Control {
  return {
    control_number: num, title: titleEn, title_nl: titleFr,
    description: descEn, description_nl: descFr,
    category: cat, subcategory: subcat, level: level ?? null,
    iso_mapping: iso, implementation_guidance: null,
    verification_guidance: null, source_url: url,
  };
}

function writeFramework(data: FrameworkData) {
  const path = join(DATA_DIR, `${data.framework.id}.json`);
  data.metadata.total_controls = data.controls.length;
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ${data.framework.id}: ${data.controls.length} controls`);
}

const NOW = new Date().toISOString();

// ============================================================
// 1. ANSSI EBIOS Risk Manager
// ============================================================
const EBIOS_URL = 'https://www.ssi.gouv.fr/guide/la-methode-ebios-risk-manager-le-guide/';
writeFramework({
  framework: {
    id: 'anssi-ebios-rm',
    name: 'EBIOS Risk Manager',
    name_nl: 'EBIOS Risk Manager',
    issuing_body: 'Agence nationale de la securite des systemes d\'information (ANSSI)',
    version: '1.0',
    effective_date: '2018-10-01',
    scope: 'Official French risk analysis methodology for information security, applicable to all organizations',
    scope_sectors: ['government', 'healthcare', 'finance', 'energy', 'telecom', 'transport', 'education', 'digital_infrastructure'],
    structure_description: '5 workshops: scope and security baseline, risk origins, strategic scenarios, operational scenarios, risk treatment. Each workshop has defined activities, inputs, outputs, and participants.',
    source_url: EBIOS_URL,
    license: 'Public sector publication',
    language: 'fr',
  },
  controls: [
    // Workshop 1: Scope and security baseline
    c('W1-01', 'Define the study scope', 'Definir le cadre de l\'etude', 'Identify the object of the study, its missions, values, and the perimeter of the risk analysis.', 'Identifier l\'objet de l\'etude, ses missions, ses valeurs et le perimetre de l\'analyse de risque.', 'Atelier 1 - Cadrage et socle de securite', 'Definition du perimetre', null, EBIOS_URL),
    c('W1-02', 'Identify business values', 'Identifier les valeurs metier', 'Determine essential business processes, information, and functions that support the organization\'s missions.', 'Determiner les processus metier essentiels, les informations et fonctions qui soutiennent les missions de l\'organisation.', 'Atelier 1 - Cadrage et socle de securite', 'Valeurs metier', null, EBIOS_URL),
    c('W1-03', 'Identify supporting assets', 'Identifier les biens supports', 'Map the information system assets that support business values: hardware, software, networks, people, facilities.', 'Cartographier les biens du systeme d\'information supportant les valeurs metier : materiels, logiciels, reseaux, personnes, locaux.', 'Atelier 1 - Cadrage et socle de securite', 'Biens supports', '5.9', EBIOS_URL),
    c('W1-04', 'Establish the security baseline', 'Etablir le socle de securite', 'Define the applicable security baseline from regulations, standards, and state of the art relevant to the study scope.', 'Definir le socle de securite applicable a partir des reglementations, normes et etat de l\'art pertinents pour le perimetre etudie.', 'Atelier 1 - Cadrage et socle de securite', 'Socle de securite', '5.1', EBIOS_URL),
    c('W1-05', 'Assess security baseline compliance', 'Evaluer la conformite au socle de securite', 'Assess the current level of compliance against the defined security baseline and identify gaps.', 'Evaluer le niveau de conformite actuel par rapport au socle de securite defini et identifier les ecarts.', 'Atelier 1 - Cadrage et socle de securite', 'Conformite', '5.36', EBIOS_URL),
    c('W1-06', 'Define the feared events', 'Definir les evenements redoutes', 'For each business value, identify feared events (loss of confidentiality, integrity, availability) and their severity.', 'Pour chaque valeur metier, identifier les evenements redoutes (perte de confidentialite, integrite, disponibilite) et leur gravite.', 'Atelier 1 - Cadrage et socle de securite', 'Evenements redoutes', null, EBIOS_URL),
    // Workshop 2: Risk origins
    c('W2-01', 'Identify risk origins', 'Identifier les sources de risque', 'Identify threat actors (risk origins) relevant to the study scope: cybercriminals, competitors, insiders, state actors.', 'Identifier les acteurs de la menace (sources de risque) pertinents pour le perimetre etudie : cybercriminels, concurrents, internes, acteurs etatiques.', 'Atelier 2 - Sources de risque', 'Sources de risque', null, EBIOS_URL),
    c('W2-02', 'Define threat objectives', 'Definir les objectifs vises', 'For each risk origin, define their strategic objectives and target objectives against the study scope.', 'Pour chaque source de risque, definir leurs objectifs strategiques et objectifs vises contre le perimetre etudie.', 'Atelier 2 - Sources de risque', 'Objectifs vises', null, EBIOS_URL),
    c('W2-03', 'Evaluate risk origin motivation', 'Evaluer la motivation des sources de risque', 'Assess the motivation, resources, and capability of each identified risk origin.', 'Evaluer la motivation, les ressources et la capacite de chaque source de risque identifiee.', 'Atelier 2 - Sources de risque', 'Evaluation', null, EBIOS_URL),
    c('W2-04', 'Select priority risk origin pairs', 'Selectionner les couples source-objectif prioritaires', 'Prioritize risk origin / target objective pairs based on relevance and likelihood.', 'Prioriser les couples source de risque / objectif vise en fonction de la pertinence et de la vraisemblance.', 'Atelier 2 - Sources de risque', 'Priorisation', null, EBIOS_URL),
    // Workshop 3: Strategic scenarios
    c('W3-01', 'Build the ecosystem map', 'Construire la cartographie de l\'ecosysteme', 'Map the ecosystem of stakeholders, partners, suppliers, and interfaces that could be exploited by risk origins.', 'Cartographier l\'ecosysteme des parties prenantes, partenaires, fournisseurs et interfaces qui pourraient etre exploites par les sources de risque.', 'Atelier 3 - Scenarios strategiques', 'Ecosysteme', '5.19', EBIOS_URL),
    c('W3-02', 'Assess ecosystem vulnerability', 'Evaluer la vulnerabilite de l\'ecosysteme', 'Evaluate the exposure, dependency, and trust level of each ecosystem stakeholder.', 'Evaluer l\'exposition, la dependance et le niveau de confiance de chaque partie prenante de l\'ecosysteme.', 'Atelier 3 - Scenarios strategiques', 'Vulnerabilite ecosysteme', '5.21', EBIOS_URL),
    c('W3-03', 'Define strategic scenarios', 'Definir les scenarios strategiques', 'Build strategic attack scenarios describing how a risk origin could reach its target objective via the ecosystem.', 'Construire des scenarios d\'attaque strategiques decrivant comment une source de risque pourrait atteindre son objectif vise via l\'ecosysteme.', 'Atelier 3 - Scenarios strategiques', 'Scenarios', null, EBIOS_URL),
    c('W3-04', 'Assess strategic scenario severity', 'Evaluer la gravite des scenarios strategiques', 'Evaluate the severity of each strategic scenario based on impact on business values.', 'Evaluer la gravite de chaque scenario strategique en fonction de l\'impact sur les valeurs metier.', 'Atelier 3 - Scenarios strategiques', 'Gravite', null, EBIOS_URL),
    // Workshop 4: Operational scenarios
    c('W4-01', 'Build operational scenarios', 'Construire les scenarios operationnels', 'Detail the technical attack paths (kill chain) for each strategic scenario, identifying exploited vulnerabilities and techniques.', 'Detailler les chemins d\'attaque techniques (kill chain) pour chaque scenario strategique, identifiant les vulnerabilites et techniques exploitees.', 'Atelier 4 - Scenarios operationnels', 'Scenarios operationnels', null, EBIOS_URL),
    c('W4-02', 'Assess operational scenario likelihood', 'Evaluer la vraisemblance des scenarios operationnels', 'Evaluate the likelihood of each operational scenario based on attacker capability and existing controls.', 'Evaluer la vraisemblance de chaque scenario operationnel en fonction de la capacite de l\'attaquant et des controles existants.', 'Atelier 4 - Scenarios operationnels', 'Vraisemblance', null, EBIOS_URL),
    c('W4-03', 'Map scenarios to MITRE ATT&CK', 'Cartographier les scenarios sur MITRE ATT&CK', 'Map operational attack scenarios to MITRE ATT&CK techniques for structured threat intelligence.', 'Cartographier les scenarios d\'attaque operationnels sur les techniques MITRE ATT&CK pour une intelligence de menace structuree.', 'Atelier 4 - Scenarios operationnels', 'ATT&CK', null, EBIOS_URL),
    // Workshop 5: Risk treatment
    c('W5-01', 'Define the risk treatment strategy', 'Definir la strategie de traitement des risques', 'For each risk, decide on treatment: reduction, acceptance, transfer, or avoidance, based on risk appetite.', 'Pour chaque risque, decider du traitement : reduction, acceptation, transfert ou evitement, en fonction de l\'appetit au risque.', 'Atelier 5 - Traitement du risque', 'Strategie', '5.5', EBIOS_URL),
    c('W5-02', 'Define security measures', 'Definir les mesures de securite', 'Specify the security measures to implement for risk reduction, covering prevention, detection, and response.', 'Specifier les mesures de securite a mettre en oeuvre pour la reduction des risques, couvrant la prevention, la detection et la reponse.', 'Atelier 5 - Traitement du risque', 'Mesures', null, EBIOS_URL),
    c('W5-03', 'Evaluate residual risks', 'Evaluer les risques residuels', 'Assess the residual risk after planned security measures are applied and validate acceptability.', 'Evaluer le risque residuel apres application des mesures de securite prevues et valider l\'acceptabilite.', 'Atelier 5 - Traitement du risque', 'Risques residuels', null, EBIOS_URL),
    c('W5-04', 'Build the security improvement plan', 'Construire le plan d\'amelioration de la securite', 'Produce an actionable security improvement plan with priorities, timelines, responsibilities, and monitoring indicators.', 'Produire un plan d\'amelioration de la securite actionnable avec des priorites, des echeances, des responsabilites et des indicateurs de suivi.', 'Atelier 5 - Traitement du risque', 'Plan d\'amelioration', '5.8', EBIOS_URL),
    c('W5-05', 'Obtain risk acceptance decision', 'Obtenir la decision d\'acceptation des risques', 'Present residual risks to management for formal acceptance and obtain signed approval.', 'Presenter les risques residuels a la direction pour acceptation formelle et obtenir l\'approbation signee.', 'Atelier 5 - Traitement du risque', 'Acceptation', '5.5', EBIOS_URL),
    c('W5-06', 'Implement continuous monitoring framework', 'Mettre en place le cadre de surveillance continue', 'Establish a framework for continuous monitoring of the risk landscape and effectiveness of security measures.', 'Etablir un cadre de surveillance continue du paysage de risques et de l\'efficacite des mesures de securite.', 'Atelier 5 - Traitement du risque', 'Surveillance', '5.36', EBIOS_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 2. ANSSI PASSI (Prestataires d'Audit)
// ============================================================
const PASSI_URL = 'https://www.ssi.gouv.fr/entreprise/qualifications/prestataires-de-services-de-confiance-qualifies/prestataires-daudit-de-la-securite-des-systemes-dinformation-passi/';
writeFramework({
  framework: {
    id: 'anssi-passi',
    name: 'Security Audit Service Provider Requirements (PASSI)',
    name_nl: 'Referentiel d\'exigences pour les prestataires d\'audit de la securite des systemes d\'information (PASSI)',
    issuing_body: 'Agence nationale de la securite des systemes d\'information (ANSSI)',
    version: '2.1',
    effective_date: '2015-04-01',
    scope: 'Qualification requirements for security audit service providers performing audits of information systems',
    scope_sectors: ['government', 'digital_infrastructure'],
    structure_description: 'Requirements organized by audit type: organizational audit, architecture audit, configuration audit, source code audit, penetration testing. Covers competence, independence, methodology, and reporting.',
    source_url: PASSI_URL,
    license: 'Public sector publication',
    language: 'fr',
  },
  controls: [
    // General requirements
    c('PASSI-GEN-01', 'Legal entity and insurance', 'Personne morale et assurance', 'The audit provider shall be a legal entity with professional liability insurance covering audit activities.', 'Le prestataire d\'audit doit etre une personne morale disposant d\'une assurance responsabilite civile professionnelle couvrant les activites d\'audit.', 'Exigences generales', 'Structure juridique', null, PASSI_URL),
    c('PASSI-GEN-02', 'Security policy for audit activities', 'Politique de securite des activites d\'audit', 'The provider shall maintain a security policy covering the protection of audit data, tools, and findings.', 'Le prestataire doit maintenir une politique de securite couvrant la protection des donnees d\'audit, des outils et des resultats.', 'Exigences generales', 'Politique de securite', '5.1', PASSI_URL),
    c('PASSI-GEN-03', 'Confidentiality commitments', 'Engagements de confidentialite', 'All audit personnel shall sign confidentiality agreements covering client information and vulnerabilities discovered.', 'L\'ensemble du personnel d\'audit doit signer des engagements de confidentialite couvrant les informations du client et les vulnerabilites decouvertes.', 'Exigences generales', 'Confidentialite', '6.6', PASSI_URL),
    c('PASSI-GEN-04', 'Independence and impartiality', 'Independance et impartialite', 'The provider shall demonstrate independence from the audited organization and document any potential conflicts of interest.', 'Le prestataire doit demontrer son independance vis-a-vis de l\'organisation auditee et documenter tout conflit d\'interets potentiel.', 'Exigences generales', 'Independance', null, PASSI_URL),
    c('PASSI-GEN-05', 'Audit tool security', 'Securite des outils d\'audit', 'Audit tools shall be maintained, secured, and validated. Toolchain provenance shall be documented.', 'Les outils d\'audit doivent etre maintenus, securises et valides. La provenance de la chaine d\'outils doit etre documentee.', 'Exigences generales', 'Outillage', '8.9', PASSI_URL),
    c('PASSI-GEN-06', 'Secure communication channels', 'Canaux de communication securises', 'All exchanges of sensitive audit data shall use encrypted communication channels.', 'Tous les echanges de donnees d\'audit sensibles doivent utiliser des canaux de communication chiffres.', 'Exigences generales', 'Communications', '8.24', PASSI_URL),
    c('PASSI-GEN-07', 'Audit data destruction', 'Destruction des donnees d\'audit', 'Audit data, findings, and work products shall be securely destroyed after the retention period.', 'Les donnees d\'audit, resultats et documents de travail doivent etre detruits de maniere securisee apres la periode de conservation.', 'Exigences generales', 'Destruction', '8.10', PASSI_URL),
    // Competence requirements
    c('PASSI-COMP-01', 'Auditor qualification criteria', 'Criteres de qualification des auditeurs', 'Auditors shall hold relevant certifications (PASSI, OSCP, CEH, or equivalent) and demonstrate at least 2 years of audit experience.', 'Les auditeurs doivent detenir des certifications pertinentes (PASSI, OSCP, CEH ou equivalent) et justifier d\'au moins 2 ans d\'experience en audit.', 'Competences', 'Qualification', '6.3', PASSI_URL),
    c('PASSI-COMP-02', 'Continuous professional development', 'Formation professionnelle continue', 'Auditors shall maintain their skills through ongoing training and participation in security research.', 'Les auditeurs doivent maintenir leurs competences par une formation continue et la participation a la recherche en securite.', 'Competences', 'Formation', '6.3', PASSI_URL),
    c('PASSI-COMP-03', 'Team composition per audit type', 'Composition de l\'equipe par type d\'audit', 'Each audit engagement shall have a team with documented competence for the specific audit type being performed.', 'Chaque mission d\'audit doit disposer d\'une equipe dont la competence est documentee pour le type d\'audit specifique realise.', 'Competences', 'Equipe', null, PASSI_URL),
    // Organizational audit
    c('PASSI-ORG-01', 'Organizational audit methodology', 'Methodologie d\'audit organisationnel', 'The provider shall use a structured methodology for organizational audits based on ISO 27001/27002 or equivalent.', 'Le prestataire doit utiliser une methodologie structuree pour les audits organisationnels basee sur ISO 27001/27002 ou equivalent.', 'Audit organisationnel', 'Methodologie', '5.35', PASSI_URL),
    c('PASSI-ORG-02', 'Document and policy review', 'Revue documentaire et des politiques', 'The audit shall include review of security policies, procedures, incident records, and management reviews.', 'L\'audit doit inclure la revue des politiques de securite, procedures, enregistrements d\'incidents et revues de direction.', 'Audit organisationnel', 'Revue documentaire', '5.1', PASSI_URL),
    c('PASSI-ORG-03', 'Staff interviews', 'Entretiens avec le personnel', 'The audit shall include structured interviews with key personnel to assess security awareness and practice compliance.', 'L\'audit doit inclure des entretiens structures avec le personnel cle pour evaluer la sensibilisation a la securite et la conformite des pratiques.', 'Audit organisationnel', 'Entretiens', null, PASSI_URL),
    // Architecture audit
    c('PASSI-ARCH-01', 'Architecture audit scope', 'Perimetre de l\'audit d\'architecture', 'Architecture audits shall cover network segmentation, data flows, trust zones, and defense-in-depth mechanisms.', 'Les audits d\'architecture doivent couvrir la segmentation reseau, les flux de donnees, les zones de confiance et les mecanismes de defense en profondeur.', 'Audit d\'architecture', 'Perimetre', '8.22', PASSI_URL),
    c('PASSI-ARCH-02', 'Architecture documentation review', 'Revue de la documentation d\'architecture', 'The auditor shall review architecture diagrams, network maps, and data flow diagrams for security weaknesses.', 'L\'auditeur doit examiner les diagrammes d\'architecture, les cartographies reseau et les diagrammes de flux de donnees pour identifier les faiblesses de securite.', 'Audit d\'architecture', 'Documentation', '5.9', PASSI_URL),
    // Configuration audit
    c('PASSI-CONF-01', 'Configuration audit scope', 'Perimetre de l\'audit de configuration', 'Configuration audits shall verify system hardening, default credentials removal, and secure configuration baselines.', 'Les audits de configuration doivent verifier le durcissement des systemes, la suppression des identifiants par defaut et les configurations de reference securisees.', 'Audit de configuration', 'Perimetre', '8.9', PASSI_URL),
    c('PASSI-CONF-02', 'Configuration benchmarking', 'Referentiel de configuration', 'Configurations shall be assessed against recognized benchmarks (CIS, vendor guidelines, ANSSI guides).', 'Les configurations doivent etre evaluees par rapport a des referentiels reconnus (CIS, guides fournisseurs, guides ANSSI).', 'Audit de configuration', 'Referentiel', '8.9', PASSI_URL),
    // Source code audit
    c('PASSI-CODE-01', 'Source code audit methodology', 'Methodologie d\'audit de code source', 'Source code audits shall combine automated scanning and manual expert review of critical code paths.', 'Les audits de code source doivent combiner une analyse automatisee et une revue manuelle experte des chemins de code critiques.', 'Audit de code source', 'Methodologie', '8.28', PASSI_URL),
    c('PASSI-CODE-02', 'Vulnerability classification', 'Classification des vulnerabilites', 'Identified vulnerabilities shall be classified by severity using a recognized scoring system (CVSS or equivalent).', 'Les vulnerabilites identifiees doivent etre classifiees par severite en utilisant un systeme de notation reconnu (CVSS ou equivalent).', 'Audit de code source', 'Classification', '8.8', PASSI_URL),
    // Penetration testing
    c('PASSI-PENTEST-01', 'Penetration test methodology', 'Methodologie de test d\'intrusion', 'Penetration tests shall follow a recognized methodology (OWASP, PTES, or equivalent) with defined rules of engagement.', 'Les tests d\'intrusion doivent suivre une methodologie reconnue (OWASP, PTES ou equivalent) avec des regles d\'engagement definies.', 'Test d\'intrusion', 'Methodologie', '8.8', PASSI_URL),
    c('PASSI-PENTEST-02', 'Rules of engagement', 'Regles d\'engagement', 'Formal rules of engagement shall define scope, timing, escalation procedures, and emergency contacts before testing begins.', 'Des regles d\'engagement formelles doivent definir le perimetre, le calendrier, les procedures d\'escalade et les contacts d\'urgence avant le debut des tests.', 'Test d\'intrusion', 'Regles d\'engagement', null, PASSI_URL),
    c('PASSI-PENTEST-03', 'Critical finding notification', 'Notification des decouvertes critiques', 'Critical vulnerabilities found during testing shall be immediately reported to the client through the agreed escalation channel.', 'Les vulnerabilites critiques decouvertes pendant les tests doivent etre immediatement signalees au client via le canal d\'escalade convenu.', 'Test d\'intrusion', 'Notification', null, PASSI_URL),
    // Reporting
    c('PASSI-RPT-01', 'Audit report content', 'Contenu du rapport d\'audit', 'Audit reports shall include executive summary, methodology, findings with severity ratings, evidence, and remediation recommendations.', 'Les rapports d\'audit doivent inclure un resume executif, la methodologie, les constats avec niveaux de severite, les preuves et les recommandations de remediation.', 'Rapport d\'audit', 'Contenu', null, PASSI_URL),
    c('PASSI-RPT-02', 'Report classification and handling', 'Classification et traitement du rapport', 'Audit reports shall be classified as confidential and transmitted through secure channels to authorized recipients only.', 'Les rapports d\'audit doivent etre classifies confidentiels et transmis par des canaux securises aux seuls destinataires autorises.', 'Rapport d\'audit', 'Classification', '5.12', PASSI_URL),
    c('PASSI-RPT-03', 'Remediation follow-up', 'Suivi de la remediation', 'The provider shall offer remediation verification to confirm that identified vulnerabilities have been addressed.', 'Le prestataire doit proposer une verification de remediation pour confirmer que les vulnerabilites identifiees ont ete traitees.', 'Rapport d\'audit', 'Suivi', null, PASSI_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 3. ANSSI PDIS (Detection Service Providers)
// ============================================================
const PDIS_URL = 'https://www.ssi.gouv.fr/entreprise/qualifications/prestataires-de-services-de-confiance-qualifies/prestataires-de-detection-des-incidents-de-securite-pdis/';
writeFramework({
  framework: {
    id: 'anssi-pdis',
    name: 'Security Incident Detection Service Provider Requirements (PDIS)',
    name_nl: 'Referentiel d\'exigences pour les prestataires de detection des incidents de securite (PDIS)',
    issuing_body: 'Agence nationale de la securite des systemes d\'information (ANSSI)',
    version: '2.0',
    effective_date: '2017-01-01',
    scope: 'Qualification requirements for providers operating security operations centers (SOC) and incident detection services',
    scope_sectors: ['government', 'energy', 'telecom', 'transport', 'digital_infrastructure'],
    structure_description: 'Requirements covering organizational structure, detection capabilities, personnel competence, log collection, analysis, alerting, and service level commitments.',
    source_url: PDIS_URL,
    license: 'Public sector publication',
    language: 'fr',
  },
  controls: [
    c('PDIS-ORG-01', 'SOC organizational structure', 'Structure organisationnelle du SOC', 'The provider shall maintain a dedicated SOC with defined roles, escalation paths, and 24/7 availability for critical clients.', 'Le prestataire doit maintenir un SOC dedie avec des roles definis, des chemins d\'escalade et une disponibilite 24/7 pour les clients critiques.', 'Organisation', null, '5.2', PDIS_URL),
    c('PDIS-ORG-02', 'Service level agreements', 'Accords de niveau de service', 'SLAs shall define detection time targets, notification delays, and coverage hours for each client.', 'Les SLA doivent definir les objectifs de temps de detection, les delais de notification et les heures de couverture pour chaque client.', 'Organisation', null, null, PDIS_URL),
    c('PDIS-ORG-03', 'Segregation of client environments', 'Segregation des environnements clients', 'Client monitoring data shall be logically or physically segregated to prevent cross-contamination.', 'Les donnees de surveillance des clients doivent etre segreguees logiquement ou physiquement pour prevenir toute contamination croisee.', 'Organisation', null, '5.31', PDIS_URL),
    c('PDIS-COMP-01', 'SOC analyst competence', 'Competence des analystes SOC', 'SOC analysts shall demonstrate competence in log analysis, threat detection, and incident triage through certifications or equivalent experience.', 'Les analystes SOC doivent demontrer leur competence en analyse de journaux, detection de menaces et tri d\'incidents par des certifications ou une experience equivalente.', 'Competences', null, '6.3', PDIS_URL),
    c('PDIS-COMP-02', 'Threat intelligence skills', 'Competences en renseignement sur les menaces', 'The detection team shall include personnel with threat intelligence capabilities to contextualize alerts.', 'L\'equipe de detection doit inclure du personnel ayant des capacites en renseignement sur les menaces pour contextualiser les alertes.', 'Competences', null, null, PDIS_URL),
    c('PDIS-COLL-01', 'Log collection architecture', 'Architecture de collecte des journaux', 'The provider shall deploy a log collection architecture ensuring completeness, integrity, and confidentiality of collected events.', 'Le prestataire doit deployer une architecture de collecte des journaux assurant la completude, l\'integrite et la confidentialite des evenements collectes.', 'Collecte des evenements', null, '8.15', PDIS_URL),
    c('PDIS-COLL-02', 'Log source coverage', 'Couverture des sources de journaux', 'Detection shall cover network equipment, servers, endpoints, authentication systems, and application logs at minimum.', 'La detection doit couvrir au minimum les equipements reseau, serveurs, postes de travail, systemes d\'authentification et journaux applicatifs.', 'Collecte des evenements', null, '8.15', PDIS_URL),
    c('PDIS-COLL-03', 'Log integrity protection', 'Protection de l\'integrite des journaux', 'Collected logs shall be protected against tampering through timestamping, hashing, or write-once storage.', 'Les journaux collectes doivent etre proteges contre la falsification par horodatage, hachage ou stockage non-reecrivable.', 'Collecte des evenements', null, '8.15', PDIS_URL),
    c('PDIS-DET-01', 'Detection rule management', 'Gestion des regles de detection', 'Detection rules shall be maintained, versioned, and regularly updated based on threat intelligence and incident lessons.', 'Les regles de detection doivent etre maintenues, versionnees et regulierement mises a jour en fonction du renseignement sur les menaces et des retours d\'incidents.', 'Detection et analyse', null, '8.16', PDIS_URL),
    c('PDIS-DET-02', 'Behavioral anomaly detection', 'Detection d\'anomalies comportementales', 'The detection system shall include behavioral analysis capabilities beyond signature-based detection.', 'Le systeme de detection doit inclure des capacites d\'analyse comportementale au-dela de la detection par signature.', 'Detection et analyse', null, '8.16', PDIS_URL),
    c('PDIS-DET-03', 'Correlation and enrichment', 'Correlation et enrichissement', 'Alerts shall be correlated across multiple sources and enriched with contextual information before analyst review.', 'Les alertes doivent etre correlees a travers plusieurs sources et enrichies d\'informations contextuelles avant la revue par l\'analyste.', 'Detection et analyse', null, '8.16', PDIS_URL),
    c('PDIS-DET-04', 'False positive management', 'Gestion des faux positifs', 'The provider shall maintain a process to identify, document, and reduce false positive rates while preserving detection coverage.', 'Le prestataire doit maintenir un processus pour identifier, documenter et reduire les taux de faux positifs tout en preservant la couverture de detection.', 'Detection et analyse', null, null, PDIS_URL),
    c('PDIS-ALT-01', 'Alert notification procedures', 'Procedures de notification des alertes', 'Confirmed security incidents shall be notified to the client within agreed timeframes using defined communication channels.', 'Les incidents de securite confirmes doivent etre notifies au client dans les delais convenus via les canaux de communication definis.', 'Alertes et notification', null, null, PDIS_URL),
    c('PDIS-ALT-02', 'Alert severity classification', 'Classification de la severite des alertes', 'Alerts shall be classified by severity level with defined response expectations for each level.', 'Les alertes doivent etre classifiees par niveau de severite avec des attentes de reponse definies pour chaque niveau.', 'Alertes et notification', null, null, PDIS_URL),
    c('PDIS-SEC-01', 'SOC infrastructure security', 'Securite de l\'infrastructure du SOC', 'SOC infrastructure shall be hardened, monitored, and physically secured with access restricted to authorized personnel.', 'L\'infrastructure du SOC doit etre durcie, surveillee et physiquement securisee avec un acces restreint au personnel autorise.', 'Securite du SOC', null, '7.1', PDIS_URL),
    c('PDIS-SEC-02', 'SOC network isolation', 'Isolation reseau du SOC', 'The SOC network shall be isolated from client production networks and general corporate networks.', 'Le reseau du SOC doit etre isole des reseaux de production des clients et des reseaux d\'entreprise generaux.', 'Securite du SOC', null, '8.22', PDIS_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 4. ANSSI PRIS (Incident Response Service Providers)
// ============================================================
const PRIS_URL = 'https://www.ssi.gouv.fr/entreprise/qualifications/prestataires-de-services-de-confiance-qualifies/prestataires-de-reponse-aux-incidents-de-securite-pris/';
writeFramework({
  framework: {
    id: 'anssi-pris',
    name: 'Security Incident Response Service Provider Requirements (PRIS)',
    name_nl: 'Referentiel d\'exigences pour les prestataires de reponse aux incidents de securite (PRIS)',
    issuing_body: 'Agence nationale de la securite des systemes d\'information (ANSSI)',
    version: '2.0',
    effective_date: '2017-06-01',
    scope: 'Qualification requirements for providers performing incident response, digital forensics, and crisis management',
    scope_sectors: ['government', 'energy', 'telecom', 'transport', 'digital_infrastructure'],
    structure_description: 'Requirements for incident response readiness, triage, containment, eradication, recovery, forensic analysis, and post-incident reporting.',
    source_url: PRIS_URL,
    license: 'Public sector publication',
    language: 'fr',
  },
  controls: [
    c('PRIS-ORG-01', 'Incident response team structure', 'Structure de l\'equipe de reponse aux incidents', 'The provider shall maintain a dedicated incident response team with defined roles: team lead, analysts, forensic experts.', 'Le prestataire doit maintenir une equipe de reponse aux incidents dediee avec des roles definis : chef d\'equipe, analystes, experts forensiques.', 'Organisation', null, '5.24', PRIS_URL),
    c('PRIS-ORG-02', 'On-call availability', 'Disponibilite d\'astreinte', 'The provider shall guarantee response capability with defined maximum response times, including outside business hours.', 'Le prestataire doit garantir une capacite de reponse avec des temps de reponse maximaux definis, y compris en dehors des heures ouvrables.', 'Organisation', null, null, PRIS_URL),
    c('PRIS-ORG-03', 'Engagement protocols', 'Protocoles d\'engagement', 'Formal engagement protocols shall define scope, authorization, legal considerations, and chain of custody from the start.', 'Des protocoles d\'engagement formels doivent definir le perimetre, les autorisations, les considerations juridiques et la chaine de conservation des preuves des le debut.', 'Organisation', null, null, PRIS_URL),
    c('PRIS-COMP-01', 'Incident responder qualifications', 'Qualifications des intervenants', 'Incident responders shall demonstrate competence in malware analysis, network forensics, and system investigation.', 'Les intervenants doivent demontrer leur competence en analyse de programmes malveillants, forensique reseau et investigation systeme.', 'Competences', null, '6.3', PRIS_URL),
    c('PRIS-COMP-02', 'Legal and regulatory knowledge', 'Connaissances juridiques et reglementaires', 'Responders shall be trained on legal requirements for evidence handling, data protection, and mandatory notifications.', 'Les intervenants doivent etre formes aux exigences legales pour la gestion des preuves, la protection des donnees et les notifications obligatoires.', 'Competences', null, null, PRIS_URL),
    c('PRIS-TRIAGE-01', 'Initial triage procedure', 'Procedure de tri initial', 'A documented triage procedure shall classify incident severity and determine resource allocation within defined timeframes.', 'Une procedure de tri documentee doit classifier la severite de l\'incident et determiner l\'allocation des ressources dans des delais definis.', 'Tri et qualification', null, '5.25', PRIS_URL),
    c('PRIS-TRIAGE-02', 'Scope assessment', 'Evaluation du perimetre', 'Rapid scope assessment shall determine affected systems, data exposure, and lateral movement indicators.', 'Une evaluation rapide du perimetre doit determiner les systemes affectes, l\'exposition des donnees et les indicateurs de mouvement lateral.', 'Tri et qualification', null, '5.25', PRIS_URL),
    c('PRIS-CONT-01', 'Containment strategy', 'Strategie de confinement', 'The provider shall implement containment measures proportional to incident severity while preserving forensic evidence.', 'Le prestataire doit mettre en oeuvre des mesures de confinement proportionnelles a la severite de l\'incident tout en preservant les preuves forensiques.', 'Confinement', null, '5.26', PRIS_URL),
    c('PRIS-CONT-02', 'Network isolation capabilities', 'Capacites d\'isolation reseau', 'The provider shall be able to advise on and implement network isolation of compromised segments.', 'Le prestataire doit etre capable de conseiller et mettre en oeuvre l\'isolation reseau des segments compromis.', 'Confinement', null, '8.22', PRIS_URL),
    c('PRIS-FOR-01', 'Digital forensic methodology', 'Methodologie forensique numerique', 'Digital forensic analysis shall follow recognized standards (ISO 27037, RFC 3227) with documented chain of custody.', 'L\'analyse forensique numerique doit suivre des normes reconnues (ISO 27037, RFC 3227) avec une chaine de conservation documentee.', 'Forensique', null, null, PRIS_URL),
    c('PRIS-FOR-02', 'Evidence preservation', 'Preservation des preuves', 'All forensic evidence shall be collected, hashed, and stored in a manner admissible in legal proceedings.', 'Toutes les preuves forensiques doivent etre collectees, hachees et stockees de maniere recevable dans les procedures judiciaires.', 'Forensique', null, null, PRIS_URL),
    c('PRIS-FOR-03', 'Malware analysis capability', 'Capacite d\'analyse de programmes malveillants', 'The provider shall have capability for static and dynamic malware analysis in isolated environments.', 'Le prestataire doit avoir la capacite d\'analyse statique et dynamique de programmes malveillants dans des environnements isoles.', 'Forensique', null, null, PRIS_URL),
    c('PRIS-REC-01', 'Recovery planning', 'Planification de la recuperation', 'The provider shall assist in developing recovery plans ensuring clean system restoration and monitoring for re-compromise.', 'Le prestataire doit assister dans l\'elaboration de plans de recuperation assurant la restauration saine des systemes et la surveillance de re-compromission.', 'Recuperation', null, '5.29', PRIS_URL),
    c('PRIS-RPT-01', 'Incident report production', 'Production du rapport d\'incident', 'A detailed incident report shall include timeline, attack chain, impact assessment, indicators of compromise, and recommendations.', 'Un rapport d\'incident detaille doit inclure la chronologie, la chaine d\'attaque, l\'evaluation d\'impact, les indicateurs de compromission et les recommandations.', 'Rapport', null, '5.27', PRIS_URL),
    c('PRIS-RPT-02', 'Lessons learned facilitation', 'Animation du retour d\'experience', 'The provider shall facilitate a post-incident lessons learned session and produce actionable improvement recommendations.', 'Le prestataire doit animer une session de retour d\'experience post-incident et produire des recommandations d\'amelioration actionnables.', 'Rapport', null, '5.27', PRIS_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 5. ANSSI Guide des bonnes pratiques de l'informatique (12 rules)
// ============================================================
const BP_URL = 'https://www.ssi.gouv.fr/guide/guide-des-bonnes-pratiques-de-linformatique/';
writeFramework({
  framework: {
    id: 'anssi-bonnes-pratiques',
    name: 'IT Best Practices Guide (12 Rules)',
    name_nl: 'Guide des bonnes pratiques de l\'informatique (12 regles)',
    issuing_body: 'Agence nationale de la securite des systemes d\'information (ANSSI)',
    version: '1.0',
    effective_date: '2017-01-01',
    scope: 'Essential IT security rules for small and medium organizations, published jointly with CPME',
    scope_sectors: ['government', 'healthcare', 'finance', 'education'],
    structure_description: '12 rules covering passwords, updates, backups, user privileges, network security, Wi-Fi security, mobile device security, personal/professional separation, email vigilance, download safety, payment security, and physical workstation protection.',
    source_url: BP_URL,
    license: 'Public sector publication',
    language: 'fr',
  },
  controls: [
    c('BP-01', 'Choose passwords carefully', 'Choisir avec soin ses mots de passe', 'Use strong, unique passwords for each service. A good password is long (12+ characters), complex, and not reused.', 'Utiliser des mots de passe robustes et uniques pour chaque service. Un bon mot de passe est long (12+ caracteres), complexe et non reutilise.', 'Mots de passe', null, '5.17', BP_URL),
    c('BP-02', 'Update software regularly', 'Mettre a jour regulierement les logiciels', 'Apply security patches promptly for operating systems, applications, and firmware to fix known vulnerabilities.', 'Appliquer rapidement les correctifs de securite pour les systemes d\'exploitation, applications et micrologiciels pour corriger les vulnerabilites connues.', 'Mises a jour', null, '8.8', BP_URL),
    c('BP-03', 'Know your users and service providers', 'Bien connaitre ses utilisateurs et ses prestataires', 'Maintain awareness of who has access to your information systems and what service providers do with your data.', 'Maintenir la connaissance de qui a acces a vos systemes d\'information et ce que les prestataires font avec vos donnees.', 'Gestion des acces', null, '5.16', BP_URL),
    c('BP-04', 'Perform regular backups', 'Effectuer des sauvegardes regulieres', 'Back up critical data regularly, test restoration procedures, and store backups offline or in a separate location.', 'Sauvegarder regulierement les donnees critiques, tester les procedures de restauration et stocker les sauvegardes hors ligne ou dans un lieu separe.', 'Sauvegardes', null, '8.13', BP_URL),
    c('BP-05', 'Secure Wi-Fi access', 'Securiser l\'acces Wi-Fi de l\'entreprise', 'Use WPA3/WPA2 encryption, change default credentials, hide SSID in sensitive environments, and segment guest Wi-Fi.', 'Utiliser le chiffrement WPA3/WPA2, changer les identifiants par defaut, masquer le SSID dans les environnements sensibles et segmenter le Wi-Fi invites.', 'Securite Wi-Fi', null, '8.22', BP_URL),
    c('BP-06', 'Be careful with smartphones and tablets', 'Etre aussi prudent avec son smartphone ou sa tablette qu\'avec son ordinateur', 'Apply the same security principles to mobile devices: PIN/biometric lock, encryption, app permissions review, remote wipe capability.', 'Appliquer les memes principes de securite aux appareils mobiles : verrouillage PIN/biometrique, chiffrement, revue des permissions des applications, capacite d\'effacement a distance.', 'Securite mobile', null, '8.1', BP_URL),
    c('BP-07', 'Protect commercial data during travel', 'Proteger ses donnees lors de deplacements', 'Use VPN on public networks, avoid charging devices on unknown USB ports, keep devices with you at all times.', 'Utiliser un VPN sur les reseaux publics, eviter de charger les appareils sur des ports USB inconnus, garder les appareils avec soi en permanence.', 'Mobilite', null, '8.1', BP_URL),
    c('BP-08', 'Be vigilant with email', 'Etre prudent avec les courriels', 'Do not open attachments from unknown senders, verify sender addresses, do not click suspicious links, report phishing.', 'Ne pas ouvrir les pieces jointes d\'expediteurs inconnus, verifier les adresses d\'expediteur, ne pas cliquer sur les liens suspects, signaler le hameconnage.', 'Messagerie', null, '6.3', BP_URL),
    c('BP-09', 'Download programs from trusted sources', 'Telecharger les programmes sur les sites officiels des editeurs', 'Only install software from official sources, verify digital signatures, avoid pirated software.', 'N\'installer des logiciels que depuis les sources officielles, verifier les signatures numeriques, eviter les logiciels pirates.', 'Telechargements', null, '8.19', BP_URL),
    c('BP-10', 'Be careful with personal and professional use', 'Separer les usages personnels et professionnels', 'Maintain separation between personal and professional data, devices, and online accounts.', 'Maintenir la separation entre les donnees, appareils et comptes en ligne personnels et professionnels.', 'Separation des usages', null, '8.1', BP_URL),
    c('BP-11', 'Take care of personal information online', 'Prendre soin de ses informations personnelles et de son identite numerique', 'Limit personal information shared online, review privacy settings, be aware of social engineering risks.', 'Limiter les informations personnelles partagees en ligne, verifier les parametres de confidentialite, etre conscient des risques d\'ingenierie sociale.', 'Identite numerique', null, null, BP_URL),
    c('BP-12', 'Secure online payments', 'Verifier la securite des sites de paiement', 'Verify HTTPS and valid certificates before entering payment data, use 3D Secure, monitor bank statements.', 'Verifier HTTPS et les certificats valides avant de saisir des donnees de paiement, utiliser 3D Secure, surveiller les releves bancaires.', 'Paiement en ligne', null, null, BP_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

console.log('\nChunk 1 complete: EBIOS, PASSI, PDIS, PRIS, Bonnes Pratiques');
