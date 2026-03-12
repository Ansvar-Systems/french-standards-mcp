// scripts/ingest-remaining-frameworks.ts
// Generates data for: ANSSI SecNumCloud, ANSSI PGSSI-S, CNIL Securite, HDS
// These are PDF-sourced frameworks — data is embedded from manual extraction.

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

// Helper to build controls from compact format
function c(num: string, titleEn: string, titleFr: string, descEn: string, descFr: string, cat: string, subcat: string | null, iso: string | null, url: string): Control {
  return { control_number: num, title: titleEn, title_nl: titleFr, description: descEn, description_nl: descFr, category: cat, subcategory: subcat, level: null, iso_mapping: iso, implementation_guidance: null, verification_guidance: null, source_url: url };
}

// ============================================================
// ANSSI SecNumCloud (anssi-secnumcloud)
// ============================================================
const SNC_URL = 'https://www.ssi.gouv.fr/entreprise/qualifications/prestataires-de-services-de-confiance-qualifies/prestataires-de-service-dinformatique-en-nuage-secnumcloud/';
const secnumcloudControls: Control[] = [
  // 5.x Organisation de la securite
  c('5.1', 'Information security policies', 'Politiques de securite de l\'information', 'The cloud service provider shall define, approve, and communicate information security policies.', 'Le prestataire de services cloud doit definir, approuver et communiquer des politiques de securite de l\'information.', 'Organisation de la securite de l\'information', null, '5.1', SNC_URL),
  c('5.2', 'Security roles and responsibilities', 'Roles et responsabilites de securite', 'Security roles and responsibilities shall be clearly defined and assigned.', 'Les roles et responsabilites de securite doivent etre clairement definis et attribues.', 'Organisation de la securite de l\'information', null, '5.2', SNC_URL),
  c('5.3', 'Contact with authorities', 'Contact avec les autorites', 'Maintain appropriate contacts with relevant authorities including ANSSI.', 'Maintenir des contacts appropries avec les autorites competentes y compris l\'ANSSI.', 'Organisation de la securite de l\'information', null, '5.5', SNC_URL),
  c('5.4', 'Security in project management', 'Securite dans la gestion de projet', 'Information security shall be integrated into project management methodology.', 'La securite de l\'information doit etre integree dans la methodologie de gestion de projet.', 'Organisation de la securite de l\'information', null, '5.8', SNC_URL),
  c('5.5', 'Mobile device policy', 'Politique des appareils mobiles', 'A policy and supporting measures shall control risks from mobile devices.', 'Une politique et des mesures de soutien doivent controler les risques lies aux appareils mobiles.', 'Organisation de la securite de l\'information', null, '8.1', SNC_URL),
  c('5.6', 'Teleworking security', 'Securite du teletravail', 'Security measures shall be implemented for teleworking activities.', 'Des mesures de securite doivent etre mises en oeuvre pour les activites de teletravail.', 'Organisation de la securite de l\'information', null, '6.7', SNC_URL),
  c('5.7', 'Information security risk assessment', 'Evaluation des risques de securite', 'Regular risk assessments shall be conducted on cloud services using EBIOS RM or equivalent.', 'Des evaluations de risques regulieres doivent etre conduites sur les services cloud en utilisant EBIOS RM ou equivalent.', 'Organisation de la securite de l\'information', null, '5.1', SNC_URL),
  c('5.8', 'Risk treatment plan', 'Plan de traitement des risques', 'A risk treatment plan shall address identified risks with appropriate measures.', 'Un plan de traitement des risques doit traiter les risques identifies avec des mesures appropriees.', 'Organisation de la securite de l\'information', null, '5.1', SNC_URL),
  // 6.x Politiques de securite
  c('6.1', 'Security policy document', 'Document de politique de securite', 'A comprehensive security policy document shall be maintained and reviewed annually.', 'Un document complet de politique de securite doit etre maintenu et revu annuellement.', 'Politiques de securite', null, '5.1', SNC_URL),
  c('6.2', 'Policy review and update', 'Revue et mise a jour de la politique', 'Security policies shall be reviewed at planned intervals or upon significant changes.', 'Les politiques de securite doivent etre revues a intervalles planifies ou lors de changements significatifs.', 'Politiques de securite', null, '5.1', SNC_URL),
  c('6.3', 'Acceptable use policy', 'Politique d\'utilisation acceptable', 'Rules for acceptable use of information and assets shall be documented.', 'Les regles d\'utilisation acceptable de l\'information et des actifs doivent etre documentees.', 'Politiques de securite', null, '5.10', SNC_URL),
  c('6.4', 'Security exception management', 'Gestion des exceptions de securite', 'A process shall manage security policy exceptions with documented justification and compensating controls.', 'Un processus doit gerer les exceptions a la politique de securite avec justification documentee et controles compensatoires.', 'Politiques de securite', null, '5.1', SNC_URL),
  // 7.x Ressources humaines
  c('7.1', 'Pre-employment screening', 'Verification avant embauche', 'Background verification checks shall be conducted on candidates prior to employment.', 'Des verifications de parcours doivent etre conduites sur les candidats avant l\'embauche.', 'Gestion des ressources humaines', null, '6.1', SNC_URL),
  c('7.2', 'Terms of employment', 'Conditions d\'emploi', 'Employment agreements shall state security responsibilities of employees.', 'Les contrats de travail doivent preciser les responsabilites de securite des employes.', 'Gestion des ressources humaines', null, '6.2', SNC_URL),
  c('7.3', 'Security awareness training', 'Formation de sensibilisation a la securite', 'All employees shall receive appropriate security awareness education and training.', 'Tous les employes doivent recevoir une formation de sensibilisation a la securite appropriee.', 'Gestion des ressources humaines', null, '6.3', SNC_URL),
  c('7.4', 'Disciplinary process', 'Processus disciplinaire', 'A formal disciplinary process shall address security policy violations.', 'Un processus disciplinaire formel doit traiter les violations de la politique de securite.', 'Gestion des ressources humaines', null, '6.4', SNC_URL),
  c('7.5', 'Termination responsibilities', 'Responsabilites de fin de contrat', 'Information security responsibilities valid after termination shall be defined and communicated.', 'Les responsabilites de securite de l\'information valables apres la fin de contrat doivent etre definies et communiquees.', 'Gestion des ressources humaines', null, '6.5', SNC_URL),
  // 8.x Gestion des actifs
  c('8.1', 'Asset inventory', 'Inventaire des actifs', 'Assets associated with information and processing facilities shall be identified and inventoried.', 'Les actifs associes a l\'information et aux moyens de traitement doivent etre identifies et inventories.', 'Gestion des actifs', null, '5.9', SNC_URL),
  c('8.2', 'Asset ownership', 'Propriete des actifs', 'Assets shall have designated owners.', 'Les actifs doivent avoir des proprietaires designes.', 'Gestion des actifs', null, '5.9', SNC_URL),
  c('8.3', 'Information classification', 'Classification de l\'information', 'Information shall be classified according to sensitivity and legal requirements.', 'L\'information doit etre classifiee selon sa sensibilite et les exigences legales.', 'Gestion des actifs', null, '5.12', SNC_URL),
  c('8.4', 'Media handling', 'Manipulation des supports', 'Procedures for the management of removable media shall be implemented.', 'Des procedures de gestion des supports amovibles doivent etre mises en oeuvre.', 'Gestion des actifs', null, '7.10', SNC_URL),
  // 9.x Controle d'acces
  c('9.1', 'Access control policy', 'Politique de controle d\'acces', 'An access control policy shall be established based on business and security requirements.', 'Une politique de controle d\'acces doit etre etablie sur la base des exigences metier et de securite.', 'Controle d\'acces', null, '5.15', SNC_URL),
  c('9.2', 'User access management', 'Gestion des acces utilisateurs', 'A formal user access provisioning process shall be implemented.', 'Un processus formel de provisionnement des acces utilisateurs doit etre mis en oeuvre.', 'Controle d\'acces', null, '5.18', SNC_URL),
  c('9.3', 'Privileged access management', 'Gestion des acces privilegies', 'Privileged access rights shall be restricted and controlled.', 'Les droits d\'acces privilegies doivent etre restreints et controles.', 'Controle d\'acces', null, '8.2', SNC_URL),
  c('9.4', 'User authentication', 'Authentification des utilisateurs', 'Strong authentication mechanisms shall be used for access to cloud management interfaces.', 'Des mecanismes d\'authentification forte doivent etre utilises pour l\'acces aux interfaces de gestion cloud.', 'Controle d\'acces', null, '8.5', SNC_URL),
  c('9.5', 'Access review', 'Revue des acces', 'Access rights shall be reviewed at regular intervals.', 'Les droits d\'acces doivent etre revus a intervalles reguliers.', 'Controle d\'acces', null, '5.18', SNC_URL),
  c('9.6', 'Multi-tenant isolation', 'Isolation multi-locataire', 'Logical isolation shall prevent any access between tenants in a multi-tenant environment.', 'L\'isolation logique doit empecher tout acces entre locataires dans un environnement multi-locataire.', 'Controle d\'acces', null, '8.22', SNC_URL),
  // 10.x Cryptographie
  c('10.1', 'Cryptographic controls policy', 'Politique de controles cryptographiques', 'A policy on the use of cryptographic controls shall be developed and implemented.', 'Une politique d\'utilisation des controles cryptographiques doit etre developpee et mise en oeuvre.', 'Cryptographie', null, '8.24', SNC_URL),
  c('10.2', 'Key management', 'Gestion des cles', 'A key management policy shall cover the entire lifecycle of cryptographic keys.', 'Une politique de gestion des cles doit couvrir l\'ensemble du cycle de vie des cles cryptographiques.', 'Cryptographie', null, '8.24', SNC_URL),
  c('10.3', 'Customer key management', 'Gestion des cles client', 'Mechanisms shall allow customers to manage their own encryption keys independently.', 'Des mecanismes doivent permettre aux clients de gerer leurs propres cles de chiffrement de maniere independante.', 'Cryptographie', null, '8.24', SNC_URL),
  c('10.4', 'Data encryption at rest', 'Chiffrement des donnees au repos', 'Customer data at rest shall be encrypted using algorithms compliant with ANSSI recommendations.', 'Les donnees client au repos doivent etre chiffrees en utilisant des algorithmes conformes aux recommandations ANSSI.', 'Cryptographie', null, '8.24', SNC_URL),
  // 11.x Securite physique
  c('11.1', 'Physical security perimeter', 'Perimetre de securite physique', 'Physical security perimeters shall protect areas containing information processing facilities.', 'Les perimetres de securite physique doivent proteger les zones contenant les installations de traitement de l\'information.', 'Securite physique et environnementale', null, '7.1', SNC_URL),
  c('11.2', 'Physical entry controls', 'Controles d\'entree physique', 'Secure areas shall be protected by appropriate entry controls.', 'Les zones securisees doivent etre protegees par des controles d\'entree appropries.', 'Securite physique et environnementale', null, '7.2', SNC_URL),
  c('11.3', 'Environmental threats protection', 'Protection contre les menaces environnementales', 'Physical protection against natural disasters, malicious attacks, and accidents shall be implemented.', 'Une protection physique contre les catastrophes naturelles, les attaques malveillantes et les accidents doit etre mise en oeuvre.', 'Securite physique et environnementale', null, '7.5', SNC_URL),
  c('11.4', 'Power and cooling redundancy', 'Redondance d\'alimentation et de refroidissement', 'Redundant power supplies and cooling systems shall protect against equipment failure.', 'Des alimentations et systemes de refroidissement redondants doivent proteger contre les pannes d\'equipement.', 'Securite physique et environnementale', null, '7.11', SNC_URL),
  c('11.5', 'Cabling security', 'Securite du cablage', 'Power and telecommunications cabling shall be protected from interception and damage.', 'Le cablage electrique et de telecommunications doit etre protege contre l\'interception et les dommages.', 'Securite physique et environnementale', null, '7.12', SNC_URL),
  c('11.6', 'Equipment maintenance', 'Maintenance des equipements', 'Equipment shall be correctly maintained to ensure continued availability and integrity.', 'Les equipements doivent etre correctement maintenus pour assurer leur disponibilite et integrite continues.', 'Securite physique et environnementale', null, '7.13', SNC_URL),
  // 12.x Securite des operations
  c('12.1', 'Documented operating procedures', 'Procedures d\'exploitation documentees', 'Operating procedures shall be documented and made available to all relevant users.', 'Les procedures d\'exploitation doivent etre documentees et rendues disponibles a tous les utilisateurs concernes.', 'Securite des operations', null, '5.37', SNC_URL),
  c('12.2', 'Change management', 'Gestion des changements', 'Changes to the infrastructure shall be controlled through a formal change management process.', 'Les changements a l\'infrastructure doivent etre controles par un processus formel de gestion des changements.', 'Securite des operations', null, '8.32', SNC_URL),
  c('12.3', 'Capacity management', 'Gestion de la capacite', 'Resource use shall be monitored and projections made to ensure required system performance.', 'L\'utilisation des ressources doit etre surveillee et des projections faites pour assurer les performances requises.', 'Securite des operations', null, '8.6', SNC_URL),
  c('12.4', 'Separation of environments', 'Separation des environnements', 'Development, testing, and production environments shall be separated.', 'Les environnements de developpement, test et production doivent etre separes.', 'Securite des operations', null, '8.31', SNC_URL),
  c('12.5', 'Malware protection', 'Protection contre les logiciels malveillants', 'Detection, prevention, and recovery controls against malware shall be implemented.', 'Des controles de detection, prevention et reprise contre les logiciels malveillants doivent etre mis en oeuvre.', 'Securite des operations', null, '8.7', SNC_URL),
  c('12.6', 'Backup policy', 'Politique de sauvegarde', 'Backup copies of information and software shall be taken and tested regularly.', 'Des copies de sauvegarde de l\'information et des logiciels doivent etre effectuees et testees regulierement.', 'Securite des operations', null, '8.13', SNC_URL),
  c('12.7', 'Event logging', 'Journalisation des evenements', 'Event logs recording user activities, exceptions, and security events shall be produced and retained.', 'Des journaux d\'evenements enregistrant les activites utilisateurs, les exceptions et les evenements de securite doivent etre produits et conserves.', 'Securite des operations', null, '8.15', SNC_URL),
  c('12.8', 'Log protection', 'Protection des journaux', 'Logging facilities and log information shall be protected against tampering and unauthorized access.', 'Les dispositifs de journalisation et les informations de journaux doivent etre proteges contre la falsification et l\'acces non autorise.', 'Securite des operations', null, '8.15', SNC_URL),
  c('12.9', 'Vulnerability management', 'Gestion des vulnerabilites', 'Technical vulnerabilities shall be identified, evaluated, and appropriate measures taken in a timely manner.', 'Les vulnerabilites techniques doivent etre identifiees, evaluees et des mesures appropriees prises en temps opportun.', 'Securite des operations', null, '8.8', SNC_URL),
  c('12.10', 'Penetration testing', 'Tests d\'intrusion', 'Regular penetration tests shall be conducted on the cloud infrastructure by qualified assessors.', 'Des tests d\'intrusion reguliers doivent etre conduits sur l\'infrastructure cloud par des evaluateurs qualifies.', 'Securite des operations', null, '8.8', SNC_URL),
  // 13.x Communications
  c('13.1', 'Network security management', 'Gestion de la securite reseau', 'Networks shall be managed and controlled to protect information in systems and applications.', 'Les reseaux doivent etre geres et controles pour proteger l\'information dans les systemes et applications.', 'Securite des communications', null, '8.20', SNC_URL),
  c('13.2', 'Network segregation', 'Segregation reseau', 'Groups of information services, users, and systems shall be segregated on networks.', 'Les groupes de services d\'information, d\'utilisateurs et de systemes doivent etre segreges sur les reseaux.', 'Securite des communications', null, '8.22', SNC_URL),
  c('13.3', 'Information transfer security', 'Securite des transferts d\'information', 'Formal transfer policies and procedures shall protect information during electronic transfer.', 'Des politiques et procedures formelles de transfert doivent proteger l\'information lors du transfert electronique.', 'Securite des communications', null, '5.14', SNC_URL),
  c('13.4', 'Secure API interfaces', 'Interfaces API securisees', 'Cloud service APIs shall be secured with authentication, encryption, and input validation.', 'Les API des services cloud doivent etre securisees avec authentification, chiffrement et validation des entrees.', 'Securite des communications', null, '8.26', SNC_URL),
  // 14.x Developpement
  c('14.1', 'Secure development policy', 'Politique de developpement securise', 'Rules for the secure development of software and systems shall be established and applied.', 'Des regles de developpement securise des logiciels et systemes doivent etre etablies et appliquees.', 'Developpement securise', null, '8.25', SNC_URL),
  c('14.2', 'Security testing', 'Tests de securite', 'Security testing shall be performed during development and before deployment.', 'Des tests de securite doivent etre effectues pendant le developpement et avant le deploiement.', 'Developpement securise', null, '8.29', SNC_URL),
  c('14.3', 'Secure coding practices', 'Pratiques de codage securise', 'Secure coding guidelines shall be applied and enforced during software development.', 'Des directives de codage securise doivent etre appliquees et imposees pendant le developpement logiciel.', 'Developpement securise', null, '8.28', SNC_URL),
  // 15.x Relations fournisseurs
  c('15.1', 'Supplier security policy', 'Politique de securite des fournisseurs', 'Information security requirements for mitigating risks from suppliers shall be agreed with each supplier.', 'Les exigences de securite pour reduire les risques lies aux fournisseurs doivent etre convenues avec chaque fournisseur.', 'Relations avec les fournisseurs', null, '5.19', SNC_URL),
  c('15.2', 'Supplier service monitoring', 'Surveillance des services fournisseurs', 'Organizations shall monitor, review, and audit supplier service delivery.', 'Les organisations doivent surveiller, revoir et auditer la prestation de services des fournisseurs.', 'Relations avec les fournisseurs', null, '5.22', SNC_URL),
  c('15.3', 'Supply chain security', 'Securite de la chaine d\'approvisionnement', 'Agreements with suppliers shall include requirements addressing information security risks in the supply chain.', 'Les accords avec les fournisseurs doivent inclure des exigences traitant les risques de securite dans la chaine d\'approvisionnement.', 'Relations avec les fournisseurs', null, '5.21', SNC_URL),
  // 16.x Incidents
  c('16.1', 'Incident management responsibilities', 'Responsabilites de gestion des incidents', 'Management responsibilities and procedures shall ensure a quick and effective response to security incidents.', 'Les responsabilites de gestion et les procedures doivent assurer une reponse rapide et efficace aux incidents de securite.', 'Gestion des incidents', null, '5.24', SNC_URL),
  c('16.2', 'Security event reporting', 'Signalement des evenements de securite', 'Information security events shall be reported through appropriate management channels as quickly as possible.', 'Les evenements de securite de l\'information doivent etre signales par les canaux de gestion appropries aussi rapidement que possible.', 'Gestion des incidents', null, '6.8', SNC_URL),
  c('16.3', 'Customer incident notification', 'Notification des incidents aux clients', 'Customers shall be notified of security incidents that affect their data or services within defined timeframes.', 'Les clients doivent etre informes des incidents de securite affectant leurs donnees ou services dans des delais definis.', 'Gestion des incidents', null, '5.26', SNC_URL),
  c('16.4', 'Evidence collection', 'Collecte de preuves', 'Procedures for the identification, collection, and preservation of digital evidence shall be defined.', 'Des procedures d\'identification, de collecte et de conservation des preuves numeriques doivent etre definies.', 'Gestion des incidents', null, '5.28', SNC_URL),
  // 17.x Continuite
  c('17.1', 'Business continuity planning', 'Planification de la continuite d\'activite', 'The organization shall determine its requirements for continuity of information security in adverse situations.', 'L\'organisation doit determiner ses exigences de continuite de la securite de l\'information en situations adverses.', 'Continuite d\'activite', null, '5.29', SNC_URL),
  c('17.2', 'Service availability targets', 'Objectifs de disponibilite des services', 'Service level agreements shall define availability targets, recovery time, and recovery point objectives.', 'Les accords de niveau de service doivent definir les objectifs de disponibilite, de temps de reprise et de point de reprise.', 'Continuite d\'activite', null, '5.30', SNC_URL),
  c('17.3', 'Data portability and reversibility', 'Portabilite et reversibilite des donnees', 'The provider shall ensure data portability and provide documented reversibility procedures for customers.', 'Le prestataire doit assurer la portabilite des donnees et fournir des procedures de reversibilite documentees aux clients.', 'Continuite d\'activite', null, null, SNC_URL),
  c('17.4', 'Disaster recovery testing', 'Tests de reprise apres sinistre', 'Business continuity and disaster recovery plans shall be tested regularly.', 'Les plans de continuite d\'activite et de reprise apres sinistre doivent etre testes regulierement.', 'Continuite d\'activite', null, '5.30', SNC_URL),
  // 18.x Conformite
  c('18.1', 'Legal and regulatory compliance', 'Conformite legale et reglementaire', 'All relevant legislative, regulatory, and contractual requirements shall be identified and documented.', 'Toutes les exigences legislatives, reglementaires et contractuelles pertinentes doivent etre identifiees et documentees.', 'Conformite', null, '5.31', SNC_URL),
  c('18.2', 'Privacy and data protection', 'Vie privee et protection des donnees', 'Privacy and protection of personal data shall be ensured as required by RGPD.', 'La vie privee et la protection des donnees personnelles doivent etre assurees conformement au RGPD.', 'Conformite', null, '5.34', SNC_URL),
  c('18.3', 'Independent security reviews', 'Revues de securite independantes', 'The organization shall undergo independent reviews of its information security approach.', 'L\'organisation doit faire l\'objet de revues independantes de son approche de securite de l\'information.', 'Conformite', null, '5.35', SNC_URL),
  c('18.4', 'SecNumCloud audit requirements', 'Exigences d\'audit SecNumCloud', 'The provider shall submit to SecNumCloud qualification audits conducted by ANSSI-approved auditors.', 'Le prestataire doit se soumettre aux audits de qualification SecNumCloud conduits par des auditeurs agrees par l\'ANSSI.', 'Conformite', null, null, SNC_URL),
  // 19.x Souverainete
  c('19.1', 'Data localization in France/EU', 'Localisation des donnees en France/UE', 'Customer data shall be stored and processed exclusively within France or the European Union.', 'Les donnees client doivent etre stockees et traitees exclusivement en France ou dans l\'Union europeenne.', 'Souverainete et localisation des donnees', null, null, SNC_URL),
  c('19.2', 'Protection against extra-territorial laws', 'Protection contre les lois extraterritoriales', 'The provider shall demonstrate immunity from extra-territorial laws that could compel data disclosure.', 'Le prestataire doit demontrer son immunite face aux lois extraterritoriales qui pourraient contraindre la divulgation de donnees.', 'Souverainete et localisation des donnees', null, null, SNC_URL),
  c('19.3', 'French/EU corporate control', 'Controle corporate francais/UE', 'The cloud service provider shall be controlled by French or EU entities with no foreign controlling interest.', 'Le prestataire de services cloud doit etre controle par des entites francaises ou europeennes sans interet controleur etranger.', 'Souverainete et localisation des donnees', null, null, SNC_URL),
  c('19.4', 'Administration from France/EU', 'Administration depuis la France/UE', 'Cloud service administration shall be performed exclusively from France or EU territory.', 'L\'administration des services cloud doit etre effectuee exclusivement depuis le territoire francais ou europeen.', 'Souverainete et localisation des donnees', null, null, SNC_URL),
  c('19.5', 'No data transfer outside EU', 'Pas de transfert de donnees hors UE', 'Customer data shall not be transferred outside the European Union without explicit customer consent.', 'Les donnees client ne doivent pas etre transferees en dehors de l\'Union europeenne sans le consentement explicite du client.', 'Souverainete et localisation des donnees', null, null, SNC_URL),
  c('19.6', 'Transparency on subcontractors', 'Transparence sur les sous-traitants', 'The provider shall disclose all subcontractors involved in service delivery, including their nationality and location.', 'Le prestataire doit divulguer tous les sous-traitants impliques dans la prestation de services, y compris leur nationalite et localisation.', 'Souverainete et localisation des donnees', null, null, SNC_URL),
];

