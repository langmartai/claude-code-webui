---
allowed-tools: Bash
description: Open web terminal for a Claude Code session
---

# /terminal — Open Web Terminal

Start a web terminal for a running Claude Code session, accessible from any browser.

## Arguments

- No arguments: show available sessions to connect to
- `$ARGUMENTS[0]`: session ID or slug to connect to

## Execution

```bash
node -e "
const http = require('http');
const os = require('os');
const target = process.argv[1] || '';

function api(path, method, body) {
  return new Promise((resolve) => {
    const opts = { hostname: '127.0.0.1', port: 3100, path, method: method || 'GET', timeout: 5000 };
    if (body) opts.headers = { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) };
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

(async () => {
  const health = await api('/health');
  if (!health?.success) {
    console.log('lm-assist API is not running. Start with: lm-assist start');
    return;
  }

  // Get LAN IP
  const nets = os.networkInterfaces();
  let lanIp = 'localhost';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) { lanIp = net.address; break; }
    }
  }

  // Check existing terminals
  const status = await api('/ttyd/status');
  const active = status?.data?.terminals || [];

  if (!target) {
    // Show available sessions
    console.log('Web Terminal');
    console.log('\u2500'.repeat(50));
    if (active.length) {
      console.log('Active terminals:');
      for (const t of active) {
        console.log('  http://' + lanIp + ':' + t.port + '  session:' + (t.sessionId || '').slice(0,12));
      }
    }
    console.log();
    console.log('Running sessions:');
    const data = await api('/projects/sessions');
    if (data?.data?.sessions) {
      const running = data.data.sessions.filter(s => s.isRunning).slice(0, 10);
      if (running.length === 0) {
        console.log('  No running sessions.');
      } else {
        for (const s of running) {
          const name = s.customTitle || s.slug || s.sessionId.slice(0,12);
          const project = (s.projectPath || '').split('/').pop() || '-';
          console.log('  ' + name + '  (' + project + ')  ' + s.sessionId.slice(0,12));
        }
        console.log();
        console.log('To connect: /terminal SESSION_ID_OR_SLUG');
      }
    }
    console.log();
    console.log('Terminal dashboard: http://' + lanIp + ':3848/session-dashboard');
    return;
  }

  // Start terminal for target session
  console.log('Starting web terminal for: ' + target);
  const result = await api('/ttyd/start', 'POST', JSON.stringify({ sessionId: target }));
  if (result?.success) {
    const port = result.data?.port;
    console.log('Terminal ready:');
    console.log('  Local: http://localhost:' + port);
    console.log('  LAN:   http://' + lanIp + ':' + port);
  } else {
    console.log('Failed: ' + (result?.error?.message || 'unknown error'));
    console.log('Open the session dashboard instead: http://' + lanIp + ':3848/session-dashboard');
  }
})();
" -- "$ARGUMENTS"
```

## Output

Present the script output directly.
