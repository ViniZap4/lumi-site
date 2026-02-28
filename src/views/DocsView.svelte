<script>
  import { onMount } from 'svelte';

  let activeSection = $state('getting-started');
  let sidebarOpen = $state(false);

  const sections = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'user-guide', label: 'User Guide' },
    { id: 'api-reference', label: 'API Reference' },
    { id: 'configuration', label: 'Configuration' },
    { id: 'note-format', label: 'Note Format' },
    { id: 'faq', label: 'FAQ' },
  ];

  const architectureDiagram = `┌─────────────────┐          ┌──────────────┐
│   TUI Client    │          │  Web Client  │
│ (Go + Bubbletea)│          │  (Svelte 5)  │
└────────┬────────┘          └──────┬───────┘
         │                          │
         │ direct R/W               │ HTTP + WebSocket
         │ + optional WS            │
         │                          │
         │        ┌─────────────────┘
         │        │
         │  ┌─────▼───────────┐     ┌─────────────┐
         │  │   Go Server     │◄───►│ Peer Servers │
         │  │  REST + WS Hub  │     │  (optional)  │
         │  └─────────┬───────┘     └─────────────┘
         │            │
         └──────┬─────┘
                │
       ┌────────▼──────────┐
       │    Filesystem     │
       │  Markdown + YAML  │
       │   frontmatter     │
       └───────────────────┘`;

  const apiEndpoints = [
    { method: 'POST', path: '/api/auth', desc: 'Validate password. Send the password in the X-Lumi-Token header. Returns 200 on success, 401 on failure.' },
    { method: 'GET', path: '/api/folders', desc: 'List all folders in the notes directory.' },
    { method: 'GET', path: '/api/notes', desc: 'List all notes. Optional ?path= query param to filter by folder.' },
    { method: 'GET', path: '/api/notes/:id', desc: 'Get a single note by ID, including full content.' },
    { method: 'POST', path: '/api/notes', desc: 'Create a new note. Send { title, content, tags } in JSON body.' },
    { method: 'PUT', path: '/api/notes/:id', desc: 'Update an existing note. Send { title, content, tags } in JSON body.' },
    { method: 'DELETE', path: '/api/notes/:id', desc: 'Delete a note by ID.' },
    { method: 'WS', path: '/ws?token=<token>', desc: 'WebSocket for real-time updates. Broadcasts note_created, note_updated, note_deleted events.' },
  ];

  const tuiKeybindings = [
    { keys: 'j / k', desc: 'Move down / up' },
    { keys: 'h / l', desc: 'Switch panels or cycle values' },
    { keys: 'gg / G', desc: 'Jump to top / bottom' },
    { keys: '0 / $', desc: 'Start / end of line' },
    { keys: '/', desc: 'Search / filter' },
    { keys: 'Ctrl+F', desc: 'Toggle filename / content search' },
    { keys: 'e / Enter', desc: 'Edit note in $EDITOR' },
    { keys: 'n', desc: 'Create new note' },
    { keys: 'r', desc: 'Rename note' },
    { keys: 'd', desc: 'Delete note' },
    { keys: 'D', desc: 'Duplicate note' },
    { keys: 'v', desc: 'Visual mode (select text)' },
    { keys: 'y', desc: 'Copy selection to clipboard' },
    { keys: 't', desc: 'Tree modal (file switcher)' },
    { keys: 's / S', desc: 'Horizontal / vertical split' },
    { keys: 'c', desc: 'Open settings' },
    { keys: 'Esc', desc: 'Go back / exit mode' },
    { keys: 'q', desc: 'Quit' },
  ];

  const webKeybindings = [
    { keys: 'j / k', desc: 'Navigate up / down' },
    { keys: '/', desc: 'Search notes' },
    { keys: 'Enter', desc: 'Open note or submit' },
    { keys: 'Esc', desc: 'Go back / close dialogs' },
  ];

  const serverEnvVars = [
    { name: 'LUMI_PASSWORD', default: 'dev', desc: 'Password for web login, REST API (X-Lumi-Token header), and WebSocket (?token= query param).' },
    { name: 'LUMI_ROOT', default: './notes', desc: 'Path to the notes directory. In Docker, defaults to /notes (volume mount target).' },
    { name: 'LUMI_PORT', default: '8080', desc: 'HTTP server listen port.' },
    { name: 'LUMI_SERVER_ID', default: 'auto', desc: 'Unique server ID for peer-to-peer sync origin tracking. Auto-generated if left empty.' },
    { name: 'LUMI_PEERS', default: '—', desc: 'Comma-separated URLs of peer lumi servers to federate with (e.g. http://peer1:8080,http://peer2:8080).' },
  ];

  const webEnvVars = [
    { name: 'VITE_LUMI_SERVER_URL', default: 'http://localhost:8080', desc: 'URL the browser uses to reach the API server. Baked into the JS bundle at build time — changing requires a rebuild.' },
  ];

  const composeEnvVars = [
    { name: 'LUMI_PASSWORD', default: 'dev', desc: 'Shared password for server + web client login.' },
    { name: 'LUMI_PORT', default: '8080', desc: 'Host port mapped to the server container.' },
    { name: 'WEB_PORT', default: '3000', desc: 'Host port mapped to the web client container.' },
    { name: 'NOTES_PATH', default: './notes', desc: 'Host path to the notes directory (mounted into server).' },
    { name: 'LUMI_SERVER_URL', default: 'http://localhost:8080', desc: 'Browser-facing API URL. Passed as build arg to web client — changing requires docker compose build web.' },
  ];

  function scrollToSection(id) {
    activeSection = id;
    sidebarOpen = false;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function methodColor(method) {
    const colors = {
      GET: 'var(--color-accent)',
      POST: 'var(--color-info)',
      PUT: 'var(--color-secondary)',
      DELETE: 'var(--color-error)',
      WS: 'var(--color-warning)',
    };
    return colors[method] || 'var(--color-text)';
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  });
</script>

