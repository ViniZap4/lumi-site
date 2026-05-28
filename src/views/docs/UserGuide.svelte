<script>
  const tuiKeybindings = [
    { keys: 'j / k', desc: 'Move down / up' },
    { keys: 'h / l', desc: 'Switch panels or cycle values' },
    { keys: 'gg / G', desc: 'Jump to top / bottom' },
    { keys: '0 / $', desc: 'Start / end of line' },
    { keys: 'w / b', desc: 'Move word forward / backward' },
    { keys: '/', desc: 'Search / filter' },
    { keys: 'Ctrl+F', desc: 'Toggle filename / content search' },
    { keys: 'Ctrl+/', desc: 'Global search from note view' },
    { keys: 'e / Enter', desc: 'Edit note in $EDITOR' },
    { keys: 'n', desc: 'Create new note' },
    { keys: 'N', desc: 'Create new folder' },
    { keys: 'r', desc: 'Rename note' },
    { keys: 'd', desc: 'Delete note' },
    { keys: 'D', desc: 'Duplicate note' },
    { keys: 'm', desc: 'Move note/folder' },
    { keys: 'v', desc: 'Visual mode (select text)' },
    { keys: 'V', desc: 'Visual line mode' },
    { keys: 'y', desc: 'Copy selection to clipboard' },
    { keys: 'x', desc: 'Open external URL in browser' },
    { keys: 'L', desc: 'Insert wiki-style link' },
    { keys: 't', desc: 'Tree modal (file switcher)' },
    { keys: 's / S', desc: 'Horizontal / vertical split' },
    { keys: 'Ctrl+D / Ctrl+U', desc: 'Half-page down / up' },
    { keys: 'c', desc: 'Open settings' },
    { keys: 'Esc', desc: 'Go back / exit mode' },
    { keys: 'q', desc: 'Quit' },
  ];

  const tuiSubcommands = [
    { cmd: 'lumi login <server-url>', desc: 'Interactive login flow; stores a session token in accounts.yaml.' },
    { cmd: 'lumi accounts [--verify]', desc: 'List signed-in servers; --verify re-pings each one.' },
    { cmd: 'lumi vaults', desc: 'List vaults registered in vaults.yaml.' },
    { cmd: 'lumi vault link <path>', desc: 'Register an existing directory as a vault.' },
    { cmd: 'lumi vault clone <url>/<slug> [<path>]', desc: 'Pull a server-hosted vault to a local directory.' },
    { cmd: 'lumi vault unlink <slug>', desc: 'Remove from the registry; files stay on disk.' },
    { cmd: 'lumi vault sync <slug>', desc: 'Snapshot+diff round-trip against the server (one-shot).' },
    { cmd: 'lumi vault manage', desc: 'Interactive vault TUI: open/unlink/sync without leaving the terminal.' },
  ];

  const webKeybindings = [
    { keys: 'j / k', desc: 'Navigate up / down' },
    { keys: '/', desc: 'Search notes' },
    { keys: 'Enter', desc: 'Open note or submit' },
    { keys: 'Esc', desc: 'Go back / close dialogs' },
  ];
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> User Guide
  </h2>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Vaults</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    A <strong>vault</strong> is a portable directory containing markdown notes and a <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">.lumi/</code> metadata folder. Every client tracks vaults independently — each one is either <em>local-only</em> or <em>server-bound</em>. A server-bound vault keeps its files on your filesystem and mirrors them to a lumi-server vault on demand.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">TUI Subcommands</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    The TUI's entrypoint dispatches v2 subcommands before falling back to the vault picker. Running <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">./lumi</code> with no args opens the picker; passing a directory opens that vault.
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    {#each tuiSubcommands as sc, i}
      <div class="flex flex-col gap-1 px-4 py-2" style="border-bottom: {i < tuiSubcommands.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
        <code class="text-xs" style="color: var(--color-accent);">{sc.cmd}</code>
        <span class="text-xs" style="color: var(--color-text-dim);">{sc.desc}</span>
      </div>
    {/each}
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">TUI Layout</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);">┌─────────────────┬──────────────────────────────┐
│   Folders       │   Notes                      │
│                 │                              │
│ > Projects      │ > 2026-lumi-architecture     │
│   Personal      │   2026-meeting-notes         │
│   Archive       │   2026-ideas                 │
│                 │                              │
└─────────────────┴──────────────────────────────┘
┌──────────────────────────────────────────────────┐
│ Help: q=quit | e=edit | n=new | d=delete | ?=help│
└──────────────────────────────────────────────────┘</pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">TUI Keybindings</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    {#each tuiKeybindings as kb, i}
      <div class="flex items-center justify-between px-4 py-2" style="border-bottom: {i < tuiKeybindings.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
        <code class="text-xs px-2 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">{kb.keys}</code>
        <span class="text-xs" style="color: var(--color-text-dim);">{kb.desc}</span>
      </div>
    {/each}
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Sign in with your username and password (the server account, not a shared secret). The session token is stored in <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">localStorage</code> partitioned by server origin; refreshing the page stays logged in until the 30-day session expires. After login, pick a vault from the selector — the web client only sees vaults on its own origin server (vaults on other servers are reachable via that server's web client or the TUI).
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Live Collaboration</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    The web and Apple clients use Yjs over WebSocket. Every note has a per-room Yjs document; updates fan out to all subscribers with awareness/presence (cursor + display name). The TUI uses snapshot+diff REST — it fetches the current text, lets <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">$EDITOR</code> mutate it, then posts the diff back. The server diff-merges into the live CRDT, so concurrent web edits are preserved.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client Keybindings</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    {#each webKeybindings as kb, i}
      <div class="flex items-center justify-between px-4 py-2" style="border-bottom: {i < webKeybindings.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
        <code class="text-xs px-2 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">{kb.keys}</code>
        <span class="text-xs" style="color: var(--color-text-dim);">{kb.desc}</span>
      </div>
    {/each}
  </div>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    The editor itself uses CodeMirror 6 with vim mode (same keymap as the TUI). The vim layer is lazy-loaded with the rest of the editor on first edit to keep the login + vault-list cold path light.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Workflows</h3>
  <div class="flex flex-col gap-3">
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Creating a note (TUI)</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Press <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">n</code>, type a title, and <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">$EDITOR</code> opens with frontmatter pre-filled. Save and close to return to lumi. If the vault is server-bound, the note is posted via the snapshot+diff endpoints on next sync.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Editing with live collab (web / Apple)</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Open a note. The client connects to <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">WSS /api/vaults/:vault/notes/:id/sync</code>, sends a Yjs SyncStep1, and starts receiving updates. Other connected editors see your cursor and selection via awareness frames.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Inviting a collaborator</p>
      <p class="text-xs" style="color: var(--color-text-dim);">A vault admin generates an invite link via the web client (or <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">POST /api/vaults/:vault/invites</code>). The recipient opens the link, registers + joins in one round trip. Server policy is <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_REGISTRATION=invite-only</code> by default.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">External markdown edit</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Edit a vault file with any editor. The server's fsnotify watcher detects the write, diffs it against the current Yjs doc, and broadcasts the change as ordinary CRDT operations. Mid-flight remote edits are preserved.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Link following</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Move cursor to a <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">[[wiki-link]]</code> and press <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">Enter</code> to jump to that note.</p>
    </div>
  </div>

  <h3 class="text-sm font-semibold mb-3 mt-6" style="color: var(--color-secondary);">Settings & Themes</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">
    Press <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">c</code> in the TUI to open settings — split layout with config on the left and a live-rendered note preview on the right. Cycle themes with <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">h/l</code>.
  </p>
  <p class="text-sm" style="color: var(--color-text-dim);">
    12 themes are shared across TUI, web client, Apple client, and this site: Tokyo Night, Tokyo Day, Catppuccin Mocha, Catppuccin Latte, Dracula, Obsidian, and several pride themes.
  </p>
</section>
