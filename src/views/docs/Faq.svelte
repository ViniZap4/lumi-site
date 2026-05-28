<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> FAQ
  </h2>
  <div class="flex flex-col gap-3">
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Can I use lumi without the server?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Yes. A vault can be local-only — the TUI reads and writes markdown directly with no server involved. Server binding is opt-in per vault and only adds collaboration, presence, and snapshot+diff sync.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">What's a vault?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">A portable directory of markdown notes plus a <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">.lumi/</code> folder for metadata. Same idea as an Obsidian vault: you own the directory and can move it anywhere (iCloud, Syncthing, Git, USB stick). Server-bound vaults add a server-side mirror and per-vault custom roles.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">How does collaboration work?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Yjs CRDT. The web and Apple clients exchange Yjs updates + awareness over WebSocket; the TUI uses snapshot+diff REST. The server holds the authoritative Yjs doc, persists it as a compacted snapshot + an append-only update log in Postgres, and broadcasts changes to all subscribers. External markdown edits are picked up by fsnotify and diff-merged into the CRDT.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">What happens if I edit a file outside of lumi?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">The server's fsnotify watcher detects the write, computes a textual diff against the current CRDT, and applies it as ordinary Yjs operations. Live collaborators see the change as if it came from another editor. Concurrent in-flight edits are preserved.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">How do I export my notes?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">They're already plain Markdown files — just copy the vault directory. <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">GET /api/users/me/export</code> also streams a zip of your profile, owned notes, audit entries, and consent history (LGPD right of access; rate-limited to 1/day).</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">How do I invite a teammate?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">A vault admin (or any member with the <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">members.invite</code> capability) generates an invite link via the web UI or <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">POST /api/vaults/:vault/invites</code>. The recipient opens the URL, registers + joins in a single round trip.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">What about mobile?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">The Apple client targets iOS, iPadOS, macOS, and visionOS via SwiftUI with a TextKit 2 vim engine and Yjs (yswift) sync. The web client also works in mobile browsers.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Is anything encrypted end-to-end?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">No. The server reads plaintext notes and CRDT state — it's a trust boundary for vault members. TLS is required for transport; deployments are expected to use disk-level encryption for at-rest. E2E is out of scope for v2.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Where are my notes stored?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">In the vault directory you point lumi at. The TUI takes a path argument (<code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">./lumi ~/vaults/personal</code>); the server uses <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ROOT</code> as the parent of all vaults it hosts. Postgres only holds metadata + Yjs state — not the markdown bodies, which always live on disk.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Can I delete my account?</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Yes — <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">DELETE /api/users/me</code> (LGPD right of erasure). Sessions are dropped; memberships are removed; personal vaults you solely admin are deleted; shared vaults are retained for the remaining members. Audit log rows stay but with your identifying fields nullified.</p>
    </div>
  </div>
</section>
