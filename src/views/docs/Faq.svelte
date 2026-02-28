<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> FAQ
  </h2>
  <div class="flex flex-col gap-3">
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Can I use lumi without the server?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Yes. The TUI works completely offline with local files — the server is only needed for the web client and multi-device sync.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">What happens if I edit a file outside of lumi?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Changes are detected automatically. The TUI refreshes on focus, and the web client receives realtime updates via WebSocket.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">How do I export my notes?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">They're already plain Markdown files — just copy the folder. Use git, rsync, or any cloud sync tool for backup.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Can multiple people use the same notes?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Yes, if they share the same notes directory. The server broadcasts changes to all connected clients. Multiple servers can also federate via LUMI_PEERS.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Is there mobile support?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Not yet as a native app, but the web client works on mobile browsers.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Can I encrypt my notes?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Not built-in yet. For now, use filesystem-level encryption (FileVault, LUKS, VeraCrypt).</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Where are my notes stored?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Wherever you point lumi. Pass a directory as an argument to the TUI (<code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">./lumi ~/notes</code>) or set <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ROOT</code> for the server. There is no hidden database — only the files you see.</p>
    </div>
  </div>
</section>
