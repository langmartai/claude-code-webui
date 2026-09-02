/**
 * Shared API helper for claude-code-webui scripts.
 * All scripts use this to call the lm-assist API.
 */
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Dev-aware ports: when devModeEnabled in ~/.claude-code-config.json, talk to the
// dev instance (API :3200 / Web :3948) instead of prod (:3100 / :3848).
function devMode() {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.claude-code-config.json'), 'utf-8'));
    return cfg.devModeEnabled === true;
  } catch { return false; }
}
const DEV = devMode();
const PORT = DEV ? 3200 : 3100;
const WEB_PORT = DEV ? 3948 : 3848;

// lm-assist gates every endpoint except /health behind a rotating API token
// (~/.lm-assist/api-token, or $LM_ASSIST_DATA_DIR/api-token). Without it,
// requests get 401 even from localhost.
function apiToken() {
  try {
    const dataDir = process.env.LM_ASSIST_DATA_DIR || path.join(os.homedir(), '.lm-assist');
    return fs.readFileSync(path.join(dataDir, 'api-token'), 'utf8').trim();
  } catch { return ''; }
}

// Warn once (stderr) instead of silently rendering zeros when auth fails.
let warnedUnauthorized = false;
function warnUnauthorized() {
  if (warnedUnauthorized) return;
  warnedUnauthorized = true;
  const dataDir = process.env.LM_ASSIST_DATA_DIR || path.join(os.homedir(), '.lm-assist');
  console.error(`Warning: lm-assist rejected the API token (expected at ${path.join(dataDir, 'api-token')}); counts may be missing.`);
}

function api(apiPath, method, body) {
  return new Promise((resolve) => {
    const opts = { hostname: '127.0.0.1', port: PORT, path: apiPath, method: method || 'GET', timeout: 5000 };
    opts.headers = {};
    const token = apiToken();
    if (token) opts.headers['x-api-key'] = token;
    if (body) {
      const payload = typeof body === 'string' ? body : JSON.stringify(body);
      opts.headers['Content-Type'] = 'application/json';
      opts.headers['Content-Length'] = Buffer.byteLength(payload);
      body = payload;
    }
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed?.success === false && parsed?.error?.code === 'UNAUTHORIZED') warnUnauthorized();
          resolve(parsed);
        } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    if (body) req.write(body);
    req.end();
  });
}

async function checkHealth() {
  const h = await api('/health');
  if (!h?.success) {
    console.log('lm-assist API is not running.');
    console.log('Start with: npm install -g lm-assist && lm-assist start');
    process.exit(0);
  }
  return h.data;
}

const fmt = {
  hdr: (s, n) => (s + ' '.repeat(n)).slice(0, n),
  rgt: (s, n) => (' '.repeat(n) + s).slice(-n),
  cost: (v) => v ? '$' + v.toFixed(2) : '-',
  line: (n) => '─'.repeat(n || 95),
  dline: (n) => '═'.repeat(n || 95),
};

module.exports = { api, checkHealth, fmt, PORT, WEB_PORT };
