// scripts/seed-test-db.ts
// Builds a minimal test database at data/standards.db for development and testing.
// Uses @ansvar/mcp-sqlite (WASM-based, CommonJS loaded via createRequire).

import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'standards.db');

// Ensure the data directory exists
mkdirSync(join(__dirname, '..', 'data'), { recursive: true });

const require = createRequire(import.meta.url);
const { Database } = require('@ansvar/mcp-sqlite');
const db = new Database(DB_PATH);

db.exec(`
CREATE TABLE IF NOT EXISTS frameworks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_nl TEXT,
  issuing_body TEXT NOT NULL,
  version TEXT NOT NULL,
  effective_date TEXT,
  scope TEXT,
  scope_sectors TEXT,
  structure_description TEXT,
  source_url TEXT,
  license TEXT,
  language TEXT NOT NULL DEFAULT 'fr'
);

CREATE TABLE IF NOT EXISTS controls (
  id TEXT PRIMARY KEY,
  framework_id TEXT NOT NULL REFERENCES frameworks(id),
  control_number TEXT NOT NULL,
  title TEXT,
  title_nl TEXT NOT NULL,
  description TEXT,
  description_nl TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  level TEXT,
  iso_mapping TEXT,
  implementation_guidance TEXT,
  verification_guidance TEXT,
  source_url TEXT
);

CREATE VIRTUAL TABLE IF NOT EXISTS controls_fts USING fts5(
  id,
  title,
  title_nl,
  description,
  description_nl,
  category,
  content='controls',
  content_rowid='rowid'
);

CREATE TABLE IF NOT EXISTS db_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`);

