<script>
  import { onMount } from 'svelte';

  let activeSection = $state('getting-started');
  let sidebarOpen = $state(false);

  const groups = [
    {
      label: 'Guide',
      sections: [
        { id: 'getting-started', label: 'Getting Started' },
        { id: 'user-guide', label: 'User Guide' },
        { id: 'configuration', label: 'Configuration' },
        { id: 'note-format', label: 'Note Format' },
        { id: 'faq', label: 'FAQ' },
      ],
    },
    {
      label: 'Reference',
      sections: [
        { id: 'architecture', label: 'Architecture' },
        { id: 'project-structure', label: 'Project Structure' },
        { id: 'docker-environment', label: 'Docker & Environment' },
        { id: 'api-reference', label: 'API Reference' },
      ],
    },
    {
      label: 'Contributing',
      sections: [
        { id: 'development-setup', label: 'Development Setup' },
        { id: 'git-submodules', label: 'Git & Submodules' },
        { id: 'coding-standards', label: 'Coding Standards' },
      ],
    },
  ];

  const allSections = groups.flatMap((g) => g.sections);

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

  const projectTree = `lumi/
├── tui-client/             # Terminal client (Go + Bubbletea)
│   ├── main.go
│   ├── go.mod
│   ├── domain/             # Core types (Note, Folder)
│   ├── filesystem/         # File I/O, YAML frontmatter parsing
│   ├── config/             # Global config + per-folder server config
│   ├── sync/               # WebSocket client for real-time server sync
│   ├── ui/                 # Bubbletea models and views
│   │   ├── simple.go       # Main model, Update(), View() routing
│   │   ├── view_tree.go    # Tree file browser (3-column split)
│   │   ├── view_note.go    # Full note display, markdown rendering
│   │   ├── view_config.go  # Settings view (split: config + live preview)
│   │   ├── inline.go       # Per-character inline markdown classification
│   │   └── styles.go       # Lipgloss styles, theme application
│   ├── theme/              # Theme definitions and registry
│   ├── editor/             # External editor integration ($EDITOR)
│   └── image/              # Terminal image rendering (timg/chafa/viu)
├── server/                 # API server (Go)
│   ├── main.go
│   ├── go.mod
│   ├── Dockerfile
│   ├── domain/             # Shared types (Note, Folder)
│   ├── filesystem/         # File operations + frontmatter parsing
│   ├── http/               # HTTP handlers (REST API)
│   ├── ws/                 # WebSocket hub (broadcast to clients + peers)
│   ├── auth/               # Token authentication middleware
│   └── peer/               # Peer-to-peer server federation
├── web-client/             # Web interface (Svelte 5 + Vite)
│   ├── package.json
│   ├── Dockerfile
│   └── src/
│       ├── lib/
│       │   ├── api.js      # HTTP client (REST) with dynamic token auth
│       │   ├── ws.js       # WebSocket client (auto-reconnect, token auth)
│       │   ├── store.svelte.js  # Reactive store (auth, notes, folders)
│       │   └── themes.js   # Theme definitions and application
│       ├── views/
│       │   ├── LoginView.svelte   # Password login screen
│       │   ├── HomeView.svelte    # Home with logo animation
│       │   ├── TreeView.svelte    # File browser
│       │   ├── NoteView.svelte    # Note display/editor
│       │   └── ConfigView.svelte  # Settings
│       └── App.svelte      # Root component (auth gate + routing)
├── site/                   # Landing page (Svelte 5 + Tailwind)
├── notes/                  # Your notes (markdown files)
├── docker-compose.yml
├── .env.example
└── README.md`;

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

  const submoduleQuickRef = [
    { task: 'Clone everything', command: 'git clone --recurse-submodules <url>' },
    { task: 'Pull everything', command: 'git pull --recurse-submodules' },
    { task: 'Init after clone', command: 'git submodule update --init --recursive' },
    { task: 'Check status', command: 'git submodule status' },
    { task: 'Run cmd in all', command: "git submodule foreach '<cmd>'" },
    { task: 'Fetch latest remotes', command: 'git submodule update --remote --merge' },
    { task: 'Fix detached HEAD', command: 'cd <submodule> && git checkout main' },
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
    for (const s of allSections) {
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
      {#each groups as group}
        <p class="text-xs font-semibold uppercase tracking-wider mb-2 mt-5 first:mt-0" style="color: var(--color-muted);">{group.label}</p>
        <ul class="flex flex-col gap-0.5 mb-1">
          {#each group.sections as s}
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
      {/each}
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

    <!-- ═══════════════════════════════════════ -->
    <!--  GUIDE                                  -->
    <!-- ═══════════════════════════════════════ -->

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

    <!-- User Guide -->
    <section id="user-guide" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> User Guide
      </h2>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">TUI Layout</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);">┌─────────────────┬──────────────────────────────┐
│   Folders       │   Notes                      │
│                 │                              │
│ > Projects      │ > 2026-lumi-architecture     │
│   Personal      │   2026-meeting-notes         │
│   Archive       │   2026-ideas                 │
│                 │                              │
└─────────────────┴──────────────────────────────┘
┌──────────────────────────────────────────────────┐
│ Help: q=quit | e=edit | n=new | d=delete | ?=help│
└──────────────────────────────────────────────────┘</pre>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">TUI Keybindings</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        {#each tuiKeybindings as kb, i}
          <div class="flex items-center justify-between px-4 py-2" style="border-bottom: {i < tuiKeybindings.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
            <code class="text-xs px-2 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">{kb.keys}</code>
            <span class="text-xs" style="color: var(--color-text-dim);">{kb.desc}</span>
          </div>
        {/each}
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client Login</h3>
      <p class="text-sm mb-4" style="color: var(--color-text-dim);">
        Open the web client in your browser and enter the password (the value of <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_PASSWORD</code>). Your session is encrypted and persisted in localStorage — refreshing the page stays logged in.
      </p>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client Keybindings</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        {#each webKeybindings as kb, i}
          <div class="flex items-center justify-between px-4 py-2" style="border-bottom: {i < webKeybindings.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
            <code class="text-xs px-2 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">{kb.keys}</code>
            <span class="text-xs" style="color: var(--color-text-dim);">{kb.desc}</span>
          </div>
        {/each}
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Workflows</h3>
      <div class="flex flex-col gap-3">
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Creating a note</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Press <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">n</code>, type a title, and your editor opens with frontmatter pre-filled. Save and close to return to lumi.</p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Editing a note</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Navigate with <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">j/k</code>, press <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">e</code> or <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">Enter</code> to open in your <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">$EDITOR</code>. Changes are detected automatically on save.</p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Quick copy</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Press <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">v</code> to enter visual mode, select with <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">j/k</code>, then <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">y</code> to copy to clipboard.</p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Link following</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Move cursor to a <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">[[wiki-link]]</code> and press <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">Enter</code> to jump to that note.</p>
        </div>
      </div>

      <h3 class="text-sm font-semibold mb-3 mt-6" style="color: var(--color-secondary);">Settings & Themes</h3>
      <p class="text-sm mb-2" style="color: var(--color-text-dim);">
        Press <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">c</code> in the TUI to open settings. The view uses a split layout — settings on the left, a live-rendered note preview on the right. Both columns update instantly as you cycle themes with <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">h/l</code>.
      </p>
      <p class="text-sm" style="color: var(--color-text-dim);">
        12 themes are available across dark and light modes: Tokyo Night, Tokyo Day, Catppuccin Mocha, Catppuccin Latte, Dracula, Obsidian, and several pride themes.
      </p>
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

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Editor</h3>
      <p class="text-sm mb-2" style="color: var(--color-text-dim);">
        The TUI uses your <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">$EDITOR</code> environment variable. If not set, defaults to <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">nvim</code>.
      </p>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-muted);"># Use vim</span>
<span style="color: var(--color-primary);">export</span> EDITOR=vim

<span style="color: var(--color-muted);"># Use VS Code (wait for window to close)</span>
<span style="color: var(--color-primary);">export</span> EDITOR="code --wait"

<span style="color: var(--color-muted);"># Use emacs</span>
<span style="color: var(--color-primary);">export</span> EDITOR=emacs</pre>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Troubleshooting</h3>
      <div class="flex flex-col gap-3">
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">TUI won't start</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Check that Go 1.23+ is installed (<code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">go version</code>) and your terminal supports ANSI colors.</p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Editor doesn't open</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Verify <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">$EDITOR</code> is set and in your PATH. Try <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">export EDITOR=vim</code>.</p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Server connection fails</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Check the server is running (<code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">curl http://localhost:8080/api/folders</code>), verify your token matches, and check firewall settings.</p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Notes not syncing</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Check the WebSocket connection in browser console, verify server logs, and ensure <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ROOT</code> points to the correct directory.</p>
        </div>
      </div>
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
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Where are my notes stored?</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Wherever you point lumi. Pass a directory as an argument to the TUI (<code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">./lumi ~/notes</code>) or set <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ROOT</code> for the server. There is no hidden database — only the files you see.</p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════ -->
    <!--  REFERENCE                              -->
    <!-- ═══════════════════════════════════════ -->

    <!-- Architecture -->
    <section id="architecture" class="mb-16">
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

    <!-- Project Structure -->
    <section id="project-structure" class="mb-16">
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

    <!-- Docker & Environment -->
    <section id="docker-environment" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> Docker & Environment
      </h2>

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

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">How Environment Variables Flow</h3>

      <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Server chain</h4>
      <div class="rounded-xl border overflow-hidden mb-4" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text-dim);"><span style="color: var(--color-accent);">.env</span> file  →  compose <span style="color: var(--color-accent);">environment:</span>  →  container env  →  Go <span style="color: var(--color-accent);">os.Getenv()</span> with fallbacks</pre>
      </div>
      <p class="text-sm mb-4" style="color: var(--color-text-dim);">
        The server reads <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ROOT</code>, <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_PASSWORD</code>, and <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_PORT</code> at startup via <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">os.Getenv()</code>, falling back to compiled defaults. These are runtime values — you can change them without rebuilding the image.
      </p>

      <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Web client chain</h4>
      <div class="rounded-xl border overflow-hidden mb-4" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text-dim);"><span style="color: var(--color-accent);">.env</span> LUMI_SERVER_URL  →  compose <span style="color: var(--color-accent);">build.args</span>  →  Dockerfile <span style="color: var(--color-accent);">ARG</span>  →  Vite bakes into JS  →  <span style="color: var(--color-accent);">import.meta.env</span></pre>
      </div>
      <p class="text-sm mb-4" style="color: var(--color-text-dim);">
        The web client URL is a <strong>build-time only</strong> value. Vite replaces <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">import.meta.env.VITE_LUMI_SERVER_URL</code> with a literal string during the build. The resulting static files are served by nginx — there is no Node.js runtime to read environment variables, so changing the URL requires a rebuild.
      </p>

      <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">ARG vs ENV in Docker</h4>
      <p class="text-sm mb-6" style="color: var(--color-text-dim);">
        <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">ARG</code> is available only during <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">docker build</code> — used by the web client to bake the server URL into the JS bundle.
        <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">ENV</code> is available at <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">docker run</code> — used by the server for runtime configuration. The server Dockerfile uses <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">ENV</code> with defaults that can be overridden via <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">-e</code> or compose <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">environment:</code>.
      </p>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Standalone Docker</h3>
      <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Server</h4>
      <div class="rounded-xl border overflow-hidden mb-4" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre">docker build -t lumi-server ./server
docker run -d -p 8080:8080 \
  -v /path/to/notes:/notes \
  -e LUMI_PASSWORD=your-secret \
  lumi-server</pre>
      </div>

      <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Web client</h4>
      <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre">docker build \
  --build-arg VITE_LUMI_SERVER_URL=http://your-server:8080 \
  -t lumi-web ./web-client
docker run -d -p 3000:80 lumi-web</pre>
      </div>
    </section>

    <!-- API Reference -->
    <section id="api-reference" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> API Reference
      </h2>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Authentication</h3>
      <p class="text-sm mb-4" style="color: var(--color-text-dim);">
        All REST endpoints require the <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">X-Lumi-Token</code> header set to the server password. The WebSocket endpoint requires a <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">?token=</code> query parameter instead. <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">POST /api/auth</code> is the only endpoint exempt from middleware — it validates the token for the login flow.
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

    <!-- ═══════════════════════════════════════ -->
    <!--  CONTRIBUTING                           -->
    <!-- ═══════════════════════════════════════ -->

    <!-- Development Setup -->
    <section id="development-setup" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> Development Setup
      </h2>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">TUI Client</h3>
      <p class="text-sm mb-2" style="color: var(--color-text-dim);">Requires Go 1.23+.</p>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> tui-client
go mod tidy
go run main.go ../notes</pre>
      </div>
      <p class="text-sm mb-6" style="color: var(--color-text-dim);">
        Dependencies: <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">bubbletea</code>, <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">bubbles</code>, <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">lipgloss</code>. Optional for images: <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">timg</code>, <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">chafa</code>, or <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">viu</code>.
      </p>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Server</h3>
      <p class="text-sm mb-2" style="color: var(--color-text-dim);">Requires Go 1.21+.</p>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> server
go mod tidy
LUMI_ROOT=../notes LUMI_PASSWORD=dev go run main.go</pre>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client</h3>
      <p class="text-sm mb-2" style="color: var(--color-text-dim);">Requires Node.js 18+.</p>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> web-client
npm install
npm run dev     <span style="color: var(--color-muted);"># http://localhost:5173, uses VITE_LUMI_SERVER_URL from .env</span></pre>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Full Stack (Docker Compose)</h3>
      <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre">cp .env.example .env            <span style="color: var(--color-muted);"># edit LUMI_PASSWORD</span>
docker compose up -d            <span style="color: var(--color-muted);"># web on :3000, API on :8080</span>
docker compose logs -f          <span style="color: var(--color-muted);"># watch logs</span></pre>
      </div>
    </section>

    <!-- Git & Submodules -->
    <section id="git-submodules" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> Git & Submodules
      </h2>
      <p class="text-sm mb-6" style="color: var(--color-text-dim);">
        lumi is organized as a monorepo where each component is a separate Git repository linked via submodules. The root repo (<code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">ViniZap4/lumi</code>) acts as a manifest that pins each submodule to a specific commit.
      </p>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Repository Map</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <table class="w-full text-sm">
          <thead>
            <tr style="background: var(--color-selected-bg); border-bottom: 1px solid var(--color-border);">
              <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Path</th>
              <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Repository</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--color-separator);">
              <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">tui-client/</td>
              <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">ViniZap4/lumi-tui</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--color-separator);">
              <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">server/</td>
              <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">ViniZap4/lumi-server</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--color-separator);">
              <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">web-client/</td>
              <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">ViniZap4/lumi-web</td>
            </tr>
            <tr>
              <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">site/</td>
              <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">ViniZap4/lumi-site</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Cloning</h3>
      <div class="rounded-xl border overflow-hidden mb-2" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-muted);"># Clone with all submodules</span>
git clone --recurse-submodules git@github.com:ViniZap4/lumi.git

<span style="color: var(--color-muted);"># Already cloned without submodules?</span>
git submodule update --init --recursive</pre>
      </div>
      <p class="text-sm mb-6" style="color: var(--color-text-dim);">
        You can also clone any component independently: <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">git clone git@github.com:ViniZap4/lumi-tui.git</code>
      </p>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Day-to-Day Workflow</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-muted);"># 1. Work inside a submodule</span>
