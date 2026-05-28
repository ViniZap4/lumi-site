<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Coding Standards
  </h2>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Pillars</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Applied to every design decision, in order. LGPD compliance is a hard constraint, not a preference.
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <ul class="p-4 flex flex-col gap-2">
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">1.</span> Security first / LGPD compliance</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">2.</span> Performance — cold-start &lt;1s, note-open &lt;200ms p95, CRDT echo &lt;50ms p95</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">3.</span> DX — sqlc, structured logging, hot-reload, scriptable ops CLI</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">4.</span> Scale — stateless server, sessions in Postgres, sticky-LB horizontally-ready</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">5.</span> UX — multi-vault clients, invite-link signup, presence, vault portability</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">6.</span> UI — keyboard-first, vim mode, 12 shared themes</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">7.</span> QA — automated tests for security-critical + CRDT paths</li>
    </ul>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Go</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <ul class="p-4 flex flex-col gap-2">
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Format with <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">gofmt</code> and <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">goimports</code></li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Meaningful package names (<code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">auth</code>, <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">crdt</code>, <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">wsync</code> — never <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">utils</code>)</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Explicit error handling; never ignore errors. Domain errors via <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">domain.ErrValidation</code>, <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">domain.ErrUnauthorized</code>, etc.</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Postgres via <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">pgx/v5</code> + <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">sqlc</code>; no ORM</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Path joins through <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">storage/fs.SafeJoin</code> — rejects <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">..</code>, absolute paths, and symlink escapes</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Constant-time compares for tokens / passwords (<code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">crypto/subtle</code>, <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">bcrypt.CompareHashAndPassword</code>)</li>
    </ul>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Svelte</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <ul class="p-4 flex flex-col gap-2">
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Svelte 5 runes (<code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">$state</code>, <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">$derived</code>, <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">$effect</code>); no Svelte 4 stores</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> One component per file</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Lazy-load heavy chunks (Yjs, CodeMirror, vim) on first edit</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Markdown sanitised with DOMPurify before injection; CSP enforced via meta tag + nginx headers</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> TypeScript everywhere (.ts / .svelte.ts), strict mode on</li>
    </ul>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Swift</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <ul class="p-4 flex flex-col gap-2">
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Swift 6 strict concurrency; CRDT access through a <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">Y.Doc</code> actor</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Module split: <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">LumiKit</code> (platform-agnostic) → <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">LumiUI</code> (shared SwiftUI) → app target</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Native TextKit 2 vim engine — no embedded webview editor</li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);"><span style="color: var(--color-muted);">-</span> Per-launch client ID for stable presence across reconnects</li>
    </ul>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Tests</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    v1's "no automated tests" convention is superseded for security-critical and CRDT paths. v2 ships unit tests (<code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">go test ./...</code>), integration tests against a real Postgres via <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">testcontainers-go</code>, a smoke harness, and vitest suites in the web client. Coverage targets: 80%+ for <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">internal/auth</code>, <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">internal/domain/capability</code>, <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">internal/storage/fs</code>.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Commit Messages</h3>
  <p class="text-sm mb-3" style="color: var(--color-text-dim);">
    Conventional Commits with a module scope. Imperative mood, first line under 72 characters. Push immediately after every commit (monorepo convention is push-after-every-commit, including submodule pointer bumps).
  </p>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);"><span style="color: var(--color-accent);">feat(server, notes):</span> paginate list endpoint
<span style="color: var(--color-accent);">fix(web, phase-4.x):</span> sanitise wiki-link href before render
<span style="color: var(--color-accent);">docs(site):</span> rewrite api reference for v2
<span style="color: var(--color-accent);">refactor(tui, sync):</span> extract diff client to its own package
<span style="color: var(--color-accent);">chore(monorepo):</span> bump server to phase 3 hardening</pre>
  </div>
</section>
