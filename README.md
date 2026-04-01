# French Standards MCP

[![npm version](https://img.shields.io/npm/v/@ansvar/french-standards-mcp)](https://www.npmjs.com/package/@ansvar/french-standards-mcp)
[![CI](https://github.com/Ansvar-Systems/french-standards-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/Ansvar-Systems/french-standards-mcp/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-ansvar.ai%2Fmcp-blue)](https://ansvar.ai/mcp)

Structured access to 31 French government cybersecurity standards and regulatory frameworks: ANSSI (RGS, SecNumCloud, EBIOS, PASSI, PDIS, PRIS, and 11 technical guides), CNIL (data security and RGPD), LPM-OIV, NIS2, DORA, ACPR, healthcare (PGSSI-S, HDS, CI-SIS), defence (II 901), and government digital (DINUM Cloud, RGI). 727 controls, bilingual French/English, FTS search, ISO 27002:2022 cross-references, and sector-based filtering.

Part of the [Ansvar MCP Network](https://ansvar.ai/mcp) -- specialist MCP servers for compliance and security intelligence.

---

## Quick Start

### Remote endpoint (no installation)

Add to your MCP client config:

```json
{
  "mcpServers": {
    "french-standards": {
      "url": "https://french-standards-mcp.vercel.app/mcp"
    }
  }
}
```

### Local (stdio via npx)

**Claude Desktop** -- edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "french-standards": {
      "command": "npx",
      "args": ["-y", "@ansvar/french-standards-mcp"]
    }
  }
}
```

**Cursor** -- edit `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "french-standards": {
      "command": "npx",
      "args": ["-y", "@ansvar/french-standards-mcp"]
    }
  }
}
```

**VS Code / GitHub Copilot** -- add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "french-standards": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@ansvar/french-standards-mcp"]
    }
  }
}
```

---


### Public Endpoint (Streamable HTTP)

Connect from any MCP client (Claude Desktop, ChatGPT, Cursor, VS Code, GitHub Copilot):

```
https://mcp.ansvar.eu/standards-fr/mcp
```

**Claude Code:**
```bash
claude mcp add standards-fr --transport http https://mcp.ansvar.eu/standards-fr/mcp
```

**Claude Desktop / Cursor** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "standards-fr": {
      "type": "url",
      "url": "https://mcp.ansvar.eu/standards-fr/mcp"
    }
  }
}
```

No authentication required. See [all Ansvar MCP endpoints](https://github.com/Ansvar-Systems/Ansvar-Architecture-Documentation/blob/main/docs/mcp-remote-access.md).
## What's Included

### ANSSI Core (8 frameworks, 359 controls)

| Source | Items |
|--------|-------|
| RGS (Referentiel General de Securite) | 86 |
| Guide d'hygiene informatique (42 mesures) | 55 |
| SecNumCloud v3.2 | 127 |
| EBIOS Risk Manager | 23 |
| PASSI (audit service providers) | 25 |
| PDIS (detection service providers) | 16 |
| PRIS (incident response providers) | 15 |
| Bonnes pratiques de l'informatique (12 rules) | 12 |

### ANSSI Technical Guides (11 guides, 126 controls)

TLS, Logging, Password/MFA, Active Directory, Secure Architecture, Secure Development, WiFi, IoT, System Segmentation, Cryptographic Mechanisms, IS Administration Security.

### Regulatory (6 frameworks, 75 controls)

| Source | Authority | Items |
|--------|-----------|-------|
| LPM-OIV (critical infrastructure) | SGDSN/ANSSI | 16 |
| NIS2 French transposition | ANSSI | 17 |
| RGPD technical measures | CNIL | 16 |
| II 901 (Diffusion Restreinte) | SGDSN | 11 |
| DINUM Cloud doctrine | DINUM | 9 |
| RGI (Interoperability) | DINUM | 6 |

### Data Protection, Healthcare, Finance (6 frameworks, 167 controls)

| Source | Authority | Items |
|--------|-----------|-------|
| CNIL Guide de la securite des donnees personnelles | CNIL | 54 |
| PGSSI-S (health IS security) | ANS | 41 |
| HDS (health data hosting) | ANS | 38 |
| ANS CI-SIS (health interoperability) | ANS | 8 |
| ACPR IT risk requirements | ACPR/Banque de France | 13 |
| DORA French implementation | ACPR/AMF | 13 |

**Total:** 727 controls across 31 frameworks.

For full coverage details, see [COVERAGE.md](COVERAGE.md).

---

## What's NOT Included

| Gap | Status |
|-----|--------|
| IGI 1300 (classified information protection) | Not planned -- restricted distribution document |
| ANSSI PAMS (maintenance providers) | Not planned -- narrow scope |
| ARCEP telecom operator requirements | Possible v0.3 |
| NF Z42-013 (electronic archiving) | Not planned -- AFNOR commercial standard |
| ISO/IEC 27001:2022 full text | Excluded -- commercial ISO license; ISO cross-references available via `get_iso_mapping` |

For the complete gap list, see [COVERAGE.md -- What's NOT Included](COVERAGE.md#whats-not-included).

---

## Available Tools

| Tool | Category | Description |
|------|----------|-------------|
| `search_controls` | Search | Full-text search across all 31 frameworks. Returns controls ranked by FTS5 relevance. |
| `search_by_sector` | Search | Returns frameworks for a sector (`government`, `healthcare`, `finance`, etc.), optionally filtered by keyword. |
| `get_control` | Lookup | Full record for a single control: bilingual description, implementation guidance, ISO mapping. |
| `get_framework` | Lookup | Metadata for a framework: issuing body, version, control count, category breakdown. |
| `list_controls` | Lookup | All controls in a framework, filterable by category. Paginated. |
| `compare_controls` | Comparison | Side-by-side comparison of the same topic across 2-4 frameworks. |
| `get_iso_mapping` | Comparison | All French controls mapped to a given ISO 27002:2022 control reference. |
| `list_frameworks` | Meta | Lists all frameworks in the database with summary stats. |
| `about` | Meta | Server version, build date, and coverage statistics. |
| `list_sources` | Meta | Data provenance: authority, standard name, retrieval method, license for each source. |
| `check_data_freshness` | Meta | Per-source freshness status against the expected refresh schedule. |

For full parameter documentation, return formats, and examples, see [TOOLS.md](TOOLS.md).

---

## Data Sources & Freshness

All 31 sources refreshed: 2026-03-12. Refresh schedule: Annual for all sources.

The `ingest.yml` workflow runs automatically on the most frequent source schedule. The `check-updates.yml` workflow runs daily and creates a GitHub issue if any source is overdue.

To check freshness at runtime, call `check_data_freshness`. Full source provenance and licenses: [sources.yml](sources.yml).

---

## Security

This repository runs 6-layer automated security scanning on every push and weekly:

| Layer | Tool | What it checks |
|-------|------|----------------|
| Static analysis | CodeQL | Code vulnerabilities |
| SAST | Semgrep | Security anti-patterns |
| Container / dependency scan | Trivy | Known CVEs in dependencies |
| Secret detection | Gitleaks | Leaked credentials |
| Supply chain | OSSF Scorecard | Repository security posture |
| Dependency updates | Dependabot | Automated dependency PRs |

---

## Disclaimer

**THIS TOOL IS NOT PROFESSIONAL ADVICE.**

This MCP provides structured access to French cybersecurity standards sourced from authoritative publications. It is provided for informational and research purposes only.

- Verify critical compliance decisions against the original standards
- Data is a snapshot -- sources update, and there may be a delay between upstream changes and database refresh
- See [DISCLAIMER.md](DISCLAIMER.md) for the full disclaimer and no-warranty statement

---

## Ansvar MCP Network

This server is part of the [Ansvar MCP Network](https://ansvar.ai/mcp) -- 276+ specialist MCP servers covering legislation, compliance frameworks, and cybersecurity standards.

| Category | Servers | Coverage |
|----------|---------|----------|
| Law MCPs | 108 | 119 countries, 668K+ laws |
| EU Regulations | 1 | 61 regulations, 4,054 articles |
| Security frameworks | 1 | 262 frameworks, 1,451 SCF controls |
| Domain-specific | ~48 | CVE, STRIDE, sanctions, OWASP, healthcare, financial, and more |

Browse the full directory at [ansvar.ai/mcp](https://ansvar.ai/mcp).

---

## Development

### Branch strategy

`feature-branch -> PR to dev -> verify on dev -> PR to main -> deploy`

Never push directly to `main`. `main` triggers npm publish and Vercel deployment.

### Setup

```bash
git clone https://github.com/Ansvar-Systems/french-standards-mcp.git
cd french-standards-mcp
npm install
npm run build
npm test
```

### Ingestion

```bash
# Full pipeline: fetch -> diff -> build DB -> update coverage
npm run ingest:full

