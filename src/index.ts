import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { handleSearchControls } from './tools/search-controls.js';
import { handleGetControl } from './tools/get-control.js';
import { handleListControls } from './tools/list-controls.js';
import { handleGetFramework } from './tools/get-framework.js';
import { handleListFrameworks } from './tools/list-frameworks.js';
import { handleCompareControls } from './tools/compare-controls.js';
import { handleGetIsoMapping } from './tools/get-iso-mapping.js';
import { handleSearchBySector } from './tools/search-by-sector.js';
import { handleAbout } from './tools/about.js';
import { handleListSources } from './tools/list-sources.js';
import { handleCheckDataFreshness } from './tools/check-data-freshness.js';

const server = new McpServer({
  name: 'french-standards-mcp',
  version: '1.0.0',
});

server.tool(
  'search_controls',
  'Search French government cybersecurity and information security controls by keyword (French or English). Covers ANSSI RGS, ANSSI Hygiene, SecNumCloud, PGSSI-S, CNIL Securite, and HDS.',
  {
    query: z.string().describe('Search query in French or English'),
    framework_id: z.string().optional().describe('Filter by framework ID (e.g. "anssi-rgs", "cnil-securite")'),
    category: z.string().optional().describe('Filter by control category'),
    language: z.enum(['fr', 'en']).optional().describe('Language preference for results'),
    limit: z.number().optional().describe('Maximum number of results to return'),
    offset: z.number().optional().describe('Number of results to skip for pagination'),
  },
  async (args) => handleSearchControls(args),
);

server.tool(
  'get_control',
  'Retrieve a specific French security control by its unique ID, including full text, implementation guidance, and framework metadata.',
  {
    control_id: z.string().describe('Unique identifier of the control (e.g. "anssi-rgs:AUTH-01", "anssi-hygiene:1")'),
  },
  async (args) => handleGetControl(args),
);

server.tool(
  'list_controls',
  'List all controls in a specified French security framework, with optional filtering by category or level.',
  {
    framework_id: z.string().describe('Framework to list controls from (e.g. "anssi-rgs", "cnil-securite")'),
    category: z.string().optional().describe('Filter by category within the framework'),
    level: z.string().optional().describe('Filter by control level or tier'),
    language: z.string().optional().describe('Language preference for result labels'),
    limit: z.number().optional().describe('Maximum number of controls to return'),
    offset: z.number().optional().describe('Number of controls to skip for pagination'),
  },
  async (args) => handleListControls(args),
);

server.tool(
  'get_framework',
  'Retrieve metadata for a specific French security framework: name, version, issuing body, scope, and summary statistics.',
  {
    framework_id: z.string().describe('Framework identifier (e.g. "anssi-rgs", "anssi-secnumcloud", "hds")'),
  },
  async (args) => handleGetFramework(args),
);

server.tool(
  'list_frameworks',
  'List all French security and information security frameworks available in this MCP server, including ANSSI RGS, ANSSI Hygiene, SecNumCloud, PGSSI-S, CNIL Securite, and HDS.',
  {},
  async () => handleListFrameworks(),
);

server.tool(
  'compare_controls',
  'Compare how a security topic is addressed across multiple French frameworks simultaneously. Returns matching controls from each specified framework for the given query.',
  {
    query: z.string().describe('Security topic or requirement to compare across frameworks'),
    framework_ids: z.array(z.string()).describe('List of framework IDs to compare (e.g. ["anssi-rgs", "cnil-securite"])'),
  },
  async (args) => handleCompareControls(args),
);

server.tool(
  'get_iso_mapping',
  'Find French framework controls that map to a given ISO 27001/27002 control reference. Returns ANSSI RGS, SecNumCloud, CNIL, and other French controls aligned to the specified ISO control.',
  {
    iso_control: z.string().describe('ISO 27001/27002 control reference (e.g. "A.9.1.1", "8.2")'),
  },
  async (args) => handleGetIsoMapping(args),
);

server.tool(
  'search_by_sector',
  'Search French security controls relevant to a specific sector (e.g. healthcare, finance, government). Optionally narrow results with a keyword query.',
  {
    sector: z.string().describe('Target sector (e.g. "healthcare", "finance", "government", "education")'),
    query: z.string().optional().describe('Optional keyword query to narrow results within the sector'),
  },
  async (args) => handleSearchBySector(args),
);

server.tool(
  'about',
  'Return a description of this MCP server: what it covers, which French security frameworks are included, data sources, and usage guidance.',
  {},
  async () => handleAbout(),
);

server.tool(
  'list_sources',
  'List all primary data sources used in this MCP server, including source URLs, issuing organisations, version numbers, and last-updated dates for each French security framework.',
  {},
  async () => handleListSources(),
);

server.tool(
  'check_data_freshness',
  'Check whether the embedded French security framework data is current. Returns the last-updated date for each framework and flags any sources that may be outdated.',
  {},
  async () => handleCheckDataFreshness(),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Fatal error starting french-standards-mcp:', err);
  process.exit(1);
});
