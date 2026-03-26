# Claude Code WebUI

**Web dashboard for Claude Code — browse sessions, debug agents, control terminals from any browser, any device.**

15 insight views per session. Responsive on phone, tablet, and desktop. Access from localhost, LAN, or anywhere by signing in to [langmart.ai](https://langmart.ai).

## Install

```bash
npm install -g lm-assist
```

Services start automatically. Open a **new Claude Code session** and type `/web`.

Or install the plugin only:
```
/plugin marketplace add langmartai/lm-assist
/plugin install claude-code-webui@langmartai
```

## Commands

| Command | What it does |
|---------|-------------|
| `/web` | Open the main web dashboard |
| `/web-sessions` | Open session browser with 15 insight tabs |
| `/web-tasks` | Open task kanban board |

### `/web` — Open Dashboard

```
> /web
Web Dashboard (v0.1.69)
════════════════════════════════════════
  Local:  http://localhost:3848
  LAN:    http://192.168.1.100:3848
  3 running, 127 total, $89.10
```

### `/web-sessions` — Session Browser

```
> /web-sessions
Session Browser: http://192.168.1.100:3848/sessions
15 insight tabs per session: Chat, Thinking, Agents, Plans, Team, DAG, Files, Git...
```

### `/web-tasks` — Task Board

```
> /web-tasks
Task Board: http://192.168.1.100:3848/tasks
  Pending: 5  In Progress: 2  Done: 12
```

## Access From Anywhere

### Local (same machine)
`http://localhost:3848` — no auth needed.

### LAN (same network)
`http://<your-ip>:3848` — access from phone, tablet, or another computer on your WiFi.

### Cloud (any device, anywhere)
Sign in to [langmart.ai](https://langmart.ai) and connect your machine:
1. Get an API key at [langmart.ai/assist](https://assist.langmart.ai/assist)
2. Run `lm-assist setup --key YOUR_API_KEY`
3. Access your dashboard at [assist.langmart.ai/assist-dashboard](https://assist.langmart.ai/assist-dashboard)

Your data stays on your machine — the cloud relay only forwards API requests, never stores session data.

## What You See

### Session Browser

Browse all sessions across projects. Click any session for 15 specialized views.

<a href="https://langmart.ai/images/assist/session-browser.png"><img src="https://langmart.ai/images/assist/session-browser.png" alt="Session Browser" width="700"></a>

### 15 Insight Tabs

| Tab | What You See |
|-----|-------------|
| **Chat** | Full conversation with syntax-highlighted code |
| **Thinking** | Extended thinking / chain-of-thought |
| **Agents** | Subagent hierarchy tree |
| **Skills** | Skill invocation timeline with traces |
| **Commands** | Slash command invocations |
| **Tasks** | Task lists with dependency tracking |
| **Plans** | Plan mode entries with approval status |
| **Team** | Multi-agent team coordination |
| **Files** | All files read, written, edited |
| **Git** | Commits, pushes, diffs |
| **Console** | Terminal output |
| **Summary** | LLM-generated session summary |
| **Meta** | Metadata — slug, cost, tokens, model |
| **JSON** | Raw session JSONL data |
| **DB** | Internal cache and index |

### Agent Tree & Task Kanban

<table>
  <tr>
    <td><a href="https://langmart.ai/images/assist/agent-tree.png"><img src="https://langmart.ai/images/assist/agent-tree.png" alt="Agent Tree" width="340"></a><br><sub>Subagent hierarchy</sub></td>
    <td><a href="https://langmart.ai/images/assist/task-kanban.png"><img src="https://langmart.ai/images/assist/task-kanban.png" alt="Task Kanban" width="340"></a><br><sub>Task kanban board</sub></td>
  </tr>
</table>

### Web Terminal

<a href="https://langmart.ai/images/assist/session-terminal.png"><img src="https://langmart.ai/images/assist/session-terminal.png" alt="Web Terminal" width="700"></a>

Control running Claude Code sessions from any browser.

### Mobile & Tablet

Fully responsive — monitor sessions and manage tasks from your phone.

## Related

- [claude-code-multisession](https://github.com/langmartai/claude-code-multisession) — Skills for cross-project session routing and management
- [lm-assist](https://github.com/langmartai/lm-assist) — The observability platform powering everything

## License

[MIT](LICENSE)
