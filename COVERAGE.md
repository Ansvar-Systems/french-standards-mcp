# Coverage -- French Standards MCP

> Last verified: 2026-03-12 | Database version: 0.1.0

This document declares exactly what data the French Standards MCP contains, what it does not contain, and the limitations of each source. It is the contract with users.

---

## What's Included

| Source | Authority | Items | Version / Date | Completeness | Refresh |
|--------|-----------|-------|----------------|-------------|---------|
| ANSSI RGS (Referentiel General de Securite) | ANSSI | 86 controls | v2.0 (2014) | Full | Annual |
| ANSSI Guide d'hygiene informatique | ANSSI | 55 controls | v2.0 (2017) | Full | Annual |
| SecNumCloud (Prestataires de services d'informatique en nuage) | ANSSI | 127 controls | v3.2 (2022) | Full | Annual |
| PGSSI-S (Politique Generale de Securite des Systemes d'Information de Sante) | ANS/ANSSI | 41 controls | 2021 | Full | Annual |
| CNIL Guide de la securite des donnees personnelles | CNIL | 54 controls | 2024 | Full | Annual |
| HDS (Hebergeurs de Donnees de Sante) | ANS | 38 controls | 2024 | Full | Annual |

**Total:** 11 tools, 401 controls, database built from 6 authoritative French sources.

---

## What's NOT Included

| Gap | Reason | Planned? |
|-----|--------|----------|
| ANSSI EBIOS Risk Manager | Risk assessment methodology, not a control catalog | No |
| ANSSI PASSI (prestataires d'audit de la securite des systemes d'information) | Audit provider qualification standard, not a control framework | No |
| LPM OIV requirements (Loi de Programmation Militaire, Operateurs d'Importance Vitale) | Sector-specific annexes with restricted distribution | Yes -- v0.2 |
| NIS2 French transposition | Law not yet fully transposed as of database build date (2026-03-12) | Yes -- planned once transposition is complete |
| ANSSI PAMS (Prestataires d'Administration et de Maintenance Securisees) | Maintenance provider qualification, not a control catalog | No |
| ANSSI CC (Certification Criteres Communs) | Evaluation methodology for product certification | No |
| ISO/IEC 27001:2022 (full standard) | Commercial ISO standard -- reference mappings included via `iso_mapping` field, full text excluded | No |

---

## Limitations

- **ISO mapping is partial.** Not all controls have `iso_mapping` populated. ANSSI RGS and SecNumCloud have the most complete ISO 27002:2022 mapping; other frameworks have varying coverage. `get_iso_mapping` only returns controls with an explicit mapping.
- **Snapshot data, not live.** The database is a point-in-time extract. Standards may be updated between database rebuilds. The `check_data_freshness` tool reports the last-fetched date for each source.
- **French as primary language.** All controls have French titles and descriptions (`title_nl`, `description_nl` columns). English translations are provided for all frameworks. When English text is unavailable, the French text is used.
- **No case law or guidance letters.** The database contains normative controls only, not interpretive guidance, CNIL decisions, or ANSSI advisory notes.
- **Sector metadata may be incomplete.** Frameworks are tagged with `scope_sectors` values during ingestion. If a framework's sector coverage is broader than what's tagged, `search_by_sector` may not surface it.
- **Not a legal opinion.** Compliance with these standards is not verified by this tool. The tool provides structured access to control text -- whether a specific system or process meets a control requires qualified assessment.

---

## Data Freshness Schedule

| Source | Refresh Schedule | Last Refresh | Next Expected |
|--------|-----------------|-------------|---------------|
| ANSSI RGS | Annual | 2026-03-12 | 2027-01-01 |
| ANSSI Guide d'hygiene | Annual | 2026-03-12 | 2027-01-01 |
| SecNumCloud | Annual | 2026-03-12 | 2027-01-01 |
| PGSSI-S | Annual | 2026-03-12 | 2027-01-01 |
| CNIL Guide securite | Annual | 2026-03-12 | 2027-01-01 |
| HDS | Annual | 2026-03-12 | 2027-01-01 |

To check current freshness status programmatically, call the `check_data_freshness` tool.

The ingestion pipeline (`ingest.yml`) runs on the most frequent source schedule. The `check-updates.yml` workflow runs daily and creates a GitHub issue if any source is overdue.

---

## Regulatory Mapping

This table maps French regulations and laws to the frameworks in this MCP that implement or operationalize them.

| Regulation / Law | Relevant Frameworks | Notes |
|-----------------|---------------------|-------|
| Loi Informatique et Libertes (as amended by RGPD transposition) | CNIL Guide securite | Personal data protection -- CNIL is the supervisory authority |
| RGPD / GDPR Article 32 | CNIL Guide securite, PGSSI-S, HDS | Technical and organizational security measures for personal data |
| Code de la sante publique (L1111-8) | HDS, PGSSI-S | Hosting and security of health data |
| Loi de Programmation Militaire (LPM) | ANSSI RGS (for OIV) | Security obligations for critical infrastructure operators |
| Ordonnance n 2005-1516 (echanges electroniques) | ANSSI RGS | Authentication and signature requirements for public sector electronic exchanges |
| Arrete du 14 novembre 2014 (HDS) | HDS | Health data hosting certification requirements |
| Decret n 2018-137 (hebergement de donnees de sante) | HDS, PGSSI-S | Updated HDS certification process |

---

## Sector-Specific Coverage

### Government (Etat, collectivites territoriales, etablissements publics)

- **Included:** ANSSI RGS (full), ANSSI Guide d'hygiene
- **Gap:** LPM OIV-specific annexes not included
- **Gap:** ANSSI PRIS (prestataires de reponse aux incidents) guidance not included

### Healthcare (Sante)

- **Included:** PGSSI-S, HDS, CNIL Guide securite (data protection overlay)
- **Gap:** SÉGUR du numerique en sante requirements not included
- **Gap:** Espace numerique de sante (ENS) specific technical standards not included

### Financial Services (Banque, assurance)

- **Included:** ANSSI SecNumCloud (for cloud services used by financial institutions), CNIL Guide securite
- **Gap:** ACPR (Autorite de controle prudentiel et de resolution) specific guidance not included
- **Gap:** DORA French implementation measures not included

### Cloud Services (Informatique en nuage)

- **Included:** ANSSI SecNumCloud (full)
- **Gap:** SecNumCloud qualification process documentation not included (process, not controls)
