# Tools -- French Standards MCP

> 11 tools across 4 categories: search, lookup, comparison, and meta

---

## Search Tools

### `search_controls`

Full-text search across all French cybersecurity controls using FTS5. Returns controls ranked by relevance from the combined ANSSI RGS, ANSSI Hygiene, SecNumCloud, PGSSI-S, CNIL, and HDS datasets. Use this when you need to find controls by keyword without knowing the framework.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | Yes | Search terms, e.g. `"authentification"`, `"chiffrement"`, `"incident response"` |
| `framework_id` | string | No | Restrict results to one framework, e.g. `"anssi-rgs"`, `"cnil-securite"`, `"hds"` |
| `category` | string | No | Filter by control category, e.g. `"Authentification"`, `"Chiffrement"` |
| `language` | `"fr"` \| `"en"` | No | Preferred display language for titles. Defaults to French (`"fr"`). Controls without an English title always show French. |
| `limit` | integer | No | Maximum results to return. Default: `20`. |
| `offset` | integer | No | Pagination offset. Default: `0`. |

**Returns:** A Markdown table with columns `ID`, `Control`, `Title`, `Framework`, `Category`, `Level` plus a `total_results` count above the table.

**Example:**
```
"Which French controls address password management?"
-> search_controls({ query: "mot de passe", language: "fr" })

"Find ANSSI RGS controls on encryption"
-> search_controls({ query: "chiffrement", framework_id: "anssi-rgs" })
```

**Data sources:** All 6 frameworks (anssi-rgs, anssi-hygiene, anssi-secnumcloud, anssi-pgssi-s, cnil-securite, hds)

**Limitations:**
- FTS5 phrase search: special characters (`"`, `^`, `*`, `-`, `:`) are stripped from the query before matching
- Searches bilingual content -- a French-only query may miss English-only descriptions in the same control
- Does not support wildcard or regex patterns
- Relevance ranking is FTS5 rank, not semantic similarity

---

### `search_by_sector`

Returns frameworks applicable to a specific sector, optionally filtered by a keyword query within those frameworks. Use this to scope a compliance review to a particular industry before drilling into controls.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `sector` | string | Yes | One of: `government`, `healthcare`, `finance`, `energy`, `telecom`, `transport`, `education`, `cloud` |
| `query` | string | No | Optional keyword search within the sector's frameworks |

**Returns:** A Markdown table of matching frameworks (ID, name, issuing body, version, control count, language). If `query` is provided, a second table lists matching controls within those frameworks (top 10 per framework, ranked by FTS5 relevance).

**Example:**
```
"What security frameworks apply to French healthcare organizations?"
-> search_by_sector({ sector: "healthcare" })

"Which healthcare controls cover authentication?"
-> search_by_sector({ sector: "healthcare", query: "authentification" })
```

**Data sources:** Framework `scope_sectors` metadata + FTS5 on controls

**Limitations:**
- Sector taxonomy is fixed to the values listed above
- A framework appears only if it was ingested with sector metadata -- frameworks without `scope_sectors` are not returned
- Query within sector does not cross-search frameworks not assigned to that sector

---

## Lookup Tools

### `get_control`

Retrieves the full record for a single control by its database ID. Returns the complete bilingual description, implementation guidance, verification guidance, ISO 27002 mapping, and source URL. Use this after `search_controls` or `list_controls` to get the full text of a specific control.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `control_id` | string | Yes | The control's database ID, e.g. `"anssi-rgs:AUTH-01"`, `"anssi-hygiene:1"`, `"cnil-securite:CNIL-01"` |

**Returns:** A structured Markdown document with control number, French and English titles, framework and issuing body, category, level, ISO 27002 mapping, French description (`Description (FR)`), English description, implementation guidance, verification guidance, and source URL.

**Example:**
```
"Give me the full text of ANSSI RGS control AUTH-01"
-> get_control({ control_id: "anssi-rgs:AUTH-01" })
```

**Data sources:** `controls` table joined to `frameworks`

**Limitations:**
- Returns a `NO_MATCH` error if the ID does not exist -- use `search_controls` or `list_controls` to discover valid IDs
- Not all controls have English descriptions -- French is always present

---

### `get_framework`

Returns metadata for a single framework: issuing body, version, effective date, language, scope, control count, category breakdown, and source URL. Use this to understand what a framework covers before listing its controls.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `framework_id` | string | Yes | Framework identifier, e.g. `"anssi-rgs"`, `"anssi-hygiene"`, `"anssi-secnumcloud"`, `"anssi-pgssi-s"`, `"cnil-securite"`, `"hds"` |

