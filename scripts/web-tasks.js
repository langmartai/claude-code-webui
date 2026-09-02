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

  const url = `http://localhost:${WEB_PORT}/tasks`;
  console.log(`Task Board: http://${ip}:${WEB_PORT}/tasks`);

  const data = await api('/task-store/tasks');
  if (data?.data?.tasks) {
    const tasks = data.data.tasks;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const progress = tasks.filter(t => t.status === 'in_progress').length;
    const done = tasks.filter(t => t.status === 'completed').length;
    console.log(`  Pending: ${pending}  In Progress: ${progress}  Done: ${done}`);
  }

  try { execFileSync('open', [url], { stdio: 'pipe' }); }
  catch { try { execFileSync('xdg-open', [url], { stdio: 'pipe' }); } catch {} }
})();
