<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Note Format
  </h2>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Notes are plain Markdown files with optional YAML frontmatter for metadata. No database, no vendor lock-in — the filesystem is the source of truth on disk; the server projects it through a Yjs CRDT for live collaboration.
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
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    Plain markdown files (no frontmatter) are accepted — lumi preserves the on-disk format on save unless metadata is added explicitly through the UI.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Vault Layout</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    A vault is a portable directory containing notes plus a <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">.lumi/</code> metadata folder. Vaults are portable — you can keep them in iCloud, Syncthing, Git, etc., the same way as an Obsidian vault.
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);">&lt;vault-dir&gt;/
<span style="color: var(--color-muted);">├──</span> .lumi/
<span style="color: var(--color-muted);">│   ├──</span> vault.yaml          <span style="color: var(--color-muted);"># id, slug, server binding, members snapshot</span>
<span style="color: var(--color-muted);">│   ├──</span> config.yaml         <span style="color: var(--color-muted);"># vault-scoped client prefs</span>
<span style="color: var(--color-muted);">│   └──</span> cache/
<span style="color: var(--color-muted);">│       ├──</span> yjs/&lt;note-id&gt;.bin  <span style="color: var(--color-muted);"># last-known CRDT state (rebuildable)</span>
<span style="color: var(--color-muted);">│       └──</span> search.idx       <span style="color: var(--color-muted);"># search index</span>
<span style="color: var(--color-muted);">├──</span> projects/
<span style="color: var(--color-muted);">│   ├──</span> lumi.md
<span style="color: var(--color-muted);">│   └──</span> work.md
<span style="color: var(--color-muted);">├──</span> journal/
<span style="color: var(--color-muted);">│   ├──</span> 2026-02.md
<span style="color: var(--color-muted);">│   └──</span> 2026-01.md
<span style="color: var(--color-muted);">└──</span> reference/</pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">vault.yaml</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Identifies the vault and (when bound) its server. For a local-only vault, the <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">server</code>, <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">members</code>, and <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">roles</code> sections are absent.
  </p>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <div class="flex items-center gap-2 px-4 py-2.5 border-b" style="border-color: var(--color-border); background: var(--color-selected-bg);">
      <span class="text-xs" style="color: var(--color-text-dim);">.lumi/vault.yaml</span>
    </div>
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);"><span style="color: var(--color-accent);">id</span>: <span style="color: var(--color-text);">8c5a1d9f-...</span>          <span style="color: var(--color-muted);"># uuid; stable across moves</span>
<span style="color: var(--color-accent);">name</span>: <span style="color: var(--color-text);">Work team</span>
<span style="color: var(--color-accent);">slug</span>: <span style="color: var(--color-text);">work-team</span>
<span style="color: var(--color-accent);">created_at</span>: <span style="color: var(--color-text);">2026-04-28T10:00:00Z</span>

<span style="color: var(--color-muted);"># present iff vault is server-bound</span>
<span style="color: var(--color-accent);">server</span>:
  <span style="color: var(--color-accent);">url</span>: <span style="color: var(--color-text);">https://lumi.work.com</span>
  <span style="color: var(--color-accent);">vault_id</span>: <span style="color: var(--color-text);">8c5a1d9f-...</span>
  <span style="color: var(--color-accent);">last_synced_at</span>: <span style="color: var(--color-text);">2026-04-28T10:05:00Z</span>

<span style="color: var(--color-muted);"># cached locally; server is authoritative when bound</span>
<span style="color: var(--color-accent);">members</span>:
  - <span style="color: var(--color-accent);">username</span>: <span style="color: var(--color-secondary);">alice</span>
    <span style="color: var(--color-accent);">role</span>: <span style="color: var(--color-secondary);">Admin</span>
  - <span style="color: var(--color-accent);">username</span>: <span style="color: var(--color-secondary);">bob</span>
    <span style="color: var(--color-accent);">role</span>: <span style="color: var(--color-secondary);">Editor</span></pre>
  </div>
</section>