writeFileSync(join(DATA_DIR, 'anssi-secnumcloud.json'), JSON.stringify({
  framework: {
    id: 'anssi-secnumcloud',
    name: 'SecNumCloud Cloud Security Certification',
    name_nl: 'SecNumCloud Qualification de Securite Cloud',
    issuing_body: 'Agence nationale de la securite des systemes d\'information (ANSSI)',
    version: '3.2',
    effective_date: '2022-03-01',
    scope: 'Security certification framework for cloud service providers hosting French government sensitive data',
    scope_sectors: ['government', 'healthcare', 'finance'],
    structure_description: 'ISO 27001-aligned domains plus French sovereignty requirements. 15 domains covering organization, policies, HR, assets, access control, cryptography, physical security, operations, communications, development, suppliers, incidents, continuity, compliance, and data sovereignty.',
    source_url: SNC_URL,
    license: 'Public sector publication',
    language: 'fr',
  },
  controls: secnumcloudControls,
  metadata: { ingested_at: new Date().toISOString(), total_controls: secnumcloudControls.length },
}, null, 2), 'utf-8');
console.log(`SecNumCloud: ${secnumcloudControls.length} controls`);

// ============================================================
// ANSSI PGSSI-S (anssi-pgssi-s)
// ============================================================
const PGSSI_URL = 'https://esante.gouv.fr/produits-services/pgssi-s';
const pgssiControls: Control[] = [
  c('PGSSI-ID-01', 'Patient identity management', 'Gestion de l\'identite des patients', 'A reliable patient identification system shall be implemented using the INS (national health identifier).', 'Un systeme fiable d\'identification des patients doit etre mis en oeuvre en utilisant l\'INS (identifiant national de sante).', 'Identification et authentification', null, '5.16', PGSSI_URL),
  c('PGSSI-ID-02', 'Health professional authentication', 'Authentification des professionnels de sante', 'Health professionals shall be authenticated using the CPS (carte de professionnel de sante) or equivalent means.', 'Les professionnels de sante doivent etre authentifies en utilisant la CPS (carte de professionnel de sante) ou un moyen equivalent.', 'Identification et authentification', null, '8.5', PGSSI_URL),
  c('PGSSI-ID-03', 'Authentication levels for health IS', 'Niveaux d\'authentification pour les SI de sante', 'Authentication levels shall be determined based on the sensitivity of health data accessed.', 'Les niveaux d\'authentification doivent etre determines en fonction de la sensibilite des donnees de sante accedees.', 'Identification et authentification', null, '8.5', PGSSI_URL),
  c('PGSSI-ID-04', 'Identity federation', 'Federation d\'identites', 'Identity federation mechanisms shall enable secure single sign-on across health information systems.', 'Les mecanismes de federation d\'identites doivent permettre l\'authentification unique securisee entre les systemes d\'information de sante.', 'Identification et authentification', null, '5.16', PGSSI_URL),
  c('PGSSI-ID-05', 'Patient consent management', 'Gestion du consentement patient', 'Systems shall manage patient consent for access to their health data in compliance with health data regulations.', 'Les systemes doivent gerer le consentement des patients pour l\'acces a leurs donnees de sante conformement a la reglementation sur les donnees de sante.', 'Identification et authentification', null, '5.34', PGSSI_URL),
  c('PGSSI-DR-01', 'Role-based access to health data', 'Acces aux donnees de sante base sur les roles', 'Access to health data shall be granted based on the professional role and the care relationship with the patient.', 'L\'acces aux donnees de sante doit etre accorde en fonction du role professionnel et de la relation de soins avec le patient.', 'Gestion des droits', null, '5.15', PGSSI_URL),
  c('PGSSI-DR-02', 'Break-glass procedures', 'Procedures de bris de glace', 'Emergency access procedures (break-glass) shall allow access to health data in life-threatening situations with full audit trail.', 'Les procedures d\'acces d\'urgence (bris de glace) doivent permettre l\'acces aux donnees de sante dans les situations engageant le pronostic vital avec tracabilite complete.', 'Gestion des droits', null, '5.18', PGSSI_URL),
  c('PGSSI-DR-03', 'Minimum necessary principle', 'Principe du minimum necessaire', 'Access to health data shall be limited to the minimum necessary for patient care.', 'L\'acces aux donnees de sante doit etre limite au minimum necessaire pour les soins au patient.', 'Gestion des droits', null, '5.15', PGSSI_URL),
  c('PGSSI-DR-04', 'Patient data compartmentalization', 'Compartimentalisation des donnees patient', 'Health data shall be compartmentalized to prevent unauthorized access across care teams.', 'Les donnees de sante doivent etre compartimentalisees pour empecher l\'acces non autorise entre equipes de soins.', 'Gestion des droits', null, '8.3', PGSSI_URL),
  c('PGSSI-TR-01', 'Health data access logging', 'Journalisation de l\'acces aux donnees de sante', 'All access to health data shall be logged with user identity, timestamp, data accessed, and action performed.', 'Tous les acces aux donnees de sante doivent etre journalises avec l\'identite de l\'utilisateur, l\'horodatage, les donnees accedees et l\'action effectuee.', 'Tracabilite', null, '8.15', PGSSI_URL),
  c('PGSSI-TR-02', 'Patient access to audit logs', 'Acces du patient aux journaux d\'audit', 'Patients shall have the right to access the logs of who accessed their health data.', 'Les patients doivent avoir le droit d\'acceder aux journaux indiquant qui a accede a leurs donnees de sante.', 'Tracabilite', null, '8.15', PGSSI_URL),
  c('PGSSI-TR-03', 'Log retention for health data', 'Conservation des journaux pour les donnees de sante', 'Access logs for health data shall be retained for the duration required by health data regulations (minimum 5 years).', 'Les journaux d\'acces aux donnees de sante doivent etre conserves pendant la duree requise par la reglementation (minimum 5 ans).', 'Tracabilite', null, '8.15', PGSSI_URL),
  c('PGSSI-TR-04', 'Tamper-proof health audit logs', 'Journaux d\'audit sante infalsifiables', 'Health data audit logs shall be protected against tampering using cryptographic integrity mechanisms.', 'Les journaux d\'audit des donnees de sante doivent etre proteges contre la falsification par des mecanismes d\'integrite cryptographique.', 'Tracabilite', null, '8.15', PGSSI_URL),
  c('PGSSI-MS-01', 'MSSante secure messaging', 'Messagerie securisee MSSante', 'Exchanges of health data between professionals shall use MSSante or an equivalent certified secure messaging system.', 'Les echanges de donnees de sante entre professionnels doivent utiliser MSSante ou un systeme de messagerie securisee certifie equivalent.', 'Messageries securisees de sante', null, '5.14', PGSSI_URL),
  c('PGSSI-MS-02', 'End-to-end encryption of health messages', 'Chiffrement de bout en bout des messages de sante', 'Health messages shall be encrypted end-to-end from sender to recipient.', 'Les messages de sante doivent etre chiffres de bout en bout de l\'emetteur au destinataire.', 'Messageries securisees de sante', null, '8.24', PGSSI_URL),
  c('PGSSI-MS-03', 'Message authentication and non-repudiation', 'Authentification et non-repudiation des messages', 'Health messages shall include digital signatures for authentication and non-repudiation.', 'Les messages de sante doivent inclure des signatures numeriques pour l\'authentification et la non-repudiation.', 'Messageries securisees de sante', null, '8.24', PGSSI_URL),
  // Additional PGSSI-S controls
  c('PGSSI-SEC-01', 'Health data encryption at rest', 'Chiffrement des donnees de sante au repos', 'Health data stored in information systems shall be encrypted at rest.', 'Les donnees de sante stockees dans les systemes d\'information doivent etre chiffrees au repos.', 'Securite des donnees', null, '8.24', PGSSI_URL),
  c('PGSSI-SEC-02', 'Health data backup', 'Sauvegarde des donnees de sante', 'Health data shall be backed up regularly with tested restoration procedures.', 'Les donnees de sante doivent etre sauvegardees regulierement avec des procedures de restauration testees.', 'Securite des donnees', null, '8.13', PGSSI_URL),
  c('PGSSI-SEC-03', 'Health IS vulnerability management', 'Gestion des vulnerabilites des SI de sante', 'Health information systems shall undergo regular vulnerability assessment and remediation.', 'Les systemes d\'information de sante doivent faire l\'objet d\'evaluations de vulnerabilites et de remediations regulieres.', 'Securite des donnees', null, '8.8', PGSSI_URL),
  c('PGSSI-SEC-04', 'Health data incident notification', 'Notification des incidents de donnees de sante', 'Security incidents affecting health data shall be reported to ARS and ANSSI within required timeframes.', 'Les incidents de securite affectant les donnees de sante doivent etre signales a l\'ARS et a l\'ANSSI dans les delais requis.', 'Securite des donnees', null, '5.26', PGSSI_URL),
  c('PGSSI-SEC-05', 'Health data anonymization', 'Anonymisation des donnees de sante', 'Health data used for research or statistics shall be anonymized or pseudonymized using validated techniques.', 'Les donnees de sante utilisees pour la recherche ou les statistiques doivent etre anonymisees ou pseudonymisees en utilisant des techniques validees.', 'Securite des donnees', null, '8.11', PGSSI_URL),
  c('PGSSI-SEC-06', 'DMP integration security', 'Securite de l\'integration DMP', 'Integration with the Dossier Medical Partage (DMP) shall comply with ANS technical specifications.', 'L\'integration avec le Dossier Medical Partage (DMP) doit respecter les specifications techniques de l\'ANS.', 'Securite des donnees', null, null, PGSSI_URL),
  c('PGSSI-SEC-07', 'Telehealth security', 'Securite de la telesante', 'Telehealth services shall implement end-to-end encryption and strong authentication for both patient and practitioner.', 'Les services de telesante doivent mettre en oeuvre le chiffrement de bout en bout et l\'authentification forte pour le patient et le praticien.', 'Securite des donnees', null, '8.24', PGSSI_URL),
  c('PGSSI-SEC-08', 'Connected medical device security', 'Securite des dispositifs medicaux connectes', 'Connected medical devices shall comply with cybersecurity requirements defined by ANSSI and HAS.', 'Les dispositifs medicaux connectes doivent respecter les exigences de cybersecurite definies par l\'ANSSI et la HAS.', 'Securite des donnees', null, '8.1', PGSSI_URL),
];

