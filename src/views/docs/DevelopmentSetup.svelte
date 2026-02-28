<section class="mb-16">
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
