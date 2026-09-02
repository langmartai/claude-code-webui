#!/usr/bin/env node
/**
 * claude-code-webui — Web dashboard for Claude Code
 * Shell wrapper around lm-assist.
 */
const { execFileSync } = require('child_process');
const args = process.argv.slice(2);

// Default command is 'start' if none provided
if (args.length === 0) args.push('start');

try {
  execFileSync('lm-assist', args, { stdio: 'inherit' });
} catch (e) {
  if (e.code === 'ENOENT') {
    console.error('lm-assist is not installed. Run: npm install -g lm-assist');
  }
  process.exit(e.status || 1);
}
