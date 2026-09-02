# Claude Code WebUI

**Web dashboard for Claude Code — browse sessions, debug agents, control terminals from any browser, any device.**

15 insight views per session. Responsive on phone, tablet, and desktop. Access from localhost, LAN, or anywhere by signing in to [langmart.ai](https://langmart.ai).

## Install

```bash
npm install -g lm-assist
```

Services start automatically, and the `claude-code-multisession` plugin is installed for you — open a **new Claude Code session** and try `/sessions`. For `/web` and the other dashboard commands, install this plugin from the marketplace below.

### Plugin Marketplace

Add the marketplace once — then install any combination of plugins:

```
/plugin marketplace add langmartai/lm-assist
```

| Install command | What you get |
|----------------|-------------|
| `/plugin install claude-code-multisession@langmartai` | Skills (observe, route) + commands (`/projects`, `/sessions`, `/summary`, `/run`) — cross-project session management |
| `/plugin install claude-code-webui@langmartai` | Skill (dashboard) + commands (`/web`, `/web-sessions`, `/web-tasks`) — web dashboard access |
| `/plugin install lm-assist@langmartai` | Commands (`/assist`, `/assist-setup`, `/assist-status`, `/assist-search`, `/assist-logs`, `/assist-mcp-logs`) — setup and diagnostics |

Install all three for the full experience, or pick what you need. This plugin release (v0.2.0) works against lm-assist >= 0.2.x — `npm install -g lm-assist` currently gets you v0.2.1.

## Commands

| Command | What it does |
|---------|-------------|
| `/web` | Open the main web dashboard |
| `/web-sessions` | Open session browser with 15 insight tabs |
| `/web-tasks` | Open task kanban board |

### `/web` — Open Dashboard

```
> /web
Web Dashboard (v0.2.1)
════════════════════════════════════════
  Local:  http://localhost:3848
  LAN:    http://192.168.1.100:3848
  3 running, 127 total, $89.10
  Auto-resume: 1 stalled session(s) tracked
  Pages: sessions, tasks, projects, missions, search, memory, backlog,
         scheduler, ccr, data, clusters, knowledge, skills...
```

The `Auto-resume` line appears when the stall monitor is tracking sessions — see [Everyday Workflows](#everyday-workflows) below.

### `/web-sessions` — Session Browser

```
> /web-sessions
Session Browser: http://192.168.1.100:3848/sessions
Insight tabs: Chat, Tasks, Plans, Agents, Skills, Commands, Team, Files, Thinking, Git, DB...
The Agents tab shows each subagent's real type (e.g. Explore) as of lm-assist v0.2.1.
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
`http://<your-ip>:3848` — access from phone, tablet, or another computer on your WiFi. LAN access is protected by default: the first visit from another device asks you to sign in with the same cloud account bound to the machine (or disable LAN protection in Settings).

### Cloud (any device, anywhere)
Sign in to [langmart.ai](https://langmart.ai) and connect your machine:
1. Get an API key at [langmart.ai/assist](https://assist.langmart.ai/assist)
2. Run `lm-assist setup --key YOUR_API_KEY`
3. Access your machines from [assist.langmart.ai/assist](https://assist.langmart.ai/assist) — each connected machine's dashboard opens from there

Your session data stays on your machine — the cloud relay forwards API requests to your local services, which read sessions from local files.

## Everyday Workflows

### Find the session where you fixed that bug

Open the **/search** page and type what you remember typing. Search is full-text over your own prompts with bm25 ranking and CJK-aware tokenization, so it works just as well for 中文 prompts:

```
> search: retry backoff jitter
1. fix flaky uploader — add retry with jitter     api-server    2d ago
2. wrap fetch helper in exponential backoff       web-client    6d ago
```

Click a result to open an inline chat preview of that session's recent messages, with a one-click jump to the full session in the session browser.

### Let an overnight run recover itself

Kick off a long refactor before bed. If the session stalls on a server or network error, the auto-resume monitor nudges it back to life; if it hits a model usage limit, it switches to a fallback with a verified `/model` command instead of sitting idle. The next morning, `/web` (or `GET /monitor/stalls`) shows what happened:

```
  Auto-resume: 2 stalled session(s) tracked
```

### Check your headroom before a big job

lm-assist reads your Claude Code rate-limit windows (5-hour and 7-day) live from your account (`GET /claude-code/usage`), so you can see how much room a large agent run has before you start it — and the session browser's cost columns show what each session actually spent.

## What You See

### Session Browser

Browse all sessions across projects. Click any session for 15 specialized views. The **/search** page sits right next to it: full-text search over your own prompts (bm25 ranking, CJK-aware) that jumps straight into the matching session.

<a href="https://raw.githubusercontent.com/langmartai/lm-assist/main/docs/screenshots/session-browser.png"><img src="https://raw.githubusercontent.com/langmartai/lm-assist/main/docs/screenshots/session-browser.png" alt="Session Browser" width="700"></a>

### 15 Insight Tabs

| Tab | What You See |
|-----|-------------|
| **Chat** | Full conversation with syntax-highlighted code |
| **Thinking** | Extended thinking / chain-of-thought |
| **Agents** | Subagent hierarchy tree — each agent shows its real type, e.g. Explore |
| **Skills** | Skill invocation timeline with traces |
| **Commands** | Slash command invocations |
| **Tasks** | Task lists with dependency tracking |
| **Plans** | Plan mode entries with approval status |
| **Team** | Multi-agent team coordination |
| **Files** | All files read, written, edited |
| **Git** | Commits, pushes, diffs |
| **Console** | Terminal output (hidden on Windows) |
| **DAG** | Session flow graph (labeled FlowGraph, experiment mode) — message/agent execution flow |
| **Meta** | Metadata — slug, cost, tokens, model |
| **JSON** | Raw session JSONL data |
| **DB** | Database operations detected in the session (queries, migrations) |

That's 15 tabs in all; a default install shows 14 of them (the DAG/FlowGraph tab requires experiment mode, and the Console tab is hidden on Windows).

Session summaries live in the session browser's list and summary surfaces rather than a detail tab.

### Agent Tree & Task Kanban

<table>
  <tr>
    <td><a href="https://raw.githubusercontent.com/langmartai/lm-assist/main/docs/screenshots/agent-tree.png"><img src="https://raw.githubusercontent.com/langmartai/lm-assist/main/docs/screenshots/agent-tree.png" alt="Agent Tree" width="340"></a><br><sub>Subagent hierarchy — real agent types (e.g. Explore)</sub></td>
    <td><a href="https://raw.githubusercontent.com/langmartai/lm-assist/main/docs/screenshots/task-kanban.png"><img src="https://raw.githubusercontent.com/langmartai/lm-assist/main/docs/screenshots/task-kanban.png" alt="Task Kanban" width="340"></a><br><sub>Task kanban board</sub></td>
  </tr>
</table>

### Web Terminal

<a href="https://raw.githubusercontent.com/langmartai/lm-assist/main/docs/screenshots/session-terminal.png"><img src="https://raw.githubusercontent.com/langmartai/lm-assist/main/docs/screenshots/session-terminal.png" alt="Web Terminal" width="700"></a>

Control running Claude Code sessions from any browser.

### Beyond Sessions and Tasks

The dashboard has grown well past its two original pages. The sidebar now also reaches pages for missions (plus mission graph and process views), backlog, memory, MCP tools, full-text search, the scheduler, remote code sessions (ccr), shared data, clusters, machines, knowledge, skills, and dedicated session, terminal, and process dashboards, plus a cowork chat view.

### Mobile & Tablet

Fully responsive — monitor sessions and manage tasks from your phone.

## Related

- [claude-code-multisession](https://github.com/langmartai/claude-code-multisession) — Skills for cross-project session routing and management
- [lm-assist](https://github.com/langmartai/lm-assist) — The observability platform powering everything

## License

[MIT](LICENSE)
