---
allowed-tools: Bash
description: Open the web dashboard in your browser
---

# /dashboard — Open Web Dashboard

Open the lm-assist web dashboard for visual session browsing and management.

## Execution

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
    console.log('lm-assist API is not running.');
    console.log('Start with: npm install -g lm-assist && lm-assist start');
    return;
  }

  const v = health.data?.version || '?';

  // Get LAN IP
  const nets = os.networkInterfaces();
  let lanIp = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) { lanIp = net.address; break; }
    }
  }

  console.log('Claude Code Web Dashboard (v' + v + ')');
  console.log('\u2550'.repeat(45));
  console.log('  Local:  http://localhost:3848');
  console.log('  LAN:    http://' + lanIp + ':3848');
  console.log('  Mobile: http://' + lanIp + ':3848 (responsive)');
  console.log();

  // Session counts
  const data = await api('/projects/sessions');
  if (data?.data?.sessions) {
    const sessions = data.data.sessions;
    const running = sessions.filter(s => s.isRunning).length;
    const total = data.data.total || sessions.length;
    const cost = sessions.reduce((a, s) => a + (s.totalCostUsd || 0), 0);
    console.log('  Sessions: ' + running + ' running, ' + total + ' total');
    console.log('  Cost:     \$' + cost.toFixed(2));
  }

  console.log();
  console.log('Pages:');
  console.log('  /sessions           Session browser + 15 insight tabs');
  console.log('  /session-dashboard  Multi-terminal live view');
  console.log('  /knowledge          Knowledge base browser');
  console.log('  /tasks              Task kanban board');
  console.log('  /settings           Configuration');

  // Try to open
  try {
    execFileSync('open', ['http://localhost:3848'], { stdio: 'pipe' });
    console.log(); console.log('Opened in browser.');
  } catch {
    try {
      execFileSync('xdg-open', ['http://localhost:3848'], { stdio: 'pipe' });
      console.log(); console.log('Opened in browser.');
    } catch {
      console.log(); console.log('Open the URL above in your browser.');
    }
  }
})();
"
```

## Output

Present the script output directly.
