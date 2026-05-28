<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Development Setup
  </h2>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Server</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">
    Requires Go 1.25, Rust stable (cgo libyrs build), and a reachable Postgres 16.
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> server
git submodule update --init --recursive    <span style="color: var(--color-muted);"># pulls third_party/y-crdt</span>
make libyrs                                 <span style="color: var(--color-muted);"># cargo build yffi static lib</span>
docker compose up -d postgres               <span style="color: var(--color-muted);"># local Postgres on :5432</span>
make migrate                                <span style="color: var(--color-muted);"># apply SQL migrations</span>
make run                                    <span style="color: var(--color-muted);"># http://localhost:8080</span>

<span style="color: var(--color-muted);"># Tests</span>
make test                                   <span style="color: var(--color-muted);"># unit</span>
make test-integration                       <span style="color: var(--color-muted);"># testcontainers-go Postgres</span>
make smoke                                  <span style="color: var(--color-muted);"># docker compose smoke</span></pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">TUI Client</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">Requires Go 1.23+.</p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> tui-client
go mod tidy
go run . ../vaults/personal                 <span style="color: var(--color-muted);"># open a local vault</span>
go test ./...                               <span style="color: var(--color-muted);"># unit tests (account, sync, cmd_* subcommands)</span></pre>
  </div>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    Dependencies: <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">bubbletea</code>, <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">bubbles</code>, <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">lipgloss</code>. Optional for images: <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">timg</code>, <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">chafa</code>, <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">viu</code>.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">Requires Node.js 20+.</p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> web-client
npm install
npm run dev     <span style="color: var(--color-muted);"># http://localhost:5173, uses VITE_LUMI_SERVER_URL from .env</span>
npm test        <span style="color: var(--color-muted);"># vitest (auth, capabilities, markdown sanitisation, ...)</span>
npm run build   <span style="color: var(--color-muted);"># production build to dist/</span></pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Apple Client</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">Requires Xcode 16+ on macOS, Swift 6.</p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> apple-client
make bootstrap                              <span style="color: var(--color-muted);"># installs xcodegen</span>
make open                                   <span style="color: var(--color-muted);"># generates project + opens Xcode</span>
make test                                   <span style="color: var(--color-muted);"># swift test</span></pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Full Stack (Docker Compose)</h3>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre">cp .env.example .env            <span style="color: var(--color-muted);"># set POSTGRES_PASSWORD + LUMI_ADMIN_*</span>
docker compose up -d            <span style="color: var(--color-muted);"># postgres + server + web</span>
docker compose logs -f          <span style="color: var(--color-muted);"># watch logs</span>
docker compose build web        <span style="color: var(--color-muted);"># rebuild web after changing LUMI_SERVER_URL</span></pre>
  </div>
</section>