<span style="color: var(--color-primary);">cd</span> tui-client
<span style="color: var(--color-muted);"># make changes...</span>
git add -A
git commit -m "feat: add new keybinding"
git push

<span style="color: var(--color-muted);"># 2. Update the root repo's submodule reference</span>
<span style="color: var(--color-primary);">cd</span> ..
git add tui-client
git commit -m "feat(tui): add new keybinding"
git push</pre>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Common Scenarios</h3>
      <div class="flex flex-col gap-3 mb-6">
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Submodule is in detached HEAD</p>
          <p class="text-xs" style="color: var(--color-text-dim);">This happens after <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git submodule update</code>. Fix it: <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">cd tui-client && git checkout main</code></p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Push changes to multiple submodules</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Push each one, then update root: <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git submodule foreach 'git push || true'</code>, then <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git add tui-client server web-client && git commit && git push</code></p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Pulling updates from all repos</p>
          <p class="text-xs" style="color: var(--color-text-dim);"><code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git pull --recurse-submodules</code> or <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git pull && git submodule update --init --recursive</code></p>
        </div>
        <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
          <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Forgot to commit root after submodule push</p>
          <p class="text-xs" style="color: var(--color-text-dim);">Root will show <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">modified: tui-client (new commits)</code>. Just <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git add tui-client && git commit -m "chore: update submodule ref"</code></p>
        </div>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Quick Reference</h3>
      <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
        <table class="w-full text-sm">
          <thead>
            <tr style="background: var(--color-selected-bg); border-bottom: 1px solid var(--color-border);">
              <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Task</th>
              <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Command</th>
            </tr>
          </thead>
          <tbody>
            {#each submoduleQuickRef as ref, i}
              <tr style="border-bottom: {i < submoduleQuickRef.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
                <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">{ref.task}</td>
                <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">{ref.command}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Coding Standards -->
    <section id="coding-standards" class="mb-16">
      <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> Coding Standards
      </h2>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Go</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <ul class="p-4 flex flex-col gap-2">
          <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
            <span style="color: var(--color-muted);">-</span> Format with <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">gofmt</code> and <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">goimports</code>
          </li>
          <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
            <span style="color: var(--color-muted);">-</span> Meaningful package names (<code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">domain</code>, <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">filesystem</code>, not <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">utils</code>)
          </li>
          <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
            <span style="color: var(--color-muted);">-</span> Handle errors explicitly — don't ignore them
          </li>
          <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
            <span style="color: var(--color-muted);">-</span> Keep functions small and focused
          </li>
          <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
            <span style="color: var(--color-muted);">-</span> Prefer composition over inheritance
          </li>
        </ul>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Svelte</h3>
      <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
        <ul class="p-4 flex flex-col gap-2">
          <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
            <span style="color: var(--color-muted);">-</span> One component per file
          </li>
          <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
            <span style="color: var(--color-muted);">-</span> Prefer reactive declarations over manual updates
          </li>
          <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
            <span style="color: var(--color-muted);">-</span> Use stores for shared state
          </li>
        </ul>
      </div>

      <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Commit Messages</h3>
      <p class="text-sm mb-3" style="color: var(--color-text-dim);">
        Follow <a href="https://www.conventionalcommits.org" target="_blank" rel="noopener" class="underline" style="color: var(--color-info);">Conventional Commits</a>. Use imperative mood, keep the first line under 72 characters.
      </p>
      <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
        <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);"><span style="color: var(--color-accent);">feat:</span> add folder navigation to TUI
<span style="color: var(--color-accent);">fix:</span> handle missing frontmatter gracefully
<span style="color: var(--color-accent);">docs:</span> update API endpoints in docs
<span style="color: var(--color-accent);">refactor:</span> extract frontmatter parsing to separate package</pre>
      </div>
    </section>

  </main>
</div>
