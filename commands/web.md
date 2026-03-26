---
allowed-tools: Bash
description: Open the Claude Code web dashboard
---

# /web — Open Web Dashboard

```bash
node -e "
const http = require('http');
const { execFileSync } = require('child_process');
const os = require('os');

function api(path) {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3100' + path, { timeout: 3000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

(async () => {
  const health = await api('/health');
  if (!health?.success) {
    console.log('lm-assist not running. Install: npm install -g lm-assist');
    return;
  }
  const nets = os.networkInterfaces();
  let ip = 'localhost';
  for (const n of Object.values(nets)) for (const i of n) if (i.family === 'IPv4' && !i.internal) { ip = i.address; break; }

  const data = await api('/projects/sessions');
  const sessions = data?.data?.sessions || [];
  const running = sessions.filter(s => s.isRunning).length;
  const total = data?.data?.total || sessions.length;
  const cost = sessions.reduce((a, s) => a + (s.totalCostUsd || 0), 0);

  console.log('Web Dashboard (v' + (health.data?.version || '?') + ')');
  console.log('\u2550'.repeat(40));
  console.log('  Local:  http://localhost:3848');
  console.log('  LAN:    http://' + ip + ':3848');
  console.log('  ' + running + ' running, ' + total + ' total, \$' + cost.toFixed(2));

  try { execFileSync('open', ['http://localhost:3848'], { stdio: 'pipe' }); }
  catch { try { execFileSync('xdg-open', ['http://localhost:3848'], { stdio: 'pipe' }); } catch {} }
})();
"
```

## Output

Present the script output directly.