# Individual steps
npm run ingest:fetch     # Download latest data from upstream sources
npm run ingest:diff      # Check for changes against current DB
npm run build:db         # Rebuild SQLite database
npm run coverage:update  # Regenerate coverage.json and COVERAGE.md

# Check freshness
npm run freshness:check
```

### Pre-deploy verification

```bash
npm run build            # Gate 1: build
npm run lint             # Gate 2: TypeScript strict
npm test                 # Gate 3: unit tests
npm run test:contract    # Gate 4: golden contract tests
sqlite3 data/standards.db "PRAGMA integrity_check;"   # Gate 5: DB integrity
npm run coverage:verify  # Gate 6: coverage consistency
```

---

## License & Data Licenses

**Code:** [Apache-2.0](LICENSE)

**Data licenses by source:**

| Source | License |
|--------|---------|
| ANSSI publications (18 frameworks) | Public sector publication (ssi.gouv.fr) |
| CNIL publications (2 frameworks) | Public sector publication (cnil.fr) |
| ANS publications (3 frameworks) | Public sector publication (esante.gouv.fr) |
| DINUM publications (2 frameworks) | Public sector publication (numerique.gouv.fr) |
| LPM, NIS2, II 901 (3 frameworks) | Public law (Legifrance) |
| ACPR (1 framework) | Public sector publication (banque-france.fr) |
| DORA (1 framework) | EU public law (eur-lex.europa.eu) |
| Republique francaise (1 framework) | Public sector publication |

All data is extracted from publicly available authoritative publications. Zero AI-generated content in the database. See [sources.yml](sources.yml) for complete provenance.