<div class="flex min-h-screen pt-12">
  <!-- Mobile sidebar toggle -->
  <button
    class="fixed bottom-6 right-6 z-50 md:hidden w-12 h-12 rounded-full border flex items-center justify-center"
    style="background: var(--color-selected-bg); border-color: var(--color-border); color: var(--color-primary);"
    onclick={() => sidebarOpen = !sidebarOpen}
    aria-label="Toggle navigation"
  >
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      {#if sidebarOpen}
        <path d="M6 18L18 6M6 6l12 12" />
      {:else}
        <path d="M4 6h16M4 12h16M4 18h16" />
      {/if}
    </svg>
  </button>

  <!-- Sidebar -->
  <aside
    class="fixed left-0 top-12 bottom-0 w-56 border-r overflow-y-auto z-40 transition-transform duration-200 md:translate-x-0"
    class:max-md:-translate-x-full={!sidebarOpen}
    class:max-md:translate-x-0={sidebarOpen}
    style="background: var(--color-overlay-bg); border-color: var(--color-border);"
  >
    <nav class="p-4">
      <p class="text-xs font-semibold uppercase tracking-wider mb-4" style="color: var(--color-muted);">Documentation</p>
      <ul class="flex flex-col gap-0.5">
        {#each sections as s}
          <li>
            <button
              onclick={() => scrollToSection(s.id)}
              class="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer"
              style="color: {activeSection === s.id ? 'var(--color-primary)' : 'var(--color-text-dim)'}; background: {activeSection === s.id ? 'var(--color-selected-bg)' : 'transparent'};"
            >
              {s.label}
            </button>
          </li>
        {/each}
      </ul>
      <div class="mt-6 pt-4 border-t" style="border-color: var(--color-border);">
        <a href="#/"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
          style="color: var(--color-text-dim);"
        >
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </a>
      </div>
    </nav>
  </aside>

  <!-- Content -->
  <main class="flex-1 md:ml-56 px-6 sm:px-10 py-10 max-w-[900px]">

    <!-- Getting Started -->
    <section id="getting-started" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> Getting Started
      </h2>

      <h3 class="text-sm font-semibold mb-3 mt-6" style="color: var(--color-secondary);">Docker Compose (recommended)</h3>
      <p class="text-sm mb-4" style="color: var(--color-text-dim);">
        The fastest way to run the server and web client together.
      </p>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <div class="flex items-center gap-2 px-4 py-2.5 border-b" style="border-color: var(--color-border); background: var(--color-selected-bg);">
          <span class="w-2.5 h-2.5 rounded-full" style="background: var(--color-error);"></span>
          <span class="w-2.5 h-2.5 rounded-full" style="background: var(--color-warning);"></span>
          <span class="w-2.5 h-2.5 rounded-full" style="background: #a9b665;"></span>
          <span class="text-xs ml-2" style="color: var(--color-text-dim);">terminal</span>
        </div>
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-muted);"># Clone with all submodules</span>
git clone --recurse-submodules https://github.com/ViniZap4/lumi.git
<span style="color: var(--color-primary);">cd</span> lumi

<span style="color: var(--color-muted);"># Configure and start</span>
cp .env.example .env          <span style="color: var(--color-muted);"># edit LUMI_PASSWORD</span>
docker compose up -d          <span style="color: var(--color-muted);"># web on :3000, API on :8080</span></pre>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">TUI Client (standalone)</h3>
      <p class="text-sm mb-4" style="color: var(--color-text-dim);">
        The terminal client works completely offline — it reads/writes markdown files directly. Requires Go 1.23+.
      </p>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> tui-client
go build -o lumi
./lumi ../notes</pre>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Server (standalone)</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> server
LUMI_ROOT=../notes LUMI_PASSWORD=secret go run main.go</pre>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client (standalone)</h3>
      <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> web-client
npm install
npm run dev                   <span style="color: var(--color-muted);"># http://localhost:5173</span></pre>
      </div>
    </section>

    <!-- Architecture -->
    <section id="architecture" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> Architecture
      </h2>
      <p class="text-sm mb-4" style="color: var(--color-text-dim);">
        The filesystem is the single source of truth. All notes are plain Markdown files with YAML frontmatter — no database, no vendor lock-in.
      </p>
      <div class="rounded-xl border p-5 overflow-x-auto mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="whitespace-pre leading-tight" style="font-size: clamp(0.5rem, 1.3vw, 0.8rem); color: var(--color-accent);">{architectureDiagram}</pre>
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex gap-3 items-start">
          <span class="text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5" style="background: var(--color-selected-bg); color: var(--color-primary);">TUI</span>
          <p class="text-sm" style="color: var(--color-text-dim);">Reads/writes the filesystem directly. Can optionally connect to the server via WebSocket for real-time sync notifications.</p>
        </div>
        <div class="flex gap-3 items-start">
          <span class="text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5" style="background: var(--color-selected-bg); color: var(--color-primary);">Web</span>
          <p class="text-sm" style="color: var(--color-text-dim);">Connects through the Go server via REST for CRUD and WebSocket for live updates. Password-gated with encrypted session persistence.</p>
        </div>
        <div class="flex gap-3 items-start">
          <span class="text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5" style="background: var(--color-selected-bg); color: var(--color-primary);">Server</span>
          <p class="text-sm" style="color: var(--color-text-dim);">Can peer with other lumi servers for multi-instance federation via LUMI_PEERS. Events are exchanged over WebSocket with origin tracking to prevent echo loops.</p>
        </div>
      </div>
    </section>

    <!-- User Guide -->
    <section id="user-guide" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> User Guide
      </h2>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">TUI Keybindings</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        {#each tuiKeybindings as kb, i}
          <div class="flex items-center justify-between px-4 py-2" style="border-bottom: {i < tuiKeybindings.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
            <code class="text-xs px-2 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">{kb.keys}</code>
            <span class="text-xs" style="color: var(--color-text-dim);">{kb.desc}</span>
          </div>
        {/each}
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client Keybindings</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        {#each webKeybindings as kb, i}
          <div class="flex items-center justify-between px-4 py-2" style="border-bottom: {i < webKeybindings.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
            <code class="text-xs px-2 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">{kb.keys}</code>
            <span class="text-xs" style="color: var(--color-text-dim);">{kb.desc}</span>
          </div>
        {/each}
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client Login</h3>
      <p class="text-sm mb-4" style="color: var(--color-text-dim);">
        Open the web client in your browser and enter the password (the value of <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_PASSWORD</code>). Your session is encrypted and persisted in localStorage — refreshing the page stays logged in.
      </p>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Settings & Themes</h3>
      <p class="text-sm mb-2" style="color: var(--color-text-dim);">
        Press <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">c</code> in the TUI to open settings. The view uses a split layout — settings on the left, a live-rendered note preview on the right. Both columns update instantly as you cycle themes with <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">h/l</code>.
      </p>
      <p class="text-sm" style="color: var(--color-text-dim);">
        12 themes are available across dark and light modes: Tokyo Night, Tokyo Day, Catppuccin Mocha, Catppuccin Latte, Dracula, Obsidian, and several pride themes.
      </p>
    </section>

    <!-- API Reference -->
    <section id="api-reference" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> API Reference
      </h2>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Authentication</h3>
      <p class="text-sm mb-4" style="color: var(--color-text-dim);">
        All REST endpoints require the <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">X-Lumi-Token</code> header set to the server password. The WebSocket endpoint requires a <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">?token=</code> query parameter instead.
      </p>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Endpoints</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        {#each apiEndpoints as ep, i}
          <div class="px-4 py-3" style="border-bottom: {i < apiEndpoints.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
            <div class="flex items-center gap-3 mb-1">
              <span class="text-xs font-semibold px-2 py-0.5 rounded" style="background: var(--color-selected-bg); color: {methodColor(ep.method)};">{ep.method}</span>
              <code class="text-xs" style="color: var(--color-text);">{ep.path}</code>
            </div>
            <p class="text-xs ml-[52px]" style="color: var(--color-text-dim);">{ep.desc}</p>
          </div>
        {/each}
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">WebSocket Events</h3>
      <p class="text-sm mb-2" style="color: var(--color-text-dim);">
        After connecting, the server broadcasts JSON messages for every change:
      </p>
      <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);"><!-- --><span style="color: var(--color-muted);">// Server → Client</span>
{'{'}
  <span style="color: var(--color-accent);">"type"</span>: <span style="color: var(--color-secondary);">"note_created"</span> | <span style="color: var(--color-secondary);">"note_updated"</span> | <span style="color: var(--color-secondary);">"note_deleted"</span>,
  <span style="color: var(--color-accent);">"note"</span>: {'{'} <span style="color: var(--color-muted);">...</span> {'}'}
{'}'}</pre>
      </div>
    </section>

    <!-- Configuration -->
    <section id="configuration" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> Configuration
      </h2>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Server Environment Variables</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <table class="w-full text-sm">
          <thead>
            <tr style="background: var(--color-selected-bg); border-bottom: 1px solid var(--color-border);">
              <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Variable</th>
              <th class="text-left px-4 py-2.5 font-medium hidden sm:table-cell" style="color: var(--color-text-dim);">Default</th>
              <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Description</th>
            </tr>
          </thead>
          <tbody>
            {#each serverEnvVars as ev, i}
              <tr style="border-bottom: {i < serverEnvVars.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
                <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">{ev.name}</td>
                <td class="px-4 py-2 font-mono text-xs hidden sm:table-cell" style="color: var(--color-muted);">{ev.default}</td>
                <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">{ev.desc}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client Environment Variables</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <table class="w-full text-sm">
          <thead>
            <tr style="background: var(--color-selected-bg); border-bottom: 1px solid var(--color-border);">
              <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Variable</th>
              <th class="text-left px-4 py-2.5 font-medium hidden sm:table-cell" style="color: var(--color-text-dim);">Default</th>
              <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Description</th>
            </tr>
          </thead>
          <tbody>
            {#each webEnvVars as ev}
              <tr>
                <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">{ev.name}</td>
                <td class="px-4 py-2 font-mono text-xs hidden sm:table-cell" style="color: var(--color-muted);">{ev.default}</td>
                <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">{ev.desc}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Docker Compose (.env)</h3>
      <p class="text-sm mb-4" style="color: var(--color-text-dim);">
        Copy <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">.env.example</code> to <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">.env</code> and set your password before starting.
      </p>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <table class="w-full text-sm">
          <thead>
            <tr style="background: var(--color-selected-bg); border-bottom: 1px solid var(--color-border);">
              <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Variable</th>
              <th class="text-left px-4 py-2.5 font-medium hidden sm:table-cell" style="color: var(--color-text-dim);">Default</th>
              <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Description</th>
            </tr>
          </thead>
          <tbody>
            {#each composeEnvVars as ev, i}
              <tr style="border-bottom: {i < composeEnvVars.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
                <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">{ev.name}</td>
                <td class="px-4 py-2 font-mono text-xs hidden sm:table-cell" style="color: var(--color-muted);">{ev.default}</td>
                <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">{ev.desc}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Editor</h3>
      <p class="text-sm" style="color: var(--color-text-dim);">
        The TUI uses your <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">$EDITOR</code> environment variable. If not set, defaults to <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">nvim</code>. Use <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">code --wait</code> for VS Code.
      </p>
    </section>

    <!-- Note Format -->
    <section id="note-format" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> Note Format
      </h2>
      <p class="text-sm mb-4" style="color: var(--color-text-dim);">
        Notes are standard Markdown files with YAML frontmatter for metadata. No database, no vendor lock-in — just files on disk.
      </p>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <div class="flex items-center gap-2 px-4 py-2.5 border-b" style="border-color: var(--color-border); background: var(--color-selected-bg);">
          <span class="text-xs" style="color: var(--color-text-dim);">example-note.md</span>
        </div>
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);"><span style="color: var(--color-muted);">---</span>
<span style="color: var(--color-accent);">id</span>: <span style="color: var(--color-text);">2026-example-note</span>
<span style="color: var(--color-accent);">title</span>: <span style="color: var(--color-text);">Example Note</span>
<span style="color: var(--color-accent);">created_at</span>: <span style="color: var(--color-text);">2026-02-16T11:00:00-03:00</span>
<span style="color: var(--color-accent);">updated_at</span>: <span style="color: var(--color-text);">2026-02-16T11:05:00-03:00</span>
<span style="color: var(--color-accent);">tags</span>:
  - <span style="color: var(--color-secondary);">example</span>
  - <span style="color: var(--color-secondary);">markdown</span>
<span style="color: var(--color-muted);">---</span>

<span style="color: var(--color-primary);"># Content</span>

This is the note content in <span style="color: var(--color-secondary);">**Markdown**</span>.

Link to another note: <span style="color: var(--color-info);">[[2026-another-note]]</span></pre>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Folder Structure</h3>
      <p class="text-sm mb-4" style="color: var(--color-text-dim);">
        Organize notes in directories however you like. lumi detects folders and files automatically.
      </p>
      <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);">notes/
<span style="color: var(--color-muted);">├──</span> projects/
<span style="color: var(--color-muted);">│   ├──</span> lumi/
<span style="color: var(--color-muted);">│   └──</span> work/
<span style="color: var(--color-muted);">├──</span> journal/
<span style="color: var(--color-muted);">│   ├──</span> 2026-02/
<span style="color: var(--color-muted);">│   └──</span> 2026-01/
<span style="color: var(--color-muted);">└──</span> reference/</pre>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> FAQ
      </h2>
      <div class="flex flex-col gap-3">
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Can I use lumi without the server?</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Yes. The TUI works completely offline with local files — the server is only needed for the web client and multi-device sync.</p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">What happens if I edit a file outside of lumi?</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Changes are detected automatically. The TUI refreshes on focus, and the web client receives realtime updates via WebSocket.</p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">How do I export my notes?</p>
          <p class="text-xs" style="color: var(--color-text-dim);">They're already plain Markdown files — just copy the folder. Use git, rsync, or any cloud sync tool for backup.</p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Can multiple people use the same notes?</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Yes, if they share the same notes directory. The server broadcasts changes to all connected clients. Multiple servers can also federate via LUMI_PEERS.</p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Is there mobile support?</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Not yet as a native app, but the web client works on mobile browsers.</p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Can I encrypt my notes?</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Not built-in yet. For now, use filesystem-level encryption (FileVault, LUKS, VeraCrypt).</p>
        </div>
      </div>
    </section>

  </main>
</div>
