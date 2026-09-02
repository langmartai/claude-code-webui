#!/usr/bin/env node
/**
 * Claude Code WebUI — SessionStart hook
 * Quick health check. Suggests setup if API is down.
 */
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Dev-aware port: when devModeEnabled in ~/.claude-code-config.json, check the
// dev API (:3200) instead of prod (:3100).
let port = 3100;
try {
  const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.claude-code-config.json'), 'utf-8'));
  if (cfg.devModeEnabled === true) port = 3200;
} catch { /* prod default */ }

const req = http.get(`http://127.0.0.1:${port}/health`, { timeout: 2000 }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try { if (!JSON.parse(data).success) console.log('lm-assist API unhealthy. Run: npm install -g lm-assist && lm-assist start'); }
    catch { /* silent */ }
  });
});
req.on('error', () => console.log('Web dashboard needs lm-assist. Run: npm install -g lm-assist && lm-assist start'));
req.on('timeout', () => req.destroy());
