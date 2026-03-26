#!/usr/bin/env node
const { api, checkHealth, fmt } = require('./api');
const { execFileSync } = require('child_process');
const os = require('os');

(async () => {
  const health = await checkHealth();
  const v = health.version || '?';

  // Get LAN IP
  const nets = os.networkInterfaces();
  let ip = 'localhost';
  for (const n of Object.values(nets))
    for (const i of n)
      if (i.family === 'IPv4' && !i.internal) { ip = i.address; break; }

  const data = await api('/projects/sessions');
  const sessions = data?.data?.sessions || [];
  const running = sessions.filter(s => s.isRunning).length;
  const total = data?.data?.total || sessions.length;
  const cost = sessions.reduce((a, s) => a + (s.totalCostUsd || 0), 0);

  console.log(`Web Dashboard (v${v})`);
  console.log(fmt.dline(40));
  console.log(`  Local:  http://localhost:3848`);
  console.log(`  LAN:    http://${ip}:3848`);
  console.log(`  ${running} running, ${total} total, ${fmt.cost(cost)}`);

  try { execFileSync('open', ['http://localhost:3848'], { stdio: 'pipe' }); }
  catch { try { execFileSync('xdg-open', ['http://localhost:3848'], { stdio: 'pipe' }); } catch {} }
})();
