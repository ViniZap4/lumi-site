<script lang="ts">
  import { onMount } from 'svelte';
  import ThemePicker from './lib/ThemePicker.svelte';
  import DocsView from './views/DocsView.svelte';
  import { applyTheme, resolveTheme, loadThemeSettings, watchSystemTheme } from './lib/themes.ts';
  import type { ThemeMode } from './lib/themes.ts';

  let mode: ThemeMode = $state('dark');
  let darkName: string = $state('tokyo-night');
  let lightName: string = $state('tokyo-day');
  let route: string = $state('home');
  let docsPage: string = $state('getting-started');

  const BASE_URL = 'https://lumi-note.vercel.app';

  const pageMeta: Record<string, { title: string; description: string }> = {
    home: {
      title: 'Lumi — Local-first note-taking',
      description: 'A local-first, markdown-based note-taking system with real-time collaboration. Portable vaults, Yjs CRDT sync, and TUI, web, and Apple clients.',
    },
    'getting-started': {
      title: 'Getting Started — Lumi Docs',
      description: 'Install and set up Lumi: clone the repo, build the TUI client, run the server, and launch the web client.',
    },
    'user-guide': {
      title: 'User Guide — Lumi Docs',
      description: 'Learn how to use Lumi: create notes, organize folders, search, and navigate the TUI and web clients.',
    },
    'configuration': {
      title: 'Configuration — Lumi Docs',
      description: 'Configure Lumi: environment variables, per-folder config, server settings, and TUI options.',
    },
    'note-format': {
      title: 'Note Format — Lumi Docs',
      description: 'Lumi note format: Markdown files with YAML frontmatter for ID, title, timestamps, and tags.',
    },
    'faq': {
      title: 'FAQ — Lumi Docs',
      description: 'Frequently asked questions about Lumi: troubleshooting, compatibility, and common workflows.',
    },
    'architecture': {
      title: 'Architecture — Lumi Docs',
      description: 'Lumi system architecture: TUI, web, and Apple clients, multi-tenant Go server, Postgres, and Yjs CRDT sync over WebSocket.',
    },
    'project-structure': {
      title: 'Project Structure — Lumi Docs',
      description: 'Lumi project structure: monorepo layout, submodule organization, and package conventions.',
    },
    'docker-environment': {
      title: 'Docker & Environment — Lumi Docs',
      description: 'Run Lumi with Docker Compose: container setup, environment variables, and production deployment.',
    },
    'api-reference': {
      title: 'API Reference — Lumi Docs',
      description: 'Lumi REST API and WebSocket reference: endpoints, session authentication, request/response schemas, and the Yjs sync protocol.',
    },
    'development-setup': {
      title: 'Development Setup — Lumi Docs',
      description: 'Set up a Lumi development environment: Go, Node.js, and local server configuration.',
    },
    'git-submodules': {
      title: 'Git & Submodules — Lumi Docs',
      description: 'Working with Lumi git submodules: cloning, updating, and contributing across repositories.',
    },
    'coding-standards': {
      title: 'Coding Standards — Lumi Docs',
      description: 'Lumi coding conventions: Go style, Svelte patterns, commit messages, and code formatting.',
    },
  };

  function updateMeta() {
    const key = route === 'docs' ? docsPage : 'home';
    const meta = pageMeta[key] || pageMeta['home'];
    const canonicalPath = route === 'docs' ? `/docs/${docsPage}` : '/';
    const canonicalUrl = `${BASE_URL}${canonicalPath}`;

    document.title = meta.title;

    const setMeta = (attr: string, key: string, value: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (el) el.setAttribute('content', value);
    };

    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('name', 'twitter:title', meta.title);
    setMeta('name', 'twitter:description', meta.description);
    setMeta('name', 'description', meta.description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) canonical.href = canonicalUrl;
  }

  function navigate(path: string) {
    window.history.pushState({}, '', path);
    updateRoute();
  }

  function updateRoute() {
    const path = window.location.pathname;
    if (path.startsWith('/docs')) {
      route = 'docs';
      docsPage = path.replace('/docs', '').replace(/^\//, '') || 'getting-started';
    } else {
      route = 'home';
    }
    updateMeta();
  }

  function handleClick(e: MouseEvent) {
    const anchor = (e.target as Element).closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // Let external links, new-tab clicks, and modifier keys pass through
    if (anchor.target === '_blank' || anchor.origin !== window.location.origin) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    // In-page anchor on the home page — let the browser scroll
    if (href.startsWith('#') && !href.startsWith('#/')) {
      if (route !== 'home') {
        e.preventDefault();
        navigate('/');
        // After navigating home, scroll to anchor on next tick
        const id = href.slice(1);
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        });
      }
      return;
    }

    // Internal path navigation
    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
    }
  }

  onMount(() => {
    const settings = loadThemeSettings();
    mode = settings.mode;
    darkName = settings.darkName;
    lightName = settings.lightName;
    applyTheme(resolveTheme(mode, darkName, lightName));

    updateRoute();
    window.addEventListener('popstate', updateRoute);
    document.addEventListener('click', handleClick);

    const cleanup = watchSystemTheme(() => {
      if (mode === 'auto') {
        applyTheme(resolveTheme(mode, darkName, lightName));
      }
    });

    return () => {
      window.removeEventListener('popstate', updateRoute);
      document.removeEventListener('click', handleClick);
      cleanup();
    };
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
      title: 'Local-first vaults',
      desc: 'A vault is a portable directory of plain markdown files with YAML frontmatter. The filesystem stays the source of truth — no vendor lock-in.',
    },
    {
      icon: '🖥️',
      title: 'Multi-client',
      desc: 'Terminal TUI (Bubbletea) for keyboard-driven workflows, a Svelte web client for the browser, and a native SwiftUI client for iOS, iPadOS, macOS, and visionOS.',
    },
    {
      icon: '⚡',
      title: 'Real-time collaboration',
      desc: 'Yjs CRDT sync over WebSocket with live presence. Concurrent edits merge conflict-free, and external file edits are diff-merged in via the filesystem watcher.',
    },
    {
      icon: '🔒',
      title: 'Per-vault roles',
      desc: 'Session-based auth with invite-link signup. Custom per-vault roles and capabilities gate every action, on a self-hosted multi-tenant server.',
    },
    {
      icon: '📝',
      title: 'Markdown-native',
      desc: 'Notes are standard markdown with YAML frontmatter for metadata. Tags, timestamps, and IDs — all in plain text.',
    },
    {
      icon: '⌨️',
      title: 'Vim keybindings',
      desc: 'Full vim-style editing everywhere: TUI motions with $EDITOR handoff, CodeMirror vim mode on the web, and a native vim engine in the Apple client.',
    },
    {
      icon: '🎨',
      title: '12 themes',
      desc: 'Tokyo Night, Catppuccin, Dracula, Obsidian, and pride themes. Dark and light variants with automatic OS preference detection.',
    },
  ];

  const architectureDiagram = `┌─────────────────┐  ┌──────────────┐  ┌──────────────────┐
│   TUI Client    │  │  Web Client  │  │   Apple Client   │
│ (Go + Bubbletea)│  │  (Svelte 5)  │  │    (SwiftUI)     │
└────────┬────────┘  └──────┬───────┘  └────────┬─────────┘
         │                  │                   │
  snapshot+diff       Yjs WS + REST       Yjs WS + REST
  REST sync           (live awareness)    (yswift + presence)
         │                  │                   │
         └──────────────────┼───────────────────┘
                            │
                  ┌─────────▼──────────┐
                  │    lumi-server     │
                  │  Fiber + cgo yrs   │
                  └─────────┬──────────┘
                            │
              ┌─────────────┴────────────┐
              │                          │
       ┌──────▼──────┐         ┌─────────▼─────────┐
       │  Postgres   │         │    Filesystem     │
       │ users/vaults│         │  Markdown + YAML  │
       │ roles/audit │         │  frontmatter      │
       │  Yjs state  │         │ (source of truth) │
       └─────────────┘         └───────────────────┘`;

  const techStack = [
    { name: 'Go', url: 'https://go.dev' },
    { name: 'Fiber', url: 'https://gofiber.io' },
    { name: 'Postgres', url: 'https://www.postgresql.org' },
    { name: 'Yjs / y-crdt', url: 'https://github.com/y-crdt/y-crdt' },
    { name: 'Svelte 5', url: 'https://svelte.dev' },
    { name: 'SwiftUI', url: 'https://developer.apple.com/xcode/swiftui/' },
    { name: 'Bubbletea', url: 'https://github.com/charmbracelet/bubbletea' },
    { name: 'Vite', url: 'https://vite.dev' },
  ];

  const repos = [
    { name: 'lumi', desc: 'Monorepo', url: 'https://github.com/ViniZap4/lumi' },
    { name: 'lumi-tui', desc: 'TUI Client', url: 'https://github.com/ViniZap4/lumi-tui' },
    { name: 'lumi-server', desc: 'Server', url: 'https://github.com/ViniZap4/lumi-server' },
    { name: 'lumi-web', desc: 'Web Client', url: 'https://github.com/ViniZap4/lumi-web' },
    { name: 'lumi-apple', desc: 'Apple Client', url: 'https://github.com/ViniZap4/lumi-apple' },
    { name: 'lumi-site', desc: 'This site', url: 'https://github.com/ViniZap4/lumi-site' },
  ];
