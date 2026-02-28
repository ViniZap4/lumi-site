<script>
  const submoduleQuickRef = [
    { task: 'Clone everything', command: 'git clone --recurse-submodules <url>' },
    { task: 'Pull everything', command: 'git pull --recurse-submodules' },
    { task: 'Init after clone', command: 'git submodule update --init --recursive' },
    { task: 'Check status', command: 'git submodule status' },
    { task: 'Run cmd in all', command: "git submodule foreach '<cmd>'" },
    { task: 'Fetch latest remotes', command: 'git submodule update --remote --merge' },
    { task: 'Fix detached HEAD', command: 'cd <submodule> && git checkout main' },
  ];
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Git & Submodules
  </h2>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    lumi is organized as a monorepo where each component is a separate Git repository linked via submodules. The root repo (<code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">ViniZap4/lumi</code>) acts as a manifest that pins each submodule to a specific commit.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Repository Map</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <table class="w-full text-sm">
      <thead>
        <tr style="background: var(--color-selected-bg); border-bottom: 1px solid var(--color-border);">
          <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Path</th>
          <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Repository</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid var(--color-separator);">
          <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">tui-client/</td>
          <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">ViniZap4/lumi-tui</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--color-separator);">
          <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">server/</td>
          <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">ViniZap4/lumi-server</td>
        </tr>
        <tr style="border-bottom: 1px solid var(--color-separator);">
          <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">web-client/</td>
          <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">ViniZap4/lumi-web</td>
        </tr>
        <tr>
          <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">site/</td>
          <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">ViniZap4/lumi-site</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Cloning</h3>
  <div class="rounded-xl border overflow-hidden mb-2" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-muted);"># Clone with all submodules</span>
git clone --recurse-submodules git@github.com:ViniZap4/lumi.git

<span style="color: var(--color-muted);"># Already cloned without submodules?</span>
git submodule update --init --recursive</pre>
  </div>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    You can also clone any component independently: <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">git clone git@github.com:ViniZap4/lumi-tui.git</code>
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Day-to-Day Workflow</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-muted);"># 1. Work inside a submodule</span>
<span style="color: var(--color-primary);">cd</span> tui-client
<span style="color: var(--color-muted);"># make changes...</span>
git add -A
git commit -m "feat: add new keybinding"
git push

<span style="color: var(--color-muted);"># 2. Update the root repo's submodule reference</span>
<span style="color: var(--color-primary);">cd</span> ..
git add tui-client
git commit -m "feat(tui): add new keybinding"
git push</pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Common Scenarios</h3>
  <div class="flex flex-col gap-3 mb-6">
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Submodule is in detached HEAD</p>
      <p class="text-xs" style="color: var(--color-text-dim);">This happens after <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git submodule update</code>. Fix it: <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">cd tui-client && git checkout main</code></p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Push changes to multiple submodules</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Push each one, then update root: <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git submodule foreach 'git push || true'</code>, then <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git add tui-client server web-client && git commit && git push</code></p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Pulling updates from all repos</p>
      <p class="text-xs" style="color: var(--color-text-dim);"><code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git pull --recurse-submodules</code> or <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git pull && git submodule update --init --recursive</code></p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Forgot to commit root after submodule push</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Root will show <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">modified: tui-client (new commits)</code>. Just <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git add tui-client && git commit -m "chore: update submodule ref"</code></p>
    </div>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Quick Reference</h3>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <table class="w-full text-sm">
      <thead>
        <tr style="background: var(--color-selected-bg); border-bottom: 1px solid var(--color-border);">
          <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Task</th>
          <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Command</th>
        </tr>
      </thead>
      <tbody>
        {#each submoduleQuickRef as ref, i}
          <tr style="border-bottom: {i < submoduleQuickRef.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
            <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">{ref.task}</td>
            <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">{ref.command}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
