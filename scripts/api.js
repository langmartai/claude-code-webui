/**
 * Shared API helper for claude-code-multisession scripts.
 * All scripts use this to call the lm-assist API.
 */
const http = require('http');
const PORT = 3100;

function api(path, method, body) {
  return new Promise((resolve) => {
    const opts = { hostname: '127.0.0.1', port: PORT, path, method: method || 'GET', timeout: 5000 };
    if (body) {
      const payload = typeof body === 'string' ? body : JSON.stringify(body);
      opts.headers = { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) };
      body = payload;
    }
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(null); } });
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
  line: (n) => '\u2500'.repeat(n || 95),
  dline: (n) => '\u2550'.repeat(n || 95),
};

module.exports = { api, checkHealth, fmt, PORT };
