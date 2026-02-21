#!/usr/bin/env node

// Suppress all warnings and only output JSON to stdout
process.removeAllListeners('warning');
process.env.NODE_NO_WARNINGS = '1';

// Import and run the MCP server
import('./mcp-server.js');
