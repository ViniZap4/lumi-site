<script>
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
                  │  lumi-server (v2)  │
                  │  Fiber + cgo yrs   │
                  └─────────┬──────────┘
                            │
              ┌─────────────┴────────────┐
              │                          │
       ┌──────▼──────┐         ┌─────────▼─────────┐
       │  Postgres   │         │   Filesystem      │
       │ users/vaults│         │  &lt;vault&gt;/notes/   │
       │ roles/audit │         │  Markdown + YAML  │
       │ Yjs state   │         │ (source of truth) │
       └─────────────┘         └───────────────────┘`;
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Architecture
  </h2>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Source of Truth</h3>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    The filesystem holds the canonical bytes — every note is a markdown file with optional YAML frontmatter, sitting in a vault directory. Postgres holds users, vaults, roles, membership, audit, and the compacted Yjs CRDT state per note. The CRDT is the operational projection used to merge concurrent edits; the markdown file is what you can <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">ls</code>, <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">cat</code>, <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">grep</code>.
  </p>

  <div class="rounded-xl border p-5 overflow-x-auto mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="whitespace-pre leading-tight" style="font-size: clamp(0.5rem, 1.3vw, 0.8rem); color: var(--color-accent);">{architectureDiagram}</pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Components</h3>
  <div class="flex flex-col gap-3 mb-6">
    <div class="flex gap-3 items-start">
      <span class="text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5" style="background: var(--color-selected-bg); color: var(--color-primary);">TUI</span>
      <div>
        <p class="text-sm" style="color: var(--color-text-dim);">Go 1.23+ + Bubbletea + Lipgloss. Reads/writes the filesystem directly for local-only vaults. For server-bound vaults, uses REST snapshot+diff sync (no live cursors — <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">$EDITOR</code> is opaque). Multi-server account store in <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">~/.config/lumi/</code>.</p>
      </div>
    </div>
    <div class="flex gap-3 items-start">
      <span class="text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5" style="background: var(--color-selected-bg); color: var(--color-primary);">Server</span>
      <div>
        <p class="text-sm" style="color: var(--color-text-dim);">Go 1.25 + Fiber v2 + pgx/v5 + yrs (Rust Yjs core via cgo). Multi-tenant: hosts many vaults with per-vault custom roles and invite-link signup. Session-based auth in Postgres, bcrypt cost 12, 30-day sliding TTL. fsnotify watcher diff-merges external edits into the live CRDT.</p>
      </div>
    </div>
    <div class="flex gap-3 items-start">
      <span class="text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5" style="background: var(--color-selected-bg); color: var(--color-primary);">Web</span>
      <div>
        <p class="text-sm" style="color: var(--color-text-dim);">Svelte 5 (runes) + Vite 7 + TypeScript. REST for CRUD, Yjs over WebSocket for live edits with awareness/presence. CodeMirror 6 + vim mode + DOMPurify-sanitised markdown render. Sessions stored per-origin in localStorage.</p>
      </div>
    </div>
    <div class="flex gap-3 items-start">
      <span class="text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5" style="background: var(--color-selected-bg); color: var(--color-primary);">Apple</span>
      <div>
        <p class="text-sm" style="color: var(--color-text-dim);">SwiftUI + Swift 6, targets iOS / iPadOS / macOS / visionOS. yswift wraps Y.Doc in a Swift actor for thread-safe CRDT ops. Native TextKit 2 vim engine. Per-launch client ID for stable presence across reconnects.</p>
      </div>
    </div>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Data Flow</h3>
  <div class="flex flex-col gap-3 mb-6">
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Web / Apple ↔ Server (live CRDT)</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Each note has a Yjs room keyed by <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">(vault_id, note_id)</code>. Clients send SyncStep1 with their state vector, server answers with a SyncStep2 diff, then both sides exchange incremental updates + awareness frames. The server persists every applied update to <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">note_yjs_updates</code> and compacts into <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">note_yjs_snapshots</code>.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">TUI ↔ Server (snapshot + diff)</p>
      <p class="text-xs" style="color: var(--color-text-dim);">TUI fetches <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">GET /api/vaults/:vault/notes/:id/snapshot</code> → <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">{'{'} text, vector_clock {'}'}</code>, launches <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">$EDITOR</code>, posts <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">POST .../diff</code> on save. If the doc advanced server-side, the diff is replayed against current text — concurrent edits survive.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Server ↔ Filesystem (FS-CRDT bridge)</p>
      <p class="text-xs" style="color: var(--color-text-dim);">CRDT mutations enqueue debounced writes to <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">&lt;vault&gt;/&lt;note-id&gt;.md</code>. The fsnotify watcher in <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">internal/fswatch</code> sees writes whose self-write marker doesn't match, diffs them against the live doc, and applies them via <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">Doc.ApplyDiff</code>. External edits become ordinary CRDT updates.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Local-only vault</p>
      <p class="text-xs" style="color: var(--color-text-dim);">No server. The TUI reads and writes markdown files directly; <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">.lumi/vault.yaml</code> has no <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">server</code> section. Conversion to server-bound is a single <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">lumi vault link</code> call.</p>
    </div>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Identity & Roles</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Identity is server-scoped — each server is its own trust boundary, no central SSO. Roles are per-vault and customisable; the seed set is Admin / Editor / Viewer / Commenter (seed roles can't be renamed or deleted). Capabilities are strings like <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">note.edit</code>, <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">members.invite</code>, <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">roles.manage</code>; wildcards (<code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">note.*</code>, <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">*</code>) expand at check time. Every mutating handler runs through a capguard middleware.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Domain Model</h3>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <div class="flex items-center gap-2 px-4 py-2.5 border-b" style="border-color: var(--color-border); background: var(--color-selected-bg);">
      <span class="text-xs" style="color: var(--color-text-dim);">server/internal/domain (excerpt)</span>
    </div>
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);"><span style="color: var(--color-primary);">type</span> <span style="color: var(--color-accent);">User</span> <span style="color: var(--color-primary);">struct</span> {'{'} ID uuid.UUID; Username, DisplayName <span style="color: var(--color-secondary);">string</span> {'}'}
<span style="color: var(--color-primary);">type</span> <span style="color: var(--color-accent);">Session</span> <span style="color: var(--color-primary);">struct</span> {'{'} Token <span style="color: var(--color-secondary);">string</span>; UserID uuid.UUID; ExpiresAt time.Time {'}'}
<span style="color: var(--color-primary);">type</span> <span style="color: var(--color-accent);">Vault</span> <span style="color: var(--color-primary);">struct</span> {'{'} ID uuid.UUID; Slug, Name <span style="color: var(--color-secondary);">string</span>; CreatedBy uuid.UUID {'}'}
<span style="color: var(--color-primary);">type</span> <span style="color: var(--color-accent);">VaultRole</span> <span style="color: var(--color-primary);">struct</span> {'{'} ID, VaultID uuid.UUID; Name <span style="color: var(--color-secondary);">string</span>;
                       Capabilities CapabilitySet; IsSeed <span style="color: var(--color-secondary);">bool</span> {'}'}
<span style="color: var(--color-primary);">type</span> <span style="color: var(--color-accent);">Note</span> <span style="color: var(--color-primary);">struct</span> {'{'} ID <span style="color: var(--color-secondary);">string</span>; VaultID uuid.UUID;
                  Path, Title <span style="color: var(--color-secondary);">string</span>; CreatedAt, UpdatedAt time.Time {'}'}</pre>
  </div>
</section>
