// scripts/ingest-new-frameworks-3.ts
// Chunk 3: Regulatory + Financial sector frameworks
// Run: node --import tsx scripts/ingest-new-frameworks-3.ts

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data', 'extracted');
mkdirSync(DATA_DIR, { recursive: true });

interface Control {
  control_number: string; title: string | null; title_nl: string;
  description: string | null; description_nl: string; category: string;
  subcategory: string | null; level: string | null; iso_mapping: string | null;
  implementation_guidance: string | null; verification_guidance: string | null;
  source_url: string;
}
interface FrameworkData {
  framework: { id: string; name: string; name_nl: string; issuing_body: string;
    version: string; effective_date: string; scope: string; scope_sectors: string[];
    structure_description: string; source_url: string; license: string; language: string; };
  controls: Control[];
  metadata: { ingested_at: string; total_controls: number };
}

function c(num: string, titleEn: string, titleFr: string, descEn: string, descFr: string, cat: string, subcat: string | null, iso: string | null, url: string): Control {
  return { control_number: num, title: titleEn, title_nl: titleFr, description: descEn, description_nl: descFr, category: cat, subcategory: subcat, level: null, iso_mapping: iso, implementation_guidance: null, verification_guidance: null, source_url: url };
}
function writeFramework(data: FrameworkData) {
  const path = join(DATA_DIR, `${data.framework.id}.json`);
  data.metadata.total_controls = data.controls.length;
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ${data.framework.id}: ${data.controls.length} controls`);
}
const NOW = new Date().toISOString();

// ============================================================
// 17. LPM - OIV Cybersecurity Requirements
// ============================================================
const LPM_URL = 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000028338825';
writeFramework({
  framework: {
    id: 'lpm-oiv',
    name: 'Military Programming Law - OIV Cybersecurity Requirements',
    name_nl: 'Loi de Programmation Militaire - Exigences de cybersecurite des OIV',
    issuing_body: 'Republique francaise / SGDSN / ANSSI',
    version: '2024', effective_date: '2024-01-01',
    scope: 'Mandatory cybersecurity requirements for Operators of Vital Importance (OIV) designated under the LPM',
    scope_sectors: ['government', 'energy', 'telecom', 'transport', 'healthcare', 'finance', 'water'],
    structure_description: 'Requirements covering SIIV (systemes d\'information d\'importance vitale) identification, security rules, incident notification, audit obligations, and ANSSI controls.',
    source_url: LPM_URL, license: 'Public sector publication (Legifrance)', language: 'fr',
  },
  controls: [
    c('LPM-01', 'SIIV identification', 'Identification des SIIV', 'OIV shall identify their information systems of vital importance (SIIV) and notify ANSSI of the list.', 'Les OIV doivent identifier leurs systemes d\'information d\'importance vitale (SIIV) et notifier la liste a l\'ANSSI.', 'Identification des SIIV', null, '5.9', LPM_URL),
    c('LPM-02', 'SIIV security policy', 'Politique de securite des SIIV', 'OIV shall establish and maintain a security policy specifically covering their SIIV, approved by senior management.', 'Les OIV doivent etablir et maintenir une politique de securite couvrant specifiquement leurs SIIV, approuvee par la direction.', 'Gouvernance', null, '5.1', LPM_URL),
    c('LPM-03', 'Security homologation', 'Homologation de securite', 'Each SIIV shall undergo security homologation (formal security authorization) before deployment or after significant changes.', 'Chaque SIIV doit faire l\'objet d\'une homologation de securite (autorisation formelle de securite) avant mise en service ou apres des changements significatifs.', 'Gouvernance', null, '5.1', LPM_URL),
    c('LPM-04', 'SIIV asset inventory', 'Inventaire des actifs SIIV', 'Maintain a complete and current inventory of all hardware, software, and network components of SIIV.', 'Maintenir un inventaire complet et a jour de tous les materiels, logiciels et composants reseau des SIIV.', 'Cartographie', null, '5.9', LPM_URL),
    c('LPM-05', 'SIIV network segmentation', 'Segmentation reseau des SIIV', 'SIIV shall be segmented from other information systems with controlled and monitored interconnection points.', 'Les SIIV doivent etre segmentes des autres systemes d\'information avec des points d\'interconnexion controles et surveilles.', 'Protection', null, '8.22', LPM_URL),
    c('LPM-06', 'SIIV access control', 'Controle d\'acces aux SIIV', 'Access to SIIV shall be restricted to authorized personnel with strong authentication and strict need-to-know.', 'L\'acces aux SIIV doit etre restreint au personnel autorise avec une authentification forte et un besoin d\'en connaitre strict.', 'Protection', null, '8.5', LPM_URL),
    c('LPM-07', 'SIIV administration security', 'Securite de l\'administration des SIIV', 'Administration of SIIV shall use dedicated administration workstations and networks per ANSSI recommendations.', 'L\'administration des SIIV doit utiliser des postes et reseaux d\'administration dedies conformement aux recommandations de l\'ANSSI.', 'Administration', null, '8.2', LPM_URL),
    c('LPM-08', 'Security patch management', 'Gestion des correctifs de securite', 'Security patches for SIIV shall be applied within timeframes defined by ANSSI, with testing procedures.', 'Les correctifs de securite pour les SIIV doivent etre appliques dans les delais definis par l\'ANSSI, avec des procedures de test.', 'Maintien en condition de securite', null, '8.8', LPM_URL),
    c('LPM-09', 'Security event logging for SIIV', 'Journalisation des evenements de securite des SIIV', 'SIIV shall log all security-relevant events with retention of at least 6 months, accessible to ANSSI upon request.', 'Les SIIV doivent journaliser tous les evenements pertinents pour la securite avec une conservation d\'au moins 6 mois, accessible a l\'ANSSI sur demande.', 'Detection', null, '8.15', LPM_URL),
    c('LPM-10', 'Continuous security monitoring', 'Surveillance continue de la securite', 'OIV shall implement continuous security monitoring of SIIV through a qualified PDIS or internal SOC.', 'Les OIV doivent mettre en oeuvre une surveillance continue de la securite des SIIV par un PDIS qualifie ou un SOC interne.', 'Detection', null, '8.16', LPM_URL),
    c('LPM-11', 'Incident notification to ANSSI', 'Notification des incidents a l\'ANSSI', 'Security incidents affecting SIIV shall be reported to ANSSI without delay, using the defined notification format.', 'Les incidents de securite affectant les SIIV doivent etre signales a l\'ANSSI sans delai, en utilisant le format de notification defini.', 'Gestion des incidents', null, '5.24', LPM_URL),
    c('LPM-12', 'Incident response capability', 'Capacite de reponse aux incidents', 'OIV shall maintain an incident response capability, either internal or through a qualified PRIS provider.', 'Les OIV doivent maintenir une capacite de reponse aux incidents, soit interne, soit par un prestataire PRIS qualifie.', 'Gestion des incidents', null, '5.26', LPM_URL),
    c('LPM-13', 'ANSSI audit compliance', 'Conformite aux audits ANSSI', 'OIV shall submit to security audits conducted or mandated by ANSSI on their SIIV, and implement remediation plans.', 'Les OIV doivent se soumettre aux audits de securite conduits ou mandates par l\'ANSSI sur leurs SIIV, et mettre en oeuvre des plans de remediation.', 'Audit et controle', null, '5.35', LPM_URL),
    c('LPM-14', 'Crisis management plan', 'Plan de gestion de crise', 'OIV shall maintain a crisis management plan covering major cyber incidents affecting SIIV, including communication protocols.', 'Les OIV doivent maintenir un plan de gestion de crise couvrant les incidents cyber majeurs affectant les SIIV, incluant les protocoles de communication.', 'Gestion de crise', null, '5.29', LPM_URL),
    c('LPM-15', 'SIIV physical security', 'Securite physique des SIIV', 'Physical access to SIIV infrastructure shall be controlled, monitored, and restricted to authorized personnel.', 'L\'acces physique aux infrastructures SIIV doit etre controle, surveille et restreint au personnel autorise.', 'Securite physique', null, '7.1', LPM_URL),
    c('LPM-16', 'Supply chain security for SIIV', 'Securite de la chaine d\'approvisionnement pour les SIIV', 'Components and services for SIIV shall be sourced from evaluated or qualified suppliers with security requirements in contracts.', 'Les composants et services pour les SIIV doivent provenir de fournisseurs evalues ou qualifies avec des exigences de securite dans les contrats.', 'Chaine d\'approvisionnement', null, '5.19', LPM_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 18. NIS2 French Transposition
// ============================================================
const NIS2_URL = 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049566498';
writeFramework({
  framework: {
    id: 'nis2-fr',
    name: 'NIS2 French Transposition - Cybersecurity Requirements',
    name_nl: 'Transposition francaise de NIS2 - Exigences de cybersecurite',
    issuing_body: 'Republique francaise / ANSSI',
    version: '2025', effective_date: '2025-01-01',
    scope: 'French implementation of EU Directive 2022/2555 (NIS2) covering essential and important entities',
    scope_sectors: ['government', 'energy', 'telecom', 'transport', 'healthcare', 'finance', 'water', 'digital_infrastructure'],
    structure_description: 'Requirements for entity registration, risk management measures, incident reporting, supply chain security, governance obligations, and ANSSI supervision.',
    source_url: NIS2_URL, license: 'Public sector publication (Legifrance)', language: 'fr',
  },
  controls: [
    c('NIS2-01', 'Entity registration with ANSSI', 'Enregistrement de l\'entite aupres de l\'ANSSI', 'Essential and important entities shall register with ANSSI, declaring their activities, sectors, and point of contact.', 'Les entites essentielles et importantes doivent s\'enregistrer aupres de l\'ANSSI, declarant leurs activites, secteurs et point de contact.', 'Gouvernance', null, null, NIS2_URL),
    c('NIS2-02', 'Management body accountability', 'Responsabilite de l\'organe de direction', 'Management bodies of essential entities shall approve cybersecurity risk measures and be trained in cybersecurity.', 'Les organes de direction des entites essentielles doivent approuver les mesures de gestion des risques cyber et etre formes en cybersecurite.', 'Gouvernance', null, '5.4', NIS2_URL),
    c('NIS2-03', 'Risk analysis and security policy', 'Analyse des risques et politique de securite', 'Entities shall conduct regular risk analysis and maintain security policies covering their information systems.', 'Les entites doivent conduire des analyses de risques regulieres et maintenir des politiques de securite couvrant leurs systemes d\'information.', 'Mesures de gestion des risques', null, '5.1', NIS2_URL),
    c('NIS2-04', 'Incident handling procedures', 'Procedures de gestion des incidents', 'Implement documented incident handling procedures including detection, analysis, containment, and recovery.', 'Mettre en oeuvre des procedures de gestion des incidents documentees incluant la detection, l\'analyse, le confinement et la recuperation.', 'Mesures de gestion des risques', null, '5.24', NIS2_URL),
    c('NIS2-05', 'Business continuity and crisis management', 'Continuite d\'activite et gestion de crise', 'Maintain business continuity plans, disaster recovery procedures, and crisis management capabilities.', 'Maintenir des plans de continuite d\'activite, des procedures de reprise apres sinistre et des capacites de gestion de crise.', 'Mesures de gestion des risques', null, '5.29', NIS2_URL),
    c('NIS2-06', 'Supply chain security', 'Securite de la chaine d\'approvisionnement', 'Assess and manage cybersecurity risks in the supply chain, including security requirements for suppliers and service providers.', 'Evaluer et gerer les risques de cybersecurite dans la chaine d\'approvisionnement, incluant des exigences de securite pour les fournisseurs et prestataires.', 'Mesures de gestion des risques', null, '5.19', NIS2_URL),
    c('NIS2-07', 'Vulnerability management', 'Gestion des vulnerabilites', 'Implement vulnerability handling and disclosure processes, including patch management and coordinated vulnerability disclosure.', 'Mettre en oeuvre des processus de gestion et divulgation des vulnerabilites, incluant la gestion des correctifs et la divulgation coordonnee.', 'Mesures de gestion des risques', null, '8.8', NIS2_URL),
    c('NIS2-08', 'Security hygiene practices and training', 'Pratiques d\'hygiene cyber et formation', 'Implement basic cyber hygiene practices and provide regular cybersecurity training to all personnel.', 'Mettre en oeuvre les pratiques de base d\'hygiene cyber et fournir une formation reguliere en cybersecurite a tout le personnel.', 'Mesures de gestion des risques', null, '6.3', NIS2_URL),
    c('NIS2-09', 'Cryptographic controls', 'Controles cryptographiques', 'Implement appropriate use of cryptography, including encryption policies aligned with ANSSI recommendations.', 'Mettre en oeuvre une utilisation appropriee de la cryptographie, incluant des politiques de chiffrement alignees sur les recommandations de l\'ANSSI.', 'Mesures de gestion des risques', null, '8.24', NIS2_URL),
    c('NIS2-10', 'Access control and asset management', 'Controle d\'acces et gestion des actifs', 'Implement access control policies and maintain a complete asset inventory including human resources security.', 'Mettre en oeuvre des politiques de controle d\'acces et maintenir un inventaire complet des actifs incluant la securite des ressources humaines.', 'Mesures de gestion des risques', null, '5.16', NIS2_URL),
    c('NIS2-11', 'MFA and secure authentication', 'AMF et authentification securisee', 'Deploy multi-factor authentication, continuous authentication, or equivalent measures for system access.', 'Deployer l\'authentification multifacteur, l\'authentification continue, ou des mesures equivalentes pour l\'acces aux systemes.', 'Mesures de gestion des risques', null, '8.5', NIS2_URL),
    c('NIS2-12', 'Secure communications', 'Communications securisees', 'Use secured voice, video, and text communications and emergency communication systems.', 'Utiliser des communications voix, video et texte securisees et des systemes de communication d\'urgence.', 'Mesures de gestion des risques', null, '8.24', NIS2_URL),
    c('NIS2-13', 'Early warning notification (24h)', 'Notification d\'alerte precoce (24h)', 'Notify ANSSI within 24 hours of becoming aware of a significant incident (early warning with initial assessment).', 'Notifier l\'ANSSI dans les 24 heures suivant la connaissance d\'un incident significatif (alerte precoce avec evaluation initiale).', 'Notification des incidents', null, '5.24', NIS2_URL),
    c('NIS2-14', 'Incident notification (72h)', 'Notification d\'incident (72h)', 'Submit a detailed incident notification to ANSSI within 72 hours including severity assessment, impact, and indicators of compromise.', 'Soumettre une notification d\'incident detaillee a l\'ANSSI dans les 72 heures incluant l\'evaluation de severite, l\'impact et les indicateurs de compromission.', 'Notification des incidents', null, '5.24', NIS2_URL),
    c('NIS2-15', 'Final incident report (1 month)', 'Rapport d\'incident final (1 mois)', 'Submit a final incident report within one month including root cause analysis, mitigation applied, and cross-border impact.', 'Soumettre un rapport d\'incident final dans un delai d\'un mois incluant l\'analyse des causes profondes, les mesures d\'attenuation et l\'impact transfrontalier.', 'Notification des incidents', null, '5.27', NIS2_URL),
    c('NIS2-16', 'ANSSI supervision compliance', 'Conformite a la supervision ANSSI', 'Entities shall cooperate with ANSSI inspections, audits, and requests for information on their cybersecurity posture.', 'Les entites doivent cooperer avec les inspections, audits et demandes d\'information de l\'ANSSI sur leur posture de cybersecurite.', 'Supervision', null, '5.35', NIS2_URL),
    c('NIS2-17', 'Penalty awareness for non-compliance', 'Conscience des sanctions en cas de non-conformite', 'Essential entities face administrative fines up to 10M EUR or 2% of global turnover; important entities up to 7M EUR or 1.4%.', 'Les entites essentielles encourent des amendes administratives jusqu\'a 10M EUR ou 2% du CA mondial ; les entites importantes jusqu\'a 7M EUR ou 1,4%.', 'Sanctions', null, null, NIS2_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 19. RGPD Technical Implementation Measures
// ============================================================
const RGPD_URL = 'https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on';
writeFramework({
  framework: {
    id: 'cnil-rgpd-technique',
    name: 'RGPD Technical Implementation Measures',
    name_nl: 'Mesures techniques de mise en oeuvre du RGPD',
    issuing_body: 'Commission Nationale de l\'Informatique et des Libertes (CNIL)',
    version: '2024', effective_date: '2024-01-01',
    scope: 'Technical and organizational measures required by the RGPD (GDPR) as interpreted by CNIL guidance and enforcement actions',
    scope_sectors: ['government', 'healthcare', 'finance', 'education', 'telecom', 'digital_infrastructure'],
    structure_description: 'Measures covering data minimization, purpose limitation, consent management, data subject rights, DPIA, breach notification, and security measures (Article 32).',
    source_url: RGPD_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('RGPD-01', 'Data processing register', 'Registre des traitements de donnees', 'Maintain a register of all personal data processing activities with purpose, legal basis, categories, and retention periods.', 'Maintenir un registre de toutes les activites de traitement de donnees personnelles avec la finalite, la base legale, les categories et les durees de conservation.', 'Conformite generale', null, null, RGPD_URL),
    c('RGPD-02', 'Privacy by design', 'Protection de la vie privee des la conception', 'Integrate data protection requirements from the design phase of systems processing personal data.', 'Integrer les exigences de protection des donnees des la phase de conception des systemes traitant des donnees personnelles.', 'Principes', null, '8.25', RGPD_URL),
    c('RGPD-03', 'Privacy by default', 'Protection de la vie privee par defaut', 'Default settings shall minimize personal data collection, processing scope, storage period, and accessibility.', 'Les parametres par defaut doivent minimiser la collecte de donnees personnelles, le perimetre de traitement, la duree de conservation et l\'accessibilite.', 'Principes', null, null, RGPD_URL),
    c('RGPD-04', 'Purpose limitation enforcement', 'Application de la limitation de la finalite', 'Technical controls shall prevent the use of personal data beyond its declared purpose.', 'Des controles techniques doivent empecher l\'utilisation des donnees personnelles au-dela de leur finalite declaree.', 'Principes', null, null, RGPD_URL),
    c('RGPD-05', 'Consent management system', 'Systeme de gestion du consentement', 'Implement a technical consent management system recording granular, informed, specific, and withdrawable consent.', 'Mettre en oeuvre un systeme technique de gestion du consentement enregistrant un consentement granulaire, informe, specifique et retirable.', 'Droits des personnes', null, null, RGPD_URL),
    c('RGPD-06', 'Right to access implementation', 'Mise en oeuvre du droit d\'acces', 'Implement technical capability to extract and provide all personal data held about a data subject upon request.', 'Mettre en oeuvre la capacite technique d\'extraire et fournir toutes les donnees personnelles detenues sur une personne concernee a sa demande.', 'Droits des personnes', null, null, RGPD_URL),
    c('RGPD-07', 'Right to erasure implementation', 'Mise en oeuvre du droit a l\'effacement', 'Implement technical capability to delete personal data across all systems, backups, and processors upon valid request.', 'Mettre en oeuvre la capacite technique de supprimer les donnees personnelles sur tous les systemes, sauvegardes et sous-traitants sur demande valide.', 'Droits des personnes', null, '8.10', RGPD_URL),
    c('RGPD-08', 'Data portability implementation', 'Mise en oeuvre de la portabilite des donnees', 'Provide personal data in a structured, commonly used, machine-readable format (JSON, CSV, XML) upon portability request.', 'Fournir les donnees personnelles dans un format structure, couramment utilise et lisible par machine (JSON, CSV, XML) a la demande de portabilite.', 'Droits des personnes', null, null, RGPD_URL),
    c('RGPD-09', 'Data protection impact assessment (DPIA)', 'Analyse d\'impact relative a la protection des donnees (AIPD)', 'Conduct a DPIA before processing likely to result in high risk to individuals\' rights and freedoms.', 'Conduire une AIPD avant tout traitement susceptible d\'engendrer un risque eleve pour les droits et libertes des personnes.', 'Evaluation d\'impact', null, null, RGPD_URL),
    c('RGPD-10', 'Pseudonymization implementation', 'Mise en oeuvre de la pseudonymisation', 'Apply pseudonymization techniques to personal data where full identification is not necessary for processing.', 'Appliquer des techniques de pseudonymisation aux donnees personnelles lorsque l\'identification complete n\'est pas necessaire au traitement.', 'Article 32 - Securite', null, '8.11', RGPD_URL),
    c('RGPD-11', 'Encryption of personal data', 'Chiffrement des donnees personnelles', 'Encrypt personal data at rest and in transit using ANSSI-recommended algorithms and key sizes.', 'Chiffrer les donnees personnelles au repos et en transit en utilisant les algorithmes et tailles de cle recommandes par l\'ANSSI.', 'Article 32 - Securite', null, '8.24', RGPD_URL),
    c('RGPD-12', 'Data breach detection capability', 'Capacite de detection des violations de donnees', 'Implement technical measures to detect personal data breaches promptly (unauthorized access, exfiltration, loss).', 'Mettre en oeuvre des mesures techniques pour detecter rapidement les violations de donnees personnelles (acces non autorise, exfiltration, perte).', 'Notification des violations', null, '8.16', RGPD_URL),
    c('RGPD-13', 'Breach notification to CNIL (72h)', 'Notification de violation a la CNIL (72h)', 'Notify the CNIL within 72 hours of becoming aware of a personal data breach, with documented procedures.', 'Notifier la CNIL dans les 72 heures suivant la connaissance d\'une violation de donnees personnelles, avec des procedures documentees.', 'Notification des violations', null, '5.24', RGPD_URL),
    c('RGPD-14', 'Data retention automation', 'Automatisation de la conservation des donnees', 'Implement automated data retention and deletion mechanisms aligned with declared retention periods.', 'Mettre en oeuvre des mecanismes automatises de conservation et de suppression des donnees alignes sur les durees de conservation declarees.', 'Conservation', null, '8.10', RGPD_URL),
    c('RGPD-15', 'Third-party processor controls', 'Controles des sous-traitants', 'Verify that data processors implement appropriate security measures and maintain contractual guarantees (Article 28).', 'Verifier que les sous-traitants mettent en oeuvre des mesures de securite appropriees et maintiennent des garanties contractuelles (Article 28).', 'Sous-traitance', null, '5.19', RGPD_URL),
    c('RGPD-16', 'International transfer safeguards', 'Garanties pour les transferts internationaux', 'Implement appropriate safeguards (SCCs, BCRs, adequacy) for transfers of personal data outside the EEA.', 'Mettre en oeuvre des garanties appropriees (CCT, BCR, adequation) pour les transferts de donnees personnelles hors de l\'EEE.', 'Transferts internationaux', null, null, RGPD_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 20. II 901 - Protection of Classified Information (DR)
// ============================================================
const II901_URL = 'https://www.ssi.gouv.fr/administration/reglementation/protection-des-systemes-dinformations/instruction-interministerielle-n-901/';
writeFramework({
  framework: {
    id: 'ii-901',
    name: 'Instruction Interministerielle 901 - Protection of DR Information Systems',
    name_nl: 'Instruction Interministerielle n 901 - Protection des systemes d\'information Diffusion Restreinte',
    issuing_body: 'Secretariat general de la defense et de la securite nationale (SGDSN)',
    version: '2015', effective_date: '2015-01-28',
    scope: 'Protection requirements for information systems handling Diffusion Restreinte (DR) classified information',
    scope_sectors: ['government'],
    structure_description: 'Requirements for DR system homologation, physical security, access control, cryptographic protection, network architecture, maintenance, and incident handling.',
    source_url: II901_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('II901-01', 'DR system homologation', 'Homologation du systeme DR', 'Every DR-level information system shall undergo a formal homologation process before processing classified information.', 'Tout systeme d\'information de niveau DR doit faire l\'objet d\'un processus d\'homologation formel avant de traiter de l\'information classifiee.', 'Homologation', null, '5.1', II901_URL),
    c('II901-02', 'Security officer appointment', 'Nomination du responsable de securite', 'A security officer shall be formally appointed and responsible for the DR system security throughout its lifecycle.', 'Un responsable de securite doit etre formellement nomme et responsable de la securite du systeme DR tout au long de son cycle de vie.', 'Organisation', null, '5.2', II901_URL),
    c('II901-03', 'Personnel security clearance', 'Habilitation du personnel', 'All personnel accessing DR systems shall hold appropriate security clearance and have signed confidentiality agreements.', 'Tout le personnel accedant aux systemes DR doit detenir l\'habilitation de securite appropriee et avoir signe des engagements de confidentialite.', 'Personnel', null, '6.1', II901_URL),
    c('II901-04', 'Physical security of DR systems', 'Securite physique des systemes DR', 'DR systems shall be housed in controlled access areas with physical intrusion detection and access logging.', 'Les systemes DR doivent etre heberges dans des zones a acces controle avec detection d\'intrusion physique et journalisation des acces.', 'Securite physique', null, '7.1', II901_URL),
    c('II901-05', 'DR network encryption', 'Chiffrement reseau DR', 'DR information transmitted over non-protected networks shall be encrypted using ANSSI-qualified cryptographic devices.', 'L\'information DR transmise sur des reseaux non proteges doit etre chiffree en utilisant des dispositifs cryptographiques qualifies par l\'ANSSI.', 'Chiffrement', null, '8.24', II901_URL),
    c('II901-06', 'DR system network isolation', 'Isolation reseau du systeme DR', 'DR systems shall be physically or logically isolated from non-classified networks with controlled gateways.', 'Les systemes DR doivent etre physiquement ou logiquement isoles des reseaux non classifies avec des passerelles controlees.', 'Architecture reseau', null, '8.22', II901_URL),
    c('II901-07', 'Approved cryptographic products', 'Produits cryptographiques agrees', 'Only ANSSI-qualified or approved cryptographic products shall be used for DR information protection.', 'Seuls les produits cryptographiques qualifies ou agrees par l\'ANSSI doivent etre utilises pour la protection de l\'information DR.', 'Chiffrement', null, '8.24', II901_URL),
    c('II901-08', 'DR media handling', 'Gestion des supports DR', 'Removable media containing DR information shall be marked, inventoried, stored in safes, and securely destroyed at end of life.', 'Les supports amovibles contenant de l\'information DR doivent etre marques, inventories, stockes dans des coffres et detruits de maniere securisee en fin de vie.', 'Supports', null, '7.10', II901_URL),
    c('II901-09', 'DR system maintenance security', 'Securite de la maintenance des systemes DR', 'Maintenance of DR systems shall be performed by cleared personnel with procedures to prevent information leakage.', 'La maintenance des systemes DR doit etre realisee par du personnel habilite avec des procedures pour prevenir les fuites d\'information.', 'Maintenance', null, '7.13', II901_URL),
    c('II901-10', 'DR incident response', 'Reponse aux incidents DR', 'Security incidents on DR systems shall be immediately reported to the security officer and ANSSI through the chain of command.', 'Les incidents de securite sur les systemes DR doivent etre immediatement signales au responsable de securite et a l\'ANSSI via la chaine hierarchique.', 'Incidents', null, '5.24', II901_URL),
    c('II901-11', 'DR system decommissioning', 'Mise hors service des systemes DR', 'DR system decommissioning shall include certified data destruction and return of cryptographic equipment to ANSSI.', 'La mise hors service des systemes DR doit inclure la destruction certifiee des donnees et le retour des equipements cryptographiques a l\'ANSSI.', 'Fin de vie', null, '8.10', II901_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 21. ACPR IT Requirements for Financial Institutions
// ============================================================
const ACPR_URL = 'https://acpr.banque-france.fr/page-sommaire/risques-lies-aux-systemes-dinformation';
writeFramework({
  framework: {
    id: 'acpr-it',
    name: 'ACPR IT Risk Requirements for Financial Institutions',
    name_nl: 'Exigences ACPR en matiere de risques informatiques pour les institutions financieres',
    issuing_body: 'Autorite de Controle Prudentiel et de Resolution (ACPR) / Banque de France',
    version: '2024', effective_date: '2024-01-01',
    scope: 'IT risk management requirements for banks, insurance companies, and investment firms supervised by ACPR',
    scope_sectors: ['finance'],
    structure_description: 'Requirements covering IT governance, IT risk management, change management, IT outsourcing, cybersecurity, business continuity, and IT audit.',
    source_url: ACPR_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('ACPR-GOV-01', 'IT governance framework', 'Cadre de gouvernance informatique', 'Institutions shall have an IT governance framework with clear roles, committees, and reporting to the management body.', 'Les institutions doivent disposer d\'un cadre de gouvernance informatique avec des roles clairs, des comites et un reporting a l\'organe de direction.', 'Gouvernance IT', null, '5.1', ACPR_URL),
    c('ACPR-GOV-02', 'IT strategy aligned with business', 'Strategie IT alignee sur les metiers', 'IT strategy shall be formally documented, aligned with business objectives, and approved by the management body.', 'La strategie IT doit etre formellement documentee, alignee sur les objectifs metier et approuvee par l\'organe de direction.', 'Gouvernance IT', null, null, ACPR_URL),
    c('ACPR-RISK-01', 'IT risk assessment', 'Evaluation des risques informatiques', 'Conduct regular IT risk assessments covering operational, cyber, third-party, and data integrity risks.', 'Conduire des evaluations regulieres des risques informatiques couvrant les risques operationnels, cyber, tiers et d\'integrite des donnees.', 'Gestion des risques IT', null, '5.5', ACPR_URL),
    c('ACPR-RISK-02', 'IT risk appetite definition', 'Definition de l\'appetit au risque IT', 'The management body shall define and periodically review the institution\'s IT risk appetite and tolerance levels.', 'L\'organe de direction doit definir et reexaminer periodiquement l\'appetit au risque IT et les niveaux de tolerance de l\'institution.', 'Gestion des risques IT', null, '5.5', ACPR_URL),
    c('ACPR-SEC-01', 'Cybersecurity framework', 'Cadre de cybersecurite', 'Implement a comprehensive cybersecurity framework covering identification, protection, detection, response, and recovery.', 'Mettre en oeuvre un cadre de cybersecurite complet couvrant l\'identification, la protection, la detection, la reponse et la recuperation.', 'Cybersecurite', null, '5.1', ACPR_URL),
    c('ACPR-SEC-02', 'Security testing program', 'Programme de tests de securite', 'Conduct regular security testing including vulnerability scanning, penetration testing, and red team exercises.', 'Conduire des tests de securite reguliers incluant l\'analyse de vulnerabilites, les tests d\'intrusion et les exercices de red team.', 'Cybersecurite', null, '8.8', ACPR_URL),
    c('ACPR-SEC-03', 'Cyber incident reporting', 'Declaration des incidents cyber', 'Report significant cyber incidents to ACPR within agreed timeframes and cooperate with supervisory investigations.', 'Declarer les incidents cyber significatifs a l\'ACPR dans les delais convenus et cooperer avec les investigations de supervision.', 'Cybersecurite', null, '5.24', ACPR_URL),
    c('ACPR-OUT-01', 'IT outsourcing risk management', 'Gestion des risques d\'externalisation IT', 'Maintain a register of all IT outsourcing arrangements and assess concentration and substitutability risks.', 'Maintenir un registre de tous les arrangements d\'externalisation IT et evaluer les risques de concentration et de substituabilite.', 'Externalisation IT', null, '5.19', ACPR_URL),
    c('ACPR-OUT-02', 'Cloud outsourcing requirements', 'Exigences d\'externalisation cloud', 'Cloud outsourcing shall include data localization requirements, exit strategies, and audit rights.', 'L\'externalisation cloud doit inclure des exigences de localisation des donnees, des strategies de sortie et des droits d\'audit.', 'Externalisation IT', null, '5.23', ACPR_URL),
    c('ACPR-BCP-01', 'IT business continuity', 'Continuite d\'activite IT', 'Maintain IT business continuity plans with tested recovery procedures and defined RTOs/RPOs for critical systems.', 'Maintenir des plans de continuite d\'activite IT avec des procedures de recuperation testees et des RTO/RPO definis pour les systemes critiques.', 'Continuite d\'activite', null, '5.29', ACPR_URL),
    c('ACPR-BCP-02', 'IT disaster recovery testing', 'Tests de reprise d\'activite IT', 'Test IT disaster recovery plans at least annually with scenarios covering major disruption of critical IT services.', 'Tester les plans de reprise d\'activite IT au moins annuellement avec des scenarios couvrant la perturbation majeure des services IT critiques.', 'Continuite d\'activite', null, '5.30', ACPR_URL),
    c('ACPR-CHG-01', 'IT change management', 'Gestion des changements IT', 'Implement a formal IT change management process with impact assessment, testing, and rollback procedures.', 'Mettre en oeuvre un processus formel de gestion des changements IT avec evaluation d\'impact, tests et procedures de retour en arriere.', 'Gestion des changements', null, '8.32', ACPR_URL),
    c('ACPR-DATA-01', 'Data quality and integrity', 'Qualite et integrite des donnees', 'Implement controls to ensure the quality, accuracy, completeness, and integrity of financial and regulatory data.', 'Mettre en oeuvre des controles pour assurer la qualite, l\'exactitude, la completude et l\'integrite des donnees financieres et reglementaires.', 'Gestion des donnees', null, '8.11', ACPR_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 22. DORA French Implementation
// ============================================================
const DORA_URL = 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32022R2554';
writeFramework({
  framework: {
    id: 'dora-fr',
    name: 'DORA French Implementation - Digital Operational Resilience',
    name_nl: 'Mise en oeuvre francaise de DORA - Resilience operationnelle numerique',
    issuing_body: 'ACPR / AMF / Banque de France',
    version: '2025', effective_date: '2025-01-17',
    scope: 'French implementation of EU Regulation 2022/2554 on digital operational resilience for the financial sector',
    scope_sectors: ['finance'],
    structure_description: 'Requirements covering ICT risk management, incident reporting, digital resilience testing, third-party ICT risk, and information sharing.',
    source_url: DORA_URL, license: 'EU public law', language: 'fr',
  },
  controls: [
    c('DORA-ICT-01', 'ICT risk management framework', 'Cadre de gestion des risques TIC', 'Establish a comprehensive ICT risk management framework approved by the management body, reviewed annually.', 'Etablir un cadre complet de gestion des risques TIC approuve par l\'organe de direction, reexamine annuellement.', 'Gestion des risques TIC', null, '5.1', DORA_URL),
    c('DORA-ICT-02', 'ICT asset classification and mapping', 'Classification et cartographie des actifs TIC', 'Identify, classify, and document all ICT assets, systems, and their interconnections supporting critical functions.', 'Identifier, classifier et documenter tous les actifs TIC, systemes et leurs interconnexions supportant les fonctions critiques.', 'Gestion des risques TIC', null, '5.9', DORA_URL),
    c('DORA-ICT-03', 'ICT security policies and standards', 'Politiques et normes de securite TIC', 'Maintain ICT security policies covering network security, data protection, encryption, access control, and patch management.', 'Maintenir des politiques de securite TIC couvrant la securite reseau, la protection des donnees, le chiffrement, le controle d\'acces et la gestion des correctifs.', 'Gestion des risques TIC', null, '5.1', DORA_URL),
    c('DORA-ICT-04', 'ICT business continuity policy', 'Politique de continuite d\'activite TIC', 'Develop ICT business continuity policies with defined recovery time and recovery point objectives.', 'Developper des politiques de continuite d\'activite TIC avec des objectifs de temps de recuperation et de point de recuperation definis.', 'Continuite d\'activite TIC', null, '5.29', DORA_URL),
    c('DORA-ICT-05', 'ICT response and recovery plans', 'Plans de reponse et de recuperation TIC', 'Maintain documented ICT response and recovery plans tested at least annually through realistic scenarios.', 'Maintenir des plans de reponse et de recuperation TIC documentes, testes au moins annuellement par des scenarios realistes.', 'Continuite d\'activite TIC', null, '5.26', DORA_URL),
    c('DORA-INC-01', 'ICT incident classification', 'Classification des incidents TIC', 'Classify ICT incidents using defined criteria: number of clients affected, data loss, service downtime, geographic spread.', 'Classifier les incidents TIC selon des criteres definis : nombre de clients affectes, perte de donnees, indisponibilite de service, etendue geographique.', 'Gestion des incidents TIC', null, '5.25', DORA_URL),
    c('DORA-INC-02', 'Major incident notification', 'Notification des incidents majeurs', 'Notify the competent authority (ACPR/AMF) of major ICT incidents using the defined reporting templates and timelines.', 'Notifier l\'autorite competente (ACPR/AMF) des incidents TIC majeurs en utilisant les modeles et delais de reporting definis.', 'Gestion des incidents TIC', null, '5.24', DORA_URL),
    c('DORA-INC-03', 'Incident root cause analysis', 'Analyse des causes profondes des incidents', 'Conduct root cause analysis for all major ICT incidents and implement corrective measures to prevent recurrence.', 'Conduire une analyse des causes profondes pour tous les incidents TIC majeurs et mettre en oeuvre des mesures correctives pour prevenir la recurrence.', 'Gestion des incidents TIC', null, '5.27', DORA_URL),
    c('DORA-TEST-01', 'Digital resilience testing program', 'Programme de tests de resilience numerique', 'Establish a risk-based digital resilience testing program including vulnerability scanning, network security, and gap analysis.', 'Etablir un programme de tests de resilience numerique base sur les risques incluant l\'analyse de vulnerabilites, la securite reseau et l\'analyse des ecarts.', 'Tests de resilience', null, '8.8', DORA_URL),
    c('DORA-TEST-02', 'Threat-led penetration testing (TLPT)', 'Tests d\'intrusion pilotes par les menaces (TLPT)', 'Significant entities shall conduct threat-led penetration testing (TIBER-EU framework) at least every 3 years.', 'Les entites significatives doivent conduire des tests d\'intrusion pilotes par les menaces (cadre TIBER-EU) au moins tous les 3 ans.', 'Tests de resilience', null, '8.8', DORA_URL),
    c('DORA-TPR-01', 'ICT third-party risk register', 'Registre des risques tiers TIC', 'Maintain a register of all contractual arrangements with ICT third-party providers with risk assessments.', 'Maintenir un registre de tous les arrangements contractuels avec les prestataires tiers TIC avec des evaluations de risques.', 'Risques tiers TIC', null, '5.19', DORA_URL),
    c('DORA-TPR-02', 'Critical ICT provider oversight', 'Surveillance des prestataires TIC critiques', 'Implement enhanced due diligence and monitoring for critical or important ICT third-party providers.', 'Mettre en oeuvre une diligence raisonnable et une surveillance renforcees pour les prestataires tiers TIC critiques ou importants.', 'Risques tiers TIC', null, '5.22', DORA_URL),
    c('DORA-TPR-03', 'Exit strategy for critical ICT providers', 'Strategie de sortie pour les prestataires TIC critiques', 'Develop and maintain exit strategies for critical ICT providers ensuring continuity of critical functions.', 'Developper et maintenir des strategies de sortie pour les prestataires TIC critiques assurant la continuite des fonctions critiques.', 'Risques tiers TIC', null, '5.23', DORA_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 23. DINUM Cloud Doctrine
// ============================================================
const CLOUD_URL = 'https://www.numerique.gouv.fr/services/cloud/doctrine/';
writeFramework({
  framework: {
    id: 'dinum-cloud',
    name: 'Government Cloud Doctrine (Cloud de confiance)',
    name_nl: 'Doctrine d\'utilisation du cloud par l\'Etat (Cloud de confiance)',
    issuing_body: 'Direction interministerielle du numerique (DINUM)',
    version: '2023', effective_date: '2023-01-01',
    scope: 'Cloud usage doctrine for French government administrations defining "Cloud au centre" strategy',
    scope_sectors: ['government'],
    structure_description: 'Principles covering cloud-first strategy, data sensitivity classification, SecNumCloud requirement for sensitive data, sovereign cloud requirements, and permitted cloud providers.',
    source_url: CLOUD_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('CLOUD-01', 'Cloud-first principle', 'Principe cloud d\'abord', 'Government administrations shall adopt a "Cloud au centre" approach for all new projects and digital services.', 'Les administrations publiques doivent adopter une approche « Cloud au centre » pour tous les nouveaux projets et services numeriques.', 'Principes generaux', null, null, CLOUD_URL),
    c('CLOUD-02', 'Data sensitivity classification for cloud', 'Classification de la sensibilite des donnees pour le cloud', 'Classify data into sensitivity levels: public, ordinary, sensitive, very sensitive. Cloud choice depends on classification.', 'Classifier les donnees en niveaux de sensibilite : publiques, ordinaires, sensibles, tres sensibles. Le choix du cloud depend de la classification.', 'Classification', null, '5.12', CLOUD_URL),
    c('CLOUD-03', 'SecNumCloud for sensitive data', 'SecNumCloud pour les donnees sensibles', 'Sensitive and very sensitive government data shall only be hosted on SecNumCloud-qualified cloud providers.', 'Les donnees gouvernementales sensibles et tres sensibles ne doivent etre hebergees que chez des fournisseurs cloud qualifies SecNumCloud.', 'Exigences cloud', null, null, CLOUD_URL),
    c('CLOUD-04', 'EU data sovereignty', 'Souverainete des donnees UE', 'Government data shall be stored and processed within the European Union, by EU-controlled entities.', 'Les donnees gouvernementales doivent etre stockees et traitees au sein de l\'Union europeenne, par des entites controlees par l\'UE.', 'Souverainete', null, null, CLOUD_URL),
    c('CLOUD-05', 'Protection from non-EU jurisdictions', 'Protection contre les juridictions non-UE', 'Cloud providers hosting government data shall not be subject to non-EU extraterritorial legislation (e.g., CLOUD Act, FISA).', 'Les fournisseurs cloud hebergeant des donnees gouvernementales ne doivent pas etre soumis a des legislations extraterritoriales non-UE (ex : CLOUD Act, FISA).', 'Souverainete', null, null, CLOUD_URL),
    c('CLOUD-06', 'Interministerial cloud catalog', 'Catalogue cloud interministeriel', 'Use services from the interministerial cloud catalog (Pi Cloud) for government cloud deployments.', 'Utiliser les services du catalogue cloud interministeriel (Pi Cloud) pour les deploiements cloud gouvernementaux.', 'Services autorises', null, null, CLOUD_URL),
    c('CLOUD-07', 'Reversibility requirement', 'Exigence de reversibilite', 'All government cloud contracts shall include reversibility provisions ensuring data and service portability.', 'Tous les contrats cloud gouvernementaux doivent inclure des provisions de reversibilite assurant la portabilite des donnees et des services.', 'Contractuel', null, '5.23', CLOUD_URL),
    c('CLOUD-08', 'Multi-cloud architecture', 'Architecture multi-cloud', 'Government cloud architectures should avoid single-provider lock-in through multi-cloud or hybrid strategies.', 'Les architectures cloud gouvernementales doivent eviter le verrouillage mono-fournisseur par des strategies multi-cloud ou hybrides.', 'Architecture', null, null, CLOUD_URL),
    c('CLOUD-09', 'Cloud security baseline', 'Socle de securite cloud', 'Cloud deployments shall implement a security baseline aligned with ANSSI SecNumCloud requirements and RGS.', 'Les deploiements cloud doivent implementer un socle de securite aligne sur les exigences SecNumCloud de l\'ANSSI et le RGS.', 'Securite', null, '5.1', CLOUD_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 24. RGI - General Interoperability Framework
// ============================================================
const RGI_URL = 'https://www.numerique.gouv.fr/publications/interoperabilite/';
writeFramework({
  framework: {
    id: 'rgi',
    name: 'General Interoperability Framework (RGI)',
    name_nl: 'Referentiel General d\'Interoperabilite (RGI)',
    issuing_body: 'Direction interministerielle du numerique (DINUM)',
    version: '2.0', effective_date: '2016-04-20',
    scope: 'Interoperability standards for French government information systems, including security aspects of data exchange',
    scope_sectors: ['government'],
    structure_description: 'Recommendations for technical, syntactic, semantic, and organizational interoperability with security requirements for data exchange protocols.',
    source_url: RGI_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('RGI-SEC-01', 'Secure data exchange protocols', 'Protocoles d\'echange de donnees securises', 'Government data exchanges shall use secure protocols (HTTPS, SFTP, AS4) with mutual authentication.', 'Les echanges de donnees gouvernementaux doivent utiliser des protocoles securises (HTTPS, SFTP, AS4) avec authentification mutuelle.', 'Securite des echanges', null, '8.24', RGI_URL),
    c('RGI-SEC-02', 'XML and JSON security', 'Securite XML et JSON', 'XML and JSON payloads shall be validated against schemas, with protection against injection and XXE attacks.', 'Les charges utiles XML et JSON doivent etre validees par rapport a des schemas, avec protection contre les attaques d\'injection et XXE.', 'Securite des echanges', null, '8.28', RGI_URL),
    c('RGI-SEC-03', 'Digital signature for official documents', 'Signature numerique pour les documents officiels', 'Official electronic documents shall be digitally signed using RGS-compliant signature mechanisms.', 'Les documents electroniques officiels doivent etre signes numeriquement en utilisant des mecanismes de signature conformes au RGS.', 'Signature et authentification', null, '8.24', RGI_URL),
    c('RGI-SEC-04', 'API security standards', 'Normes de securite des API', 'Government APIs shall implement OAuth 2.0/OpenID Connect, rate limiting, input validation, and API gateway protection.', 'Les API gouvernementales doivent implementer OAuth 2.0/OpenID Connect, la limitation de debit, la validation des entrees et la protection par passerelle API.', 'Securite des API', null, '8.5', RGI_URL),
    c('RGI-SEC-05', 'Certificate requirements for interoperability', 'Exigences de certificats pour l\'interoperabilite', 'Use certificates from RGS-qualified certification authorities for inter-administration authentication and encryption.', 'Utiliser des certificats provenant d\'autorites de certification qualifiees RGS pour l\'authentification et le chiffrement inter-administrations.', 'Certificats', null, '8.24', RGI_URL),
    c('RGI-SEC-06', 'Interoperability audit trail', 'Piste d\'audit d\'interoperabilite', 'All inter-system data exchanges shall be logged with sender, receiver, timestamp, and transaction identifier.', 'Tous les echanges de donnees inter-systemes doivent etre journalises avec l\'emetteur, le recepteur, l\'horodatage et l\'identifiant de transaction.', 'Tracabilite', null, '8.15', RGI_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 25. ANS Health Interoperability Security (CI-SIS)
// ============================================================
const CISIS_URL = 'https://esante.gouv.fr/produits-services/ci-sis';
writeFramework({
  framework: {
    id: 'ans-ci-sis',
    name: 'Health IS Interoperability Framework Security (CI-SIS)',
    name_nl: 'Cadre d\'Interoperabilite des Systemes d\'Information de Sante - Securite (CI-SIS)',
    issuing_body: 'Agence du Numerique en Sante (ANS)',
    version: '2024', effective_date: '2024-01-01',
    scope: 'Security requirements within the health information system interoperability framework',
    scope_sectors: ['healthcare'],
    structure_description: 'Security requirements for health data exchange protocols, identity management, consent, audit trails, and integration with Mon Espace Sante.',
    source_url: CISIS_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('CISIS-SEC-01', 'Health data exchange encryption', 'Chiffrement des echanges de donnees de sante', 'All health data exchanges between systems shall be encrypted using TLS 1.2+ with mutual authentication.', 'Tous les echanges de donnees de sante entre systemes doivent etre chiffres en utilisant TLS 1.2+ avec authentification mutuelle.', 'Securite des echanges', null, '8.24', CISIS_URL),
    c('CISIS-SEC-02', 'INS (Identifiant National de Sante) verification', 'Verification de l\'INS (Identifiant National de Sante)', 'Systems exchanging health data shall verify patient identity using the INS (matricule INS) through the national teleservice.', 'Les systemes echangeant des donnees de sante doivent verifier l\'identite du patient en utilisant l\'INS (matricule INS) via le teleservice national.', 'Identite du patient', null, '5.16', CISIS_URL),
    c('CISIS-SEC-03', 'Pro Sante Connect authentication', 'Authentification Pro Sante Connect', 'Health professionals accessing shared health data shall authenticate via Pro Sante Connect (national authentication service).', 'Les professionnels de sante accedant aux donnees de sante partagees doivent s\'authentifier via Pro Sante Connect (service national d\'authentification).', 'Authentification', null, '8.5', CISIS_URL),
    c('CISIS-SEC-04', 'Health data consent management', 'Gestion du consentement pour les donnees de sante', 'Implement consent verification before sharing health data, respecting patient opposition rights via Mon Espace Sante.', 'Mettre en oeuvre la verification du consentement avant le partage de donnees de sante, respectant les droits d\'opposition du patient via Mon Espace Sante.', 'Consentement', null, null, CISIS_URL),
    c('CISIS-SEC-05', 'Health data exchange audit trail', 'Piste d\'audit des echanges de donnees de sante', 'All health data exchanges shall generate audit records including professional identity, patient INS, and action performed.', 'Tous les echanges de donnees de sante doivent generer des enregistrements d\'audit incluant l\'identite du professionnel, l\'INS du patient et l\'action realisee.', 'Tracabilite', null, '8.15', CISIS_URL),
    c('CISIS-SEC-06', 'Structured health document security', 'Securite des documents de sante structures', 'CDA-R2 and FHIR documents shall include digital signatures and integrity verification mechanisms.', 'Les documents CDA-R2 et FHIR doivent inclure des signatures numeriques et des mecanismes de verification d\'integrite.', 'Documents de sante', null, '8.24', CISIS_URL),
    c('CISIS-SEC-07', 'DMP integration security', 'Securite de l\'integration DMP', 'Integration with the DMP (Dossier Medical Partage) shall follow ANS security specifications for reading and writing.', 'L\'integration avec le DMP (Dossier Medical Partage) doit suivre les specifications de securite ANS pour la lecture et l\'ecriture.', 'Integration DMP', null, null, CISIS_URL),
    c('CISIS-SEC-08', 'Messagerie securisee de sante (MSSante)', 'MSSante (Messagerie securisee de sante)', 'Health message exchanges between professionals shall use MSSante for end-to-end encrypted, traceable communication.', 'Les echanges de messages de sante entre professionnels doivent utiliser MSSante pour une communication chiffree de bout en bout et tracable.', 'Messagerie', null, '8.24', CISIS_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

console.log('\nChunk 3 complete: LPM-OIV, NIS2-FR, RGPD-technique, II-901, ACPR, DORA-FR, DINUM Cloud, RGI, ANS CI-SIS');
