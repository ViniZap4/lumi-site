<script>
  const serverEnvVars = [
    { name: 'LUMI_DATABASE_URL', default: '— (required)', desc: 'Postgres connection string (e.g. postgres://lumi:lumi@postgres:5432/lumi?sslmode=disable).' },
    { name: 'LUMI_ROOT', default: '— (required)', desc: 'Filesystem root for vault directories. Each vault lives at <LUMI_ROOT>/<vault-slug>/.' },
    { name: 'LUMI_PORT', default: '8080', desc: 'HTTP listen port.' },
    { name: 'LUMI_BIND_ADDR', default: '0.0.0.0', desc: 'Listen address.' },
    { name: 'LUMI_REQUIRE_TLS', default: 'true', desc: 'Refuse non-loopback binds without upstream TLS. Set false only when terminating TLS upstream or running on 127.0.0.1.' },
    { name: 'LUMI_ALLOWED_ORIGINS', default: '—', desc: 'CSV of allowed CORS / WebSocket origins. Browsers only attach session tokens to requests whose Origin is on this list.' },
    { name: 'LUMI_REGISTRATION', default: 'invite-only', desc: 'invite-only or open. Invite-only means POST /api/auth/register returns 403 — new users must come through an invite link.' },
    { name: 'LUMI_AUTO_MIGRATE', default: 'false', desc: 'Apply pending SQL migrations at startup. Convenient for compose; in CD pipelines, run lumi-server migrate up explicitly.' },
    { name: 'LUMI_ADMIN_USERNAME', default: '—', desc: 'First-boot admin bootstrap (pair with password). When the users table is empty, creates a single admin user.' },
    { name: 'LUMI_ADMIN_PASSWORD', default: '—', desc: 'First-boot admin bootstrap (pair with username).' },
    { name: 'LUMI_PUBLIC_BASE_URL', default: '—', desc: 'Public URL used to render invite links. Falls back to relative paths.' },
    { name: 'LUMI_AUDIT_RETENTION_DAYS', default: '90', desc: 'LGPD audit log retention; nightly purge job drops expired rows.' },
    { name: 'LUMI_TOS_VERSION', default: '—', desc: 'If set together with LUMI_PRIVACY_VERSION, the server records explicit consent at signup.' },
    { name: 'LUMI_PRIVACY_VERSION', default: '—', desc: 'See LUMI_TOS_VERSION.' },
    { name: 'LUMI_LOG_FORMAT', default: 'json', desc: 'json (machine-readable) or console (dev-friendly).' },
    { name: 'LUMI_LOG_LEVEL', default: 'info', desc: 'debug | info | warn | error.' },
  ];

  const webEnvVars = [
    { name: 'VITE_LUMI_SERVER_URL', default: 'http://localhost:8080', desc: 'API server URL. Build-time only — Vite bakes it into the JS bundle. Changing requires a rebuild of the web image.' },
  ];

  const tuiPaths = [
    { path: '~/.config/lumi/accounts.yaml', desc: 'Per-server session tokens (username, server URL, expiry). One stanza per signed-in account.' },
    { path: '~/.config/lumi/vaults.yaml', desc: 'Registry of known vaults (path, optional server binding, last-opened bumps).' },
    { path: '<vault>/.lumi/vault.yaml', desc: 'Per-vault metadata: id, slug, server binding, cached members + roles snapshot.' },
    { path: '<vault>/.lumi/config.yaml', desc: 'Vault-scoped client prefs (theme, editor, etc.).' },
    { path: '<vault>/.lumi/cache/yjs/<note-id>.bin', desc: 'Last-known CRDT state for offline read; rebuildable.' },
  ];
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Configuration
  </h2>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Server Environment Variables</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Read at startup; runtime values, no rebuild needed. See <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">.env.example</code> in the monorepo for an annotated copy.
  </p>
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

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">TUI Client Paths</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    The TUI keeps account + vault state under <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">~/.config/lumi/</code>. Per-vault state lives inside the vault itself so vaults are portable.
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <table class="w-full text-sm">
      <thead>
        <tr style="background: var(--color-selected-bg); border-bottom: 1px solid var(--color-border);">
          <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Path</th>
          <th class="text-left px-4 py-2.5 font-medium" style="color: var(--color-text-dim);">Purpose</th>
        </tr>
      </thead>
      <tbody>
        {#each tuiPaths as p, i}
          <tr style="border-bottom: {i < tuiPaths.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
            <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">{p.path}</td>
            <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">{p.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Editor</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">
    The TUI shells out to your <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">$EDITOR</code>. Defaults to <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">nvim</code> when unset.
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
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Server fails to start with libyrs link error</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Run <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">git submodule update --init --recursive</code> then <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">make libyrs</code> in <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">server/</code>. The cgo build needs <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">libyrs.a</code> compiled by cargo before <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">go build</code> runs.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Login returns invalid_credentials</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Check the password and that the user exists. Bcrypt compares are constant-time; identical errors are returned for unknown-user and bad-password to prevent enumeration.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">Web client can't reach the API</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Verify the API URL baked into the bundle: <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">grep -ro 'VITE_LUMI_SERVER_URL' /usr/share/nginx/html</code> inside the web container. Also confirm <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ALLOWED_ORIGINS</code> includes the web origin.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">WebSocket sync drops every ~60s</p>
      <p class="text-xs" style="color: var(--color-text-dim);">That's the read-deadline. The package auto-replies to pings; if your reverse proxy isn't forwarding pings, raise its idle timeout above 60 seconds.</p>
    </div>
    <div class="rounded-xl border p-4" style="border-color: var(--color-border); background: var(--color-background);">
      <p class="text-sm font-medium mb-1" style="color: var(--color-text);">External edits don't appear</p>
      <p class="text-xs" style="color: var(--color-text-dim);">Confirm the file lives under <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ROOT/&lt;vault-slug&gt;/</code>; <code class="px-1 py-0.5 rounded" style="background: var(--color-selected-bg); color: var(--color-accent);">fsnotify</code> is path-bound. Files outside the vault or behind symlinks are ignored.</p>
    </div>
  </div>
</section>
