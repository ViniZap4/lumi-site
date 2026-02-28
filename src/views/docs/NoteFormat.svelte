<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Note Format
  </h2>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Notes are standard Markdown files with YAML frontmatter for metadata. No database, no vendor lock-in — just files on disk.
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

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Folder Structure</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Organize notes in directories however you like. lumi detects folders and files automatically.
  </p>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);">notes/
<span style="color: var(--color-muted);">├──</span> projects/
<span style="color: var(--color-muted);">│   ├──</span> lumi/
<span style="color: var(--color-muted);">│   └──</span> work/
<span style="color: var(--color-muted);">├──</span> journal/
<span style="color: var(--color-muted);">│   ├──</span> 2026-02/
<span style="color: var(--color-muted);">│   └──</span> 2026-01/
<span style="color: var(--color-muted);">└──</span> reference/</pre>
  </div>
</section>
