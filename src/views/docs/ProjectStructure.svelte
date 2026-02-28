<script>
  const projectTree = `lumi/
\u251C\u2500\u2500 tui-client/             # Terminal client (Go + Bubbletea)
\u2502   \u251C\u2500\u2500 main.go
\u2502   \u251C\u2500\u2500 go.mod
\u2502   \u251C\u2500\u2500 domain/             # Core types (Note, Folder)
\u2502   \u251C\u2500\u2500 filesystem/         # File I/O, YAML frontmatter parsing
\u2502   \u251C\u2500\u2500 config/             # Global config + per-folder server config
\u2502   \u251C\u2500\u2500 sync/               # WebSocket client for real-time server sync
\u2502   \u251C\u2500\u2500 ui/                 # Bubbletea models and views
\u2502   \u2502   \u251C\u2500\u2500 simple.go       # Main model, Update(), View() routing
\u2502   \u2502   \u251C\u2500\u2500 view_tree.go    # Tree file browser (3-column split)
\u2502   \u2502   \u251C\u2500\u2500 view_note.go    # Full note display, markdown rendering
\u2502   \u2502   \u251C\u2500\u2500 view_config.go  # Settings view (split: config + live preview)
\u2502   \u2502   \u251C\u2500\u2500 inline.go       # Per-character inline markdown classification
\u2502   \u2502   \u2514\u2500\u2500 styles.go       # Lipgloss styles, theme application
\u2502   \u251C\u2500\u2500 theme/              # Theme definitions and registry
\u2502   \u251C\u2500\u2500 editor/             # External editor integration ($EDITOR)
\u2502   \u2514\u2500\u2500 image/              # Terminal image rendering (timg/chafa/viu)
\u251C\u2500\u2500 server/                 # API server (Go)
\u2502   \u251C\u2500\u2500 main.go
\u2502   \u251C\u2500\u2500 go.mod
\u2502   \u251C\u2500\u2500 Dockerfile
\u2502   \u251C\u2500\u2500 domain/             # Shared types (Note, Folder)
\u2502   \u251C\u2500\u2500 filesystem/         # File operations + frontmatter parsing
\u2502   \u251C\u2500\u2500 http/               # HTTP handlers (REST API)
\u2502   \u251C\u2500\u2500 ws/                 # WebSocket hub (broadcast to clients + peers)
\u2502   \u251C\u2500\u2500 auth/               # Token authentication middleware
\u2502   \u2514\u2500\u2500 peer/               # Peer-to-peer server federation
\u251C\u2500\u2500 web-client/             # Web interface (Svelte 5 + Vite)
\u2502   \u251C\u2500\u2500 package.json
\u2502   \u251C\u2500\u2500 Dockerfile
\u2502   \u2514\u2500\u2500 src/
\u2502       \u251C\u2500\u2500 lib/
\u2502       \u2502   \u251C\u2500\u2500 api.js      # HTTP client (REST) with dynamic token auth
\u2502       \u2502   \u251C\u2500\u2500 ws.js       # WebSocket client (auto-reconnect, token auth)
\u2502       \u2502   \u251C\u2500\u2500 store.svelte.js  # Reactive store (auth, notes, folders)
\u2502       \u2502   \u2514\u2500\u2500 themes.js   # Theme definitions and application
\u2502       \u251C\u2500\u2500 views/
\u2502       \u2502   \u251C\u2500\u2500 LoginView.svelte   # Password login screen
\u2502       \u2502   \u251C\u2500\u2500 HomeView.svelte    # Home with logo animation
\u2502       \u2502   \u251C\u2500\u2500 TreeView.svelte    # File browser
\u2502       \u2502   \u251C\u2500\u2500 NoteView.svelte    # Note display/editor
\u2502       \u2502   \u2514\u2500\u2500 ConfigView.svelte  # Settings
\u2502       \u2514\u2500\u2500 App.svelte      # Root component (auth gate + routing)
\u251C\u2500\u2500 site/                   # Landing page (Svelte 5 + Tailwind)
\u251C\u2500\u2500 notes/                  # Your notes (markdown files)
\u251C\u2500\u2500 docker-compose.yml
\u251C\u2500\u2500 .env.example
\u2514\u2500\u2500 README.md`;
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Project Structure
  </h2>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Each component follows a layered package structure. Both Go components share the same <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">domain/</code> and <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">filesystem/</code> pattern.
  </p>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);">{projectTree}</pre>
  </div>
</section>