writeFileSync(join(DATA_DIR, 'anssi-pgssi-s.json'), JSON.stringify({
  framework: {
    id: 'anssi-pgssi-s',
    name: 'Health Information Systems Security Policy (PGSSI-S)',
    name_nl: 'Politique Generale de Securite des Systemes d\'Information de Sante (PGSSI-S)',
    issuing_body: 'Agence du Numerique en Sante (ANS) / ANSSI',
    version: '2024',
    effective_date: '2024-01-01',
    scope: 'Security framework for health information systems in France, covering identity, access, traceability, secure messaging, and data protection',
    scope_sectors: ['healthcare'],
    structure_description: 'Organized by security domain: identification and authentication (CPS/INS), access rights management, traceability/audit, secure health messaging (MSSante), and data security.',
    source_url: PGSSI_URL,
    license: 'Public sector publication',
    language: 'fr',
  },
  controls: pgssiControls,
  metadata: { ingested_at: new Date().toISOString(), total_controls: pgssiControls.length },
}, null, 2), 'utf-8');
console.log(`PGSSI-S: ${pgssiControls.length} controls`);

// ============================================================
// CNIL Securite (cnil-securite)
// ============================================================
const CNIL_URL = 'https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles';
const cnilControls: Control[] = [
  c('CNIL-01', 'User awareness', 'Sensibiliser les utilisateurs', 'Raise user awareness of data protection issues, document procedures, and inform users of the measures taken.', 'Sensibiliser les utilisateurs aux enjeux de protection des donnees, documenter les procedures et informer les utilisateurs des mesures prises.', 'Fiche 1 - Sensibiliser les utilisateurs', null, '6.3', CNIL_URL),
  c('CNIL-01.1', 'Awareness training program', 'Programme de formation de sensibilisation', 'Establish a regular awareness program covering data protection obligations and security best practices.', 'Etablir un programme de sensibilisation regulier couvrant les obligations de protection des donnees et les bonnes pratiques de securite.', 'Fiche 1 - Sensibiliser les utilisateurs', null, '6.3', CNIL_URL),
  c('CNIL-01.2', 'Acceptable use charter', 'Charte d\'utilisation acceptable', 'Define and communicate a charter for acceptable use of IT resources including personal data handling.', 'Definir et communiquer une charte d\'utilisation acceptable des ressources informatiques incluant le traitement des donnees personnelles.', 'Fiche 1 - Sensibiliser les utilisateurs', null, '5.10', CNIL_URL),
  c('CNIL-02', 'User authentication', 'Authentifier les utilisateurs', 'Implement authentication mechanisms proportional to the sensitivity of the personal data accessed.', 'Mettre en oeuvre des mecanismes d\'authentification proportionnels a la sensibilite des donnees personnelles accedees.', 'Fiche 2 - Authentifier les utilisateurs', null, '8.5', CNIL_URL),
  c('CNIL-02.1', 'Password policy for personal data', 'Politique de mots de passe pour les donnees personnelles', 'Apply a password policy meeting CNIL recommendations: minimum 12 characters or 8 with additional factor.', 'Appliquer une politique de mots de passe conforme aux recommandations CNIL : minimum 12 caracteres ou 8 avec facteur additionnel.', 'Fiche 2 - Authentifier les utilisateurs', null, '5.17', CNIL_URL),
  c('CNIL-02.2', 'Multi-factor authentication for sensitive data', 'Authentification multifacteur pour les donnees sensibles', 'Use multi-factor authentication for access to sensitive personal data including health and biometric data.', 'Utiliser l\'authentification multifacteur pour l\'acces aux donnees personnelles sensibles incluant les donnees de sante et biometriques.', 'Fiche 2 - Authentifier les utilisateurs', null, '8.5', CNIL_URL),
  c('CNIL-03', 'Access rights management', 'Gerer les habilitations', 'Define access profiles and limit access to personal data to authorized persons with a legitimate need.', 'Definir des profils d\'acces et limiter l\'acces aux donnees personnelles aux personnes autorisees ayant un besoin legitime.', 'Fiche 3 - Gerer les habilitations', null, '5.18', CNIL_URL),
  c('CNIL-03.1', 'Regular access review', 'Revue reguliere des acces', 'Review access rights at least annually and upon any change of role or departure.', 'Revoir les droits d\'acces au moins annuellement et lors de tout changement de role ou depart.', 'Fiche 3 - Gerer les habilitations', null, '5.18', CNIL_URL),
  c('CNIL-04', 'Activity logging', 'Tracer les acces et gerer les incidents', 'Log access to personal data and manage security incidents affecting personal data.', 'Journaliser les acces aux donnees personnelles et gerer les incidents de securite affectant les donnees personnelles.', 'Fiche 4 - Tracer les acces', null, '8.15', CNIL_URL),
  c('CNIL-04.1', 'Personal data breach notification', 'Notification des violations de donnees personnelles', 'Notify the CNIL of personal data breaches within 72 hours as required by RGPD Article 33.', 'Notifier la CNIL des violations de donnees personnelles dans les 72 heures conformement a l\'article 33 du RGPD.', 'Fiche 4 - Tracer les acces', null, '5.26', CNIL_URL),
  c('CNIL-05', 'Workstation security', 'Securiser les postes de travail', 'Secure workstations with automatic locking, firewall, antivirus, and disk encryption.', 'Securiser les postes de travail avec verrouillage automatique, pare-feu, antivirus et chiffrement du disque.', 'Fiche 5 - Securiser les postes de travail', null, '8.1', CNIL_URL),
  c('CNIL-06', 'Mobile device security', 'Securiser l\'informatique mobile', 'Protect mobile devices with encryption, remote wipe capability, and VPN for remote access.', 'Proteger les appareils mobiles avec chiffrement, capacite d\'effacement a distance et VPN pour l\'acces distant.', 'Fiche 6 - Securiser les mobiles', null, '8.1', CNIL_URL),
  c('CNIL-07', 'Network protection', 'Proteger le reseau informatique interne', 'Protect the internal network with firewalls, VPN for remote access, and network segmentation.', 'Proteger le reseau interne avec des pare-feux, VPN pour l\'acces distant et segmentation reseau.', 'Fiche 7 - Proteger le reseau', null, '8.20', CNIL_URL),
  c('CNIL-08', 'Server security', 'Securiser les serveurs', 'Harden servers, apply security updates, restrict access, and implement monitoring.', 'Durcir les serveurs, appliquer les mises a jour de securite, restreindre les acces et mettre en place une surveillance.', 'Fiche 8 - Securiser les serveurs', null, '8.9', CNIL_URL),
  c('CNIL-09', 'Website security', 'Securiser les sites web', 'Implement HTTPS, input validation, CSRF protection, and regular security testing on websites.', 'Implementer HTTPS, la validation des entrees, la protection CSRF et des tests de securite reguliers sur les sites web.', 'Fiche 9 - Securiser les sites web', null, '8.26', CNIL_URL),
  c('CNIL-10', 'Data backup', 'Sauvegarder et prevoir la continuite d\'activite', 'Implement regular backups and business continuity plans to ensure availability of personal data.', 'Mettre en oeuvre des sauvegardes regulieres et des plans de continuite d\'activite pour assurer la disponibilite des donnees personnelles.', 'Fiche 10 - Sauvegarder', null, '8.13', CNIL_URL),
  c('CNIL-11', 'Data archiving', 'Archiver de maniere securisee', 'Archive personal data securely with defined retention periods and secure destruction procedures.', 'Archiver les donnees personnelles de maniere securisee avec des durees de conservation definies et des procedures de destruction securisee.', 'Fiche 11 - Archiver', null, '5.33', CNIL_URL),
  c('CNIL-12', 'Maintenance and disposal', 'Encadrer la maintenance et la destruction des donnees', 'Supervise maintenance operations and ensure secure disposal of equipment containing personal data.', 'Encadrer les operations de maintenance et assurer la mise au rebut securisee des equipements contenant des donnees personnelles.', 'Fiche 12 - Maintenance', null, '7.14', CNIL_URL),
  c('CNIL-13', 'Subcontractor management', 'Gerer la sous-traitance', 'Contractually define security obligations for processors handling personal data on your behalf.', 'Definir contractuellement les obligations de securite pour les sous-traitants traitant des donnees personnelles pour votre compte.', 'Fiche 13 - Sous-traitance', null, '5.19', CNIL_URL),
  c('CNIL-14', 'Secure data exchange', 'Securiser les echanges avec d\'autres organismes', 'Encrypt personal data during electronic exchanges and verify the identity of recipients.', 'Chiffrer les donnees personnelles lors des echanges electroniques et verifier l\'identite des destinataires.', 'Fiche 14 - Securiser les echanges', null, '5.14', CNIL_URL),
  c('CNIL-15', 'Physical premises security', 'Proteger les locaux', 'Control physical access to premises where personal data is processed or stored.', 'Controler l\'acces physique aux locaux ou les donnees personnelles sont traitees ou stockees.', 'Fiche 15 - Proteger les locaux', null, '7.1', CNIL_URL),
  c('CNIL-16', 'Secure development framework', 'Encadrer les developpements informatiques', 'Integrate privacy by design and security by design in software development processes.', 'Integrer la protection de la vie privee et la securite des la conception dans les processus de developpement logiciel.', 'Fiche 16 - Developpements', null, '8.25', CNIL_URL),
  c('CNIL-17', 'Data encryption', 'Chiffrer, hacher ou signer', 'Use encryption, hashing, and digital signatures to protect personal data confidentiality and integrity.', 'Utiliser le chiffrement, le hachage et les signatures numeriques pour proteger la confidentialite et l\'integrite des donnees personnelles.', 'Fiche 17 - Chiffrer', null, '8.24', CNIL_URL),
];