**Returns:** A Markdown document with framework name (French and English), issuing body, version, language, control count, effective date, sectors, scope description, structure description, license, and a category breakdown table.

**Example:**
```
"What is the ANSSI RGS framework and how many controls does it have?"
-> get_framework({ framework_id: "anssi-rgs" })
```

**Data sources:** `frameworks` table, `controls` aggregate

**Limitations:**
- Does not return the controls themselves -- use `list_controls` to enumerate them
- Sector and scope fields depend on ingestion quality; some frameworks may have incomplete metadata

---

## Comparison Tools

### `list_controls`

Lists all controls in a framework, with optional filtering by category. Returns a paginated table. Use this to browse a complete framework or to enumerate controls within a specific control category.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `framework_id` | string | Yes | Framework identifier, e.g. `"anssi-rgs"`, `"anssi-hygiene"` |
| `category` | string | No | Filter to one category, e.g. `"Authentification"` |
| `language` | `"fr"` \| `"en"` | No | Preferred display language for titles. Defaults to French. |
| `limit` | integer | No | Maximum results. Default: `50`. |
| `offset` | integer | No | Pagination offset. Default: `0`. |

**Returns:** A Markdown table with columns `ID`, `Control`, `Title`, `Category`, `Level` plus a `total_results` count.

**Example:**
```
"List all ANSSI RGS authentication controls"
-> list_controls({ framework_id: "anssi-rgs", category: "Authentification" })

"Show me all ANSSI Hygiene controls"
-> list_controls({ framework_id: "anssi-hygiene" })
```

**Data sources:** `controls` table

**Limitations:**
- Category values must match exactly as stored in the database -- use `get_framework` to see the available categories first
- Default limit of 50 may truncate large frameworks (SecNumCloud has 127 controls)

---

### `compare_controls`

Searches the same keyword query across 2-4 frameworks simultaneously and shows the top 5 matching controls per framework side by side. Use this to compare how different French standards treat the same topic.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | string | Yes | Topic to compare, e.g. `"authentification"`, `"journalisation"`, `"chiffrement"` |
| `framework_ids` | string[] | Yes | 2 to 4 framework IDs, e.g. `["anssi-rgs", "cnil-securite"]` or `["anssi-rgs", "anssi-hygiene", "hds", "cnil-securite"]` |

**Returns:** A Markdown section per framework showing the control number, title, and a 150-character snippet of the French description for up to 5 matching controls.

**Example:**
```
"How do ANSSI RGS and CNIL differ in their approach to authentication?"
-> compare_controls({ query: "authentification", framework_ids: ["anssi-rgs", "cnil-securite"] })

"Compare encryption requirements across ANSSI RGS, SecNumCloud, and CNIL"
-> compare_controls({ query: "chiffrement", framework_ids: ["anssi-rgs", "anssi-secnumcloud", "cnil-securite"] })
```

**Data sources:** FTS5 on `controls` filtered by `framework_id`

**Limitations:**
- Returns at most 5 controls per framework -- not a full comparison of all matching controls
- Snippets are truncated at 150 characters; use `get_control` for full text
- Both frameworks must be in the database; passing an unknown ID silently returns zero results for that framework

---

### `get_iso_mapping`

Returns all French controls that map to a specific ISO 27002:2022 control number. Use this to find which French standards implement a given ISO requirement, or to check French compliance coverage for an ISO audit.

**Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `iso_control` | string | Yes | ISO 27002:2022 control reference, e.g. `"5.15"`, `"8.5"`, `"8.24"` |

**Returns:** A Markdown table grouped by framework, listing each French control mapped to that ISO reference (ID, control number, title).

**Example:**
```
"Which French controls implement ISO 27002 control 8.5 (Secure authentication)?"
-> get_iso_mapping({ iso_control: "8.5" })

"Show me all French framework controls that map to ISO 27002 8.24"
-> get_iso_mapping({ iso_control: "8.24" })
```

**Data sources:** `controls.iso_mapping` field

**Limitations:**
- Only returns controls with an exact `iso_mapping` match -- controls without ISO mapping are not included
- ISO mapping coverage varies by framework: ANSSI RGS and SecNumCloud have extensive mapping; other frameworks have varying coverage
- Does not support partial matches or range queries (e.g. `"5.x"` will not match)

---

## Meta Tools

### `list_frameworks`

Returns a summary table of all frameworks in the database. No parameters required. Use this to discover which frameworks are available before calling `get_framework` or `list_controls`.

**Parameters:** None

**Returns:** A Markdown table listing framework ID, name, issuing body, version, control count, language, and sectors for each framework in the database.

