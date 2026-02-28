<script>
  const serverEnvVars = [
    { name: 'LUMI_PASSWORD', default: 'dev', desc: 'Password for web login, REST API (X-Lumi-Token header), and WebSocket (?token= query param).' },
    { name: 'LUMI_ROOT', default: './notes', desc: 'Path to the notes directory. In Docker, defaults to /notes (volume mount target).' },
    { name: 'LUMI_PORT', default: '8080', desc: 'HTTP server listen port.' },
    { name: 'LUMI_SERVER_ID', default: 'auto', desc: 'Unique server ID for peer-to-peer sync origin tracking. Auto-generated if left empty.' },
    { name: 'LUMI_PEERS', default: '\u2014', desc: 'Comma-separated URLs of peer lumi servers to federate with (e.g. http://peer1:8080,http://peer2:8080).' },
  ];

  const webEnvVars = [
    { name: 'VITE_LUMI_SERVER_URL', default: 'http://localhost:8080', desc: 'URL the browser uses to reach the API server. Baked into the JS bundle at build time \u2014 changing requires a rebuild.' },
  ];
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Configuration
  </h2>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Server Environment Variables</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <table class="w-full text-sm">
      <thead>
        <tr style="background: var(--color-selected-bg); border-bottom: 1px solid var(--color-border);">
          <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Variable</th>
          <th class="text-left px-4 py-2.5 font-medium hidden sm:table-cell" style="color: var(--color-text-dim);">Default</th>
          <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Description</th>
        </tr>
      </thead>
      <tbody>
        {#each serverEnvVars as ev, i}
          <tr style="border-bottom: {i < serverEnvVars.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
            <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">{ev.name}</td>
            <td class="px-4 py-2 font-mono text-xs hidden sm:table-cell" style="color: var(--color-muted);">{ev.default}</td>
            <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">{ev.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Web Client Environment Variables</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <table class="w-full text-sm">
      <thead>
        <tr style="background: var(--color-selected-bg); border-bottom: 1px solid var(--color-border);">
          <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Variable</th>
          <th class="text-left px-4 py-2.5 font-medium hidden sm:table-cell" style="color: var(--color-text-dim);">Default</th>
          <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Description</th>
        </tr>
      </thead>
      <tbody>
        {#each webEnvVars as ev}
          <tr>
            <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">{ev.name}</td>
            <td class="px-4 py-2 font-mono text-xs hidden sm:table-cell" style="color: var(--color-muted);">{ev.default}</td>
            <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">{ev.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Editor</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">
    The TUI uses your <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">$EDITOR</code> environment variable. If not set, defaults to <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">nvim</code>.
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre"><span style="color: var(--color-muted);"># Use vim</span>
<span style="color: var(--color-primary);">export</span> EDITOR=vim

<span style="color: var(--color-muted);"># Use VS Code (wait for window to close)</span>
<span style="color: var(--color-primary);">export</span> EDITOR="code --wait"

<span style="color: var(--color-muted);"># Use emacs</span>
<span style="color: var(--color-primary);">export</span> EDITOR=emacs</pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Troubleshooting</h3>
  <div class="flex flex-col gap-3">
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">TUI won't start</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Check that Go 1.23+ is installed (<code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">go version</code>) and your terminal supports ANSI colors.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Editor doesn't open</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Verify <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">$EDITOR</code> is set and in your PATH. Try <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">export EDITOR=vim</code>.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Server connection fails</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Check the server is running (<code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">curl http://localhost:8080/api/folders</code>), verify your token matches, and check firewall settings.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Notes not syncing</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Check the WebSocket connection in browser console, verify server logs, and ensure <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ROOT</code> points to the correct directory.</p>
    </div>
  </div>
</section>
