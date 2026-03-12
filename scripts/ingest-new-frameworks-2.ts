// scripts/ingest-new-frameworks-2.ts
// Chunk 2: ANSSI technical recommendation guides
// Run: node --import tsx scripts/ingest-new-frameworks-2.ts

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
    id: string; name: string; name_nl: string; issuing_body: string;
    version: string; effective_date: string; scope: string;
    scope_sectors: string[]; structure_description: string;
    source_url: string; license: string; language: string;
  };
  controls: Control[];
  metadata: { ingested_at: string; total_controls: number };
}

function c(num: string, titleEn: string, titleFr: string, descEn: string, descFr: string, cat: string, subcat: string | null, iso: string | null, url: string): Control {
  return {
    control_number: num, title: titleEn, title_nl: titleFr,
    description: descEn, description_nl: descFr,
    category: cat, subcategory: subcat, level: null,
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
const ANSSI = 'Agence nationale de la securite des systemes d\'information (ANSSI)';

// ============================================================
// 6. ANSSI TLS Recommendations
// ============================================================
const TLS_URL = 'https://www.ssi.gouv.fr/guide/recommandations-de-securite-relatives-a-tls/';
writeFramework({
  framework: {
    id: 'anssi-tls',
    name: 'TLS Security Recommendations',
    name_nl: 'Recommandations de securite relatives a TLS',
    issuing_body: ANSSI, version: '1.2', effective_date: '2020-03-01',
    scope: 'Technical recommendations for secure TLS deployment on servers and clients',
    scope_sectors: ['government', 'healthcare', 'finance', 'digital_infrastructure'],
    structure_description: 'Recommendations covering TLS version selection, cipher suite configuration, certificate management, HSTS, OCSP stapling, and client authentication.',
    source_url: TLS_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('TLS-01', 'Enforce TLS 1.2 minimum', 'Imposer TLS 1.2 minimum', 'Disable SSLv2, SSLv3, TLS 1.0, and TLS 1.1. Only allow TLS 1.2 and TLS 1.3.', 'Desactiver SSLv2, SSLv3, TLS 1.0 et TLS 1.1. N\'autoriser que TLS 1.2 et TLS 1.3.', 'Version du protocole', null, '8.24', TLS_URL),
    c('TLS-02', 'Prefer TLS 1.3', 'Privilegier TLS 1.3', 'Configure servers to prefer TLS 1.3 which provides improved security and performance over TLS 1.2.', 'Configurer les serveurs pour privilegier TLS 1.3 qui offre une securite et des performances ameliorees par rapport a TLS 1.2.', 'Version du protocole', null, '8.24', TLS_URL),
    c('TLS-03', 'Restrict cipher suites', 'Restreindre les suites de chiffrement', 'Only allow cipher suites providing forward secrecy (ECDHE/DHE) with AEAD encryption (GCM, CCM, ChaCha20-Poly1305).', 'N\'autoriser que les suites de chiffrement offrant la confidentialite persistante (ECDHE/DHE) avec chiffrement AEAD (GCM, CCM, ChaCha20-Poly1305).', 'Suites de chiffrement', null, '8.24', TLS_URL),
    c('TLS-04', 'Disable weak cipher suites', 'Desactiver les suites faibles', 'Disable RC4, DES, 3DES, CBC-mode ciphers, export-grade ciphers, and NULL ciphers.', 'Desactiver RC4, DES, 3DES, chiffrements en mode CBC, chiffrements de qualite export et chiffrements NULL.', 'Suites de chiffrement', null, '8.24', TLS_URL),
    c('TLS-05', 'Use strong key exchange parameters', 'Utiliser des parametres d\'echange de cles robustes', 'Use ECDHE with P-256 or P-384 curves, or DHE with groups of at least 2048 bits.', 'Utiliser ECDHE avec les courbes P-256 ou P-384, ou DHE avec des groupes d\'au moins 2048 bits.', 'Echange de cles', null, '8.24', TLS_URL),
    c('TLS-06', 'Certificate key requirements', 'Exigences de cle de certificat', 'Use RSA keys of at least 2048 bits (4096 recommended) or ECDSA keys with P-256 or P-384.', 'Utiliser des cles RSA d\'au moins 2048 bits (4096 recommande) ou des cles ECDSA avec P-256 ou P-384.', 'Certificats', null, '8.24', TLS_URL),
    c('TLS-07', 'Certificate chain validation', 'Validation de la chaine de certificats', 'Clients shall validate the full certificate chain including intermediate certificates and revocation status.', 'Les clients doivent valider la chaine de certificats complete incluant les certificats intermediaires et le statut de revocation.', 'Certificats', null, '8.24', TLS_URL),
    c('TLS-08', 'Enable HSTS', 'Activer HSTS', 'Deploy HTTP Strict Transport Security with a minimum max-age of 6 months and includeSubDomains.', 'Deployer HTTP Strict Transport Security avec un max-age minimum de 6 mois et includeSubDomains.', 'Configuration serveur', null, '8.24', TLS_URL),
    c('TLS-09', 'Enable OCSP stapling', 'Activer l\'agrafage OCSP', 'Enable OCSP stapling to improve certificate revocation checking performance and privacy.', 'Activer l\'agrafage OCSP pour ameliorer les performances et la confidentialite de la verification de revocation des certificats.', 'Configuration serveur', null, '8.24', TLS_URL),
    c('TLS-10', 'Disable renegotiation or use secure renegotiation', 'Desactiver la renegociation ou utiliser la renegociation securisee', 'Disable client-initiated renegotiation. If renegotiation is needed, use RFC 5746 secure renegotiation.', 'Desactiver la renegociation initiee par le client. Si la renegociation est necessaire, utiliser la renegociation securisee RFC 5746.', 'Configuration serveur', null, '8.24', TLS_URL),
    c('TLS-11', 'Disable TLS compression', 'Desactiver la compression TLS', 'Disable TLS compression to prevent CRIME and BREACH attacks.', 'Desactiver la compression TLS pour prevenir les attaques CRIME et BREACH.', 'Configuration serveur', null, '8.24', TLS_URL),
    c('TLS-12', 'Certificate transparency', 'Transparence des certificats', 'Monitor Certificate Transparency logs for unauthorized certificate issuance for your domains.', 'Surveiller les journaux de Certificate Transparency pour detecter l\'emission de certificats non autorises pour vos domaines.', 'Surveillance', null, '8.16', TLS_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 7. ANSSI Logging Recommendations
// ============================================================
const LOG_URL = 'https://www.ssi.gouv.fr/guide/recommandations-de-securite-pour-la-journalisation/';
writeFramework({
  framework: {
    id: 'anssi-journalisation',
    name: 'Logging Security Recommendations',
    name_nl: 'Recommandations de securite pour la journalisation',
    issuing_body: ANSSI, version: '1.0', effective_date: '2022-01-01',
    scope: 'Technical recommendations for implementing secure logging in information systems',
    scope_sectors: ['government', 'healthcare', 'finance', 'energy', 'telecom', 'digital_infrastructure'],
    structure_description: 'Recommendations covering what to log, log format standardization, log collection architecture, log storage, integrity protection, retention, and analysis.',
    source_url: LOG_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('LOG-01', 'Define a logging policy', 'Definir une politique de journalisation', 'Establish a formal logging policy defining what events to log, retention periods, access controls, and analysis frequency.', 'Etablir une politique de journalisation formelle definissant les evenements a journaliser, les periodes de conservation, les controles d\'acces et la frequence d\'analyse.', 'Politique de journalisation', null, '8.15', LOG_URL),
    c('LOG-02', 'Log authentication events', 'Journaliser les evenements d\'authentification', 'Log all authentication attempts (success and failure), password changes, and privilege escalation.', 'Journaliser toutes les tentatives d\'authentification (succes et echecs), changements de mots de passe et escalades de privileges.', 'Evenements a journaliser', 'Authentification', '8.15', LOG_URL),
    c('LOG-03', 'Log access to sensitive data', 'Journaliser les acces aux donnees sensibles', 'Log all access to sensitive data including reads, modifications, and deletions with user identity and timestamp.', 'Journaliser tous les acces aux donnees sensibles incluant les lectures, modifications et suppressions avec l\'identite de l\'utilisateur et l\'horodatage.', 'Evenements a journaliser', 'Donnees sensibles', '8.15', LOG_URL),
    c('LOG-04', 'Log administrative actions', 'Journaliser les actions administratives', 'Log all administrative actions: configuration changes, user account management, security policy modifications.', 'Journaliser toutes les actions administratives : changements de configuration, gestion des comptes utilisateurs, modifications des politiques de securite.', 'Evenements a journaliser', 'Administration', '8.15', LOG_URL),
    c('LOG-05', 'Log network security events', 'Journaliser les evenements de securite reseau', 'Log firewall decisions, IDS/IPS alerts, VPN connections, and proxy activity.', 'Journaliser les decisions de pare-feu, alertes IDS/IPS, connexions VPN et activite du proxy.', 'Evenements a journaliser', 'Reseau', '8.15', LOG_URL),
    c('LOG-06', 'Standardize log format', 'Normaliser le format des journaux', 'Use a standardized log format (CEF, syslog RFC 5424, or JSON structured) across all systems for correlation.', 'Utiliser un format de journal standardise (CEF, syslog RFC 5424 ou JSON structure) sur tous les systemes pour la correlation.', 'Format et collecte', null, '8.15', LOG_URL),
    c('LOG-07', 'Synchronize time sources', 'Synchroniser les sources de temps', 'All systems generating logs shall synchronize their clocks via NTP to a common authoritative time source.', 'Tous les systemes generant des journaux doivent synchroniser leurs horloges via NTP sur une source de temps de reference commune.', 'Format et collecte', null, '8.17', LOG_URL),
    c('LOG-08', 'Centralize log collection', 'Centraliser la collecte des journaux', 'Deploy a centralized log collection infrastructure (SIEM) to aggregate logs from all sources.', 'Deployer une infrastructure centralisee de collecte des journaux (SIEM) pour agreger les journaux de toutes les sources.', 'Architecture de collecte', null, '8.15', LOG_URL),
    c('LOG-09', 'Protect log transmission', 'Proteger la transmission des journaux', 'Log transmission from sources to the central collector shall use encrypted channels (TLS syslog, HTTPS).', 'La transmission des journaux des sources vers le collecteur central doit utiliser des canaux chiffres (syslog TLS, HTTPS).', 'Architecture de collecte', null, '8.24', LOG_URL),
    c('LOG-10', 'Ensure log integrity', 'Assurer l\'integrite des journaux', 'Implement integrity protection for stored logs using write-once storage, digital signatures, or hash chains.', 'Mettre en oeuvre la protection de l\'integrite des journaux stockes par stockage non-reecrivable, signatures numeriques ou chaines de hachage.', 'Stockage et integrite', null, '8.15', LOG_URL),
    c('LOG-11', 'Define log retention periods', 'Definir les periodes de conservation des journaux', 'Define retention periods based on regulatory requirements (RGPD, LPM) and security needs. Minimum 6 months for security events.', 'Definir les periodes de conservation en fonction des exigences reglementaires (RGPD, LPM) et des besoins de securite. Minimum 6 mois pour les evenements de securite.', 'Stockage et integrite', null, '8.15', LOG_URL),
    c('LOG-12', 'Restrict access to logs', 'Restreindre l\'acces aux journaux', 'Access to log data shall be restricted to authorized security and audit personnel with role-based access control.', 'L\'acces aux donnees de journalisation doit etre restreint au personnel de securite et d\'audit autorise avec un controle d\'acces base sur les roles.', 'Controle d\'acces aux journaux', null, '8.3', LOG_URL),
    c('LOG-13', 'Implement log analysis and alerting', 'Mettre en oeuvre l\'analyse et l\'alerte sur les journaux', 'Deploy automated analysis rules and alerts for security-relevant events including correlation across sources.', 'Deployer des regles d\'analyse automatisees et des alertes pour les evenements pertinents pour la securite incluant la correlation entre les sources.', 'Analyse', null, '8.16', LOG_URL),
    c('LOG-14', 'Regular log review', 'Revue reguliere des journaux', 'Conduct regular manual review of logs beyond automated alerting to detect subtle anomalies.', 'Conduire une revue manuelle reguliere des journaux au-dela des alertes automatisees pour detecter les anomalies subtiles.', 'Analyse', null, '8.15', LOG_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 8. ANSSI Password Recommendations
// ============================================================
const PWD_URL = 'https://www.ssi.gouv.fr/guide/recommandations-relatives-a-lauthentification-multifacteur-et-aux-mots-de-passe/';
writeFramework({
  framework: {
    id: 'anssi-mots-de-passe',
    name: 'Password and Multi-Factor Authentication Recommendations',
    name_nl: 'Recommandations relatives a l\'authentification multifacteur et aux mots de passe',
    issuing_body: ANSSI, version: '2.0', effective_date: '2021-10-01',
    scope: 'Recommendations for password policies and multi-factor authentication implementation',
    scope_sectors: ['government', 'healthcare', 'finance', 'education', 'digital_infrastructure'],
    structure_description: 'Recommendations covering password complexity, storage, multi-factor authentication, account lockout, password managers, and authentication architecture.',
    source_url: PWD_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('MDP-01', 'Minimum password length', 'Longueur minimale du mot de passe', 'Enforce a minimum password length of 12 characters for standard accounts and 16 for privileged accounts.', 'Imposer une longueur minimale de mot de passe de 12 caracteres pour les comptes standards et 16 pour les comptes privilegies.', 'Politique de mots de passe', null, '5.17', PWD_URL),
    c('MDP-02', 'Password complexity requirements', 'Exigences de complexite des mots de passe', 'Require a mix of uppercase, lowercase, digits, and special characters, or accept long passphrases.', 'Exiger un melange de majuscules, minuscules, chiffres et caracteres speciaux, ou accepter les phrases de passe longues.', 'Politique de mots de passe', null, '5.17', PWD_URL),
    c('MDP-03', 'Prohibit common passwords', 'Interdire les mots de passe courants', 'Check passwords against a blocklist of common passwords, dictionary words, and previously breached credentials.', 'Verifier les mots de passe contre une liste de blocage de mots de passe courants, mots du dictionnaire et identifiants precedemment compromis.', 'Politique de mots de passe', null, '5.17', PWD_URL),
    c('MDP-04', 'Secure password storage', 'Stockage securise des mots de passe', 'Store passwords using modern key derivation functions (Argon2id, bcrypt, scrypt) with unique salts per password.', 'Stocker les mots de passe en utilisant des fonctions de derivation de cle modernes (Argon2id, bcrypt, scrypt) avec des sels uniques par mot de passe.', 'Stockage', null, '8.24', PWD_URL),
    c('MDP-05', 'Never store passwords in plaintext', 'Ne jamais stocker les mots de passe en clair', 'Passwords shall never be stored in plaintext, reversibly encrypted, or using weak hash algorithms (MD5, SHA-1).', 'Les mots de passe ne doivent jamais etre stockes en clair, chiffres de maniere reversible, ou avec des algorithmes de hachage faibles (MD5, SHA-1).', 'Stockage', null, '8.24', PWD_URL),
    c('MDP-06', 'Implement multi-factor authentication', 'Mettre en oeuvre l\'authentification multifacteur', 'Deploy MFA for all privileged accounts, remote access, and sensitive applications. Use hardware tokens or TOTP.', 'Deployer l\'AMF pour tous les comptes privilegies, les acces distants et les applications sensibles. Utiliser des jetons materiels ou TOTP.', 'Authentification multifacteur', null, '8.5', PWD_URL),
    c('MDP-07', 'MFA factor independence', 'Independance des facteurs AMF', 'Authentication factors shall be independent: compromise of one factor shall not compromise another.', 'Les facteurs d\'authentification doivent etre independants : la compromission d\'un facteur ne doit pas compromettre un autre.', 'Authentification multifacteur', null, '8.5', PWD_URL),
    c('MDP-08', 'Avoid SMS-based MFA for sensitive systems', 'Eviter l\'AMF par SMS pour les systemes sensibles', 'SMS-based MFA is vulnerable to SIM swapping; prefer hardware tokens or TOTP for high-security applications.', 'L\'AMF par SMS est vulnerable au detournement de carte SIM ; privilegier les jetons materiels ou TOTP pour les applications a haute securite.', 'Authentification multifacteur', null, '8.5', PWD_URL),
    c('MDP-09', 'Account lockout policy', 'Politique de verrouillage de compte', 'Implement progressive lockout after failed authentication attempts: temporary lockout escalating to manual unlock.', 'Mettre en oeuvre un verrouillage progressif apres des tentatives d\'authentification echouees : verrouillage temporaire s\'intensifiant vers un deverrouillage manuel.', 'Protection contre les attaques', null, '8.5', PWD_URL),
    c('MDP-10', 'Rate limiting on authentication', 'Limitation du debit sur l\'authentification', 'Implement rate limiting on authentication endpoints to prevent brute-force and credential stuffing attacks.', 'Mettre en oeuvre une limitation du debit sur les points de terminaison d\'authentification pour prevenir les attaques par force brute et le bourrage d\'identifiants.', 'Protection contre les attaques', null, '8.5', PWD_URL),
    c('MDP-11', 'Password manager recommendation', 'Recommandation de gestionnaire de mots de passe', 'Encourage or mandate the use of password managers to generate and store unique complex passwords per service.', 'Encourager ou imposer l\'utilisation de gestionnaires de mots de passe pour generer et stocker des mots de passe complexes uniques par service.', 'Outils', null, '5.17', PWD_URL),
    c('MDP-12', 'Password rotation policy', 'Politique de rotation des mots de passe', 'Do not require frequent mandatory password changes except after suspected compromise. Focus on strength over rotation.', 'Ne pas exiger de changements de mot de passe obligatoires frequents sauf apres une compromission suspectee. Privilegier la robustesse a la rotation.', 'Politique de mots de passe', null, '5.17', PWD_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 9. ANSSI Active Directory Security Guide
// ============================================================
const AD_URL = 'https://www.ssi.gouv.fr/guide/recommandations-de-securite-relatives-a-active-directory/';
writeFramework({
  framework: {
    id: 'anssi-active-directory',
    name: 'Active Directory Security Recommendations',
    name_nl: 'Recommandations de securite relatives a Active Directory',
    issuing_body: ANSSI, version: '1.0', effective_date: '2023-01-01',
    scope: 'Security hardening recommendations for Active Directory environments',
    scope_sectors: ['government', 'healthcare', 'finance', 'energy', 'digital_infrastructure'],
    structure_description: 'Recommendations for AD architecture, tiered administration, privilege management, group policy hardening, monitoring, and recovery.',
    source_url: AD_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('AD-01', 'Implement tiered administration model', 'Mettre en oeuvre le modele d\'administration en tiers', 'Implement a tiered administration model (Tier 0/1/2) to prevent privilege escalation across AD tiers.', 'Mettre en oeuvre un modele d\'administration en tiers (Tier 0/1/2) pour empecher l\'escalade de privileges entre les tiers AD.', 'Architecture AD', null, '8.2', AD_URL),
    c('AD-02', 'Secure domain controllers', 'Securiser les controleurs de domaine', 'Domain controllers shall be dedicated servers, physically secured, with minimal installed roles and hardened configuration.', 'Les controleurs de domaine doivent etre des serveurs dedies, physiquement securises, avec un minimum de roles installes et une configuration durcie.', 'Architecture AD', null, '8.9', AD_URL),
    c('AD-03', 'Restrict Domain Admins membership', 'Restreindre l\'appartenance a Domain Admins', 'Minimize membership of Domain Admins and Enterprise Admins groups. Use just-in-time privilege elevation.', 'Minimiser l\'appartenance aux groupes Domain Admins et Enterprise Admins. Utiliser l\'elevation de privileges juste-a-temps.', 'Gestion des privileges', null, '8.2', AD_URL),
    c('AD-04', 'Protected Users group', 'Groupe Protected Users', 'Add privileged accounts to the Protected Users security group to enforce enhanced credential protection.', 'Ajouter les comptes privilegies au groupe de securite Protected Users pour imposer une protection renforcee des identifiants.', 'Gestion des privileges', null, '8.2', AD_URL),
    c('AD-05', 'Disable NTLM where possible', 'Desactiver NTLM lorsque possible', 'Progressively disable NTLM authentication in favor of Kerberos. Monitor and audit remaining NTLM usage.', 'Desactiver progressivement l\'authentification NTLM en faveur de Kerberos. Surveiller et auditer l\'utilisation residuelle de NTLM.', 'Protocoles d\'authentification', null, '8.5', AD_URL),
    c('AD-06', 'Enforce Kerberos armoring (FAST)', 'Imposer le blindage Kerberos (FAST)', 'Enable Kerberos FAST (Flexible Authentication Secure Tunneling) for enhanced Kerberos ticket protection.', 'Activer Kerberos FAST (Flexible Authentication Secure Tunneling) pour une protection renforcee des tickets Kerberos.', 'Protocoles d\'authentification', null, '8.5', AD_URL),
    c('AD-07', 'Secure Group Policy Objects', 'Securiser les objets de strategie de groupe', 'Restrict GPO editing permissions, audit GPO changes, and back up GPOs regularly.', 'Restreindre les permissions de modification des GPO, auditer les changements de GPO et sauvegarder regulierement les GPO.', 'Strategie de groupe', null, '8.9', AD_URL),
    c('AD-08', 'Monitor AD replication', 'Surveiller la replication AD', 'Monitor AD replication health and alert on replication failures that could indicate compromise or infrastructure issues.', 'Surveiller la sante de la replication AD et alerter sur les echecs de replication qui pourraient indiquer une compromission ou des problemes d\'infrastructure.', 'Surveillance', null, '8.16', AD_URL),
    c('AD-09', 'Audit AD changes', 'Auditer les changements AD', 'Enable and monitor advanced auditing for all AD object changes, especially in privileged groups and OUs.', 'Activer et surveiller l\'audit avance de tous les changements d\'objets AD, en particulier dans les groupes privilegies et les UO.', 'Surveillance', null, '8.15', AD_URL),
    c('AD-10', 'Monitor Kerberoasting and AS-REP roasting', 'Surveiller le Kerberoasting et l\'AS-REP roasting', 'Deploy detection rules for Kerberoasting (TGS requests for service accounts) and AS-REP roasting attacks.', 'Deployer des regles de detection pour les attaques Kerberoasting (requetes TGS pour les comptes de service) et AS-REP roasting.', 'Surveillance', null, '8.16', AD_URL),
    c('AD-11', 'AD backup and recovery plan', 'Plan de sauvegarde et recuperation AD', 'Maintain tested AD backup and recovery procedures including authoritative restore and forest recovery scenarios.', 'Maintenir des procedures de sauvegarde et recuperation AD testees incluant la restauration autoritative et les scenarios de recuperation de foret.', 'Continuite', null, '8.13', AD_URL),
    c('AD-12', 'LAPS for local administrator passwords', 'LAPS pour les mots de passe administrateur locaux', 'Deploy LAPS (Local Administrator Password Solution) to manage unique local admin passwords on all domain-joined machines.', 'Deployer LAPS (Local Administrator Password Solution) pour gerer des mots de passe administrateur locaux uniques sur toutes les machines jointes au domaine.', 'Gestion des privileges', null, '5.17', AD_URL),
    c('AD-13', 'Secure AdminSDHolder', 'Securiser AdminSDHolder', 'Monitor and protect the AdminSDHolder object which propagates permissions to protected groups every 60 minutes.', 'Surveiller et proteger l\'objet AdminSDHolder qui propage les permissions aux groupes proteges toutes les 60 minutes.', 'Gestion des privileges', null, '8.2', AD_URL),
    c('AD-14', 'Disable legacy protocols', 'Desactiver les protocoles anciens', 'Disable LM hash storage, LLMNR, NBT-NS, WPAD, and other legacy protocols that enable credential theft.', 'Desactiver le stockage de hachage LM, LLMNR, NBT-NS, WPAD et autres protocoles anciens qui permettent le vol d\'identifiants.', 'Protocoles d\'authentification', null, '8.9', AD_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 10. ANSSI Secure Architecture Recommendations
// ============================================================
const ARCHI_URL = 'https://www.ssi.gouv.fr/guide/recommandations-pour-les-architectures-des-systemes-dinformation-sensibles-ou-diffusion-restreinte/';
writeFramework({
  framework: {
    id: 'anssi-architecture',
    name: 'Secure Architecture Recommendations',
    name_nl: 'Recommandations pour les architectures des systemes d\'information sensibles ou Diffusion Restreinte',
    issuing_body: ANSSI, version: '2.0', effective_date: '2022-01-01',
    scope: 'Architecture recommendations for sensitive or Diffusion Restreinte information systems',
    scope_sectors: ['government', 'energy', 'telecom', 'digital_infrastructure'],
    structure_description: 'Recommendations covering network zoning, defense in depth, administration networks, interconnection security, and sensitive system isolation.',
    source_url: ARCHI_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('ARCHI-01', 'Defense in depth strategy', 'Strategie de defense en profondeur', 'Implement multiple independent security layers so that failure of one layer does not compromise the system.', 'Mettre en oeuvre plusieurs couches de securite independantes de sorte que la defaillance d\'une couche ne compromette pas le systeme.', 'Principes d\'architecture', null, '8.22', ARCHI_URL),
    c('ARCHI-02', 'Network zoning', 'Zonage reseau', 'Segment the network into security zones based on data sensitivity and function: DMZ, internal, restricted, administration.', 'Segmenter le reseau en zones de securite basees sur la sensibilite des donnees et la fonction : DMZ, interne, restreint, administration.', 'Segmentation reseau', null, '8.22', ARCHI_URL),
    c('ARCHI-03', 'Inter-zone filtering', 'Filtrage inter-zones', 'Deploy stateful firewalls between all security zones with explicit allow rules and default-deny policy.', 'Deployer des pare-feu a etats entre toutes les zones de securite avec des regles d\'autorisation explicites et une politique de refus par defaut.', 'Segmentation reseau', null, '8.22', ARCHI_URL),
    c('ARCHI-04', 'DMZ architecture', 'Architecture de la DMZ', 'Exposed services shall be placed in a DMZ with no direct path from the DMZ to internal networks.', 'Les services exposes doivent etre places dans une DMZ sans chemin direct de la DMZ vers les reseaux internes.', 'Segmentation reseau', null, '8.22', ARCHI_URL),
    c('ARCHI-05', 'Dedicated administration network', 'Reseau d\'administration dedie', 'Administrative access to servers and network equipment shall use a dedicated, isolated administration network.', 'L\'acces administratif aux serveurs et equipements reseau doit utiliser un reseau d\'administration dedie et isole.', 'Reseau d\'administration', null, '8.22', ARCHI_URL),
    c('ARCHI-06', 'Bastion host for administration', 'Bastion d\'administration', 'All administrative connections shall transit through a hardened bastion host with session recording and MFA.', 'Toutes les connexions administratives doivent transiter par un bastion durci avec enregistrement de session et AMF.', 'Reseau d\'administration', null, '8.2', ARCHI_URL),
    c('ARCHI-07', 'Interconnection security', 'Securite des interconnexions', 'Interconnections with external networks shall use dual-firewall architecture with an application-level gateway.', 'Les interconnexions avec les reseaux externes doivent utiliser une architecture a double pare-feu avec une passerelle applicative.', 'Interconnexions', null, '8.22', ARCHI_URL),
    c('ARCHI-08', 'Data diode for sensitive systems', 'Diode de donnees pour les systemes sensibles', 'For highly sensitive systems, use hardware data diodes to enforce one-way data flows.', 'Pour les systemes hautement sensibles, utiliser des diodes de donnees materielles pour imposer des flux de donnees unidirectionnels.', 'Interconnexions', null, '8.22', ARCHI_URL),
    c('ARCHI-09', 'Minimize the attack surface', 'Minimiser la surface d\'attaque', 'Disable unnecessary services, ports, and protocols. Remove default accounts and sample applications.', 'Desactiver les services, ports et protocoles inutiles. Supprimer les comptes par defaut et les applications d\'exemple.', 'Durcissement', null, '8.9', ARCHI_URL),
    c('ARCHI-10', 'DNS security', 'Securite DNS', 'Deploy DNSSEC for domain validation and use internal DNS resolvers that do not forward to public resolvers.', 'Deployer DNSSEC pour la validation des domaines et utiliser des resolveurs DNS internes qui ne font pas de transfert vers les resolveurs publics.', 'Services d\'infrastructure', null, '8.22', ARCHI_URL),
    c('ARCHI-11', 'PKI for internal certificates', 'IGC pour les certificats internes', 'Deploy an internal PKI for managing certificates used in internal communications, VPN, and administration.', 'Deployer une IGC interne pour gerer les certificats utilises dans les communications internes, le VPN et l\'administration.', 'Services d\'infrastructure', null, '8.24', ARCHI_URL),
    c('ARCHI-12', 'Secure remote access architecture', 'Architecture d\'acces distant securise', 'Remote access shall use VPN with MFA, terminating in a dedicated DMZ, with no split tunneling for sensitive environments.', 'L\'acces distant doit utiliser un VPN avec AMF, terminant dans une DMZ dediee, sans tunneling fractionne pour les environnements sensibles.', 'Acces distant', null, '8.22', ARCHI_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 11. ANSSI Secure Development Guide
// ============================================================
const DEV_URL = 'https://www.ssi.gouv.fr/guide/regles-de-programmation-pour-le-developpement-securise-de-logiciels-en-langage-c/';
writeFramework({
  framework: {
    id: 'anssi-dev-securise',
    name: 'Secure Software Development Guide',
    name_nl: 'Guide de developpement securise',
    issuing_body: ANSSI, version: '1.1', effective_date: '2020-01-01',
    scope: 'Secure coding practices and development process security for software projects',
    scope_sectors: ['government', 'digital_infrastructure'],
    structure_description: 'Recommendations for secure development lifecycle, input validation, memory safety, cryptographic usage, dependency management, and secure build/deployment.',
    source_url: DEV_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('DEV-01', 'Secure development lifecycle', 'Cycle de developpement securise', 'Integrate security at every stage of the development lifecycle: requirements, design, coding, testing, deployment.', 'Integrer la securite a chaque etape du cycle de developpement : exigences, conception, codage, tests, deploiement.', 'Processus de developpement', null, '8.25', DEV_URL),
    c('DEV-02', 'Threat modeling during design', 'Modelisation des menaces en phase de conception', 'Conduct threat modeling during the design phase to identify security requirements and attack surfaces.', 'Conduire une modelisation des menaces en phase de conception pour identifier les exigences de securite et les surfaces d\'attaque.', 'Processus de developpement', null, '8.25', DEV_URL),
    c('DEV-03', 'Input validation', 'Validation des entrees', 'Validate all inputs on the server side using allowlists. Never trust client-side validation alone.', 'Valider toutes les entrees cote serveur en utilisant des listes d\'autorisation. Ne jamais faire confiance a la validation cote client seule.', 'Codage securise', null, '8.28', DEV_URL),
    c('DEV-04', 'Output encoding', 'Encodage des sorties', 'Encode all outputs contextually to prevent injection attacks (XSS, SQL injection, command injection).', 'Encoder toutes les sorties de maniere contextuelle pour prevenir les attaques par injection (XSS, injection SQL, injection de commandes).', 'Codage securise', null, '8.28', DEV_URL),
    c('DEV-05', 'Parameterized queries', 'Requetes parametrees', 'Use parameterized queries or prepared statements for all database interactions. Never concatenate user input into queries.', 'Utiliser des requetes parametrees ou des instructions preparees pour toutes les interactions avec la base de donnees. Ne jamais concatener les entrees utilisateur dans les requetes.', 'Codage securise', null, '8.28', DEV_URL),
    c('DEV-06', 'Memory-safe coding', 'Codage sur pour la memoire', 'Avoid buffer overflows, use-after-free, and null pointer dereferences through memory-safe languages or strict coding disciplines.', 'Eviter les debordements de tampon, les utilisations apres liberation et les dereferencements de pointeur nul par des langages surs pour la memoire ou des disciplines de codage strictes.', 'Codage securise', null, '8.28', DEV_URL),
    c('DEV-07', 'Cryptographic best practices', 'Bonnes pratiques cryptographiques', 'Use established cryptographic libraries, avoid custom implementations, follow ANSSI cryptographic recommendations for algorithm selection.', 'Utiliser des bibliotheques cryptographiques etablies, eviter les implementations personnalisees, suivre les recommandations cryptographiques de l\'ANSSI pour la selection des algorithmes.', 'Cryptographie', null, '8.24', DEV_URL),
    c('DEV-08', 'Secret management in code', 'Gestion des secrets dans le code', 'Never hardcode secrets (passwords, API keys, certificates) in source code. Use secret management systems.', 'Ne jamais coder en dur les secrets (mots de passe, cles API, certificats) dans le code source. Utiliser des systemes de gestion des secrets.', 'Gestion des secrets', null, '8.24', DEV_URL),
    c('DEV-09', 'Dependency management', 'Gestion des dependances', 'Maintain an inventory of all dependencies, monitor for known vulnerabilities, and update promptly.', 'Maintenir un inventaire de toutes les dependances, surveiller les vulnerabilites connues et mettre a jour rapidement.', 'Dependances', null, '8.8', DEV_URL),
    c('DEV-10', 'Static analysis in CI/CD', 'Analyse statique dans le CI/CD', 'Integrate static application security testing (SAST) into the CI/CD pipeline to detect vulnerabilities before deployment.', 'Integrer les tests statiques de securite applicative (SAST) dans le pipeline CI/CD pour detecter les vulnerabilites avant le deploiement.', 'Tests de securite', null, '8.28', DEV_URL),
    c('DEV-11', 'Dynamic testing', 'Tests dynamiques', 'Perform dynamic application security testing (DAST) and penetration testing before production release.', 'Realiser des tests dynamiques de securite applicative (DAST) et des tests d\'intrusion avant la mise en production.', 'Tests de securite', null, '8.8', DEV_URL),
    c('DEV-12', 'Secure build pipeline', 'Pipeline de construction securise', 'Secure the build pipeline: sign artifacts, use reproducible builds, restrict pipeline access, verify dependencies.', 'Securiser le pipeline de construction : signer les artefacts, utiliser des constructions reproductibles, restreindre l\'acces au pipeline, verifier les dependances.', 'Deploiement securise', null, '8.25', DEV_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 12. ANSSI WiFi Security Recommendations
// ============================================================
const WIFI_URL = 'https://www.ssi.gouv.fr/guide/recommandations-de-securite-relatives-aux-reseaux-wifi/';
writeFramework({
  framework: {
    id: 'anssi-wifi',
    name: 'WiFi Security Recommendations',
    name_nl: 'Recommandations de securite relatives aux reseaux WiFi',
    issuing_body: ANSSI, version: '1.0', effective_date: '2013-03-01',
    scope: 'Security recommendations for deploying and managing WiFi networks in enterprise environments',
    scope_sectors: ['government', 'healthcare', 'finance', 'education'],
    structure_description: 'Recommendations covering WiFi protocol selection, authentication, encryption, segmentation, monitoring, and rogue AP detection.',
    source_url: WIFI_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('WIFI-01', 'Use WPA3 or WPA2-Enterprise', 'Utiliser WPA3 ou WPA2-Enterprise', 'Deploy WPA3-Enterprise or WPA2-Enterprise with 802.1X authentication. Do not use WPA-Personal in corporate settings.', 'Deployer WPA3-Enterprise ou WPA2-Enterprise avec authentification 802.1X. Ne pas utiliser WPA-Personal en entreprise.', 'Protocole et chiffrement', null, '8.22', WIFI_URL),
    c('WIFI-02', 'Disable WEP and WPA1', 'Desactiver WEP et WPA1', 'Disable WEP and WPA (TKIP) as they are cryptographically broken and provide no real security.', 'Desactiver WEP et WPA (TKIP) car ils sont cryptographiquement casses et ne fournissent aucune securite reelle.', 'Protocole et chiffrement', null, '8.24', WIFI_URL),
    c('WIFI-03', '802.1X authentication with RADIUS', 'Authentification 802.1X avec RADIUS', 'Use 802.1X (EAP-TLS preferred) with a RADIUS server for enterprise WiFi authentication.', 'Utiliser 802.1X (EAP-TLS de preference) avec un serveur RADIUS pour l\'authentification WiFi d\'entreprise.', 'Authentification', null, '8.5', WIFI_URL),
    c('WIFI-04', 'Certificate-based WiFi authentication', 'Authentification WiFi par certificat', 'For sensitive environments, use certificate-based authentication (EAP-TLS) rather than password-based (PEAP/MSCHAPv2).', 'Pour les environnements sensibles, utiliser l\'authentification par certificat (EAP-TLS) plutot que par mot de passe (PEAP/MSCHAPv2).', 'Authentification', null, '8.5', WIFI_URL),
    c('WIFI-05', 'WiFi network segmentation', 'Segmentation du reseau WiFi', 'Place WiFi networks on dedicated VLANs segmented from wired internal networks. Apply firewall rules between segments.', 'Placer les reseaux WiFi sur des VLAN dedies segmentes des reseaux internes filaires. Appliquer des regles de pare-feu entre les segments.', 'Segmentation', null, '8.22', WIFI_URL),
    c('WIFI-06', 'Guest WiFi isolation', 'Isolation du WiFi invites', 'Guest WiFi shall provide internet access only, fully isolated from internal networks with captive portal authentication.', 'Le WiFi invites ne doit fournir qu\'un acces internet, entierement isole des reseaux internes avec authentification par portail captif.', 'Segmentation', null, '8.22', WIFI_URL),
    c('WIFI-07', 'Rogue access point detection', 'Detection des points d\'acces non autorises', 'Deploy wireless intrusion detection/prevention (WIDS/WIPS) to detect rogue access points and deauthentication attacks.', 'Deployer la detection/prevention d\'intrusion sans fil (WIDS/WIPS) pour detecter les points d\'acces non autorises et les attaques de desauthentification.', 'Surveillance', null, '8.16', WIFI_URL),
    c('WIFI-08', 'WiFi access point hardening', 'Durcissement des points d\'acces WiFi', 'Change default credentials on all APs, disable management interfaces on user-facing networks, keep firmware updated.', 'Changer les identifiants par defaut sur tous les AP, desactiver les interfaces de gestion sur les reseaux utilisateurs, maintenir le micrologiciel a jour.', 'Durcissement', null, '8.9', WIFI_URL),
    c('WIFI-09', 'Disable WiFi when not needed', 'Desactiver le WiFi lorsque non necessaire', 'In highly sensitive environments, prefer wired connections and disable WiFi interfaces when not required.', 'Dans les environnements hautement sensibles, privilegier les connexions filaires et desactiver les interfaces WiFi lorsque non necessaires.', 'Politique', null, '8.20', WIFI_URL),
    c('WIFI-10', 'WiFi usage logging', 'Journalisation de l\'utilisation WiFi', 'Log WiFi authentication events, association/disassociation, and bandwidth anomalies for security monitoring.', 'Journaliser les evenements d\'authentification WiFi, les associations/desassociations et les anomalies de bande passante pour la surveillance de securite.', 'Surveillance', null, '8.15', WIFI_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 13. ANSSI IoT Security Recommendations
// ============================================================
const IOT_URL = 'https://www.ssi.gouv.fr/guide/recommandations-de-securite-pour-les-dispositifs-de-linternet-des-objets/';
writeFramework({
  framework: {
    id: 'anssi-iot',
    name: 'IoT Security Recommendations',
    name_nl: 'Recommandations de securite pour les dispositifs de l\'Internet des objets',
    issuing_body: ANSSI, version: '1.0', effective_date: '2021-01-01',
    scope: 'Security recommendations for design, deployment, and management of IoT devices and ecosystems',
    scope_sectors: ['government', 'healthcare', 'energy', 'transport', 'digital_infrastructure'],
    structure_description: 'Recommendations for IoT device hardening, communication security, update mechanisms, data protection, and lifecycle management.',
    source_url: IOT_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('IOT-01', 'Secure by design approach', 'Approche securisee des la conception', 'Integrate security requirements from the design phase of IoT products, not as an afterthought.', 'Integrer les exigences de securite des la phase de conception des produits IoT, non comme un ajout posterieur.', 'Conception', null, '8.25', IOT_URL),
    c('IOT-02', 'Minimal functionality principle', 'Principe de fonctionnalite minimale', 'IoT devices shall only include the features and services necessary for their intended function. Disable all others.', 'Les dispositifs IoT ne doivent inclure que les fonctionnalites et services necessaires a leur fonction prevue. Desactiver tous les autres.', 'Conception', null, '8.9', IOT_URL),
    c('IOT-03', 'Unique device credentials', 'Identifiants uniques par dispositif', 'Each IoT device shall have unique credentials. No shared default passwords across device models.', 'Chaque dispositif IoT doit avoir des identifiants uniques. Pas de mots de passe par defaut partages entre les modeles de dispositifs.', 'Authentification', null, '5.17', IOT_URL),
    c('IOT-04', 'Secure boot mechanism', 'Mecanisme de demarrage securise', 'Implement secure boot to verify firmware integrity at startup and prevent execution of tampered firmware.', 'Mettre en oeuvre le demarrage securise pour verifier l\'integrite du micrologiciel au demarrage et empecher l\'execution de micrologiciels alteres.', 'Integrite du dispositif', null, '8.9', IOT_URL),
    c('IOT-05', 'Encrypted communications', 'Communications chiffrees', 'All IoT device communications shall be encrypted using TLS 1.2+ or DTLS with mutual authentication.', 'Toutes les communications des dispositifs IoT doivent etre chiffrees en utilisant TLS 1.2+ ou DTLS avec authentification mutuelle.', 'Communications', null, '8.24', IOT_URL),
    c('IOT-06', 'Secure firmware update mechanism', 'Mecanisme de mise a jour securise du micrologiciel', 'Implement authenticated and encrypted over-the-air (OTA) update mechanisms with rollback capability.', 'Mettre en oeuvre des mecanismes de mise a jour a distance (OTA) authentifies et chiffres avec capacite de retour en arriere.', 'Mises a jour', null, '8.8', IOT_URL),
    c('IOT-07', 'Data minimization on device', 'Minimisation des donnees sur le dispositif', 'IoT devices shall collect and store only the data necessary for their function, in accordance with RGPD principles.', 'Les dispositifs IoT ne doivent collecter et stocker que les donnees necessaires a leur fonction, conformement aux principes du RGPD.', 'Protection des donnees', null, '5.34', IOT_URL),
    c('IOT-08', 'IoT network segmentation', 'Segmentation du reseau IoT', 'IoT devices shall be placed on dedicated, segmented network zones isolated from corporate networks.', 'Les dispositifs IoT doivent etre places sur des zones reseau dediees et segmentees, isolees des reseaux d\'entreprise.', 'Reseau', null, '8.22', IOT_URL),
    c('IOT-09', 'Physical tamper protection', 'Protection contre la falsification physique', 'IoT devices deployed in uncontrolled environments shall include tamper detection or tamper-evident mechanisms.', 'Les dispositifs IoT deployes dans des environnements non controles doivent inclure des mecanismes de detection ou d\'evidence de falsification.', 'Securite physique', null, '7.4', IOT_URL),
    c('IOT-10', 'End-of-life security management', 'Gestion de la securite en fin de vie', 'Define and communicate the security support period. Ensure secure data erasure and decommissioning procedures.', 'Definir et communiquer la periode de support de securite. Assurer des procedures d\'effacement securise des donnees et de mise hors service.', 'Cycle de vie', null, '8.10', IOT_URL),
    c('IOT-11', 'IoT device inventory and monitoring', 'Inventaire et surveillance des dispositifs IoT', 'Maintain a complete inventory of all IoT devices and monitor their health, firmware version, and network behavior.', 'Maintenir un inventaire complet de tous les dispositifs IoT et surveiller leur sante, version de micrologiciel et comportement reseau.', 'Operations', null, '5.9', IOT_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 14. ANSSI System Segmentation Recommendations
// ============================================================
const SEG_URL = 'https://www.ssi.gouv.fr/guide/recommandations-pour-la-mise-en-place-de-cloisonnement-systeme/';
writeFramework({
  framework: {
    id: 'anssi-cloisonnement',
    name: 'System Segmentation Recommendations',
    name_nl: 'Recommandations pour la mise en place de cloisonnement systeme',
    issuing_body: ANSSI, version: '1.0', effective_date: '2017-12-01',
    scope: 'Recommendations for implementing system-level segmentation to contain security incidents and limit lateral movement',
    scope_sectors: ['government', 'energy', 'telecom', 'digital_infrastructure'],
    structure_description: 'Recommendations for host-based segmentation, container isolation, virtualization security, application sandboxing, and privilege separation.',
    source_url: SEG_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('CLOIS-01', 'Identify segmentation boundaries', 'Identifier les frontieres de cloisonnement', 'Analyze the information system to identify natural segmentation boundaries based on data sensitivity and functional domains.', 'Analyser le systeme d\'information pour identifier les frontieres naturelles de cloisonnement basees sur la sensibilite des donnees et les domaines fonctionnels.', 'Principes de cloisonnement', null, '8.22', SEG_URL),
    c('CLOIS-02', 'Micro-segmentation', 'Micro-segmentation', 'Apply micro-segmentation at the workload level using host firewalls, network policies, or SDN to limit east-west traffic.', 'Appliquer la micro-segmentation au niveau des charges de travail en utilisant des pare-feu hotes, des politiques reseau ou le SDN pour limiter le trafic est-ouest.', 'Segmentation reseau', null, '8.22', SEG_URL),
    c('CLOIS-03', 'Container isolation', 'Isolation des conteneurs', 'Containers shall run with minimal privileges, read-only root filesystems, dropped capabilities, and mandatory access control.', 'Les conteneurs doivent fonctionner avec des privileges minimaux, des systemes de fichiers racine en lecture seule, des capacites retirees et un controle d\'acces obligatoire.', 'Isolation applicative', null, '8.9', SEG_URL),
    c('CLOIS-04', 'Virtual machine isolation', 'Isolation des machines virtuelles', 'VMs hosting different security levels shall run on separate hypervisor hosts or use hardware-enforced isolation.', 'Les VM hebergeant des niveaux de securite differents doivent fonctionner sur des hotes hyperviseurs separes ou utiliser l\'isolation renforcee par materiel.', 'Virtualisation', null, '8.22', SEG_URL),
    c('CLOIS-05', 'Application sandboxing', 'Sandboxing applicatif', 'Run high-risk applications (browsers, email clients, document viewers) in sandboxed environments.', 'Executer les applications a haut risque (navigateurs, clients de messagerie, visionneuses de documents) dans des environnements sandboxes.', 'Isolation applicative', null, '8.9', SEG_URL),
    c('CLOIS-06', 'Privilege separation', 'Separation des privileges', 'Apply the principle of least privilege at the system level: separate service accounts, avoid running services as root.', 'Appliquer le principe du moindre privilege au niveau systeme : comptes de service separes, eviter d\'executer des services en tant que root.', 'Privileges', null, '8.2', SEG_URL),
    c('CLOIS-07', 'Mandatory access control', 'Controle d\'acces obligatoire', 'Deploy mandatory access control (SELinux, AppArmor) on critical servers to confine services even if compromised.', 'Deployer le controle d\'acces obligatoire (SELinux, AppArmor) sur les serveurs critiques pour confiner les services meme en cas de compromission.', 'Controle d\'acces', null, '8.3', SEG_URL),
    c('CLOIS-08', 'Monitoring segmentation effectiveness', 'Surveillance de l\'efficacite du cloisonnement', 'Monitor inter-zone traffic to detect segmentation violations and lateral movement attempts.', 'Surveiller le trafic inter-zones pour detecter les violations de cloisonnement et les tentatives de mouvement lateral.', 'Surveillance', null, '8.16', SEG_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 15. ANSSI Cryptographic Agility Recommendations
// ============================================================
const CRYPTO_URL = 'https://www.ssi.gouv.fr/guide/mecanismes-cryptographiques/';
writeFramework({
  framework: {
    id: 'anssi-crypto',
    name: 'Cryptographic Mechanisms and Agility Recommendations',
    name_nl: 'Mecanismes cryptographiques - Regles et recommandations',
    issuing_body: ANSSI, version: '2.04', effective_date: '2021-01-01',
    scope: 'Recommended cryptographic algorithms, key sizes, and agility practices for information protection',
    scope_sectors: ['government', 'healthcare', 'finance', 'energy', 'digital_infrastructure'],
    structure_description: 'Recommendations for symmetric encryption, asymmetric encryption, hash functions, digital signatures, key management, and cryptographic agility planning.',
    source_url: CRYPTO_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('CRYPTO-01', 'Approved symmetric algorithms', 'Algorithmes symetriques approuves', 'Use AES-256 or AES-128 in authenticated mode (GCM, CCM). Avoid DES, 3DES, RC4, and Blowfish.', 'Utiliser AES-256 ou AES-128 en mode authentifie (GCM, CCM). Eviter DES, 3DES, RC4 et Blowfish.', 'Chiffrement symetrique', null, '8.24', CRYPTO_URL),
    c('CRYPTO-02', 'Approved asymmetric algorithms', 'Algorithmes asymetriques approuves', 'Use RSA 2048+ (4096 recommended), ECDSA/ECDH with P-256 or P-384, or Ed25519/X25519.', 'Utiliser RSA 2048+ (4096 recommande), ECDSA/ECDH avec P-256 ou P-384, ou Ed25519/X25519.', 'Chiffrement asymetrique', null, '8.24', CRYPTO_URL),
    c('CRYPTO-03', 'Approved hash functions', 'Fonctions de hachage approuvees', 'Use SHA-256, SHA-384, or SHA-512. Avoid MD5 and SHA-1 for any security-critical purpose.', 'Utiliser SHA-256, SHA-384 ou SHA-512. Eviter MD5 et SHA-1 pour tout usage critique en securite.', 'Fonctions de hachage', null, '8.24', CRYPTO_URL),
    c('CRYPTO-04', 'Key size requirements', 'Exigences de taille de cle', 'Minimum key sizes: AES-128 (symmetric), RSA-2048 (asymmetric), ECDSA P-256 (elliptic curve). Use larger keys for protection beyond 2030.', 'Tailles de cle minimales : AES-128 (symetrique), RSA-2048 (asymetrique), ECDSA P-256 (courbe elliptique). Utiliser des cles plus grandes pour une protection au-dela de 2030.', 'Tailles de cle', null, '8.24', CRYPTO_URL),
    c('CRYPTO-05', 'Random number generation', 'Generation de nombres aleatoires', 'Use cryptographically secure random number generators (CSPRNG) certified or evaluated for all key generation.', 'Utiliser des generateurs de nombres aleatoires cryptographiquement surs (CSPRNG) certifies ou evalues pour toute generation de cle.', 'Generation de cles', null, '8.24', CRYPTO_URL),
    c('CRYPTO-06', 'Key lifecycle management', 'Gestion du cycle de vie des cles', 'Implement formal key lifecycle management: generation, distribution, storage, rotation, revocation, and destruction.', 'Mettre en oeuvre une gestion formelle du cycle de vie des cles : generation, distribution, stockage, rotation, revocation et destruction.', 'Gestion des cles', null, '8.24', CRYPTO_URL),
    c('CRYPTO-07', 'Key storage protection', 'Protection du stockage des cles', 'Store cryptographic keys in hardware security modules (HSM) or secure enclaves. Never store keys in plaintext files.', 'Stocker les cles cryptographiques dans des modules de securite materielle (HSM) ou des enclaves securisees. Ne jamais stocker les cles dans des fichiers en clair.', 'Gestion des cles', null, '8.24', CRYPTO_URL),
    c('CRYPTO-08', 'Cryptographic agility plan', 'Plan d\'agilite cryptographique', 'Maintain a cryptographic agility plan enabling rapid algorithm replacement if an algorithm is compromised or deprecated.', 'Maintenir un plan d\'agilite cryptographique permettant le remplacement rapide d\'algorithme si un algorithme est compromis ou deprecie.', 'Agilite cryptographique', null, '8.24', CRYPTO_URL),
    c('CRYPTO-09', 'Post-quantum readiness', 'Preparedness post-quantique', 'Begin planning for post-quantum cryptography migration. Inventory systems using vulnerable algorithms (RSA, ECDSA) and evaluate hybrid approaches.', 'Commencer a planifier la migration vers la cryptographie post-quantique. Inventorier les systemes utilisant des algorithmes vulnerables (RSA, ECDSA) et evaluer les approches hybrides.', 'Agilite cryptographique', null, '8.24', CRYPTO_URL),
    c('CRYPTO-10', 'Cryptographic inventory', 'Inventaire cryptographique', 'Maintain an inventory of all cryptographic implementations, algorithms, and key sizes used across the organization.', 'Maintenir un inventaire de toutes les implementations cryptographiques, algorithmes et tailles de cle utilises dans l\'organisation.', 'Gouvernance', null, '5.9', CRYPTO_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

// ============================================================
// 16. ANSSI IS Administration Security
// ============================================================
const ADMIN_URL = 'https://www.ssi.gouv.fr/guide/recommandations-relatives-a-ladministration-securisee-des-systemes-dinformation/';
writeFramework({
  framework: {
    id: 'anssi-admin-si',
    name: 'IS Administration Security Recommendations',
    name_nl: 'Recommandations relatives a l\'administration securisee des systemes d\'information',
    issuing_body: ANSSI, version: '3.0', effective_date: '2021-05-01',
    scope: 'Security recommendations for the administration of information systems, covering people, processes, and tools',
    scope_sectors: ['government', 'healthcare', 'finance', 'energy', 'telecom', 'digital_infrastructure'],
    structure_description: 'Recommendations for dedicated administration accounts, administration workstations, administration networks, remote administration, and admin action traceability.',
    source_url: ADMIN_URL, license: 'Public sector publication', language: 'fr',
  },
  controls: [
    c('ADMIN-01', 'Dedicated administration accounts', 'Comptes d\'administration dedies', 'System administration shall use dedicated accounts separate from day-to-day user accounts.', 'L\'administration des systemes doit utiliser des comptes dedies, separes des comptes utilisateurs quotidiens.', 'Comptes d\'administration', null, '8.2', ADMIN_URL),
    c('ADMIN-02', 'MFA for all admin accounts', 'AMF pour tous les comptes d\'administration', 'All administration accounts shall require multi-factor authentication, with hardware tokens for Tier 0.', 'Tous les comptes d\'administration doivent exiger l\'authentification multifacteur, avec des jetons materiels pour le Tier 0.', 'Comptes d\'administration', null, '8.5', ADMIN_URL),
    c('ADMIN-03', 'Privileged access workstations (PAW)', 'Postes d\'administration dedies (PAW)', 'Administration tasks shall be performed from dedicated, hardened workstations used exclusively for administration.', 'Les taches d\'administration doivent etre realisees depuis des postes dedies et durcis, utilises exclusivement pour l\'administration.', 'Postes d\'administration', null, '8.9', ADMIN_URL),
    c('ADMIN-04', 'PAW hardening requirements', 'Exigences de durcissement des PAW', 'Administration workstations shall have full disk encryption, application whitelisting, USB device control, and no internet access.', 'Les postes d\'administration doivent avoir le chiffrement complet du disque, la liste blanche d\'applications, le controle des peripheriques USB et aucun acces internet.', 'Postes d\'administration', null, '8.9', ADMIN_URL),
    c('ADMIN-05', 'Isolated administration network', 'Reseau d\'administration isole', 'Administration traffic shall transit over a physically or logically isolated network with strict access control.', 'Le trafic d\'administration doit transiter par un reseau physiquement ou logiquement isole avec un controle d\'acces strict.', 'Reseau d\'administration', null, '8.22', ADMIN_URL),
    c('ADMIN-06', 'Jump server / bastion host', 'Serveur rebond / bastion', 'All remote administration shall transit through a hardened bastion with session recording, MFA, and break-glass procedures.', 'Toute administration a distance doit transiter par un bastion durci avec enregistrement de session, AMF et procedures de bris de glace.', 'Acces distant', null, '8.22', ADMIN_URL),
    c('ADMIN-07', 'Just-in-time privilege elevation', 'Elevation de privileges juste-a-temps', 'Use just-in-time (JIT) privilege elevation rather than permanent privileged access. Privileges shall be time-limited.', 'Utiliser l\'elevation de privileges juste-a-temps (JIT) plutot que l\'acces privilegie permanent. Les privileges doivent etre limites dans le temps.', 'Gestion des privileges', null, '8.2', ADMIN_URL),
    c('ADMIN-08', 'Admin action logging', 'Journalisation des actions d\'administration', 'All administrative actions shall be logged with user identity, timestamp, action performed, and target system.', 'Toutes les actions administratives doivent etre journalisees avec l\'identite de l\'utilisateur, l\'horodatage, l\'action realisee et le systeme cible.', 'Tracabilite', null, '8.15', ADMIN_URL),
    c('ADMIN-09', 'Session recording for critical admin', 'Enregistrement de session pour l\'administration critique', 'Sessions on critical infrastructure (domain controllers, firewalls, hypervisors) shall be recorded for post-incident analysis.', 'Les sessions sur les infrastructures critiques (controleurs de domaine, pare-feu, hyperviseurs) doivent etre enregistrees pour l\'analyse post-incident.', 'Tracabilite', null, '8.15', ADMIN_URL),
    c('ADMIN-10', 'Emergency break-glass procedures', 'Procedures de bris de glace d\'urgence', 'Document and test emergency break-glass procedures for regaining administrative access when normal channels fail.', 'Documenter et tester les procedures de bris de glace d\'urgence pour retrouver l\'acces administratif lorsque les canaux normaux echouent.', 'Continuite', null, '5.30', ADMIN_URL),
    c('ADMIN-11', 'Admin account lifecycle management', 'Gestion du cycle de vie des comptes d\'administration', 'Implement formal processes for admin account creation, review, suspension, and deletion aligned with HR events.', 'Mettre en oeuvre des processus formels pour la creation, la revue, la suspension et la suppression des comptes d\'administration alignes avec les evenements RH.', 'Comptes d\'administration', null, '5.18', ADMIN_URL),
  ],
  metadata: { ingested_at: NOW, total_controls: 0 },
});

console.log('\nChunk 2 complete: TLS, Logging, Passwords, AD, Architecture, SecDev, WiFi, IoT, Segmentation, Crypto, Admin SI');
