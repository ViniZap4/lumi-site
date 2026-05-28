<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Getting Started
  </h2>

  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    lumi v2 ships four clients (TUI, web, Apple, server) and a docs site. The fastest path is Docker Compose — it stands up Postgres, the multi-tenant server, and the web client in one command. Standalone instructions for each component follow.
  </p>

  <h3 class="text-sm font-semibold mb-3 mt-6" style="color: var(--color-secondary);">Docker Compose (recommended)</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Brings up <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">postgres</code>, <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">server</code>, and <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">web</code> together. The server links libyrs.a (yrs/y-crdt) statically via cgo, so the recursive submodule init is required.
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <div class="flex items-center gap-2 px-4 py-2.5 border-b" style="border-color: var(--color-border); background: var(--color-selected-bg);">
      <span class="w-2.5 h-2.5 rounded-full" style="background: var(--color-error);"></span>
      <span class="w-2.5 h-2.5 rounded-full" style="background: var(--color-warning);"></span>
      <span class="w-2.5 h-2.5 rounded-full" style="background: #a9b665;"></span>
      <span class="text-xs ml-2" style="color: var(--color-text-dim);">terminal</span>
    </div>
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-muted);"># Clone with all submodules (server depends on third_party/y-crdt)</span>
git clone --recurse-submodules https://github.com/ViniZap4/lumi.git
<span style="color: var(--color-primary);">cd</span> lumi

<span style="color: var(--color-muted);"># Configure and start</span>
cp .env.example .env          <span style="color: var(--color-muted);"># set POSTGRES_PASSWORD + LUMI_ADMIN_*</span>
docker compose up -d          <span style="color: var(--color-muted);"># web on :3000, API on :8080</span></pre>
  </div>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    On first boot, if <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ADMIN_USERNAME</code> and <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ADMIN_PASSWORD</code> are set and the users table is empty, the server seeds a single admin account. Otherwise the deployment starts in <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_REGISTRATION=invite-only</code> mode and someone has to bootstrap via an invite link.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Server (standalone)</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Requires Go 1.25, Rust stable (for the libyrs cgo build), and a reachable Postgres 16.
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> server
git submodule update --init --recursive    <span style="color: var(--color-muted);"># pulls third_party/y-crdt</span>
make libyrs                                 <span style="color: var(--color-muted);"># cargo build yffi static lib</span>
docker compose up -d postgres               <span style="color: var(--color-muted);"># local Postgres on :5432</span>
make migrate                                <span style="color: var(--color-muted);"># apply SQL migrations</span>
make run                                    <span style="color: var(--color-muted);"># http://localhost:8080</span></pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">TUI Client (standalone)</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Go 1.23+. Works fully offline against a local-only vault; sign into a server with <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">lumi login</code> to enable snapshot+diff sync.
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> tui-client
go build -o lumi
./lumi                                      <span style="color: var(--color-muted);"># vault picker if any registered</span>
./lumi ../vaults/personal                   <span style="color: var(--color-muted);"># open a local vault</span>
./lumi login https://lumi.example.com       <span style="color: var(--color-muted);"># sign in to a server</span>
./lumi vault clone https://lumi.example.com/personal</pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client (standalone)</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Svelte 5 + Vite 7. Set <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">VITE_LUMI_SERVER_URL</code> in <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">.env</code> before <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">npm run dev</code>.
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> web-client
npm install
npm run dev                                 <span style="color: var(--color-muted);"># http://localhost:5173</span></pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Apple Client (macOS / iOS / iPadOS / visionOS)</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    SwiftUI, Swift 6. Requires Xcode 16+ and macOS.
  </p>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-primary);">cd</span> apple-client
make bootstrap                              <span style="color: var(--color-muted);"># installs xcodegen</span>
make open                                   <span style="color: var(--color-muted);"># generates project + opens Xcode</span></pre>
  </div>
</section>
