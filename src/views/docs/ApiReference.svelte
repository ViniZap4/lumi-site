<script>
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

  const endpointGroups = [
    {
      label: 'Authentication',
      endpoints: [
        {
          method: 'POST',
          path: '/api/auth',
          desc: 'Validate password. No auth middleware — used by the login flow.',
          request: '# Header\nX-Lumi-Token: <password>',
          response: '200 OK\n{ "status": "ok" }\n\n401 Unauthorized',
        },
      ],
    },
    {
      label: 'Folders',
      endpoints: [
        {
          method: 'GET',
          path: '/api/folders',
          desc: 'List all folders recursively.',
          response: '200 OK\n[\n  { "name": "journal", "path": "journal" },\n  { "name": "daily", "path": "journal/daily" }\n]',
        },
        {
          method: 'POST',
          path: '/api/folders',
          desc: 'Create a new folder. Nested paths supported.',
          request: '{ "name": "journal/daily" }',
          response: '201 Created\n{ "name": "daily", "path": "journal/daily" }',
        },
        {
          method: 'PUT',
          path: '/api/folders/:name',
          desc: 'Rename a folder.',
          request: '{ "new_name": "diary" }',
          response: '200 OK',
        },
        {
          method: 'DELETE',
          path: '/api/folders/:name',
          desc: 'Delete a folder and all its contents.',
          response: '204 No Content',
        },
        {
          method: 'POST',
          path: '/api/folders/:name/move',
          desc: 'Move a folder to a different parent directory. Broadcasts folder_updated.',
          request: '{ "destination": "archive" }',
          response: '200 OK',
        },
      ],
    },
    {
      label: 'Notes',
      endpoints: [
        {
          method: 'GET',
          path: '/api/notes',
          desc: 'List all notes. Optional ?path= query param to filter by folder.',
          response: '200 OK\n[\n  {\n    "id": "my-note",\n    "title": "My Note",\n    "created_at": "2026-02-16T11:00:00Z",\n    "updated_at": "2026-02-16T11:05:00Z",\n    "tags": ["example"],\n    "path": "journal/my-note.md",\n    "content": "# My Note\\n\\nContent here"\n  }\n]',
        },
        {
          method: 'GET',
          path: '/api/notes/:id',
          desc: 'Get a single note by ID, including full content.',
          response: '200 OK  — single Note object\n404 Not Found',
        },
        {
          method: 'POST',
          path: '/api/notes',
          desc: 'Create a new note. Broadcasts note_created.',
          request: '{\n  "id": "my-note",\n  "title": "My Note",\n  "content": "# My Note\\n\\nContent here",\n  "tags": ["example"],\n  "folder": "journal"\n}',
          response: '201 Created  — Note object',
        },
        {
          method: 'PUT',
          path: '/api/notes/:id',
          desc: 'Update an existing note. Broadcasts note_updated.',
          request: '{\n  "title": "Updated Title",\n  "content": "# Updated\\n\\nNew content",\n  "tags": ["updated"]\n}',
          response: '200 OK  — updated Note object',
        },
        {
          method: 'DELETE',
          path: '/api/notes/:id',
          desc: 'Delete a note. Broadcasts note_deleted.',
          response: '204 No Content',
        },
        {
          method: 'POST',
          path: '/api/notes/:id/move',
          desc: 'Move a note to a different folder. Broadcasts note_updated.',
          request: '{ "folder": "archive" }',
          response: '200 OK  — Note object with updated path',
        },
        {
          method: 'POST',
          path: '/api/notes/:id/copy',
          desc: 'Duplicate a note with a new ID and title.',
          request: '{ "new_id": "my-note-copy", "new_title": "My Note (Copy)" }',
          response: '201 Created  — new Note object',
        },
        {
          method: 'POST',
          path: '/api/notes/:id/rename',
          desc: 'Rename a note (change its ID and title). Broadcasts note_deleted + note_created.',
          request: '{ "new_id": "renamed-note", "new_title": "Renamed Note" }',
          response: '200 OK  — renamed Note object',
        },
      ],
    },
    {
      label: 'Files',
      endpoints: [
        {
          method: 'GET',
          path: '/api/files/:filepath',
          desc: 'Serve a file (image, attachment) from the notes directory. Path-traversal protected — requests outside the notes root return 403.',
          response: '200 OK  — file contents (auto-detected Content-Type)\n403 Forbidden  — path traversal attempt\n404 Not Found',
        },
      ],
    },
    {
      label: 'WebSocket',
      endpoints: [
        {
          method: 'WS',
          path: '/ws?token=<token>',
          desc: 'Client WebSocket for real-time updates. Authenticated via token query parameter. Broadcasts note and folder events to all connected clients.',
        },
        {
          method: 'WS',
          path: '/ws/peer?server_id=<id>',
          desc: 'Peer federation WebSocket. No token auth — uses origin field in messages for echo prevention. Accepts inbound connections from peer servers.',
        },
      ],
    },
  ];
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> API Reference
  </h2>

  <!-- Authentication -->
  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Authentication</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    All REST endpoints require the <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">X-Lumi-Token</code> header set to the server password (<code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_PASSWORD</code> env var, defaults to <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">dev</code>). The client WebSocket endpoint requires a <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">?token=</code> query parameter instead. <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">POST /api/auth</code> is the only endpoint exempt from middleware — it validates the token for the login flow.
  </p>

  <!-- CORS -->
  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">CORS</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">
    The server sets the following CORS headers on all responses:
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);"><span style="color: var(--color-accent);">Access-Control-Allow-Origin</span>: *
<span style="color: var(--color-accent);">Access-Control-Allow-Methods</span>: GET, POST, PUT, DELETE, OPTIONS
<span style="color: var(--color-accent);">Access-Control-Allow-Headers</span>: Content-Type, X-Lumi-Token</pre>
  </div>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    Preflight <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">OPTIONS</code> requests are handled automatically and return <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">200 OK</code>.
  </p>

  <!-- Note Schema -->
  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Note Object</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">
    All note endpoints return or accept this JSON shape:
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);">{'{'}<br/>  <span style="color: var(--color-accent);">"id"</span>:         <span style="color: var(--color-secondary);">string</span>    <span style="color: var(--color-muted);">// unique identifier (becomes filename)</span><br/>  <span style="color: var(--color-accent);">"title"</span>:      <span style="color: var(--color-secondary);">string</span>    <span style="color: var(--color-muted);">// display title</span><br/>  <span style="color: var(--color-accent);">"created_at"</span>: <span style="color: var(--color-secondary);">string</span>    <span style="color: var(--color-muted);">// ISO 8601 timestamp</span><br/>  <span style="color: var(--color-accent);">"updated_at"</span>: <span style="color: var(--color-secondary);">string</span>    <span style="color: var(--color-muted);">// ISO 8601 timestamp</span><br/>  <span style="color: var(--color-accent);">"tags"</span>:       <span style="color: var(--color-secondary);">string[]</span>  <span style="color: var(--color-muted);">// tag array</span><br/>  <span style="color: var(--color-accent);">"path"</span>:       <span style="color: var(--color-secondary);">string</span>    <span style="color: var(--color-muted);">// relative file path</span><br/>  <span style="color: var(--color-accent);">"content"</span>:    <span style="color: var(--color-secondary);">string</span>    <span style="color: var(--color-muted);">// markdown body</span><br/>{'}'}</pre>
  </div>

  <!-- Endpoints by group -->
  {#each endpointGroups as group}
    <h3 class="text-sm font-semibold mb-3 mt-8" style="color: var(--color-secondary);">{group.label}</h3>
    <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
      {#each group.endpoints as ep, i}
        <div class="px-4 py-3" style="border-bottom: {i < group.endpoints.length - 1 ? '1px solid var(--color-separator)' : 'none'};">
          <div class="flex items-center gap-3 mb-1">
            <span class="text-xs font-semibold px-2 py-0.5 rounded" style="background: var(--color-selected-bg); color: {methodColor(ep.method)};">{ep.method}</span>
            <code class="text-xs" style="color: var(--color-text);">{ep.path}</code>
          </div>
          <p class="text-xs ml-[52px] mb-2" style="color: var(--color-text-dim);">{ep.desc}</p>
          {#if ep.request}
            <div class="ml-[52px] mb-2">
              <span class="text-xs font-semibold" style="color: var(--color-muted);">Request</span>
              <pre class="mt-1 p-3 rounded-lg text-xs leading-relaxed overflow-x-auto whitespace-pre" style="background: var(--color-selected-bg); color: var(--color-text);">{ep.request}</pre>
            </div>
          {/if}
          {#if ep.response}
            <div class="ml-[52px]">
              <span class="text-xs font-semibold" style="color: var(--color-muted);">Response</span>
              <pre class="mt-1 p-3 rounded-lg text-xs leading-relaxed overflow-x-auto whitespace-pre" style="background: var(--color-selected-bg); color: var(--color-text);">{ep.response}</pre>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/each}

  <!-- WebSocket Events -->
  <h3 class="text-sm font-semibold mb-3 mt-8" style="color: var(--color-secondary);">WebSocket Events</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">
    After connecting to <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">/ws</code>, the server broadcasts JSON messages for every change:
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);"><span style="color: var(--color-muted);">// Server → Client</span>
{'{'}<br/>  <span style="color: var(--color-accent);">"type"</span>:   <span style="color: var(--color-secondary);">"note_created"</span> | <span style="color: var(--color-secondary);">"note_updated"</span> | <span style="color: var(--color-secondary);">"note_deleted"</span> | <span style="color: var(--color-secondary);">"folder_updated"</span>,<br/>  <span style="color: var(--color-accent);">"note"</span>:   {'{'} ... {'}'}            <span style="color: var(--color-muted);">// Note object (omitted for folder_updated)</span>,<br/>  <span style="color: var(--color-accent);">"origin"</span>: <span style="color: var(--color-secondary);">"server-id"</span>      <span style="color: var(--color-muted);">// originating server ID (for peer federation)</span><br/>{'}'}</pre>
  </div>

  <h4 class="text-xs font-semibold mb-2" style="color: var(--color-text);">Event Types</h4>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <div class="px-4 py-3" style="border-bottom: 1px solid var(--color-separator);">
      <code class="text-xs" style="color: var(--color-accent);">note_created</code>
      <span class="text-xs ml-2" style="color: var(--color-text-dim);">— fired after POST /api/notes</span>
    </div>
    <div class="px-4 py-3" style="border-bottom: 1px solid var(--color-separator);">
      <code class="text-xs" style="color: var(--color-accent);">note_updated</code>
      <span class="text-xs ml-2" style="color: var(--color-text-dim);">— fired after PUT /api/notes/:id or POST /api/notes/:id/move</span>
    </div>
    <div class="px-4 py-3" style="border-bottom: 1px solid var(--color-separator);">
      <code class="text-xs" style="color: var(--color-accent);">note_deleted</code>
      <span class="text-xs ml-2" style="color: var(--color-text-dim);">— fired after DELETE /api/notes/:id</span>
    </div>
    <div class="px-4 py-3">
      <code class="text-xs" style="color: var(--color-accent);">folder_updated</code>
      <span class="text-xs ml-2" style="color: var(--color-text-dim);">— fired after any folder create/rename/delete/move operation</span>
    </div>
  </div>

  <!-- Peer Federation -->
  <h3 class="text-sm font-semibold mb-3 mt-8" style="color: var(--color-secondary);">Peer Federation</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Multiple Lumi server instances can sync with each other over WebSocket. Each server maintains outbound connections to its configured peers and accepts inbound connections on <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">/ws/peer</code>.
  </p>

  <h4 class="text-xs font-semibold mb-2" style="color: var(--color-text);">Configuration</h4>
  <div class="rounded-xl border overflow-hidden mb-4" style="border-color: var(--color-border); background: var(--color-background);">
    <div class="px-4 py-3" style="border-bottom: 1px solid var(--color-separator);">
      <code class="text-xs" style="color: var(--color-accent);">LUMI_PEERS</code>
      <span class="text-xs ml-2" style="color: var(--color-text-dim);">— comma-separated list of peer WebSocket URLs</span>
      <pre class="mt-1 text-xs" style="color: var(--color-muted);">LUMI_PEERS=ws://server-b:8080,ws://server-c:8080</pre>
    </div>
    <div class="px-4 py-3">
      <code class="text-xs" style="color: var(--color-accent);">LUMI_SERVER_ID</code>
      <span class="text-xs ml-2" style="color: var(--color-text-dim);">— unique identifier for this server instance (auto-generated if not set)</span>
    </div>
  </div>

  <h4 class="text-xs font-semibold mb-2" style="color: var(--color-text);">How It Works</h4>
  <div class="flex flex-col gap-2 mb-4">
    <p class="text-sm" style="color: var(--color-text-dim);">
      <span style="color: var(--color-primary);">Origin tracking</span> — every WebSocket message includes an <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">origin</code> field set to the server ID that originated the change. Peers skip messages where <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">origin</code> matches their own ID, preventing echo loops.
    </p>
    <p class="text-sm" style="color: var(--color-text-dim);">
      <span style="color: var(--color-primary);">Broadcast routing</span> — <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">Broadcast()</code> sends events to all local clients <em>and</em> all peers. <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">BroadcastLocal()</code> sends only to local clients — used when applying a change received from a peer, to avoid re-broadcasting back.
    </p>
    <p class="text-sm" style="color: var(--color-text-dim);">
      <span style="color: var(--color-primary);">Auto-reconnect</span> — outbound peer connections automatically retry with a 5-second backoff on disconnect.
    </p>
  </div>
</section>
