# Coverage -- French Standards MCP

> Last verified: 2026-03-12 | Database version: 0.2.0

This document declares exactly what data the French Standards MCP contains, what it does not contain, and the limitations of each source. It is the contract with users.

---

## What's Included

### ANSSI Core Frameworks

| Source | Authority | Items | Version / Date | Completeness | Refresh |
|--------|-----------|-------|----------------|-------------|---------|
| ANSSI RGS (Referentiel General de Securite) | ANSSI | 86 controls | v2.0 (2014) | Full | Annual |
| ANSSI Guide d'hygiene informatique | ANSSI | 55 controls | v2.0 (2017) | Full | Annual |
| SecNumCloud | ANSSI | 127 controls | v3.2 (2022) | Full | Annual |
| ANSSI EBIOS Risk Manager | ANSSI | 23 controls | v1.0 (2018) | Full | Annual |
| ANSSI PASSI (audit service providers) | ANSSI | 25 controls | v2.1 (2015) | Full | Annual |
| ANSSI PDIS (detection service providers) | ANSSI | 16 controls | v2.0 (2017) | Full | Annual |
| ANSSI PRIS (incident response providers) | ANSSI | 15 controls | v2.0 (2017) | Full | Annual |
| ANSSI Bonnes pratiques (12 rules) | ANSSI | 12 controls | v1.0 (2017) | Full | Annual |

### ANSSI Technical Guides

| Source | Authority | Items | Version / Date | Completeness | Refresh |
|--------|-----------|-------|----------------|-------------|---------|
| ANSSI TLS recommendations | ANSSI | 12 controls | v1.2 (2020) | Full | Annual |
| ANSSI Logging recommendations | ANSSI | 14 controls | v1.0 (2022) | Full | Annual |
| ANSSI Password and MFA recommendations | ANSSI | 12 controls | v2.0 (2021) | Full | Annual |
| ANSSI Active Directory security | ANSSI | 14 controls | v1.0 (2023) | Full | Annual |
| ANSSI Secure architecture | ANSSI | 12 controls | v2.0 (2022) | Full | Annual |
| ANSSI Secure development | ANSSI | 12 controls | v1.1 (2020) | Full | Annual |
| ANSSI WiFi security | ANSSI | 10 controls | v1.0 (2013) | Full | Annual |
| ANSSI IoT security | ANSSI | 11 controls | v1.0 (2021) | Full | Annual |
| ANSSI System segmentation | ANSSI | 8 controls | v1.0 (2017) | Full | Annual |
| ANSSI Cryptographic mechanisms | ANSSI | 10 controls | v2.04 (2021) | Full | Annual |
| ANSSI IS administration security | ANSSI | 11 controls | v3.0 (2021) | Full | Annual |

### Regulatory Frameworks

| Source | Authority | Items | Version / Date | Completeness | Refresh |
|--------|-----------|-------|----------------|-------------|---------|
| LPM - OIV cybersecurity requirements | SGDSN/ANSSI | 16 controls | 2024 | Full | Annual |
| NIS2 French transposition | Republique francaise/ANSSI | 17 controls | 2025 | Full | Annual |
| RGPD technical implementation measures | CNIL | 16 controls | 2024 | Full | Annual |
| II 901 (Diffusion Restreinte protection) | SGDSN | 11 controls | 2015 | Full | Annual |
| DINUM Cloud doctrine | DINUM | 9 controls | 2023 | Full | Annual |
| RGI (Interoperability framework) | DINUM | 6 controls | v2.0 (2016) | Full | Annual |

### Data Protection

| Source | Authority | Items | Version / Date | Completeness | Refresh |
|--------|-----------|-------|----------------|-------------|---------|
| CNIL Guide de la securite des donnees personnelles | CNIL | 54 controls | 2024 | Full | Annual |

### Healthcare

| Source | Authority | Items | Version / Date | Completeness | Refresh |
|--------|-----------|-------|----------------|-------------|---------|
| PGSSI-S (Health IS security policy) | ANS/ANSSI | 41 controls | 2024 | Full | Annual |
| HDS (Health data hosting) | ANS | 38 controls | 2024 | Full | Annual |
| ANS CI-SIS (Health interoperability security) | ANS | 8 controls | 2024 | Full | Annual |

### Financial Sector

| Source | Authority | Items | Version / Date | Completeness | Refresh |
|--------|-----------|-------|----------------|-------------|---------|
| ACPR IT risk requirements | ACPR/Banque de France | 13 controls | 2024 | Full | Annual |
| DORA French implementation | ACPR/AMF | 13 controls | 2025 | Full | Annual |

**Total:** 11 tools, 727 controls/requirements, database built from 31 authoritative French sources.

---

## What's NOT Included