const insertFramework = db.prepare(
  'INSERT OR REPLACE INTO frameworks (id, name, name_nl, issuing_body, version, effective_date, scope, scope_sectors, structure_description, source_url, license, language) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

insertFramework.run('anssi-rgs', 'General Security Framework (RGS)', 'Referentiel General de Securite (RGS)', 'Agence nationale de la securite des systemes d\'information (ANSSI)', '2.0', '2014-06-24', 'Mandatory security framework for French government information systems', '["government"]', 'Organized by security functions: authentication, electronic signature, confidentiality, timestamping, governance, incident management', 'https://www.ssi.gouv.fr/entreprise/reglementation/confiance-numerique/le-referentiel-general-de-securite-rgs/', 'Public sector publication', 'fr');

insertFramework.run('anssi-hygiene', 'IT Hygiene Guide', 'Guide d\'hygiene informatique', 'Agence nationale de la securite des systemes d\'information (ANSSI)', '2.0', '2017-01-01', '42 essential security measures for all organizations', '["government","healthcare","finance","education"]', '42 measures organized in 8 themes: know the IS, control access, secure workstations, secure the network, secure administration, maintain security, monitor/audit/respond, raise awareness', 'https://www.ssi.gouv.fr/guide/guide-dhygiene-informatique/', 'Public sector publication', 'fr');

insertFramework.run('cnil-securite', 'Personal Data Security Guide', 'Guide de la securite des donnees personnelles', 'Commission Nationale de l\'Informatique et des Libertes (CNIL)', '2024', '2024-01-01', 'Security measures for organizations processing personal data under RGPD', '["government","healthcare","finance","education"]', '17 fiches covering awareness, authentication, access management, logging, workstation security, mobile security, network protection, server security, web security, backup, archiving, maintenance, subcontracting, data exchange, physical security, development, and encryption', 'https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles', 'Public sector publication', 'fr');

insertFramework.run('anssi-secnumcloud', 'SecNumCloud Cloud Security Framework', 'Referentiel SecNumCloud', 'Agence nationale de la securite des systemes d\'information (ANSSI)', '3.2', '2022-03-01', 'Cloud service provider qualification requirements including sovereignty', '["government","healthcare","finance"]', 'ISO 27001-aligned controls plus sovereignty requirements for cloud service providers', 'https://www.ssi.gouv.fr/entreprise/qualifications/prestataires-de-services-de-confiance-qualifies/prestataires-de-service-dinformatique-en-nuage-secnumcloud/', 'Public sector publication', 'fr');

insertFramework.run('anssi-pgssi-s', 'Health IS Security Policy (PGSSI-S)', 'Politique Generale de Securite des SI de Sante (PGSSI-S)', 'Agence du Numerique en Sante (ANS)', '2024', '2024-01-01', 'Security framework for health information systems in France', '["healthcare"]', 'Covers identification/authentication, access rights management, traceability, secure messaging, health data security', 'https://esante.gouv.fr/produits-services/pgssi-s', 'Public sector publication', 'fr');

insertFramework.run('hds', 'Health Data Hosting Certification (HDS)', 'Certification Hebergeurs de Donnees de Sante (HDS)', 'Agence du Numerique en Sante (ANS)', '2024', '2024-01-01', 'Certification for organizations hosting French health data', '["healthcare"]', 'Requirements for physical infrastructure, network, managed hosting, operations, backup, and certification', 'https://esante.gouv.fr/produits-services/hds', 'Public sector publication', 'fr');

// New frameworks (representative samples for development/testing)
insertFramework.run('anssi-ebios-rm', 'EBIOS Risk Manager', 'EBIOS Risk Manager', 'Agence nationale de la securite des systemes d\'information (ANSSI)', '1.0', '2018-10-01', 'Official French risk analysis methodology', '["government","healthcare","finance","energy","telecom","transport","education","digital_infrastructure"]', '5 workshops for risk analysis', 'https://www.ssi.gouv.fr/guide/la-methode-ebios-risk-manager-le-guide/', 'Public sector publication', 'fr');

insertFramework.run('lpm-oiv', 'Military Programming Law - OIV Cybersecurity Requirements', 'Loi de Programmation Militaire - Exigences de cybersecurite des OIV', 'Republique francaise / SGDSN / ANSSI', '2024', '2024-01-01', 'Mandatory cybersecurity requirements for Operators of Vital Importance', '["government","energy","telecom","transport","healthcare","finance","water"]', 'Requirements for SIIV identification, security rules, incident notification, audit', 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000028338825', 'Public sector publication (Legifrance)', 'fr');

insertFramework.run('nis2-fr', 'NIS2 French Transposition', 'Transposition francaise de NIS2', 'Republique francaise / ANSSI', '2025', '2025-01-01', 'French implementation of EU Directive 2022/2555', '["government","energy","telecom","transport","healthcare","finance","water","digital_infrastructure"]', 'Requirements for essential and important entities', 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049566498', 'Public sector publication (Legifrance)', 'fr');

insertFramework.run('dora-fr', 'DORA French Implementation', 'Mise en oeuvre francaise de DORA', 'ACPR / AMF / Banque de France', '2025', '2025-01-17', 'Digital operational resilience for financial sector', '["finance"]', 'ICT risk management, incident reporting, resilience testing, third-party risk', 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32022R2554', 'EU public law', 'fr');

insertFramework.run('acpr-it', 'ACPR IT Risk Requirements', 'Exigences ACPR risques informatiques', 'ACPR / Banque de France', '2024', '2024-01-01', 'IT risk management for banks and insurance companies', '["finance"]', 'IT governance, risk management, cybersecurity, outsourcing, continuity', 'https://acpr.banque-france.fr/page-sommaire/risques-lies-aux-systemes-dinformation', 'Public sector publication', 'fr');

const insertControl = db.prepare(
  'INSERT OR REPLACE INTO controls (id, framework_id, control_number, title, title_nl, description, description_nl, category, subcategory, level, iso_mapping, implementation_guidance, verification_guidance, source_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

// ANSSI RGS sample controls
insertControl.run('anssi-rgs:AUTH-01', 'anssi-rgs', 'AUTH-01', 'Authentication level determination', 'Determination du niveau d\'authentification', 'The information system owner shall determine the required authentication level based on the sensitivity of the data and services accessed.', 'Le responsable du systeme d\'information doit determiner le niveau d\'authentification requis en fonction de la sensibilite des donnees et des services accedes.', 'Authentification', 'Niveaux d\'authentification', 'Niveau 1', '8.5', 'Conduire une analyse de risques pour determiner le niveau d\'authentification necessaire.', 'Verifier que l\'analyse de risques a ete conduite et que le niveau d\'authentification est documente.', 'https://www.ssi.gouv.fr/entreprise/reglementation/confiance-numerique/le-referentiel-general-de-securite-rgs/');

insertControl.run('anssi-rgs:GOV-01', 'anssi-rgs', 'GOV-01', 'Security governance policy', 'Politique de gouvernance de la securite', 'The organization shall establish and maintain a security governance policy defining roles, responsibilities, and organization of security management.', 'L\'organisation doit etablir et maintenir une politique de gouvernance de la securite definissant les roles, responsabilites et l\'organisation de la gestion de la securite.', 'Organisation et gouvernance', 'Politique de securite', null, '5.1', 'Definir une politique de securite approuvee par la direction et diffusee a l\'ensemble du personnel.', 'Verifier que la politique existe, est approuvee et connue du personnel.', 'https://www.ssi.gouv.fr/entreprise/reglementation/confiance-numerique/le-referentiel-general-de-securite-rgs/');

// ANSSI Hygiene sample controls
insertControl.run('anssi-hygiene:1', 'anssi-hygiene', '1', 'Map the information system', 'Cartographier le systeme d\'information', 'Develop and maintain a map of the information system, listing all hardware, software, data, and interconnections.', 'Developper et maintenir une cartographie du systeme d\'information, repertoriant l\'ensemble des materiels, logiciels, donnees et interconnexions.', 'Connaitre le systeme d\'information', null, 'Standard', '5.9', 'Utiliser des outils de decouverte reseau pour identifier les actifs.', 'Verifier la completude de la cartographie.', 'https://www.ssi.gouv.fr/guide/guide-dhygiene-informatique/');

insertControl.run('anssi-hygiene:6', 'anssi-hygiene', '6', 'Define a password policy', 'Definir une politique de mots de passe', 'Establish and enforce a password policy requiring sufficient complexity and regular renewal.', 'Etablir et appliquer une politique de mots de passe exigeant une complexite suffisante et un renouvellement regulier.', 'Maitriser les acces', null, 'Standard', '5.17', 'Configurer les exigences de mots de passe dans l\'annuaire.', 'Tester les politiques de mots de passe.', 'https://www.ssi.gouv.fr/guide/guide-dhygiene-informatique/');

// CNIL sample controls
insertControl.run('cnil-securite:CNIL-01', 'cnil-securite', 'CNIL-01', 'User awareness', 'Sensibiliser les utilisateurs', 'Raise user awareness of data protection issues, document procedures, and inform users of the measures taken.', 'Sensibiliser les utilisateurs aux enjeux de protection des donnees, documenter les procedures et informer les utilisateurs des mesures prises.', 'Fiche 1 - Sensibiliser les utilisateurs', null, null, '6.3', null, null, 'https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles');

insertControl.run('cnil-securite:CNIL-02', 'cnil-securite', 'CNIL-02', 'User authentication', 'Authentifier les utilisateurs', 'Implement authentication mechanisms proportional to the sensitivity of the personal data accessed.', 'Mettre en oeuvre des mecanismes d\'authentification proportionnels a la sensibilite des donnees personnelles accedees.', 'Fiche 2 - Authentifier les utilisateurs', null, null, '8.5', null, null, 'https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles');

insertControl.run('cnil-securite:CNIL-17', 'cnil-securite', 'CNIL-17', 'Data encryption', 'Chiffrer, hacher ou signer', 'Use encryption, hashing, and digital signatures to protect personal data confidentiality and integrity.', 'Utiliser le chiffrement, le hachage et les signatures numeriques pour proteger la confidentialite et l\'integrite des donnees personnelles.', 'Fiche 17 - Chiffrer', null, null, '8.24', null, null, 'https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles');

// SecNumCloud sample control
insertControl.run('anssi-secnumcloud:19.1', 'anssi-secnumcloud', '19.1', 'Data localization in the EU', 'Localisation des donnees dans l\'UE', 'All customer data shall be stored and processed exclusively within the European Union.', 'Toutes les donnees des clients doivent etre stockees et traitees exclusivement au sein de l\'Union europeenne.', 'Souverainete', null, null, null, null, null, 'https://www.ssi.gouv.fr/entreprise/qualifications/prestataires-de-services-de-confiance-qualifies/prestataires-de-service-dinformatique-en-nuage-secnumcloud/');

// PGSSI-S sample control
insertControl.run('anssi-pgssi-s:PGSSI-IAM-01', 'anssi-pgssi-s', 'PGSSI-IAM-01', 'Health professional identification', 'Identification des professionnels de sante', 'Health professionals shall be identified using their national identifier (RPPS) before granting access to health data.', 'Les professionnels de sante doivent etre identifies par leur identifiant national (RPPS) avant de leur accorder l\'acces aux donnees de sante.', 'Identification et authentification', null, null, '5.16', null, null, 'https://esante.gouv.fr/produits-services/pgssi-s');

// HDS sample control
insertControl.run('hds:HDS-CERT-01', 'hds', 'HDS-CERT-01', 'ISO 27001 certification', 'Certification ISO 27001', 'HDS providers shall hold ISO 27001 certification covering the hosting perimeter.', 'Les hebergeurs HDS doivent detenir la certification ISO 27001 couvrant le perimetre d\'hebergement.', 'Certification', null, null, null, null, null, 'https://esante.gouv.fr/produits-services/hds');

// EBIOS RM sample control
insertControl.run('anssi-ebios-rm:W1-01', 'anssi-ebios-rm', 'W1-01', 'Define the study scope', 'Definir le cadre de l\'etude', 'Identify the object of the study, its missions, values, and the perimeter of the risk analysis.', 'Identifier l\'objet de l\'etude, ses missions, ses valeurs et le perimetre de l\'analyse de risque.', 'Atelier 1 - Cadrage et socle de securite', 'Definition du perimetre', null, null, null, null, 'https://www.ssi.gouv.fr/guide/la-methode-ebios-risk-manager-le-guide/');

// LPM-OIV sample control
insertControl.run('lpm-oiv:LPM-01', 'lpm-oiv', 'LPM-01', 'SIIV identification', 'Identification des SIIV', 'OIV shall identify their information systems of vital importance (SIIV) and notify ANSSI.', 'Les OIV doivent identifier leurs systemes d\'information d\'importance vitale (SIIV) et notifier l\'ANSSI.', 'Identification des SIIV', null, null, '5.9', null, null, 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000028338825');

// NIS2-FR sample control
insertControl.run('nis2-fr:NIS2-01', 'nis2-fr', 'NIS2-01', 'Entity registration with ANSSI', 'Enregistrement de l\'entite aupres de l\'ANSSI', 'Essential and important entities shall register with ANSSI.', 'Les entites essentielles et importantes doivent s\'enregistrer aupres de l\'ANSSI.', 'Gouvernance', null, null, null, null, null, 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049566498');

// DORA-FR sample control
insertControl.run('dora-fr:DORA-ICT-01', 'dora-fr', 'DORA-ICT-01', 'ICT risk management framework', 'Cadre de gestion des risques TIC', 'Establish a comprehensive ICT risk management framework approved by the management body.', 'Etablir un cadre complet de gestion des risques TIC approuve par l\'organe de direction.', 'Gestion des risques TIC', null, null, '5.1', null, null, 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32022R2554');

// ACPR sample control
insertControl.run('acpr-it:ACPR-GOV-01', 'acpr-it', 'ACPR-GOV-01', 'IT governance framework', 'Cadre de gouvernance informatique', 'Institutions shall have an IT governance framework with clear roles and reporting.', 'Les institutions doivent disposer d\'un cadre de gouvernance informatique avec des roles clairs et un reporting.', 'Gouvernance IT', null, null, '5.1', null, null, 'https://acpr.banque-france.fr/page-sommaire/risques-lies-aux-systemes-dinformation');

db.exec("INSERT INTO controls_fts(controls_fts) VALUES('rebuild')");

const insertMeta = db.prepare('INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)');
insertMeta.run('schema_version', '1.0');
insertMeta.run('category', 'domain_intelligence');
insertMeta.run('mcp_name', 'French Standards MCP');
insertMeta.run('database_built', new Date().toISOString().split('T')[0]);
insertMeta.run('database_version', '0.1.0');

db.pragma('journal_mode=DELETE');
db.exec('VACUUM');
db.close();

console.log('Test database seeded at data/standards.db');
