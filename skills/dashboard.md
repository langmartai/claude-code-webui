---
description: "Use when the user asks to open the web dashboard, view sessions in browser, access web terminal, check the dashboard URL, or wants to see session details visually. Handles web UI access, terminal streaming, and browser-based session management."
allowed-tools: Bash
---

# Claude Code Web Dashboard

Open and manage the lm-assist web dashboard for visual session browsing, agent debugging, and terminal control.

**Web UI:** `http://localhost:3848`

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
- Click any session for 15 insight views

### 15 Session Insight Tabs
| Tab | What you see |
|-----|-------------|
| Chat | Full conversation with syntax highlighting |
| Thinking | Extended thinking / chain-of-thought |
| Agents | Subagent hierarchy tree |
| Skills | Skill invocation timeline with traces |
| Commands | Slash command invocations |
| Tasks | Task lists with dependency tracking |
| Plans | Plan mode entries with approval status |
| Team | Multi-agent team coordination |
| Files | All files read, written, edited |
| Git | Commits, pushes, diffs |
| Console | Terminal output and process management |
| Summary | Session summary with green highlight |
| Meta | Session metadata — slug, cost, tokens, model |
| JSON | Raw session JSONL data |
| DB | Internal cache and index data |

### Web Terminal
Control running Claude Code sessions from any browser:

```bash
# Check available terminals
curl -s http://localhost:3100/ttyd/status | python3 -c "
import sys,json
d = json.load(sys.stdin).get('data',{})
print(f'Active terminals: {d.get(\"active\",0)}')
for t in d.get('terminals',[]):
    print(f'  {t.get(\"sessionId\",\"\")[:12]} port:{t.get(\"port\",\"\")} pid:{t.get(\"pid\",\"\")}')
"
```

### Session Dashboard (multi-terminal view)
Open the terminal dashboard for simultaneous multi-session monitoring:

```bash
IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "localhost")
echo "Terminal Dashboard: http://$IP:3848/session-dashboard"
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

## Access from any device

The dashboard works from any device on your network:
- **Laptop/Desktop**: `http://localhost:3848`
- **Phone/Tablet**: `http://<machine-ip>:3848` (responsive UI)
- **Remote**: Connect via LangMart Hub for access from anywhere
