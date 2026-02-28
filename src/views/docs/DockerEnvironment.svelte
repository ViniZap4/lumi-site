<script>
  const composeEnvVars = [
    { name: 'LUMI_PASSWORD', default: 'dev', desc: 'Shared password for server + web client login.' },
    { name: 'LUMI_PORT', default: '8080', desc: 'Host port mapped to the server container.' },
    { name: 'WEB_PORT', default: '3000', desc: 'Host port mapped to the web client container.' },
    { name: 'NOTES_PATH', default: './notes', desc: 'Host path to the notes directory (mounted into server).' },
    { name: 'LUMI_SERVER_URL', default: 'http://localhost:8080', desc: 'Browser-facing API URL. Passed as build arg to web client \u2014 changing requires docker compose build web.' },
  ];
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Docker & Environment
  </h2>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Docker Compose (.env)</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Copy <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">.env.example</code> to <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">.env</code> and set your password before starting.
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

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">How Environment Variables Flow</h3>

  <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Server chain</h4>
  <div class="rounded-xl border overflow-hidden mb-4" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text-dim);"><span style="color: var(--color-accent);">.env</span> file  →  compose <span style="color: var(--color-accent);">environment:</span>  →  container env  →  Go <span style="color: var(--color-accent);">os.Getenv()</span> with fallbacks</pre>
  </div>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    The server reads <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ROOT</code>, <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_PASSWORD</code>, and <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_PORT</code> at startup via <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">os.Getenv()</code>, falling back to compiled defaults. These are runtime values — you can change them without rebuilding the image.
  </p>

  <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Web client chain</h4>
  <div class="rounded-xl border overflow-hidden mb-4" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text-dim);"><span style="color: var(--color-accent);">.env</span> LUMI_SERVER_URL  →  compose <span style="color: var(--color-accent);">build.args</span>  →  Dockerfile <span style="color: var(--color-accent);">ARG</span>  →  Vite bakes into JS  →  <span style="color: var(--color-accent);">import.meta.env</span></pre>
  </div>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    The web client URL is a <strong>build-time only</strong> value. Vite replaces <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">import.meta.env.VITE_LUMI_SERVER_URL</code> with a literal string during the build. The resulting static files are served by nginx — there is no Node.js runtime to read environment variables, so changing the URL requires a rebuild.
  </p>

  <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">ARG vs ENV in Docker</h4>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">ARG</code> is available only during <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">docker build</code> — used by the web client to bake the server URL into the JS bundle.
    <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">ENV</code> is available at <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">docker run</code> — used by the server for runtime configuration. The server Dockerfile uses <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">ENV</code> with defaults that can be overridden via <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">-e</code> or compose <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">environment:</code>.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Standalone Docker</h3>
  <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Server</h4>
  <div class="rounded-xl border overflow-hidden mb-4" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre">docker build -t lumi-server ./server
docker run -d -p 8080:8080 \
  -v /path/to/notes:/notes \
  -e LUMI_PASSWORD=your-secret \
  lumi-server</pre>
  </div>

  <h4 class="text-xs font-semibold mb-2 mt-4" style="color: var(--color-text);">Web client</h4>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre">docker build \
  --build-arg VITE_LUMI_SERVER_URL=http://your-server:8080 \
  -t lumi-web ./web-client
docker run -d -p 3000:80 lumi-web</pre>
  </div>
</section>
