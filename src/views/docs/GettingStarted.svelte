<section class="mb-16">
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