**Example:**
```
"What French cybersecurity frameworks does this MCP cover?"
-> list_frameworks()
```

**Data sources:** `frameworks` table joined to control counts

**Limitations:**
- Lists only frameworks loaded in the current database build -- reflects ingestion coverage
- Sector data may be empty for frameworks ingested without sector metadata

---

### `about`

Returns server metadata: version, category, schema version, database build date, and coverage statistics (framework count, control count, database size). Use this to check the current version and data state of the MCP.

**Parameters:** None

**Returns:** A Markdown document with server name, version, category, schema version, database build date, and a coverage metrics table (frameworks, controls, database size in MB).

**Example:**
```
"What version of the French Standards MCP is running and when was it last updated?"
-> about()
```

**Data sources:** `db_metadata` table

**Limitations:**
- Database build date reflects when the SQLite database was compiled, not the publication date of the source standards
- Call `check_data_freshness` for per-source freshness status

---

### `list_sources`

Returns the data provenance table: for each source, the authority, standard name, retrieval method, and license. Use this to understand where the data comes from before relying on it in a compliance decision.

**Parameters:** None

**Returns:** A Markdown table with columns `ID`, `Authority`, `Standard / Document`, `Retrieval method`, `License`. Includes a disclaimer note about verifying against authoritative sources.

**Example:**
```
"Where does this MCP get its data from, and what are the licenses?"
-> list_sources()
```

**Data sources:** Hardcoded provenance list (sourced from `sources.yml`)

**Limitations:**
- The fallback list is hardcoded; full YAML parsing requires an optional dependency not included in the default build
- Does not show per-source item counts or last-refresh dates -- use `check_data_freshness` for that

---

### `check_data_freshness`

Reports how current each data source is against its expected refresh schedule. Returns a per-source status: `Current`, `Due in N days`, or `OVERDUE (N days)`. Use this to verify the database is not stale before using it for compliance decisions.

**Parameters:** None

**Returns:** A Markdown table with columns `Source`, `Last fetched`, `Refresh window`, `Status`. Includes a summary of any overdue or due-soon sources and instructions to trigger a data update.

**Example:**
```
"Is the French Standards MCP data up to date?"
-> check_data_freshness()
```

**Data sources:** `data/coverage.json` (generated by `npm run coverage:update`)

**Limitations:**
- Returns a "no coverage data" message if `coverage.json` has not been generated yet -- run `npm run coverage:update` after first build
- Status is based on the `last_fetched` date in `coverage.json`, not a live check of upstream sources
- `OVERDUE` status means the data is past its scheduled refresh window, not necessarily that the data has changed

---

## French Cybersecurity Glossary

This glossary covers terms used in French government cybersecurity standards that appear as parameters, category names, or framework identifiers in the tools above.

| Term | Expansion | Meaning |
|------|-----------|---------|
| **ANSSI** | Agence nationale de la securite des systemes d'information | The French national cybersecurity agency, part of the SGDSN (Secretariat general de la defense et de la securite nationale). Issues RGS, Guide d'hygiene, SecNumCloud, and PGSSI-S standards. |
| **RGS** | Referentiel General de Securite | The General Security Framework mandating authentication, encryption, and timestamping for French public sector electronic exchanges. Framework ID: `anssi-rgs`. |
| **SecNumCloud** | Securite Numerique Cloud | ANSSI qualification standard for cloud service providers. Covers infrastructure, operations, and tenant isolation. Framework ID: `anssi-secnumcloud`. |
| **PGSSI-S** | Politique Generale de Securite des Systemes d'Information de Sante | The General Security Policy for Health Information Systems, issued jointly by ANS and ANSSI. Framework ID: `anssi-pgssi-s`. |
| **CNIL** | Commission Nationale de l'Informatique et des Libertes | The French data protection authority. Issues the Guide de la securite des donnees personnelles. Framework ID: `cnil-securite`. |
| **HDS** | Hebergeurs de Donnees de Sante | Health Data Hosting certification. Organizations hosting French health data must be HDS-certified. Framework ID: `hds`. |
| **ANS** | Agence du Numerique en Sante | The French national digital health agency. Co-issues PGSSI-S and oversees HDS certification. |
| **OIV** | Operateurs d'Importance Vitale | Operators of vital importance -- critical infrastructure operators subject to LPM security requirements. |
| **RGPD** | Reglement General sur la Protection des Donnees | French name for GDPR (General Data Protection Regulation). CNIL is the French supervisory authority. |
| **Homologation** | -- | The French process of formal security approval for an information system, required by RGS for public sector systems. |
