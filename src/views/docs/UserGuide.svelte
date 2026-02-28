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

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client Login</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Open the web client in your browser and enter the password (the value of <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_PASSWORD</code>). Your session is encrypted and persisted in localStorage — refreshing the page stays logged in.
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

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Workflows</h3>
  <div class="flex flex-col gap-3">
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Creating a note</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Press <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">n</code>, type a title, and your editor opens with frontmatter pre-filled. Save and close to return to lumi.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Editing a note</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Navigate with <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">j/k</code>, press <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">e</code> or <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">Enter</code> to open in your <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">$EDITOR</code>. Changes are detected automatically on save.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Quick copy</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Press <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">v</code> to enter visual mode, select with <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">j/k</code>, then <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">y</code> to copy to clipboard.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Link following</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Move cursor to a <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">[[wiki-link]]</code> and press <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">Enter</code> to jump to that note.</p>
    </div>
  </div>

  <h3 class="text-sm font-semibold mb-3 mt-6" style="color: var(--color-secondary);">Settings & Themes</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">
    Press <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">c</code> in the TUI to open settings. The view uses a split layout — settings on the left, a live-rendered note preview on the right. Both columns update instantly as you cycle themes with <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">h/l</code>.
  </p>
  <p class="text-sm" style="color: var(--color-text-dim);">
    12 themes are available across dark and light modes: Tokyo Night, Tokyo Day, Catppuccin Mocha, Catppuccin Latte, Dracula, Obsidian, and several pride themes.
  </p>
</section>
