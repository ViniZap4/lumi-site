<script>
  const projectTree = `lumi/
├── server/                # Multi-tenant API (Go 1.25, Fiber, pgx/v5, yrs cgo)
│   ├── cmd/lumi-server/   # Binary entrypoint, env config, Fiber wiring
│   ├── internal/
│   │   ├── auth/          # sessions, login, password hashing, middleware, bootstrap
│   │   ├── users/         # /users/me/export (LGPD), /users/me delete
│   │   ├── vaults/        # vault CRUD
│   │   ├── members/       # vault membership + role assignment
│   │   ├── roles/         # custom per-vault roles + capability sets
│   │   ├── invites/       # invite generation + signup-and-join acceptance
│   │   ├── notes/         # note metadata + snapshot/diff CRDT bridge
│   │   ├── crdt/          # yrs cgo wrapper, doc registry, persistence
│   │   ├── wsync/         # Yjs WebSocket hub, awareness fan-out
│   │   ├── fswatch/       # fsnotify watcher, diff-merge external edits
│   │   ├── audit/         # audit log writer + read endpoint
│   │   ├── capguard/      # capability resolver + per-route middleware
│   │   ├── storage/fs/    # SafeJoin, atomic write, vault.yaml
│   │   ├── storage/pg/    # sqlc-generated queries
│   │   └── domain/        # canonical types, errors, capability vocabulary
│   ├── migrations/        # SQL migrations (golang-migrate)
│   └── third_party/y-crdt/  # pinned yrs submodule (make libyrs)
├── tui-client/            # Terminal client (Go 1.23+ + Bubbletea)
│   ├── main.go            # subcommand dispatch: login/accounts/vaults/vault ...
│   ├── cmd_login.go       # interactive login flow
│   ├── cmd_vault.go       # link/clone/unlink/sync entrypoints
│   ├── cmd_vault_manage.go  # interactive vault TUI (Bubbletea sub-program)
│   ├── cmd_picker.go      # vault picker (default action)
│   ├── account/           # accounts.yaml + vaults.yaml readers/writers
│   ├── sync/              # REST snapshot/diff client
│   ├── ui/                # Bubbletea Model/Update/View, vim cursor
│   ├── theme/, editor/, image/, filesystem/, domain/
├── web-client/            # Svelte 5 + Vite 7 + TypeScript
│   └── src/
│       ├── App.svelte     # auth gate, vault selection
│       ├── lib/
│       │   ├── auth.svelte.ts        # session + token state
│       │   ├── vaults.svelte.ts      # vault list + selection
│       │   ├── vaultmembers.svelte.ts  # member/role admin
│       │   ├── capabilities.ts       # capability matching
│       │   ├── notes.svelte.ts       # note CRUD
│       │   ├── editor-session.svelte.ts  # lazy Yjs + CodeMirror + vim
│       │   ├── api.ts                # REST client (X-Lumi-Token aware)
│       │   ├── ws.ts                 # Yjs WS sync (awareness/presence)
│       │   └── markdown.ts           # DOMPurify-sanitised render
│       └── views/         # LoginView, VaultsView, VaultHomeView, ...
├── apple-client/          # SwiftUI (iOS / iPadOS / macOS / visionOS)
│   ├── Sources/LumiKit/   # Domain, Filesystem, Network (platform-agnostic)
│   ├── Sources/LumiUI/    # Shared SwiftUI: theme, editor, markdown render
│   └── App/               # @main app + AppState + RootView
├── site/                  # Landing page + docs (Svelte 5 + Tailwind 4)
├── vaults/                # Default host-mounted vault root (compose VAULTS_PATH)
├── docker-compose.yml     # Postgres + server + web
├── .env.example           # annotated env surface
└── SPEC.md                # full v2 product + architecture spec`;
</script>

<section class="mb-16">
  <h2 class="text-xl font-semibold mb-6" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">#</span> Project Structure
  </h2>
  <p class="text-sm mb-4" style="color: var(--color-text-dim);">
    Five components, each in its own git submodule. The Go server is the only component that talks to Postgres; clients only see HTTP + WebSocket. Each Go package name describes a domain concern — no <code class="px-1.5 py-0.5 rounded text-xs" style="background: var(--color-selected-bg); color: var(--color-accent);">utils</code>.
  </p>
  <div class="rounded-xl border overflow-hidden" style="border-color: var(--color-border); background: var(--color-background);">
    <pre class="p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre" style="color: var(--color-text);">{projectTree}</pre>
  </div>
</section>
