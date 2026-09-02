---
allowed-tools: Bash
description: Open task kanban board in web dashboard
---

# /web-tasks — Open Task Board

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/web-tasks.js"
```

## Output

Present the script output directly. It prints the task board URL and current
task counts (pending / in progress / done). If a count line is missing, check
stderr for an API-token warning rather than assuming zero tasks.