</script>

<!-- Nav (shared across all routes) -->
<nav class="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3"
  style="background: var(--color-overlay-bg); border-bottom: 1px solid var(--color-border);">
  <a href="/" class="text-sm font-semibold" style="color: var(--color-primary);">lumi</a>
  <div class="flex items-center gap-4">
    {#if route === 'home'}
      <a href="#features" class="text-xs hidden sm:inline" style="color: var(--color-text-dim);">features</a>
      <a href="#architecture" class="text-xs hidden sm:inline" style="color: var(--color-text-dim);">architecture</a>
    {/if}
    <a href="/docs" class="text-xs hidden sm:inline" style="color: {route === 'docs' ? 'var(--color-primary)' : 'var(--color-text-dim)'};">docs</a>
    {#if route === 'home'}
      <a href="#getting-started" class="text-xs hidden sm:inline" style="color: var(--color-text-dim);">get started</a>
    {/if}
    <ThemePicker bind:mode bind:darkName bind:lightName />
  </div>
</nav>

{#if route === 'docs'}
  <DocsView activePage={docsPage} />
{:else}
  <main class="w-full overflow-x-hidden">
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
          <a href="/docs"
            class="inline-block px-6 py-3 rounded-lg font-mono text-sm transition-all duration-200 border bg-transparent"
            style="color: var(--color-secondary); border-color: var(--color-secondary);"
            onmouseenter={(e) => { e.currentTarget.style.background = 'var(--color-secondary)'; e.currentTarget.style.color = 'var(--color-overlay-bg)'; }}
            onmouseleave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-secondary)'; }}
          >
            Documentation
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
          <span style="color: var(--color-primary);">TUI client</span> works on local vaults directly and syncs server-bound vaults via snapshot+diff REST — the server merges each diff into the live CRDT.
        </p>
        <p class="text-sm" style="color: var(--color-text-dim);">
          <span style="color: var(--color-primary);">Web and Apple clients</span> collaborate live over Yjs WebSocket sync with awareness and presence.
        </p>
        <p class="text-sm" style="color: var(--color-text-dim);">
          <span style="color: var(--color-primary);">The server</span> is a multi-tenant vault host: Postgres holds users, roles, and CRDT state, while external file edits are diff-merged in via fsnotify.
        </p>
        <p class="text-sm" style="color: var(--color-text-dim);">
          All clients share the same note format: <span style="color: var(--color-primary);">Markdown + YAML frontmatter</span> — the filesystem stays the source of truth.
        </p>
      </div>
    </section>

    <!-- Getting Started -->
    <section id="getting-started" class="py-20 px-8 max-w-[1100px] mx-auto">
      <h2 class="text-2xl font-semibold mb-8" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">#</span> Getting Started
      </h2>
      <div class="rounded-xl border overflow-hidden mb-6"
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
cp .env.example .env          <span style="color: var(--color-muted);"># set POSTGRES_PASSWORD, LUMI_ADMIN_*</span>
docker compose up -d          <span style="color: var(--color-muted);"># web on :3000, API on :8080</span></pre>
      </div>
      <p class="text-sm" style="color: var(--color-text-dim);">
        See the <a href="/docs" style="color: var(--color-primary);">full documentation</a> for standalone setup, environment variables, and configuration.
      </p>
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
{/if}