writeFileSync(join(DATA_DIR, 'cnil-securite.json'), JSON.stringify({
  framework: {
    id: 'cnil-securite',
    name: 'Personal Data Security Guide',
    name_nl: 'Guide de la securite des donnees personnelles',
    issuing_body: 'Commission Nationale de l\'Informatique et des Libertes (CNIL)',
    version: '2024',
    effective_date: '2024-01-01',
    scope: 'Security measures for organizations processing personal data under RGPD, organized in 17 practical fiches',
    scope_sectors: ['government', 'healthcare', 'finance', 'education'],
    structure_description: '17 fiches (practical sheets) covering awareness, authentication, access management, logging, workstation security, mobile security, network protection, server security, web security, backup, archiving, maintenance, subcontracting, data exchange, physical security, development, and encryption.',
    source_url: CNIL_URL,
    license: 'Public sector publication',
    language: 'fr',
  },
  controls: cnilControls,
  metadata: { ingested_at: new Date().toISOString(), total_controls: cnilControls.length },
}, null, 2), 'utf-8');
console.log(`CNIL Securite: ${cnilControls.length} controls`);

// ============================================================
// HDS (hds)
// ============================================================
const HDS_URL = 'https://esante.gouv.fr/produits-services/hds';
const hdsControls: Control[] = [
  c('HDS-INFRA-01', 'Physical infrastructure security', 'Securite de l\'infrastructure physique', 'Data centers hosting health data shall meet Tier III or equivalent availability requirements.', 'Les centres de donnees hebergeant des donnees de sante doivent respecter les exigences de disponibilite Tier III ou equivalent.', 'Infrastructure physique', null, '7.5', HDS_URL),
  c('HDS-INFRA-02', 'Physical access control', 'Controle d\'acces physique', 'Multi-layer physical access controls shall protect data center facilities.', 'Des controles d\'acces physiques multicouches doivent proteger les installations du centre de donnees.', 'Infrastructure physique', null, '7.2', HDS_URL),
  c('HDS-INFRA-03', 'Environmental protection', 'Protection environnementale', 'Fire detection/suppression, flooding protection, and climate control shall be implemented.', 'La detection/extinction d\'incendie, la protection contre les inondations et la climatisation doivent etre mises en oeuvre.', 'Infrastructure physique', null, '7.5', HDS_URL),
  c('HDS-INFRA-04', 'Power redundancy', 'Redondance electrique', 'Redundant power supplies with UPS and generator backup shall ensure continuous operation.', 'Des alimentations electriques redondantes avec onduleur et groupe electrogene doivent assurer le fonctionnement continu.', 'Infrastructure physique', null, '7.11', HDS_URL),
  c('HDS-INFRA-05', 'Physical surveillance', 'Surveillance physique', 'Video surveillance and intrusion detection shall monitor data center premises 24/7.', 'La videosurveillance et la detection d\'intrusion doivent surveiller les locaux du centre de donnees 24h/24.', 'Infrastructure physique', null, '7.4', HDS_URL),
  c('HDS-NET-01', 'Network security architecture', 'Architecture de securite reseau', 'Network architecture shall implement defense in depth with DMZ, segmentation, and filtering.', 'L\'architecture reseau doit implementer la defense en profondeur avec DMZ, segmentation et filtrage.', 'Infrastructure reseau', null, '8.22', HDS_URL),
  c('HDS-NET-02', 'Network monitoring', 'Surveillance reseau', 'Network traffic shall be monitored for anomalies and potential security incidents.', 'Le trafic reseau doit etre surveille pour detecter les anomalies et incidents de securite potentiels.', 'Infrastructure reseau', null, '8.16', HDS_URL),
  c('HDS-NET-03', 'Encrypted communications', 'Communications chiffrees', 'All network communications carrying health data shall be encrypted with TLS 1.2 or higher.', 'Toutes les communications reseau transportant des donnees de sante doivent etre chiffrees avec TLS 1.2 ou superieur.', 'Infrastructure reseau', null, '8.24', HDS_URL),
  c('HDS-NET-04', 'DDoS protection', 'Protection DDoS', 'DDoS mitigation measures shall protect the availability of health data hosting services.', 'Des mesures d\'attenuation DDoS doivent proteger la disponibilite des services d\'hebergement de donnees de sante.', 'Infrastructure reseau', null, '8.6', HDS_URL),
  c('HDS-MNG-01', 'Health data hosting contract', 'Contrat d\'hebergement de donnees de sante', 'Hosting contracts shall specify security obligations, audit rights, and data return procedures.', 'Les contrats d\'hebergement doivent preciser les obligations de securite, les droits d\'audit et les procedures de restitution des donnees.', 'Hebergement infogere', null, '5.20', HDS_URL),
  c('HDS-MNG-02', 'Tenant isolation', 'Isolation des locataires', 'Logical isolation shall prevent cross-tenant access to health data.', 'L\'isolation logique doit empecher l\'acces croise entre locataires aux donnees de sante.', 'Hebergement infogere', null, '8.22', HDS_URL),
  c('HDS-MNG-03', 'Health data localization', 'Localisation des donnees de sante', 'Health data shall be hosted within France or the European Union.', 'Les donnees de sante doivent etre hebergees en France ou dans l\'Union europeenne.', 'Hebergement infogere', null, null, HDS_URL),
  c('HDS-MNG-04', 'Sub-processor management', 'Gestion des sous-traitants', 'Sub-processors shall be declared to customers and shall meet equivalent security requirements.', 'Les sous-traitants doivent etre declares aux clients et doivent respecter des exigences de securite equivalentes.', 'Hebergement infogere', null, '5.21', HDS_URL),
  c('HDS-OPS-01', 'Security operations center', 'Centre d\'operations de securite', 'A SOC shall monitor health data hosting infrastructure 24/7.', 'Un SOC doit surveiller l\'infrastructure d\'hebergement de donnees de sante 24h/24 7j/7.', 'Infogrance d\'exploitation', null, '8.16', HDS_URL),
  c('HDS-OPS-02', 'Patch management', 'Gestion des correctifs', 'Security patches shall be assessed and deployed within defined timeframes.', 'Les correctifs de securite doivent etre evalues et deployes dans des delais definis.', 'Infogrance d\'exploitation', null, '8.8', HDS_URL),
  c('HDS-OPS-03', 'Incident response', 'Reponse aux incidents', 'Incident response procedures shall be documented and tested, with notification to clients and authorities.', 'Les procedures de reponse aux incidents doivent etre documentees et testees, avec notification aux clients et autorites.', 'Infogrance d\'exploitation', null, '5.26', HDS_URL),
  c('HDS-OPS-04', 'Vulnerability management', 'Gestion des vulnerabilites', 'Regular vulnerability assessments and penetration tests shall be conducted.', 'Des evaluations de vulnerabilites et des tests d\'intrusion reguliers doivent etre conduits.', 'Infogrance d\'exploitation', null, '8.8', HDS_URL),
  c('HDS-OPS-05', 'Change management', 'Gestion des changements', 'Changes to hosting infrastructure shall follow a formal change management process.', 'Les changements a l\'infrastructure d\'hebergement doivent suivre un processus formel de gestion des changements.', 'Infogrance d\'exploitation', null, '8.32', HDS_URL),
  c('HDS-BCK-01', 'Backup policy', 'Politique de sauvegarde', 'A backup policy shall define backup frequency, retention, encryption, and testing procedures.', 'Une politique de sauvegarde doit definir la frequence, la retention, le chiffrement et les procedures de test.', 'Sauvegarde externalisee', null, '8.13', HDS_URL),
  c('HDS-BCK-02', 'Backup encryption', 'Chiffrement des sauvegardes', 'Backups of health data shall be encrypted during transfer and at rest.', 'Les sauvegardes de donnees de sante doivent etre chiffrees pendant le transfert et au repos.', 'Sauvegarde externalisee', null, '8.24', HDS_URL),
  c('HDS-BCK-03', 'Backup restoration testing', 'Tests de restauration des sauvegardes', 'Backup restoration shall be tested regularly to verify data integrity and recoverability.', 'La restauration des sauvegardes doit etre testee regulierement pour verifier l\'integrite des donnees et la capacite de reprise.', 'Sauvegarde externalisee', null, '8.13', HDS_URL),
  c('HDS-BCK-04', 'Geographic backup separation', 'Separation geographique des sauvegardes', 'Backup copies shall be stored in a geographically separate location from the primary data.', 'Les copies de sauvegarde doivent etre stockees dans un lieu geographiquement separe des donnees primaires.', 'Sauvegarde externalisee', null, '8.14', HDS_URL),
  c('HDS-CERT-01', 'ISO 27001 certification', 'Certification ISO 27001', 'HDS providers shall hold ISO 27001 certification covering the hosting perimeter.', 'Les hebergeurs HDS doivent detenir la certification ISO 27001 couvrant le perimetre d\'hebergement.', 'Certification', null, null, HDS_URL),
  c('HDS-CERT-02', 'HDS certification scope', 'Perimetre de certification HDS', 'The HDS certification scope shall cover all activities related to health data hosting.', 'Le perimetre de certification HDS doit couvrir toutes les activites liees a l\'hebergement de donnees de sante.', 'Certification', null, null, HDS_URL),
  c('HDS-CERT-03', 'Annual HDS audit', 'Audit HDS annuel', 'An annual audit by an accredited body shall verify continued compliance with HDS requirements.', 'Un audit annuel par un organisme accredite doit verifier la conformite continue aux exigences HDS.', 'Certification', null, '5.35', HDS_URL),
];

writeFileSync(join(DATA_DIR, 'hds.json'), JSON.stringify({
  framework: {
    id: 'hds',
    name: 'Health Data Hosting Certification (HDS)',
    name_nl: 'Certification Hebergeurs de Donnees de Sante (HDS)',
    issuing_body: 'Agence du Numerique en Sante (ANS)',
    version: '2024',
    effective_date: '2024-01-01',
    scope: 'Certification requirements for organizations hosting French health data, mandatory under Article L.1111-8 of the Public Health Code',
    scope_sectors: ['healthcare'],
    structure_description: 'Requirements organized by hosting activity: physical infrastructure, network infrastructure, managed hosting, operations management, externalized backup, and certification. Based on ISO 27001 with health-sector extensions.',
    source_url: HDS_URL,
    license: 'Public sector publication',
    language: 'fr',
  },
  controls: hdsControls,
  metadata: { ingested_at: new Date().toISOString(), total_controls: hdsControls.length },
}, null, 2), 'utf-8');
console.log(`HDS: ${hdsControls.length} controls`);

console.log('\nAll remaining frameworks ingested.');
