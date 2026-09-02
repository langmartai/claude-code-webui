#!/usr/bin/env node
const { api, checkHealth, WEB_PORT } = require('./api');
const { execFileSync } = require('child_process');
const os = require('os');

(async () => {
  await checkHealth();

  const nets = os.networkInterfaces();
  let ip = 'localhost';
  for (const n of Object.values(nets))
    for (const i of n)
      if (i.family === 'IPv4' && !i.internal) { ip = i.address; break; }

  const url = `http://localhost:${WEB_PORT}/sessions`;
  console.log(`Session Browser: http://${ip}:${WEB_PORT}/sessions`);
  console.log('Insight tabs: Chat, Tasks, Plans, Agents, Skills, Commands, Team, Files, Thinking, Git, DB...');
  console.log('The Agents tab shows each subagent\'s real type (e.g. Explore) as of lm-assist v0.2.1.');

  // Quick fleet-health read before the browser opens: sessions stalled on
  // server/network errors are auto-resumed; a model usage limit triggers a
  // verified /model fallback.
  const stalls = await api('/monitor/stalls');
  if (stalls?.data?.enabled && stalls.data.sessions?.length) {
    const gaveUp = stalls.data.gaveUp || 0;
    console.log(`Auto-resume: ${stalls.data.sessions.length} stalled session(s) tracked${gaveUp ? `, ${gaveUp} gave up` : ''}`);
  }

  try { execFileSync('open', [url], { stdio: 'pipe' }); }
  catch { try { execFileSync('xdg-open', [url], { stdio: 'pipe' }); } catch {} }
})();
