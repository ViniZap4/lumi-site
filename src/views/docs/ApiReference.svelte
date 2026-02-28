<script>
  const apiEndpoints = [
    { method: 'POST', path: '/api/auth', desc: 'Validate password. Send the password in the X-Lumi-Token header. Returns 200 on success, 401 on failure.' },
    { method: 'GET', path: '/api/folders', desc: 'List all folders in the notes directory.' },
    { method: 'POST', path: '/api/folders', desc: 'Create a new folder.' },
    { method: 'PUT', path: '/api/folders/:name', desc: 'Rename a folder.' },
    { method: 'DELETE', path: '/api/folders/:name', desc: 'Delete a folder.' },
    { method: 'POST', path: '/api/folders/:name/move', desc: 'Move a folder to a different parent directory.' },
    { method: 'GET', path: '/api/notes', desc: 'List all notes. Optional ?path= query param to filter by folder.' },
    { method: 'GET', path: '/api/notes/:id', desc: 'Get a single note by ID, including full content.' },
    { method: 'POST', path: '/api/notes', desc: 'Create a new note. Send { title, content, tags } in JSON body.' },
    { method: 'PUT', path: '/api/notes/:id', desc: 'Update an existing note. Send { title, content, tags } in JSON body.' },
    { method: 'DELETE', path: '/api/notes/:id', desc: 'Delete a note by ID.' },
    { method: 'POST', path: '/api/notes/:id/move', desc: 'Move a note to a different folder.' },
    { method: 'POST', path: '/api/notes/:id/copy', desc: 'Duplicate a note.' },
    { method: 'POST', path: '/api/notes/:id/rename', desc: 'Rename a note.' },
    { method: 'WS', path: '/ws?token=<token>', desc: 'WebSocket for real-time updates. Broadcasts note and folder events.' },
  ];

  function methodColor(method) {
    const colors = {
      GET: 'var(--color-accent)',
      POST: 'var(--color-info)',
      PUT: 'var(--color-secondary)',
      DELETE: 'var(--color-error)',
      WS: 'var(--color-warning)',
    };
    return colors[method] || 'var(--color-text)';
  }
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> API Reference
  </h2>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Authentication</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    All REST endpoints require the <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">X-Lumi-Token</code> header set to the server password. The WebSocket endpoint requires a <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">?token=</code> query parameter instead. <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">POST /api/auth</code> is the only endpoint exempt from middleware — it validates the token for the login flow.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Endpoints</h3>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    {#each apiEndpoints as ep, i}
      <div class="px-4 py-3" style="border-bottom: {i < apiEndpoints.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
        <div class="flex items-center gap-3 mb-1">
          <span class="text-xs font-semibold px-2 py-0.5 rounded" style="background: var(--color-selected-bg); color: {methodColor(ep.method)};">{ep.method}</span>
          <code class="text-xs" style="color: var(--color-text);">{ep.path}</code>
        </div>
        <p class="text-xs ml-[52px]" style="color: var(--color-text-dim);">{ep.desc}</p>
      </div>
    {/each}
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">WebSocket Events</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">
    After connecting, the server broadcasts JSON messages for every change:
  </p>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);"><!-- --><span style="color: var(--color-muted);">// Server → Client</span>
{'{'}
  <span style="color: var(--color-accent);">"type"</span>: <span style="color: var(--color-secondary);">"note_created"</span> | <span style="color: var(--color-secondary);">"note_updated"</span> | <span style="color: var(--color-secondary);">"note_deleted"</span> | <span style="color: var(--color-secondary);">"folder_updated"</span>,
  <span style="color: var(--color-accent);">"note"</span>: {'{'} <span style="color: var(--color-muted);">...</span> {'}'}
{'}'}</pre>
  </div>
</section>
