#!/usr/bin/env node
/**
 * Claude Code WebUI — SessionStart hook
 * Quick health check. Suggests setup if API is down.
 */
const http = require('http');
const req = http.get('http://127.0.0.1:3100/health', { timeout: 2000 }, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try { if (!JSON.parse(data).success) console.log('lm-assist API unhealthy. Run: npm install -g lm-assist && lm-assist start'); }
    catch { /* silent */ }
  });
});
req.on('error', () => console.log('Web dashboard needs lm-assist. Run: npm install -g lm-assist && lm-assist start'));
req.on('timeout', () => req.destroy());
