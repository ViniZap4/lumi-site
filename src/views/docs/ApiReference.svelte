<script>
  function methodColor(method) {
    const colors = {
      GET: 'var(--color-accent)',
      POST: 'var(--color-info)',
      PUT: 'var(--color-secondary)',
      PATCH: 'var(--color-secondary)',
      DELETE: 'var(--color-error)',
      WS: 'var(--color-warning)',
    };
    return colors[method] || 'var(--color-text)';
  }

  const endpointGroups = [
    {
      label: 'Authentication & Account',
      handlers: 'internal/auth/handlers.go, internal/users/users.go',
      endpoints: [
        {
          method: 'POST',
          path: '/api/auth/register',
          desc: 'Create a new user. Returns 403 registration_closed unless LUMI_REGISTRATION=open. When LUMI_TOS_VERSION + LUMI_PRIVACY_VERSION are configured, missing consent fields return 400 consent_required.',
          request: '{\n  "username":     string,\n  "password":     string,\n  "display_name": string,\n  "consent": { "tos_version": string, "privacy_version": string }\n}',
          response: '201 Created\n{\n  "token":      "<32-byte hex>",\n  "expires_at": "<RFC3339>",\n  "user":       { "id": "...", "username": "...", "display_name": "..." }\n}',
        },
        {
          method: 'POST',
          path: '/api/auth/login',
          desc: 'Bcrypt-verify password; issue a session token. Invalid credentials and unknown users return the same error to prevent enumeration.',
          request: '{ "username": string, "password": string }',
          response: '200 OK\n{ "token": "...", "expires_at": "...", "user": { ... } }\n\n401 invalid_credentials\n429 rate_limited',
        },
        {
          method: 'POST',
          path: '/api/auth/logout',
          desc: 'Delete the current session row. Requires X-Lumi-Token.',
          response: '204 No Content',
        },
        {
          method: 'GET',
          path: '/api/users/me',
          desc: 'Return the authenticated user profile.',
          response: '200 OK\n{ "id": "...", "username": "...", "display_name": "..." }',
        },
        {
          method: 'PATCH',
          path: '/api/users/me',
          desc: 'Update display_name. Username changes are not supported on this endpoint.',
          request: '{ "display_name": string }',
          response: '200 OK  — updated user',
        },
        {
          method: 'POST',
          path: '/api/users/me/password',
          desc: 'Change password with an old-password challenge.',
          request: '{ "old_password": string, "new_password": string }',
          response: '204 No Content\n401 invalid_credentials',
        },
        {
          method: 'GET',
          path: '/api/users/me/export',
          desc: 'LGPD right of access — streams a zip containing profile, owned notes, audit subset, and consent ledger. Rate-limited to 1/day/user.',
          response: '200 OK  — application/zip\n429 rate_limited',
        },
        {
          method: 'DELETE',
          path: '/api/users/me',
          desc: 'LGPD right of erasure. Sessions are dropped; sole-admin personal vaults are deleted; shared vault content is retained; audit log identifying fields are nullified.',
          response: '204 No Content\n409 sole_admin_vaults  — body lists vault slugs requiring transfer or ?delete_sole_admin_vaults=true',
        },
      ],
    },
    {
      label: 'Vaults',
      handlers: 'internal/vaults/vaults.go',
      endpoints: [
        {
          method: 'GET',
          path: '/api/vaults',
          desc: 'List vaults the caller is a member of.',
          response: '200 OK\n[\n  {\n    "id":         "<uuid>",\n    "slug":       "personal",\n    "name":       "Personal",\n    "created_by": "<uuid>",\n    "created_at": "<RFC3339>"\n  }\n]',
        },
        {
          method: 'POST',
          path: '/api/vaults',
          desc: 'Create a vault. Caller becomes Admin. Slug derived from name; must be unique.',
          request: '{ "slug": string, "name": string }',
          response: '201 Created  — vault DTO',
        },
        {
          method: 'GET',
          path: '/api/vaults/:vault',
          desc: 'Vault detail.',
          response: '200 OK  — vault DTO\n404 not_found',
        },
        {
          method: 'PATCH',
          path: '/api/vaults/:vault',
          desc: 'Rename / update vault metadata.',
          request: '{ "name": string }',
          response: '200 OK\n403 forbidden  — requires capability: vault.manage',
        },
        {
          method: 'DELETE',
          path: '/api/vaults/:vault',
          desc: 'Delete vault, members, roles, notes, CRDT state. capability: vault.manage.',
          response: '204 No Content',
        },
      ],
    },
    {
      label: 'Members',
      handlers: 'internal/members/members.go',
      endpoints: [
        {
          method: 'GET',
          path: '/api/vaults/:vault/members',
          desc: 'List vault members with their role + capability set.',
          response: '200 OK\n[\n  {\n    "vault_id":     "<uuid>",\n    "user_id":      "<uuid>",\n    "username":     "alice",\n    "display_name": "Alice",\n    "role_id":      "<uuid>",\n    "role_name":    "Admin",\n    "capabilities": ["*"],\n    "is_seed_role": true,\n    "joined_at":    "<RFC3339>"\n  }\n]',
        },
        {
          method: 'PATCH',
          path: '/api/vaults/:vault/members/:user',
          desc: 'Change a member\'s role. capability: members.manage.',
          request: '{ "role_id": "<uuid>" }',
          response: '200 OK',
        },
        {
          method: 'DELETE',
          path: '/api/vaults/:vault/members/:user',
          desc: 'Remove a member. capability: members.manage.',
          response: '204 No Content',
        },
      ],
    },
    {
      label: 'Roles',
      handlers: 'internal/roles/roles.go',
      endpoints: [
        {
          method: 'GET',
          path: '/api/vaults/:vault/roles',
          desc: 'List the seed and custom roles for the vault.',
          response: '200 OK\n[\n  {\n    "id":           "<uuid>",\n    "vault_id":     "<uuid>",\n    "name":         "Editor",\n    "capabilities": ["note.read", "note.create", "note.edit", "note.delete", "note.move"],\n    "is_seed":      true\n  }\n]',
        },
        {
          method: 'POST',
          path: '/api/vaults/:vault/roles',
          desc: 'Create a custom role. capability: roles.manage.',
          request: '{ "name": string, "capabilities": ["note.read", "note.edit", "..."] }',
          response: '201 Created  — role DTO',
        },
        {
          method: 'PATCH',
          path: '/api/vaults/:vault/roles/:role',
          desc: 'Update a custom role. Seed roles (is_seed=true) reject this. capability: roles.manage.',
          request: '{ "name": string, "capabilities": [...] }',
          response: '200 OK',
        },
        {
          method: 'DELETE',
          path: '/api/vaults/:vault/roles/:role',
          desc: 'Delete a custom role. Seed roles cannot be deleted. capability: roles.manage.',
          response: '204 No Content',
        },
      ],
    },
    {
      label: 'Invites',
      handlers: 'internal/invites/invites.go',
      endpoints: [
        {
          method: 'POST',
          path: '/api/vaults/:vault/invites',
          desc: 'Create an invite link. capability: members.invite.',
          request: '{\n  "role_id":    "<uuid>",\n  "max_uses":   1,\n  "expires_at": "<RFC3339>",\n  "email_hint": "alice@example.com"\n}',
          response: '201 Created\n{\n  "token":      "<opaque>",\n  "url":        "<LUMI_PUBLIC_BASE_URL>/invite/<token>",\n  "expires_at": "<RFC3339>",\n  "max_uses":   1,\n  "use_count":  0\n}',
        },
        {
          method: 'GET',
          path: '/api/vaults/:vault/invites',
          desc: 'List outstanding invites for the vault. capability: members.invite.',
          response: '200 OK  — array of invite DTOs',
        },
        {
          method: 'DELETE',
          path: '/api/vaults/:vault/invites/:token',
          desc: 'Revoke an invite. capability: members.invite.',
          response: '204 No Content',
        },
        {
          method: 'GET',
          path: '/api/invites/:token',
          desc: 'Public — inspect an invite (inviter, vault name, role). No auth required.',
          response: '200 OK\n{ "vault_name": "...", "inviter": "...", "role_name": "...", "expires_at": "..." }\n410 expired_or_revoked',
        },
        {
          method: 'POST',
          path: '/api/invites/:token/accept',
          desc: 'Public — register-and-join (anonymous body) or attach-membership (authed). Returns a session in the anonymous path.',
          request: '// anonymous (register + join):\n{ "username": "...", "password": "...", "display_name": "...", "consent": { ... } }\n\n// authed (attach membership only):\n// X-Lumi-Token: <session>',
          response: '201 Created  — session response (anonymous)\n200 OK   — membership added (authed)',
        },
      ],
    },
    {
      label: 'Notes (CRUD)',
      handlers: 'internal/notes/notes.go',
      endpoints: [
        {
          method: 'GET',
          path: '/api/vaults/:vault/notes',
          desc: 'List notes in the vault (paginated). capability: note.read.',
          response: '200 OK\n[\n  {\n    "id":         "2026-example",\n    "vault_id":   "<uuid>",\n    "path":       "projects/2026-example.md",\n    "title":      "Example Note",\n    "created_at": "<RFC3339>",\n    "updated_at": "<RFC3339>"\n  }\n]',
        },
        {
          method: 'POST',
          path: '/api/vaults/:vault/notes',
          desc: 'Create a note. capability: note.create. Server initialises CRDT state from supplied content.',
          request: '{ "id": "my-note", "title": "My Note", "path": "projects/", "content": "# My Note\\n\\n..." }',
          response: '201 Created  — note DTO',
        },
        {
          method: 'GET',
          path: '/api/vaults/:vault/notes/:id',
          desc: 'Get note metadata. capability: note.read.',
          response: '200 OK  — note DTO\n404 not_found',
        },
        {
          method: 'GET',
          path: '/api/vaults/:vault/notes/:id/content',
          desc: 'Get the current rendered markdown text from the CRDT. capability: note.read.',
          response: '200 OK  — text/markdown body',
        },
        {
          method: 'PATCH',
          path: '/api/vaults/:vault/notes/:id',
          desc: 'Rename / move a note. capability: note.edit (note: move-only without note.edit is a known limitation).',
          request: '{ "title": "New Title", "path": "archive/" }',
          response: '200 OK  — updated note DTO',
        },
        {
          method: 'DELETE',
          path: '/api/vaults/:vault/notes/:id',
          desc: 'Delete a note (also drops its CRDT snapshot + update log). capability: note.delete.',
          response: '204 No Content',
        },
      ],
    },
    {
      label: 'Notes (CRDT Sync — TUI)',
      handlers: 'internal/notes/notes.go (snapshot + diff)',
      endpoints: [
        {
          method: 'GET',
          path: '/api/vaults/:vault/notes/:id/snapshot',
          desc: 'Fetch current text + vector clock for snapshot+diff editing. capability: note.read.',
          response: '200 OK\n{ "text": "...", "vector_clock": "<base64>" }',
        },
        {
          method: 'POST',
          path: '/api/vaults/:vault/notes/:id/diff',
          desc: 'Apply a textual diff against the current CRDT. If the doc advanced since base_clock, the server replays the diff against current text so concurrent edits are preserved. capability: note.edit.',
          request: '{ "base_clock": "<base64>", "diff": "<unified-diff or text>" }',
          response: '200 OK  — { "applied": true, "new_clock": "<base64>" }',
        },
      ],
    },
    {
      label: 'Audit',
      handlers: 'internal/audit/handlers.go',
      endpoints: [
        {
          method: 'GET',
          path: '/api/vaults/:vault/audit?limit=&offset=',
          desc: 'Paginated audit log for the vault. capability: audit.read. Default limit 50, max 200.',
          response: '200 OK\n{\n  "entries": [\n    {\n      "id":         42,\n      "user_id":    "<uuid|null>",\n      "vault_id":   "<uuid|null>",\n      "action":     "vault.create",\n      "payload":    { ... },\n      "ip":         "...",\n      "user_agent": "...",\n      "created_at": "<RFC3339>"\n    }\n  ],\n  "limit":  50,\n  "offset": 0\n}',
        },
      ],
    },
    {
      label: 'WebSocket — Yjs Sync',
      handlers: 'internal/wsync/handler.go',
      endpoints: [
        {
          method: 'WS',
          path: '/api/vaults/:vault/notes/:id/sync?token=<session>',
          desc: 'Yjs sync + awareness for a single note. capability: note.edit (gated at the HTTP upgrade). Frames are binary (lib0 v1); text frames are silently dropped. Per-frame cap 1 MiB; per-user cap 10 concurrent connections; 60s read deadline with ping/pong.',
          response: 'Server → Client (binary frames):\n  SyncStep1 (initial state vector)\n  SyncStep2 (diff)\n  SyncUpdate (incremental)\n  Awareness (cursor + display name fan-out)\n\nClient → Server (binary frames):\n  SyncStep1 / SyncStep2 / SyncUpdate / Awareness',
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
    Session-based. <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">POST /api/auth/login</code> returns a 32-byte hex session token + expiry. Every authenticated REST call must carry <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">X-Lumi-Token: &lt;token&gt;</code>. WebSocket upgrades use <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">?token=</code> as a query parameter. Sessions live in Postgres with a 30-day sliding TTL (<code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">last_used_at</code> bumps on every authenticated request).
  </p>
  <p class="text-sm mb-6" style="color: var(--color-text-dim);">
    Per-vault custom roles gate every mutation. The seed role set is Admin (<code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">*</code>) / Editor (<code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">note.*</code>) / Viewer (<code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">note.read</code>) / Commenter (read-only until comments ship). Capability checks run in the <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">capguard</code> middleware before the handler body.
  </p>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">Error Codes</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">
    Errors are JSON objects of the form <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">{'{'}"error": "&lt;code&gt;"{'}'}</code> with an optional <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">detail</code>. Common codes:
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);">400 validation_failed     <span style="color: var(--color-muted);"># malformed body / params</span>
400 consent_required      <span style="color: var(--color-muted);"># LGPD consent fields missing</span>
401 unauthorized          <span style="color: var(--color-muted);"># missing or unknown token</span>
401 invalid_credentials   <span style="color: var(--color-muted);"># bad password</span>
401 token_expired
403 forbidden             <span style="color: var(--color-muted);"># capability denied</span>
403 registration_closed   <span style="color: var(--color-muted);"># LUMI_REGISTRATION=invite-only</span>
404 not_found
409 conflict              <span style="color: var(--color-muted);"># duplicate username/slug/etc.</span>
429 rate_limited          <span style="color: var(--color-muted);"># auth bucket / export quota</span>
500 internal</pre>
  </div>

  <h3 class="text-sm font-semibold mb-3" style="color: var(--color-secondary);">CORS &amp; Origin</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">
    Allowed origins are configured via <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">LUMI_ALLOWED_ORIGINS</code> (CSV). The WebSocket handshake enforces the same allowlist via the Origin header; native clients (TUI, Apple) typically send no Origin and are allowed because the token gate is the primary defence.
  </p>

  <!-- Endpoints by group -->
  {#each endpointGroups as group}
    <h3 class="text-sm font-semibold mb-1 mt-8" style="color: var(--color-secondary);">{group.label}</h3>
    {#if group.handlers}
      <p class="text-xs mb-3" style="color: var(--color-muted);">source: {group.handlers}</p>
    {/if}
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

  <!-- Capability vocabulary -->
  <h3 class="text-sm font-semibold mb-3 mt-8" style="color: var(--color-secondary);">Capability Vocabulary</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Roles are sets of capability strings. Wildcards expand at check time (<code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">note.*</code>, <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">*</code>). The full vocabulary as enforced by <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">internal/capguard</code>:
  </p>
  <div class="rounded-xl border overflow-hidden mb-6" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);"><span style="color: var(--color-accent);">note.read</span>         <span style="color: var(--color-muted);"># list, get, content, snapshot</span>
<span style="color: var(--color-accent);">note.create</span>
<span style="color: var(--color-accent);">note.edit</span>         <span style="color: var(--color-muted);"># PATCH, diff, WS sync upgrade</span>
<span style="color: var(--color-accent);">note.delete</span>
<span style="color: var(--color-accent);">note.move</span>
<span style="color: var(--color-accent);">members.invite</span>    <span style="color: var(--color-muted);"># create / list / revoke invites</span>
<span style="color: var(--color-accent);">members.manage</span>    <span style="color: var(--color-muted);"># change roles, remove members</span>
<span style="color: var(--color-accent);">roles.manage</span>      <span style="color: var(--color-muted);"># create / edit / delete custom roles</span>
<span style="color: var(--color-accent);">vault.manage</span>      <span style="color: var(--color-muted);"># rename / delete vault</span>
<span style="color: var(--color-accent);">audit.read</span>        <span style="color: var(--color-muted);"># read the audit log</span></pre>
  </div>

  <!-- LGPD -->
  <h3 class="text-sm font-semibold mb-3 mt-8" style="color: var(--color-secondary);">LGPD Endpoints</h3>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Brazilian LGPD compliance surfaces three first-class endpoints — consent capture at signup, data export, and account erasure. See the Authentication &amp; Account section above for shapes; see SPEC.md for the data-flow guarantees (cascade rules, audit nullification, retention).
  </p>

  <!-- Source map -->
  <h3 class="text-sm font-semibold mb-3 mt-8" style="color: var(--color-secondary);">Where The Code Lives</h3>
  <p class="text-sm mb-2" style="color: var(--color-text-dim);">
    All handlers are registered via a <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">Register(r fiber.Router)</code> method on each domain package's <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">Handlers</code> struct. The authed group mounts at <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">/api</code> behind the session middleware.
  </p>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);">server/internal/auth/handlers.go        <span style="color: var(--color-muted);"># /auth/*, /users/me, /users/me/password</span>
server/internal/users/users.go           <span style="color: var(--color-muted);"># /users/me/export, DELETE /users/me</span>
server/internal/vaults/vaults.go         <span style="color: var(--color-muted);"># /vaults*</span>
server/internal/members/members.go       <span style="color: var(--color-muted);"># /vaults/:vault/members*</span>
server/internal/roles/roles.go           <span style="color: var(--color-muted);"># /vaults/:vault/roles*</span>
server/internal/invites/invites.go       <span style="color: var(--color-muted);"># /vaults/:vault/invites*, /invites/:token*</span>
server/internal/notes/notes.go           <span style="color: var(--color-muted);"># /vaults/:vault/notes*, snapshot/diff</span>
server/internal/audit/handlers.go        <span style="color: var(--color-muted);"># /vaults/:vault/audit</span>
server/internal/wsync/handler.go         <span style="color: var(--color-muted);"># WSS /vaults/:vault/notes/:id/sync</span></pre>
  </div>
</section>
