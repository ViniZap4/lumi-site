<script>
  const submoduleQuickRef = [
    { task: 'Clone everything (recursive)', command: 'git clone --recurse-submodules <url>' },
    { task: 'Pull everything', command: 'git pull --recurse-submodules' },
    { task: 'Init after clone', command: 'git submodule update --init --recursive' },
    { task: 'Check status', command: 'git submodule status' },
    { task: 'Run cmd in all', command: "git submodule foreach '<cmd>'" },
    { task: 'Fetch latest remotes', command: 'git submodule update --remote --merge' },
    { task: 'Fix detached HEAD', command: 'cd <submodule> && git checkout main' },
  ];

  const repoMap = [
    { path: 'server/', repo: 'ViniZap4/lumi-server' },
    { path: 'tui-client/', repo: 'ViniZap4/lumi-tui' },
    { path: 'web-client/', repo: 'ViniZap4/lumi-web' },
    { path: 'apple-client/', repo: 'ViniZap4/lumi-apple' },
    { path: 'site/', repo: 'ViniZap4/lumi-site' },
  ];
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Git & Submodules
  </h2>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    lumi is organised as a monorepo where each component is a separate Git repository linked via submodules. The root repo (<code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">ViniZap4/lumi</code>) acts as a manifest that pins each submodule to a specific commit. The server has its own nested submodule (<code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">third_party/y-crdt</code>, pinned to a specific yrs release) needed for the cgo build — that's why the recursive flag matters.
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
        {#each repoMap as r, i}
          <tr style="border-bottom: {i < repoMap.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
            <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">{r.path}</td>
            <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">{r.repo}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Cloning</h3>
  <div class="rounded-xl border overflow-hidden mb-2" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-muted);"># Clone with all submodules (and server/third_party/y-crdt)</span>
git clone --recurse-submodules git@github.com:ViniZap4/lumi.git

<span style="color: var(--color-muted);"># Already cloned without submodules?</span>
git submodule update --init --recursive</pre>
  </div>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    You can also clone any component independently: <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">git clone git@github.com:ViniZap4/lumi-server.git</code>. The server still needs its own <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">git submodule update --init --recursive</code> after cloning to pull <code class="px-1 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">third_party/y-crdt</code>.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Day-to-Day Workflow</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Project convention: commit + push immediately, in the submodule first, then bump the pointer in the monorepo. Conventional Commits with a module scope.
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-muted);"># 1. Work inside a submodule</span>
<span style="color: var(--color-primary);">cd</span> server
<span style="color: var(--color-muted);"># make changes...</span>
git add -A
git commit -m "feat(server, notes): paginate list endpoint"
git push

<span style="color: var(--color-muted);"># 2. Update the monorepo's submodule pointer</span>
<span style="color: var(--color-primary);">cd</span> ..
git add server
git commit -m "chore(monorepo): bump server to paginated note list"
git push</pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Common Scenarios</h3>
  <div class="flex flex-col gap-3 mb-6">
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Submodule is in detached HEAD</p>
      <p class="text-xs" style="color: var(--color-text-dim);">This happens after <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git submodule update</code>. Fix it: <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">cd server && git checkout main</code>. All components track <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">main</code> as of the v2 cutover.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Push changes to multiple submodules</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Push each one, then update the root: <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git submodule foreach 'git push || true'</code>, then <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git add server tui-client web-client apple-client site && git commit -m "..." && git push</code>.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Pulling updates from all repos</p>
      <p class="text-xs" style="color: var(--color-text-dim);"><code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git pull --recurse-submodules</code> or <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git pull && git submodule update --init --recursive</code>.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Server fails to build with cgo errors</p>
      <p class="text-xs" style="color: var(--color-text-dim);">The yrs submodule is missing. Run <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git submodule update --init --recursive</code> from the server root, then <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">make libyrs</code> before <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">go build</code>.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Forgot to commit root after submodule push</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Root will show <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">modified: server (new commits)</code>. Just <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git add server && git commit -m "chore(monorepo): bump server"</code>.</p>
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
