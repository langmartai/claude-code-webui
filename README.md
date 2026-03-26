# Claude Code WebUI

**Web dashboard for Claude Code — browse sessions, debug agents, control terminals from any browser.**

15 insight views per session. Responsive on phone, tablet, and desktop. Access from localhost, LAN, or anywhere via cloud relay.

## Install

```bash
npm install -g lm-assist
```

Services start automatically. Open a **new Claude Code session** and type `/dashboard`.

Or install the plugin only:
```
/plugin marketplace add langmartai/lm-assist
/plugin install claude-code-webui@langmartai
```

## Commands

### `/dashboard` — Open the web dashboard

```
> /dashboard
Claude Code Web Dashboard (v0.1.69)
═════════════════════════════════════════════
  Local:  http://localhost:3848
  LAN:    http://192.168.1.100:3848
  Mobile: http://192.168.1.100:3848 (responsive)

  Sessions: 3 running, 127 total
  Cost:     $89.10

Pages:
  /sessions           Session browser + 15 insight tabs
  /session-dashboard  Multi-terminal live view
  /knowledge          Knowledge base browser
  /tasks              Task kanban board
  /settings           Configuration
```

### `/terminal` — Open web terminal for a session

```
> /terminal
Web Terminal
──────────────────────────────────────────────────
Running sessions:
  api-refactor         (my-backend)   abc12345
  dashboard-redesign   (my-frontend)  def67890

To connect: /terminal abc12345

Terminal dashboard: http://192.168.1.100:3848/session-dashboard
```

```
> /terminal abc12345
Starting web terminal for: abc12345
Terminal ready:
  Local: http://localhost:5901
  LAN:   http://192.168.1.100:5901
```

## What You See

### Session Browser

Browse all sessions across projects. Click any session for 15 specialized views.

<a href="https://langmart.ai/images/assist/session-browser.png"><img src="https://langmart.ai/images/assist/session-browser.png" alt="Session Browser" width="700"></a>

### 15 Insight Tabs

Every session gets a full breakdown:

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
| **Console** | Terminal output and process management |
| **Summary** | LLM-generated session summary |
| **Meta** | Metadata — slug, cost, tokens, model |
| **JSON** | Raw session JSONL data |
| **DB** | Internal cache and index |

### Agent Tree

<a href="https://langmart.ai/images/assist/agent-tree.png"><img src="https://langmart.ai/images/assist/agent-tree.png" alt="Agent Tree" width="500"></a>

### Web Terminal

<a href="https://langmart.ai/images/assist/session-terminal.png"><img src="https://langmart.ai/images/assist/session-terminal.png" alt="Web Terminal" width="700"></a>

Control running Claude Code sessions from any browser — phone, tablet, or desktop.

### Task Kanban

<a href="https://langmart.ai/images/assist/task-kanban.png"><img src="https://langmart.ai/images/assist/task-kanban.png" alt="Task Kanban" width="500"></a>

### Mobile & Tablet

The dashboard is fully responsive. Monitor sessions and control terminals from your phone.

## Access Modes

| Mode | URL | Auth |
|------|-----|------|
| **Local** | `http://localhost:3848` | None |
| **LAN** | `http://<your-ip>:3848` | Optional token |
| **Cloud** | Via LangMart Hub | API key |

## Architecture

Powered by [lm-assist](https://github.com/langmartai/lm-assist):
- **Core API** (port 3100) — 155+ REST endpoints for session data
- **Web UI** (port 3848) — Next.js 16 + React 19 dashboard
- **Web Terminals** (port 5900+) — ttyd per active session

## Related

- [claude-code-multisession](https://github.com/langmartai/claude-code-multisession) — Skills for cross-project session management
- [lm-assist](https://github.com/langmartai/lm-assist) — The observability platform powering everything

## License

[MIT](LICENSE)
