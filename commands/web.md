---
allowed-tools: Bash
description: Open the Claude Code web dashboard
---

# /web — Open Web Dashboard

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/web.js"
```

## Output

Present the script output directly. It prints the dashboard URLs (local + LAN),
a one-glance summary (running/total sessions, cost, Claude Code usage in the
5-hour and weekly windows, any auto-resume stall activity), then opens the
browser.

The root dashboard links to the full page set — sessions, tasks, projects,
missions, search, memory, backlog, scheduler, ccr, data, clusters, knowledge,
skills, and more.
