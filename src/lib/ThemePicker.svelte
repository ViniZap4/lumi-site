<script>
  import { themes, darkThemeOrder, lightThemeOrder, applyTheme, resolveTheme, saveThemeSettings } from './themes.js';

  let { mode = $bindable('dark'), darkName = $bindable('tokyo-night'), lightName = $bindable('tokyo-day') } = $props();
  let open = $state(false);

  function currentThemeName() {
    return resolveTheme(mode, darkName, lightName);
  }

  function setMode(m) {
    mode = m;
    applyTheme(resolveTheme(mode, darkName, lightName));
    saveThemeSettings(mode, darkName, lightName);
  }

  function selectTheme(name) {
    const t = themes[name];
    if (t.isDark) {
      darkName = name;
    } else {
      lightName = name;
    }
    applyTheme(resolveTheme(mode, darkName, lightName));
    saveThemeSettings(mode, darkName, lightName);
    open = false;
  }

  function toggle() {
    open = !open;
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') open = false;
  }

  function isSelected(name) {
    const t = themes[name];
    return t.isDark ? name === darkName : name === lightName;
  }

  const modes = ['auto', 'dark', 'light'];
  const modeIcons = { auto: '◐', dark: '●', light: '○' };
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
      style="background: {themes[currentThemeName()].primary};"
    ></span>
    <span class="hidden sm:inline">{themes[currentThemeName()].name}</span>
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
      class="absolute right-0 top-full mt-2 z-50 rounded-lg border overflow-hidden min-w-56 max-h-[70vh] overflow-y-auto"
      style="background: var(--color-background); border-color: var(--color-border);"
    >
      <!-- Mode selector -->
      <div class="flex border-b" style="border-color: var(--color-border); background: var(--color-selected-bg);">
        {#each modes as m}
          <button
            onclick={() => setMode(m)}
            class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs transition-colors cursor-pointer"
            style="color: {mode === m ? 'var(--color-primary)' : 'var(--color-text-dim)'}; background: {mode === m ? 'var(--color-overlay-bg)' : 'transparent'};"
          >
            <span>{modeIcons[m]}</span>
            <span class="capitalize">{m}</span>
          </button>
        {/each}
      </div>

      <!-- Dark themes -->
      {#if mode !== 'light'}
        <div class="px-3 pt-3 pb-1">
          <span class="text-[10px] uppercase tracking-wider font-semibold" style="color: var(--color-muted);">Dark</span>
        </div>
        {#each darkThemeOrder as name}
          {@const t = themes[name]}
          {@const selected = isSelected(name)}
          <button
            onclick={() => selectTheme(name)}
            class="w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors cursor-pointer"
            style="color: {selected ? t.primary : 'var(--color-text-dim)'}; background: {selected ? 'var(--color-selected-bg)' : 'transparent'};"
            onmouseenter={(e) => e.currentTarget.style.background = 'var(--color-selected-bg)'}
            onmouseleave={(e) => e.currentTarget.style.background = selected ? 'var(--color-selected-bg)' : 'transparent'}
          >
            <div class="flex gap-0.5">
              {#each t.logoColors.slice(0, 4) as color}
                <span class="w-2 h-2 rounded-sm" style="background: {color};"></span>
              {/each}
            </div>
            <span class="text-xs">{t.name}</span>
          </button>
        {/each}
      {/if}

      <!-- Light themes -->
      {#if mode !== 'dark'}
        <div class="px-3 pt-3 pb-1" style="border-top: {mode === 'auto' ? '1px solid var(--color-separator)' : 'none'};">
          <span class="text-[10px] uppercase tracking-wider font-semibold" style="color: var(--color-muted);">Light</span>
        </div>
        {#each lightThemeOrder as name}
          {@const t = themes[name]}
          {@const selected = isSelected(name)}
          <button
            onclick={() => selectTheme(name)}
            class="w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors cursor-pointer"
            style="color: {selected ? t.primary : 'var(--color-text-dim)'}; background: {selected ? 'var(--color-selected-bg)' : 'transparent'};"
            onmouseenter={(e) => e.currentTarget.style.background = 'var(--color-selected-bg)'}
            onmouseleave={(e) => e.currentTarget.style.background = selected ? 'var(--color-selected-bg)' : 'transparent'}
          >
            <div class="flex gap-0.5">
              {#each t.logoColors.slice(0, 4) as color}
                <span class="w-2 h-2 rounded-sm" style="background: {color};"></span>
              {/each}
            </div>
            <span class="text-xs">{t.name}</span>
          </button>
        {/each}
      {/if}

      <div class="h-1"></div>
    </div>
  {/if}
</div>
