<script>
  import { onMount } from 'svelte';
  import ThemePicker from './lib/ThemePicker.svelte';
  import { applyTheme, loadTheme } from './lib/themes.js';

  let currentTheme = $state('tokyo-night');

  onMount(() => {
    currentTheme = loadTheme();
    applyTheme(currentTheme);
  });

  const logoLines = [
    '██╗     ██╗   ██╗███╗   ███╗██╗',
    ' ██║     ██║   ██║████╗ ████║██║',
    ' ██║     ██║   ██║██╔████╔██║██║',
    ' ██║     ██║   ██║██║╚██╔╝██║██║',
    ' ███████╗╚██████╔╝██║ ╚═╝ ██║██║',
    ' ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝',
  ];

  const logoColors = [
    'var(--color-logo-0)',
    'var(--color-logo-1)',
    'var(--color-logo-2)',
    'var(--color-logo-3)',
    'var(--color-logo-4)',
    'var(--color-logo-5)',
  ];

  const features = [
    {
      icon: '📁',
      title: 'Local-first',
      desc: 'The filesystem is the single source of truth. Your notes are plain markdown files with YAML frontmatter — no database, no vendor lock-in.',
    },
    {
      icon: '🖥️',
      title: 'Multi-client',
      desc: 'Use the terminal TUI (Bubbletea) for keyboard-driven workflows or the Svelte web client for a browser-based experience.',
    },
    {
      icon: '⚡',
      title: 'Real-time sync',
      desc: 'Authenticated WebSocket-powered live updates keep the web client in sync. File changes propagate instantly across all connected clients.',
    },
    {
      icon: '🔒',
      title: 'Token auth',
      desc: 'Password-gated web client with persistent sessions. All API and WebSocket connections are authenticated via token. One command to deploy with Docker Compose.',
    },
    {
      icon: '📝',
      title: 'Markdown-native',
      desc: 'Notes are standard markdown with YAML frontmatter for metadata. Tags, timestamps, and IDs — all in plain text.',
    },
    {
      icon: '⌨️',
      title: 'Vim keybindings',
      desc: 'Full vim-style navigation in both TUI and web editor. hjkl movement, modal editing, and your $EDITOR for full editing power.',
    },
    {
      icon: '🎨',
      title: '12 themes',
      desc: 'Tokyo Night, Catppuccin, Dracula, Obsidian, and more. Dark and light variants with automatic OS preference detection.',
    },
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

  const techStack = [
    { name: 'Go', url: 'https://go.dev' },
    { name: 'Svelte 5', url: 'https://svelte.dev' },
    { name: 'Bubbletea', url: 'https://github.com/charmbracelet/bubbletea' },
    { name: 'Vite', url: 'https://vite.dev' },
    { name: 'WebSocket', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API' },
  ];

  const repos = [
    { name: 'lumi', desc: 'Monorepo', url: 'https://github.com/ViniZap4/lumi' },
    { name: 'lumi-tui', desc: 'TUI Client', url: 'https://github.com/ViniZap4/lumi-tui' },
    { name: 'lumi-server', desc: 'Server', url: 'https://github.com/ViniZap4/lumi-server' },
    { name: 'lumi-web', desc: 'Web Client', url: 'https://github.com/ViniZap4/lumi-web' },
    { name: 'lumi-site', desc: 'This site', url: 'https://github.com/ViniZap4/lumi-site' },
  ];
</script>

<main class="w-full overflow-x-hidden">
  <!-- Nav -->
  <nav class="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3"
    style="background: var(--color-overlay-bg); border-bottom: 1px solid var(--color-border);">
    <span class="text-sm font-semibold" style="color: var(--color-primary);">lumi</span>
    <div class="flex items-center gap-4">
      <a href="#features" class="text-xs hidden sm:inline" style="color: var(--color-text-dim);">features</a>
      <a href="#architecture" class="text-xs hidden sm:inline" style="color: var(--color-text-dim);">architecture</a>
      <a href="#getting-started" class="text-xs hidden sm:inline" style="color: var(--color-text-dim);">get started</a>
      <ThemePicker bind:current={currentTheme} />
    </div>
  </nav>

  <!-- Hero -->
  <section class="min-h-screen flex items-center justify-center relative"
    style="background: var(--color-overlay-bg);">
    <div class="absolute bottom-0 left-0 right-0 h-px"
      style="background: linear-gradient(90deg, transparent, var(--color-border), transparent);"></div>
    <div class="text-center p-8">
      <pre class="inline-block text-left whitespace-pre mb-6 leading-tight" style="font-size: clamp(0.4rem, 1.8vw, 1rem);" aria-label="LUMI">{#each logoLines as line, i}<span style="color: {logoColors[i]}">{line}</span>{#if i < logoLines.length - 1}
{/if}{/each}</pre>
      <p class="mx-auto mb-4 max-w-md" style="font-size: clamp(0.9rem, 2vw, 1.2rem); color: var(--color-text-dim);">
        A local-first, markdown-based note-taking system
      </p>
      <div class="inline-block px-4 py-2 rounded-lg border mb-10 text-xs"
        style="border-color: var(--color-warning); color: var(--color-warning); background: color-mix(in srgb, var(--color-warning) 8%, transparent);">
        🚧 Under active development — features may change or be incomplete
      </div>
      <div class="flex gap-3 justify-center flex-wrap">
        <a href="https://github.com/ViniZap4/lumi"
          class="inline-block px-6 py-3 rounded-lg font-mono text-sm transition-all duration-200 border"
          style="background: var(--color-primary); color: var(--color-overlay-bg); border-color: var(--color-primary);"
          target="_blank" rel="noopener"
          onmouseenter={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-primary)'; }}
          onmouseleave={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-overlay-bg)'; }}
        >
          GitHub
        </a>
        <a href="#getting-started"
          class="inline-block px-6 py-3 rounded-lg font-mono text-sm transition-all duration-200 border bg-transparent"
          style="color: var(--color-secondary); border-color: var(--color-secondary);"
          onmouseenter={(e) => { e.currentTarget.style.background = 'var(--color-secondary)'; e.currentTarget.style.color = 'var(--color-overlay-bg)'; }}
          onmouseleave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-secondary)'; }}
        >
          Get Started
        </a>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section id="features" class="py-20 px-8 max-w-[1100px] mx-auto">
    <h2 class="text-2xl font-semibold mb-8" style="color: var(--color-text);">
      <span style="color: var(--color-primary);">#</span> Features
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each features as feature}
        <div class="p-5 rounded-xl border transition-colors duration-200 hover:border-[var(--color-primary)]"
          style="border-color: var(--color-border); background: var(--color-background);">
          <span class="text-2xl block mb-3">{feature.icon}</span>
          <h3 class="text-base mb-2" style="color: var(--color-primary);">{feature.title}</h3>
          <p class="text-xs leading-relaxed" style="color: var(--color-text-dim);">{feature.desc}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Screenshots -->
  <section id="screenshots" class="py-20 px-8 max-w-[1100px] mx-auto">
    <h2 class="text-2xl font-semibold mb-8" style="color: var(--color-text);">
      <span style="color: var(--color-primary);">#</span> Screenshots
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
        <div class="aspect-[16/10] flex flex-col items-center justify-center gap-2" style="background: var(--color-selected-bg);">
          <span class="text-lg" style="color: var(--color-text-dim);">TUI Client</span>
          <span class="text-xs" style="color: var(--color-muted);">screenshot coming soon</span>
        </div>
        <p class="p-4 text-xs border-t" style="color: var(--color-text-dim); border-color: var(--color-border);">
          Terminal UI — keyboard-driven note management
        </p>
      </div>
      <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
        <div class="aspect-[16/10] flex flex-col items-center justify-center gap-2" style="background: var(--color-selected-bg);">
          <span class="text-lg" style="color: var(--color-text-dim);">Web Client</span>
          <span class="text-xs" style="color: var(--color-muted);">screenshot coming soon</span>
        </div>
        <p class="p-4 text-xs border-t" style="color: var(--color-text-dim); border-color: var(--color-border);">
          Web UI — 3-panel layout with live sync
        </p>
      </div>
    </div>
  </section>

  <!-- Architecture -->
  <section id="architecture" class="py-20 px-8 max-w-[1100px] mx-auto">
    <h2 class="text-2xl font-semibold mb-8" style="color: var(--color-text);">
      <span style="color: var(--color-primary);">#</span> Architecture
    </h2>
    <div class="rounded-xl border p-6 overflow-x-auto mb-6"
      style="border-color: var(--color-border); background: var(--color-background);">
      <pre class="whitespace-pre leading-tight" style="font-size: clamp(0.55rem, 1.4vw, 0.85rem); color: var(--color-accent);">{architectureDiagram}</pre>
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm" style="color: var(--color-text-dim);">
        <span style="color: var(--color-primary);">TUI client</span> reads/writes the filesystem directly and can optionally connect to the server via WebSocket for real-time sync.
      </p>
      <p class="text-sm" style="color: var(--color-text-dim);">
        <span style="color: var(--color-primary);">Web client</span> connects through the Go server via REST + WebSocket.
      </p>
      <p class="text-sm" style="color: var(--color-text-dim);">
        <span style="color: var(--color-primary);">Servers</span> can peer with each other for multi-instance sync.
      </p>
      <p class="text-sm" style="color: var(--color-text-dim);">
        All clients share the same note format: <span style="color: var(--color-primary);">Markdown + YAML frontmatter</span>.
      </p>
    </div>
  </section>

  <!-- Getting Started -->
  <section id="getting-started" class="py-20 px-8 max-w-[1100px] mx-auto">
    <h2 class="text-2xl font-semibold mb-8" style="color: var(--color-text);">
      <span style="color: var(--color-primary);">#</span> Getting Started
    </h2>
    <div class="rounded-xl border overflow-hidden"
      style="border-color: var(--color-border); background: var(--color-background);">
      <div class="flex items-center gap-2 px-4 py-3 border-b"
        style="border-color: var(--color-border); background: var(--color-selected-bg);">
        <span class="w-3 h-3 rounded-full" style="background: var(--color-error);"></span>
        <span class="w-3 h-3 rounded-full" style="background: var(--color-warning);"></span>
        <span class="w-3 h-3 rounded-full" style="background: #a9b665;"></span>
        <span class="text-xs ml-2" style="color: var(--color-text-dim);">terminal</span>
      </div>
      <pre class="p-6 text-sm leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-muted);"># Clone with all submodules</span>
git clone --recurse-submodules https://github.com/ViniZap4/lumi.git
<span style="color: var(--color-primary);">cd</span> lumi

<span style="color: var(--color-muted);"># TUI Client</span>
<span style="color: var(--color-primary);">cd</span> tui-client && go build -o lumi && ./lumi ../notes

<span style="color: var(--color-muted);"># Server + Web Client (Docker)</span>
cp .env.example .env          <span style="color: var(--color-muted);"># set LUMI_PASSWORD</span>
docker compose up -d          <span style="color: var(--color-muted);"># web on :3000, API on :8080</span></pre>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 px-8 border-t" style="border-color: var(--color-border); background: var(--color-background);">
    <div class="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div>
        <h3 class="text-sm font-semibold mb-4" style="color: var(--color-text);">Repositories</h3>
        <ul class="flex flex-col gap-2">
          {#each repos as repo}
            <li class="text-xs">
              <a href={repo.url} target="_blank" rel="noopener">{repo.name}</a>
              <span style="color: var(--color-text-dim);">— {repo.desc}</span>
            </li>
          {/each}
        </ul>
      </div>
      <div>
        <h3 class="text-sm font-semibold mb-4" style="color: var(--color-text);">Built with</h3>
        <div class="flex flex-wrap gap-2">
          {#each techStack as tech}
            <a href={tech.url}
              class="px-3 py-1.5 rounded-lg border text-xs transition-colors duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              style="border-color: var(--color-border); color: var(--color-text-dim);"
              target="_blank" rel="noopener"
            >{tech.name}</a>
          {/each}
        </div>
      </div>
    </div>
    <div class="max-w-[1100px] mx-auto pt-6 border-t text-center"
      style="border-color: var(--color-border);">
      <p class="text-xs" style="color: var(--color-muted);">lumi — local-first notes</p>
    </div>
  </footer>
</main>