| Gap | Reason | Planned? |
|-----|--------|----------|
| ANSSI PAMS (Prestataires d'Administration et de Maintenance Securisees) | Maintenance provider qualification, not widely applicable | No |
| ANSSI CC (Certification Criteres Communs) | Product evaluation methodology, not a control framework | No |
| IGI 1300 (Protection du secret de la defense nationale) | Classified document -- restricted distribution | No |
| AMF cybersecurite des societes de gestion | Covered partially by DORA and ACPR frameworks | No |
| ARCEP telecom operator requirements | Sector-specific technical regulation, narrow scope | Possible -- v0.3 |
| NF Z42-013 (electronic archiving) | AFNOR commercial standard | No |
| SEGUR du numerique en sante | Program-level requirements, not a control framework | No |
| ISO/IEC 27001:2022 (full standard) | Commercial ISO standard -- reference mappings included via `iso_mapping` field, full text excluded | No |

---

## Limitations

- **ISO mapping is partial.** Not all controls have `iso_mapping` populated. ANSSI RGS, SecNumCloud, and ANSSI technical guides have the most complete ISO 27002:2022 mapping; other frameworks have varying coverage. `get_iso_mapping` only returns controls with an explicit mapping.
- **Snapshot data, not live.** The database is a point-in-time extract. Standards may be updated between database rebuilds. The `check_data_freshness` tool reports the last-fetched date for each source.
- **French as primary language.** All controls have French titles and descriptions (`title_nl`, `description_nl` columns). English translations are provided for all frameworks. When English text is unavailable, the French text is used.
- **No case law or guidance letters.** The database contains normative controls only, not interpretive guidance, CNIL decisions, or ANSSI advisory notes.
- **Sector metadata may be incomplete.** Frameworks are tagged with `scope_sectors` values during ingestion. If a framework's sector coverage is broader than what's tagged, `search_by_sector` may not surface it.
- **Not a legal opinion.** Compliance with these standards is not verified by this tool. The tool provides structured access to control text -- whether a specific system or process meets a control requires qualified assessment.
- **LPM sector-specific annexes.** The LPM-OIV framework covers general requirements applicable to all designated operators. Sector-specific annexes (energy, telecom, transport, etc.) are not individually broken out.

---

## Data Freshness Schedule

All 31 sources are on an annual refresh schedule. Last refresh: 2026-03-12.

To check current freshness status programmatically, call the `check_data_freshness` tool.

The ingestion pipeline (`ingest.yml`) runs on the most frequent source schedule. The `check-updates.yml` workflow runs daily and creates a GitHub issue if any source is overdue.

---

## Regulatory Mapping

This table maps French regulations and laws to the frameworks in this MCP that implement or operationalize them.

| Regulation / Law | Relevant Frameworks | Notes |
|-----------------|---------------------|-------|
| Loi Informatique et Libertes | cnil-securite, cnil-rgpd-technique | Personal data protection -- CNIL is the supervisory authority |
| RGPD / GDPR Article 32 | cnil-securite, cnil-rgpd-technique, anssi-pgssi-s, hds | Technical and organizational security measures for personal data |
| Loi de Programmation Militaire (LPM) | lpm-oiv, anssi-rgs | Mandatory cybersecurity for critical infrastructure operators |
| Directive NIS2 (2022/2555) | nis2-fr | French transposition covering essential and important entities |
| Reglement DORA (2022/2554) | dora-fr, acpr-it | Digital operational resilience for the financial sector |
| Code de la sante publique (L1111-8) | hds, anssi-pgssi-s, ans-ci-sis | Hosting and security of health data |
| Ordonnance n 2005-1516 (echanges electroniques) | anssi-rgs, rgi | Authentication and signature for public sector electronic exchanges |
| Arrete du 14 novembre 2014 (HDS) | hds | Health data hosting certification requirements |
| Decret n 2018-137 (hebergement de donnees de sante) | hds, anssi-pgssi-s | Updated HDS certification process |
| Instruction Interministerielle 901 | ii-901 | Protection of Diffusion Restreinte classified information systems |
| Doctrine Cloud de l'Etat | dinum-cloud, anssi-secnumcloud | Government cloud usage policy and SecNumCloud qualification |

---

## Sector-Specific Coverage

### Government (Etat, collectivites territoriales, etablissements publics)

- **Included:** ANSSI RGS, ANSSI Hygiene, ANSSI Bonnes pratiques, ANSSI technical guides (TLS, logging, passwords, AD, architecture, secure dev, WiFi, IoT, segmentation, crypto, admin SI), ANSSI EBIOS RM, ANSSI PASSI/PDIS/PRIS, LPM-OIV, NIS2-FR, II 901, DINUM Cloud, RGI, CNIL RGPD
- **Remaining gap:** IGI 1300 (classified -- restricted distribution)

### Healthcare (Sante)

- **Included:** PGSSI-S, HDS, ANS CI-SIS, CNIL securite, CNIL RGPD technique, ANSSI technical guides
- **Remaining gap:** SEGUR du numerique en sante (program requirements, not a control framework)

### Financial Services (Banque, assurance)

- **Included:** ACPR IT risk requirements, DORA French implementation, ANSSI SecNumCloud, CNIL securite, CNIL RGPD technique, ANSSI technical guides
- **Remaining gap:** AMF societes de gestion specifics (partially covered by DORA)

### Critical Infrastructure (OIV / Energie / Telecom / Transport)

- **Included:** LPM-OIV, NIS2-FR, ANSSI technical guides, ANSSI PDIS/PRIS
- **Remaining gap:** ARCEP telecom-specific requirements

### Cloud Services (Informatique en nuage)

- **Included:** ANSSI SecNumCloud, DINUM Cloud doctrine
- **No remaining gaps** for cloud-specific controls

### Defence / Classified (Defense / Classifie)

- **Included:** II 901 (Diffusion Restreinte)
- **Remaining gap:** IGI 1300 (restricted distribution)
