---
allowed-tools: Bash
description: Open task kanban board in web dashboard
---

# /web-tasks — Open Task Board

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

  const url = 'http://localhost:3848/tasks';
  console.log('Task Board: http://' + ip + ':3848/tasks');

  const data = await api('/task-store/tasks');
  if (data?.data?.tasks) {
    const tasks = data.data.tasks;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const progress = tasks.filter(t => t.status === 'in_progress').length;
    const done = tasks.filter(t => t.status === 'completed').length;
    console.log('  Pending: ' + pending + '  In Progress: ' + progress + '  Done: ' + done);
  }

  try { execFileSync('open', [url], { stdio: 'pipe' }); }
  catch { try { execFileSync('xdg-open', [url], { stdio: 'pipe' }); } catch {} }
})();
"
```

## Output

Present the script output directly.
