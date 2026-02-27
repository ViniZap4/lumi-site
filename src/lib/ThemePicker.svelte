<script>
  import { themes, darkThemeOrder, lightThemeOrder, applyTheme, resolveTheme, saveThemeSettings } from './themes.js';

  let { mode = $bindable('dark'), darkName = $bindable('tokyo-night'), lightName = $bindable('tokyo-day') } = $props();
  let open = $state(false);

  function currentThemeName() {
    return resolveTheme(mode, darkName, lightName);
  }

  function cycleMode() {
    const modes = ['auto', 'dark', 'light'];
    const idx = modes.indexOf(mode);
    mode = modes[(idx + 1) % modes.length];
    const resolved = resolveTheme(mode, darkName, lightName);
    applyTheme(resolved);
    saveThemeSettings(mode, darkName, lightName);
  }

  function selectTheme(name) {
    const t = themes[name];
    if (t.isDark) {
      darkName = name;
    } else {
      lightName = name;
    }
    const resolved = resolveTheme(mode, darkName, lightName);
    applyTheme(resolved);
    saveThemeSettings(mode, darkName, lightName);
    open = false;
  }

  function toggle() {
    open = !open;
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') open = false;
  }

  function visibleThemes() {
    if (mode === 'dark') return darkThemeOrder;
    if (mode === 'light') return lightThemeOrder;
    return [...darkThemeOrder, ...lightThemeOrder];
  }

  function isSelected(name) {
    const t = themes[name];
    return t.isDark ? name === darkName : name === lightName;
  }

  const modeLabels = { auto: 'Auto', dark: 'Dark', light: 'Light' };
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
      class="absolute right-0 top-full mt-2 z-50 rounded-lg border overflow-hidden min-w-52"
      style="background: var(--color-background); border-color: var(--color-border);"
    >
      <!-- Mode toggle -->
      <button
        onclick={cycleMode}
        class="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors cursor-pointer border-b"
        style="color: var(--color-primary); border-color: var(--color-border); background: var(--color-selected-bg);"
        onmouseenter={(e) => e.currentTarget.style.background = 'var(--color-overlay-bg)'}
        onmouseleave={(e) => e.currentTarget.style.background = 'var(--color-selected-bg)'}
      >
        <span>Mode</span>
        <span class="flex items-center gap-1.5">
          <span>{modeIcons[mode]}</span>
          <span>{modeLabels[mode]}</span>
        </span>
      </button>

      <!-- Theme list -->
      {#each visibleThemes() as name}
        {@const t = themes[name]}
        {@const selected = isSelected(name)}
        <button
          onclick={() => selectTheme(name)}
          class="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors cursor-pointer"
          style="color: {selected ? t.primary : 'var(--color-text-dim)'}; background: {selected ? 'var(--color-selected-bg)' : 'transparent'};"
          onmouseenter={(e) => e.currentTarget.style.background = 'var(--color-selected-bg)'}
          onmouseleave={(e) => e.currentTarget.style.background = selected ? 'var(--color-selected-bg)' : 'transparent'}
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
