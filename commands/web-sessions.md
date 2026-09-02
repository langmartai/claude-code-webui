---
allowed-tools: Bash
description: Open session browser in web dashboard
---

# /web-sessions — Open Session Browser

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/web-sessions.js"
```

## Output

Present the script output directly. It prints the session browser URL, the
insight tabs available on each session (Chat, Tasks, Plans, Agents, Skills,
Commands, Team, Files, Thinking, Git, DB...), and a stalled-session count when
the auto-resume monitor is tracking any. The Agents tab shows each subagent's
real type (e.g. Explore instead of general-purpose) as of lm-assist v0.2.1.
