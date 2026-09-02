---
description: "Use when the user asks to open the web dashboard, view sessions in browser, check the dashboard URL, or wants to see session details visually. Handles web UI access and browser-based session management."
allowed-tools: Bash
---

# Claude Code Web Dashboard

Open and manage the lm-assist web dashboard for visual session browsing, agent debugging, and terminal control.

**Web UI:** `http://localhost:3848` (prod; Core API on `:3100`)

Ports above are the prod defaults. A dev checkout serves the web UI on `:3948` with the API on `:3200` — the plugin's hooks and scripts follow `devModeEnabled` in `~/.claude-code-config.json`.

## Pre-flight: Ensure lm-assist is running

```bash
curl -s --max-time 2 http://localhost:3100/health | python3 -c "
import sys,json
try:
    d = json.load(sys.stdin)
    if d.get('success'): print('API: healthy')
    else: print('API: unhealthy')
except: print('API: not running')
"
```

If not running:
```bash
npm list -g lm-assist --depth=0 2>/dev/null || npm install -g lm-assist
lm-assist start
```

## Open the dashboard

Get the URL and open in browser:

```bash
# Get machine IP for LAN access
IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "localhost")
echo "Web UI URLs:"
echo "  Local: http://localhost:3848"
echo "  LAN:   http://$IP:3848"

# Try to open in browser
open "http://localhost:3848" 2>/dev/null || xdg-open "http://localhost:3848" 2>/dev/null || echo "Open http://localhost:3848 in your browser"
```

## Dashboard features

The web dashboard provides:

### Session Browser
- All sessions across projects with slug names, costs, running status
- Filter by project, time range, search
- Click any session for 14 insight views (plus an experimental FlowGraph tab)

### Session Insight Tabs
| Tab | What you see |
|-----|-------------|
| Console | Web terminal for the session (Linux/macOS only) |
| Chat | Full conversation with syntax highlighting |
| Tasks | Task lists with dependency tracking |
| Plans | Plan mode entries with approval status |
| Agents | Subagent hierarchy tree — shows each subagent's real type (e.g. Explore), not just general-purpose |
| Skills | Skill invocation timeline with traces |
| Commands | Slash command invocations |
| Team | Multi-agent team coordination |
| Files | All files read, written, edited |
| Thinking | Extended thinking / chain-of-thought |
| Git | Commits, pushes, diffs |
| DB | Database operations (queries, migrations) detected in the session |
| JSON | Raw session JSONL data |
| Meta | Session metadata — slug, cost, tokens, model |

With Experiment mode enabled in Settings, a FlowGraph tab adds a session flow diagram.

### Web Terminal
Control running Claude Code sessions from any browser:

```bash
# Check available terminals (API endpoints other than /health need the local token)
curl -s -H "x-api-key: $(cat "${LM_ASSIST_DATA_DIR:-$HOME/.lm-assist}/api-token" 2>/dev/null)" http://localhost:3100/ttyd/processes | python3 -c "
import sys,json
d = json.load(sys.stdin).get('data',{})
print(f'Managed terminals: {d.get(\"summary\",{}).get(\"totalManaged\",0)}')
for t in d.get('managed',[]):
    print(f'  {t.get(\"sessionId\",\"\")[:12]} port:{t.get(\"port\",\"\")} pid:{t.get(\"pid\",\"\")}')
"
```

### Session Dashboard (multi-session view)
Open the session dashboard for simultaneous multi-session monitoring (compact live message feeds per session). For a grid of live terminals, use the separate Terminal Dashboard at `/terminal-dashboard`:

```bash
IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "localhost")
echo "Session Dashboard:  http://$IP:3848/session-dashboard"
echo "Terminal Dashboard: http://$IP:3848/terminal-dashboard"
open "http://localhost:3848/session-dashboard" 2>/dev/null || xdg-open "http://localhost:3848/session-dashboard" 2>/dev/null || true
```

### Settings
Web-based settings management:

```bash
echo "Settings: http://localhost:3848/settings"
```

Available settings pages:
- Connection — LAN access, cloud connection
- Terminal — terminal configuration
- Claude Code — Claude Code config viewer
- Data Loading — knowledge system toggle (kill switch)
- Experiment — developer mode, version updates
- MCP — points to the dedicated MCP Tools page (`/mcp-tools`)
- Memory — memory sync toggles and sync status

### More dashboard pages

Beyond sessions and settings, the sidebar links dedicated pages, including:
- `/search` — full-text search over your prompts across sessions
- `/missions`, `/mission-graph`, `/mission-processes` — mission control views
- `/backlog` — feature/idea backlog graph
- `/memory` — browse memory and rules
- `/mcp-tools` — MCP tool registry (descriptions, enable/disable)
- `/scheduler` — scheduled jobs
- `/ccr` — Claude Code remote (cloud) sessions
- `/terminal-dashboard`, `/process-dashboard` — live terminals and process views
- `/data`, `/clusters`, `/machines`, `/knowledge`, `/skills`, `/cowork`

## Access from any device

The dashboard works from any device on your network:
- **Laptop/Desktop**: `http://localhost:3848`
- **Phone/Tablet**: `http://<machine-ip>:3848` (responsive UI)
- **Remote**: Connect via LangMart Hub for access from anywhere
