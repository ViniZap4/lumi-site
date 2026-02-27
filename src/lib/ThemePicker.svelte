<script>
  import { themes, themeOrder, applyTheme, saveTheme } from './themes.js';

  let { current = $bindable('tokyo-night') } = $props();
  let open = $state(false);

  function select(name) {
    current = name;
    applyTheme(name);
    saveTheme(name);
    open = false;
  }

  function toggle() {
    open = !open;
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') open = false;
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative">
  <button
    onclick={toggle}
    class="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer text-sm"
    style="border-color: var(--color-border); color: var(--color-text-dim); background: var(--color-selected-bg);"
    aria-label="Change theme"
  >
    <span
      class="w-3 h-3 rounded-full"
      style="background: {themes[current].primary};"
    ></span>
    <span class="hidden sm:inline">{themes[current].name}</span>
    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {#if open}
    <button
      class="fixed inset-0 z-40"
      onclick={() => open = false}
      aria-label="Close theme picker"
    ></button>
    <div
      class="absolute right-0 top-full mt-2 z-50 rounded-lg border overflow-hidden min-w-48"
      style="background: var(--color-background); border-color: var(--color-border);"
    >
      {#each themeOrder as name}
        {@const t = themes[name]}
        <button
          onclick={() => select(name)}
          class="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors cursor-pointer"
          style="color: {current === name ? t.primary : 'var(--color-text-dim)'}; background: {current === name ? 'var(--color-selected-bg)' : 'transparent'};"
          onmouseenter={(e) => e.currentTarget.style.background = 'var(--color-selected-bg)'}
          onmouseleave={(e) => e.currentTarget.style.background = current === name ? 'var(--color-selected-bg)' : 'transparent'}
        >
          <div class="flex gap-1">
            {#each t.logoColors.slice(0, 3) as color}
              <span class="w-2.5 h-2.5 rounded-full" style="background: {color};"></span>
            {/each}
          </div>
          <span>{t.name}</span>
          {#if !t.isDark}
            <span class="ml-auto text-xs opacity-50">light</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
