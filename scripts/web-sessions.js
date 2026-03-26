#!/usr/bin/env node
const { checkHealth } = require('./api');
const { execFileSync } = require('child_process');
const os = require('os');

(async () => {
  await checkHealth();

  const nets = os.networkInterfaces();
  let ip = 'localhost';
  for (const n of Object.values(nets))
    for (const i of n)
      if (i.family === 'IPv4' && !i.internal) { ip = i.address; break; }

  const url = 'http://localhost:3848/sessions';
  console.log(`Session Browser: http://${ip}:3848/sessions`);
  console.log('15 insight tabs: Chat, Thinking, Agents, Plans, Team, DAG, Files, Git...');

  try { execFileSync('open', [url], { stdio: 'pipe' }); }
  catch { try { execFileSync('xdg-open', [url], { stdio: 'pipe' }); } catch {} }
})();
