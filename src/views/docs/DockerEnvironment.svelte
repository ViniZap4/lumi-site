<script>
  const composeEnvVars = [
    { name: 'POSTGRES_USER', default: 'lumi', desc: 'Bundled Postgres role.' },
    { name: 'POSTGRES_PASSWORD', default: 'lumi', desc: 'Bundled Postgres password — override before exposing the deployment.' },
    { name: 'POSTGRES_DB', default: 'lumi', desc: 'Bundled Postgres database name.' },
    { name: 'LUMI_PORT', default: '8080', desc: 'Host port mapped to the server (container always binds 0.0.0.0:8080).' },
    { name: 'WEB_PORT', default: '3000', desc: 'Host port mapped to the web client (nginx internal: 80).' },
    { name: 'VAULTS_PATH', default: './vaults', desc: 'Host path mounted at /vaults inside the server. One subdirectory per vault slug.' },
    { name: 'LUMI_SERVER_URL', default: 'http://localhost:8080', desc: 'Browser-facing API URL. Baked into the web bundle via VITE_LUMI_SERVER_URL — changing requires docker compose build web.' },
    { name: 'LUMI_REQUIRE_TLS', default: 'false', desc: 'Compose default is off (assume reverse proxy / loopback); flip to true in prod with TLS terminated upstream.' },
    { name: 'LUMI_ALLOWED_ORIGINS', default: 'http://localhost:3000', desc: 'CSV of allowed CORS origins. Update if you serve the web client from another host.' },
    { name: 'LUMI_REGISTRATION', default: 'invite-only', desc: 'invite-only or open. Invite-only is the secure default.' },
    { name: 'LUMI_AUTO_MIGRATE', default: 'true', desc: 'Apply pending SQL migrations at startup. Set false if migrations are run via lumi-server migrate up during a deploy step.' },
    { name: 'LUMI_ADMIN_USERNAME', default: '—', desc: 'First-boot admin bootstrap (pair with password). Seed account when the users table is empty.' },
    { name: 'LUMI_ADMIN_PASSWORD', default: '—', desc: 'First-boot admin bootstrap (pair with username).' },
    { name: 'LUMI_AUDIT_RETENTION_DAYS', default: '90', desc: 'LGPD audit retention.' },
  ];
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Docker & Environment
  </h2>

  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    The v2 compose file ships three services: <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">postgres</code> (image <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">postgres:16-alpine</code>), <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">server</code> (built from <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">./server</code> with libyrs.a linked statically via cgo), and <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">web</code> (nginx-served Vite build). Healthcheck on Postgres gates server boot; healthcheck on server gates web availability.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Docker Compose (.env)</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Copy <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">.env.example</code> to <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">.env</code>, set the bootstrap admin credentials, and start. The server composes <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_DATABASE_URL</code> automatically from <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">POSTGRES_*</code> — you don't set it directly in the compose flow.
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
        {#each composeEnvVars as ev, i}
          <tr style="border-bottom: {i < composeEnvVars.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
            <td class="px-4 py-2 font-mono text-xs" style="color: var(--color-accent);">{ev.name}</td>
            <td class="px-4 py-2 font-mono text-xs hidden sm:table-cell" style="color: var(--color-muted);">{ev.default}</td>
            <td class="px-4 py-2 text-xs" style="color: var(--color-text-dim);">{ev.desc}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Environment Variable Flow</h3>

  <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Server chain</h4>
  <div class="rounded-xl border overflow-hidden mb-4" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text-dim);"><span style="color: var(--color-accent);">.env</span> file  →  compose <span style="color: var(--color-accent);">environment:</span>  →  container env  →  Go <span style="color: var(--color-accent);">os.Getenv()</span> with fallbacks</pre>
  </div>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    The server reads its config at startup in <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">internal/config</code>. These are runtime values — change <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">.env</code> and restart the container, no rebuild needed.
  </p>

  <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Web client chain</h4>
  <div class="rounded-xl border overflow-hidden mb-4" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text-dim);"><span style="color: var(--color-accent);">.env</span> LUMI_SERVER_URL  →  compose <span style="color: var(--color-accent);">build.args</span>  →  Dockerfile <span style="color: var(--color-accent);">ARG</span>  →  Vite bakes into JS  →  <span style="color: var(--color-accent);">import.meta.env</span></pre>
  </div>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    The web client URL is a <strong>build-time only</strong> value. Vite replaces <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">import.meta.env.VITE_LUMI_SERVER_URL</code> with a literal string during the build. The output is served by nginx — there is no Node.js runtime to read environment variables, so changing the URL requires <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">docker compose build web</code>.
  </p>

  <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Postgres chain</h4>
  <div class="rounded-xl border overflow-hidden mb-4" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text-dim);"><span style="color: var(--color-accent);">.env</span> POSTGRES_*  →  postgres service env  →  compose composes <span style="color: var(--color-accent);">LUMI_DATABASE_URL</span>  →  server reads pgxpool</pre>
  </div>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    The data volume <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">lumi-pg</code> persists between restarts. The server's <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">depends_on</code> waits for Postgres's healthcheck before booting.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">First-Boot Admin Bootstrap</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Set <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ADMIN_USERNAME</code> + <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ADMIN_PASSWORD</code> for the first <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">docker compose up</code> — the server seeds a single admin when the users table is empty. After that user exists, you can unset the env vars and redeploy; the bootstrap is idempotent.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Standalone Docker</h3>
  <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Server</h4>
  <div class="rounded-xl border overflow-hidden mb-4" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre">docker build -t lumi-server ./server
docker run -d -p 8080:8080 \
  -v /path/to/vaults:/vaults \
  -e LUMI_DATABASE_URL=postgres://lumi:lumi@host:5432/lumi?sslmode=disable \
  -e LUMI_ROOT=/vaults \
  -e LUMI_ALLOWED_ORIGINS=https://your-web-host \
  -e LUMI_REGISTRATION=invite-only \
  -e LUMI_AUTO_MIGRATE=true \
  -e LUMI_ADMIN_USERNAME=admin \
  -e LUMI_ADMIN_PASSWORD=change-me \
  lumi-server</pre>
  </div>

  <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Web client</h4>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre">docker build \
  --build-arg VITE_LUMI_SERVER_URL=https://api.your-host \
  -t lumi-web ./web-client
docker run -d -p 3000:80 lumi-web</pre>
  </div>
</section>
