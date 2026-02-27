<script>
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
      desc: 'WebSocket-powered live updates keep the web client in sync. File changes propagate instantly across all connected clients.',
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
│ direct FS R/W   │          │  HTTP + WS   │
└────────┬────────┘          └──────┬───────┘
         │                          │
         │ filesystem               │ HTTP/WebSocket
         │                          │
         │                  ┌───────▼─────────┐
         │                  │   Go Server      │
         │                  │  REST + WS Hub   │
         │                  └────────┬─────────┘
         │                           │
         └───────────┬───────────────┘
                     │
            ┌────────▼──────────┐
            │   Filesystem      │
            │ Markdown + YAML   │
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

<main>
  <!-- Hero -->
  <section class="hero">
    <div class="hero-content">
      <pre class="logo" aria-label="LUMI">{#each logoLines as line, i}<span style="color: {logoColors[i]}">{line}</span>{#if i < logoLines.length - 1}
{/if}{/each}</pre>
      <p class="tagline">A local-first, markdown-based note-taking system</p>
      <div class="cta-buttons">
        <a href="https://github.com/ViniZap4/lumi" class="btn btn-primary" target="_blank" rel="noopener">
          GitHub
        </a>
        <a href="#getting-started" class="btn btn-secondary">
          Get Started
        </a>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="features" id="features">
    <h2 class="section-title"><span class="accent">#</span> Features</h2>
    <div class="features-grid">
      {#each features as feature}
        <div class="feature-card">
          <span class="feature-icon">{feature.icon}</span>
          <h3>{feature.title}</h3>
          <p>{feature.desc}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Screenshots -->
  <section class="screenshots" id="screenshots">
    <h2 class="section-title"><span class="accent">#</span> Screenshots</h2>
    <div class="screenshots-grid">
      <div class="screenshot-card">
        <div class="screenshot-placeholder">
          <span class="placeholder-text">TUI Client</span>
          <span class="placeholder-sub">screenshot coming soon</span>
        </div>
        <p class="screenshot-caption">Terminal UI — keyboard-driven note management</p>
      </div>
      <div class="screenshot-card">
        <div class="screenshot-placeholder">
          <span class="placeholder-text">Web Client</span>
          <span class="placeholder-sub">screenshot coming soon</span>
        </div>
        <p class="screenshot-caption">Web UI — 3-panel layout with live sync</p>
      </div>
    </div>
  </section>

  <!-- Architecture -->
  <section class="architecture" id="architecture">
    <h2 class="section-title"><span class="accent">#</span> Architecture</h2>
    <div class="arch-container">
      <pre class="arch-diagram">{architectureDiagram}</pre>
    </div>
    <div class="arch-notes">
      <p><span class="highlight">TUI client</span> reads/writes the filesystem directly — no server needed.</p>
      <p><span class="highlight">Web client</span> connects through the Go server via REST + WebSocket.</p>
      <p>Both share the same note format: <span class="highlight">Markdown + YAML frontmatter</span>.</p>
    </div>
  </section>

  <!-- Getting Started -->
  <section class="getting-started" id="getting-started">
    <h2 class="section-title"><span class="accent">#</span> Getting Started</h2>
    <div class="code-block">
      <div class="code-header">
        <span class="code-dot" style="background: var(--color-error)"></span>
        <span class="code-dot" style="background: var(--color-warning)"></span>
        <span class="code-dot" style="background: #a9b665"></span>
        <span class="code-title">terminal</span>
      </div>
      <pre class="code-content"><span class="comment"># Clone with all submodules</span>
git clone --recurse-submodules https://github.com/ViniZap4/lumi.git
<span class="command">cd</span> lumi

<span class="comment"># TUI Client</span>
<span class="command">cd</span> tui-client && go build -o lumi && ./lumi ../notes

<span class="comment"># Server + Web Client (Docker)</span>
cp .env.example .env
docker-compose up -d</pre>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="footer-content">
      <div class="footer-repos">
        <h3>Repositories</h3>
        <ul>
          {#each repos as repo}
            <li>
              <a href={repo.url} target="_blank" rel="noopener">{repo.name}</a>
              <span class="repo-desc">— {repo.desc}</span>
            </li>
          {/each}
        </ul>
      </div>
      <div class="footer-tech">
        <h3>Built with</h3>
        <div class="tech-badges">
          {#each techStack as tech}
            <a href={tech.url} class="tech-badge" target="_blank" rel="noopener">{tech.name}</a>
          {/each}
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>lumi — local-first notes</p>
    </div>
  </footer>
</main>

<style>
  main {
    max-width: 100%;
    overflow-x: hidden;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: var(--color-text);
  }

  .section-title .accent {
    color: var(--color-primary);
  }

  /* Hero */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-overlay-bg);
    position: relative;
  }

  .hero::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--color-border),
      transparent
    );
  }

  .hero-content {
    text-align: center;
    padding: 2rem;
  }

  .logo {
    font-size: clamp(0.4rem, 1.8vw, 1rem);
    line-height: 1.2;
    margin-bottom: 1.5rem;
    white-space: pre;
    display: inline-block;
    text-align: left;
  }

  .tagline {
    font-size: clamp(0.9rem, 2vw, 1.2rem);
    color: var(--color-text-dim);
    margin-bottom: 2.5rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    border: 1px solid var(--color-border);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: var(--color-primary);
    color: var(--color-overlay-bg);
    border-color: var(--color-primary);
  }

  .btn-primary:hover {
    background: transparent;
    color: var(--color-primary);
  }

  .btn-secondary {
    background: transparent;
    color: var(--color-secondary);
    border-color: var(--color-secondary);
  }

  .btn-secondary:hover {
    background: var(--color-secondary);
    color: var(--color-overlay-bg);
  }

  /* Features */
  .features {
    padding: 5rem 2rem;
    max-width: 1100px;
    margin: 0 auto;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    transition: border-color 0.2s;
  }

  .feature-card:hover {
    border-color: var(--color-primary);
  }

  .feature-icon {
    font-size: 1.5rem;
    display: block;
    margin-bottom: 0.75rem;
  }

  .feature-card h3 {
    font-size: 1rem;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }

  .feature-card p {
    font-size: 0.8rem;
    color: var(--color-text-dim);
    line-height: 1.5;
  }

  /* Screenshots */
  .screenshots {
    padding: 5rem 2rem;
    max-width: 1100px;
    margin: 0 auto;
  }

  .screenshots-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .screenshot-card {
    border: 1px solid var(--color-border);
    background: var(--color-background);
    overflow: hidden;
  }

  .screenshot-placeholder {
    aspect-ratio: 16 / 10;
    background: var(--color-selected-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .placeholder-text {
    font-size: 1.2rem;
    color: var(--color-text-dim);
  }

  .placeholder-sub {
    font-size: 0.75rem;
    color: var(--color-muted);
  }

  .screenshot-caption {
    padding: 1rem;
    font-size: 0.8rem;
    color: var(--color-text-dim);
    border-top: 1px solid var(--color-border);
  }

  /* Architecture */
  .architecture {
    padding: 5rem 2rem;
    max-width: 1100px;
    margin: 0 auto;
  }

  .arch-container {
    border: 1px solid var(--color-border);
    background: var(--color-background);
    padding: 2rem;
    overflow-x: auto;
    margin-bottom: 2rem;
  }

  .arch-diagram {
    font-size: clamp(0.55rem, 1.4vw, 0.85rem);
    line-height: 1.4;
    color: var(--color-accent);
    white-space: pre;
  }

  .arch-notes {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .arch-notes p {
    font-size: 0.85rem;
    color: var(--color-text-dim);
  }

  .highlight {
    color: var(--color-primary);
  }

  /* Getting Started */
  .getting-started {
    padding: 5rem 2rem;
    max-width: 1100px;
    margin: 0 auto;
  }

  .code-block {
    border: 1px solid var(--color-border);
    background: var(--color-background);
    overflow: hidden;
  }

  .code-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-selected-bg);
  }

  .code-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  .code-title {
    font-size: 0.75rem;
    color: var(--color-text-dim);
    margin-left: 0.5rem;
  }

  .code-content {
    padding: 1.5rem;
    font-size: 0.85rem;
    line-height: 1.6;
    overflow-x: auto;
    white-space: pre;
  }

  .code-content :global(.comment) {
    color: var(--color-muted);
  }

  .code-content :global(.command) {
    color: var(--color-primary);
  }

  /* Footer */
  footer {
    border-top: 1px solid var(--color-border);
    padding: 3rem 2rem;
    background: var(--color-background);
  }

  .footer-content {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-bottom: 2rem;
  }

  footer h3 {
    font-size: 0.9rem;
    color: var(--color-text);
    margin-bottom: 1rem;
  }

  footer ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  footer li {
    font-size: 0.8rem;
  }

  .repo-desc {
    color: var(--color-text-dim);
  }

  .tech-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tech-badge {
    padding: 0.35rem 0.75rem;
    border: 1px solid var(--color-border);
    font-size: 0.75rem;
    color: var(--color-text-dim);
    transition: all 0.2s;
  }

  .tech-badge:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .footer-bottom {
    max-width: 1100px;
    margin: 0 auto;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
    text-align: center;
  }

  .footer-bottom p {
    font-size: 0.8rem;
    color: var(--color-muted);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: 1fr;
    }

    .screenshots-grid {
      grid-template-columns: 1fr;
    }

    .footer-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  @media (max-width: 480px) {
    .logo {
      font-size: 0.35rem;
    }

    .arch-diagram {
      font-size: 0.5rem;
    }
  }
</style>
