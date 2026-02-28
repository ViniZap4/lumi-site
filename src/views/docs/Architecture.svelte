<script>
  const architectureDiagram = `\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510          \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502   TUI Client    \u2502          \u2502  Web Client  \u2502
\u2502 (Go + Bubbletea)\u2502          \u2502  (Svelte 5)  \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518          \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
         \u2502                          \u2502
         \u2502 direct R/W               \u2502 HTTP + WebSocket
         \u2502 + optional WS            \u2502
         \u2502                          \u2502
         \u2502        \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
         \u2502        \u2502
         \u2502  \u250C\u2500\u2500\u2500\u2500\u2500\u25BC\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510     \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
         \u2502  \u2502   Go Server     \u2502\u25C4\u2500\u2500\u2500\u25BA\u2502 Peer Servers \u2502
         \u2502  \u2502  REST + WS Hub  \u2502     \u2502  (optional)  \u2502
         \u2502  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518     \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
         \u2502            \u2502
         \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2518
                \u2502
       \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u25BC\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
       \u2502    Filesystem     \u2502
       \u2502  Markdown + YAML  \u2502
       \u2502   frontmatter     \u2502
       \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518`;
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Architecture
  </h2>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Source of Truth</h3>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    The filesystem is the database. All notes are plain Markdown files with YAML frontmatter stored in a configurable root directory. There is no SQLite, no LevelDB, no hidden state — if you <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">ls</code> the notes folder, you see everything lumi knows about.
  </p>

  <div class="rounded-xl border p-5 overflow-x-auto mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="whitespace-pre leading-tight" style="font-size: clamp(0.5rem, 1.3vw, 0.8rem); color: var(--color-accent);">{architectureDiagram}</pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Components</h3>
  <div class="flex flex-col gap-3 mb-6">
    <div class="flex gap-3 items-start">
      <span class="text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5" style="background: var(--color-selected-bg); color: var(--color-primary);">TUI</span>
      <div>
        <p class="text-sm" style="color: var(--color-text-dim);">Go + Bubbletea + Lipgloss. Reads/writes the filesystem directly. Can optionally connect to the server via WebSocket for real-time sync notifications. Per-folder server config in <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">&lt;notesDir&gt;/.lumi/config.yaml</code>.</p>
      </div>
    </div>
    <div class="flex gap-3 items-start">
      <span class="text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5" style="background: var(--color-selected-bg); color: var(--color-primary);">Server</span>
      <div>
        <p class="text-sm" style="color: var(--color-text-dim);">Go + gorilla/websocket. HTTP API for CRUD, WebSocket hub for real-time broadcast. Supports peer-to-peer federation — multiple servers sync via <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_PEERS</code> with origin tracking to prevent echo loops.</p>
      </div>
    </div>
    <div class="flex gap-3 items-start">
      <span class="text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5" style="background: var(--color-selected-bg); color: var(--color-primary);">Web</span>
      <div>
        <p class="text-sm" style="color: var(--color-text-dim);">Svelte 5 + Vite. Connects through the server via REST for CRUD and WebSocket for live updates. Password-gated with encrypted session persistence in localStorage.</p>
      </div>
    </div>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Data Flow</h3>
  <div class="flex flex-col gap-3 mb-6">
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">TUI → Filesystem</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Direct read/write. The TUI opens, parses, and saves markdown files without any intermediary. Optional WebSocket connection notifies the TUI of external changes.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Web → Server → Filesystem</p>
      <p class="text-xs" style="color: var(--color-text-dim);">The web client sends REST requests to the server, which reads/writes the filesystem and broadcasts changes to all connected WebSocket clients.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Peer ↔ Peer</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Servers federate over WebSocket. Each event carries an origin server ID — peers relay events they didn't originate, preventing infinite echo loops.</p>
    </div>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Domain Model</h3>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <div class="flex items-center gap-2 px-4 py-2.5 border-b" style="border-color: var(--color-border); background: var(--color-selected-bg);">
      <span class="text-xs" style="color: var(--color-text-dim);">domain/note.go</span>
    </div>
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);"><span style="color: var(--color-primary);">type</span> <span style="color: var(--color-accent);">Note</span> <span style="color: var(--color-primary);">struct</span> {'{'}
    ID        <span style="color: var(--color-secondary);">string</span>    <span style="color: var(--color-muted);">`yaml:"id"`</span>
    Title     <span style="color: var(--color-secondary);">string</span>    <span style="color: var(--color-muted);">`yaml:"title"`</span>
    CreatedAt <span style="color: var(--color-secondary);">time.Time</span> <span style="color: var(--color-muted);">`yaml:"created_at"`</span>
    UpdatedAt <span style="color: var(--color-secondary);">time.Time</span> <span style="color: var(--color-muted);">`yaml:"updated_at"`</span>
    Tags      <span style="color: var(--color-secondary);">[]string</span>  <span style="color: var(--color-muted);">`yaml:"tags"`</span>
    Path      <span style="color: var(--color-secondary);">string</span>    <span style="color: var(--color-muted);">`yaml:"-"`</span> <span style="color: var(--color-muted);">// Filesystem path</span>
    Content   <span style="color: var(--color-secondary);">string</span>    <span style="color: var(--color-muted);">`yaml:"-"`</span> <span style="color: var(--color-muted);">// Body after frontmatter</span>
{'}'}</pre>
  </div>
</section>
