#!/usr/bin/env node
const { api, checkHealth, fmt, WEB_PORT } = require('./api');
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
  console.log(`  Local:  http://localhost:${WEB_PORT}`);
  console.log(`  LAN:    http://${ip}:${WEB_PORT}`);
  console.log(`  ${running} running, ${total} total, ${fmt.cost(cost)}`);

  // Claude Code rate-limit windows (proxied from api.anthropic.com via the
  // node's OAuth token): the 5-hour session window and the weekly window.
  const usage = await api('/claude-code/usage');
  if (usage?.success && usage.data) {
    const u = usage.data;
    const pick = (kind) => (u.limits || []).find(l => l.kind === kind)?.percent;
    const fiveH = u.five_hour?.utilization ?? pick('session');
    const week = u.seven_day?.utilization ?? pick('weekly_all');
    if (fiveH != null || week != null)
      console.log(`  Usage: 5h ${fiveH ?? '?'}% · 7d ${week ?? '?'}%`);
  }

  // Auto-resume monitor: sessions stalled on server/network errors are nudged
  // back to life; a model usage limit triggers a verified /model fallback.
  const stalls = await api('/monitor/stalls');
  if (stalls?.data?.enabled && stalls.data.sessions?.length) {
    const gaveUp = stalls.data.gaveUp || 0;
    console.log(`  Auto-resume: ${stalls.data.sessions.length} stalled session(s) tracked${gaveUp ? `, ${gaveUp} gave up` : ''}`);
  }

  console.log('  Pages: sessions, tasks, projects, missions, search, memory, backlog,');
  console.log('         scheduler, ccr, data, clusters, knowledge, skills...');

  try { execFileSync('open', [`http://localhost:${WEB_PORT}`], { stdio: 'pipe' }); }
  catch { try { execFileSync('xdg-open', [`http://localhost:${WEB_PORT}`], { stdio: 'pipe' }); } catch {} }
})();
