<script>
  import GettingStarted from './docs/GettingStarted.svelte';
  import UserGuide from './docs/UserGuide.svelte';
  import Configuration from './docs/Configuration.svelte';
  import NoteFormat from './docs/NoteFormat.svelte';
  import Faq from './docs/Faq.svelte';
  import Architecture from './docs/Architecture.svelte';
  import ProjectStructure from './docs/ProjectStructure.svelte';
  import DockerEnvironment from './docs/DockerEnvironment.svelte';
  import ApiReference from './docs/ApiReference.svelte';
  import DevelopmentSetup from './docs/DevelopmentSetup.svelte';
  import GitSubmodules from './docs/GitSubmodules.svelte';
  import CodingStandards from './docs/CodingStandards.svelte';

  let { activePage = 'getting-started' } = $props();
  let sidebarOpen = $state(false);

  const groups = [
    {
      label: 'Guide',
      sections: [
        { id: 'getting-started', label: 'Getting Started' },
        { id: 'user-guide', label: 'User Guide' },
        { id: 'configuration', label: 'Configuration' },
        { id: 'note-format', label: 'Note Format' },
        { id: 'faq', label: 'FAQ' },
      ],
    },
    {
      label: 'Reference',
      sections: [
        { id: 'architecture', label: 'Architecture' },
        { id: 'project-structure', label: 'Project Structure' },
        { id: 'docker-environment', label: 'Docker & Environment' },
        { id: 'api-reference', label: 'API Reference' },
      ],
    },
    {
      label: 'Contributing',
      sections: [
        { id: 'development-setup', label: 'Development Setup' },
        { id: 'git-submodules', label: 'Git & Submodules' },
        { id: 'coding-standards', label: 'Coding Standards' },
      ],
    },
  ];

  const pages = {
    'getting-started': GettingStarted,
    'user-guide': UserGuide,
    'configuration': Configuration,
    'note-format': NoteFormat,
    'faq': Faq,
    'architecture': Architecture,
    'project-structure': ProjectStructure,
    'docker-environment': DockerEnvironment,
    'api-reference': ApiReference,
    'development-setup': DevelopmentSetup,
    'git-submodules': GitSubmodules,
    'coding-standards': CodingStandards,
  };

  $effect(() => {
    activePage;
    window.scrollTo(0, 0);
  });
</script>

<div class="flex min-h-screen pt-12">
  <!-- Mobile sidebar toggle -->
  <button
    class="fixed bottom-6 right-6 z-50 md:hidden w-12 h-12 rounded-full border flex items-center justify-center"
    style="background: var(--color-selected-bg); border-color: var(--color-border); color: var(--color-primary);"
    onclick={() => sidebarOpen = !sidebarOpen}
    aria-label="Toggle navigation"
  >
    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      {#if sidebarOpen}
        <path d="M6 18L18 6M6 6l12 12" />
      {:else}
        <path d="M4 6h16M4 12h16M4 18h16" />
      {/if}
    </svg>
  </button>

  <!-- Sidebar -->
  <aside
    class="fixed left-0 top-12 bottom-0 w-56 border-r overflow-y-auto z-40 transition-transform duration-200 md:translate-x-0"
    class:max-md:-translate-x-full={!sidebarOpen}
    class:max-md:translate-x-0={sidebarOpen}
    style="background: var(--color-overlay-bg); border-color: var(--color-border);"
  >
    <nav class="p-4">
      {#each groups as group}
        <p class="text-xs font-semibold uppercase tracking-wider mb-2 mt-5 first:mt-0" style="color: var(--color-muted);">{group.label}</p>
        <ul class="flex flex-col gap-0.5 mb-1">
          {#each group.sections as s}
            <li>
              <a
                href="#/docs/{s.id}"
                onclick={() => sidebarOpen = false}
                class="block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                style="color: {activePage === s.id ? 'var(--color-primary)' : 'var(--color-text-dim)'}; background: {activePage === s.id ? 'var(--color-selected-bg)' : 'transparent'};"
              >
                {s.label}
              </a>
            </li>
          {/each}
        </ul>
      {/each}
      <div class="mt-6 pt-4 border-t" style="border-color: var(--color-border);">
        <a href="#/"
          class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
          style="color: var(--color-text-dim);"
        >
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </a>
      </div>
    </nav>
  </aside>

  <!-- Content -->
  <main class="flex-1 md:ml-56 px-6 sm:px-10 py-10 max-w-[900px]">
    {#key activePage}
      {@const Page = pages[activePage] || pages['getting-started']}
      <Page />
    {/key}
  </main>
</div>
