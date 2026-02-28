<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Coding Standards
  </h2>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Go</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <ul class="p-4 flex flex-col gap-2">
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
        <span style="color: var(--color-muted);">-</span> Format with <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">gofmt</code> and <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">goimports</code>
      </li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
        <span style="color: var(--color-muted);">-</span> Meaningful package names (<code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">domain</code>, <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">filesystem</code>, not <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">utils</code>)
      </li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
        <span style="color: var(--color-muted);">-</span> Handle errors explicitly — don't ignore them
      </li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
        <span style="color: var(--color-muted);">-</span> Keep functions small and focused
      </li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
        <span style="color: var(--color-muted);">-</span> Prefer composition over inheritance
      </li>
    </ul>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Svelte</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <ul class="p-4 flex flex-col gap-2">
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
        <span style="color: var(--color-muted);">-</span> One component per file
      </li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
        <span style="color: var(--color-muted);">-</span> Prefer reactive declarations over manual updates
      </li>
      <li class="text-xs flex gap-2" style="color: var(--color-text-dim);">
        <span style="color: var(--color-muted);">-</span> Use stores for shared state
      </li>
    </ul>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Commit Messages</h3>
  <p class="text-sm mb-3" style="color: var(--color-text-dim);">
    Follow <a href="https://www.conventionalcommits.org" target="_blank" rel="noopener" class="underline" style="color: var(--color-info);">Conventional Commits</a>. Use imperative mood, keep the first line under 72 characters.
  </p>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);"><span style="color: var(--color-accent);">feat:</span> add folder navigation to TUI
<span style="color: var(--color-accent);">fix:</span> handle missing frontmatter gracefully
<span style="color: var(--color-accent);">docs:</span> update API endpoints in docs
<span style="color: var(--color-accent);">refactor:</span> extract frontmatter parsing to separate package</pre>
  </div>
</section>
