export const themes = {
  'tokyo-night': {
    name: 'Tokyo Night',
    isDark: true,
    primary: '#7aa2f7',
    secondary: '#bb9af7',
    accent: '#7dcfff',
    muted: '#565f89',
    background: '#1a1b26',
    selectedBg: '#292e42',
    overlayBg: '#16161e',
    text: '#c0caf5',
    textDim: '#565f89',
    border: '#3b4261',
    separator: '#292e42',
    error: '#f7768e',
    warning: '#e0af68',
    info: '#7dcfff',
    logoColors: ['#7aa2f7', '#7dcfff', '#bb9af7', '#7aa2f7', '#7dcfff', '#bb9af7'],
  },
  'catppuccin-mocha': {
    name: 'Catppuccin Mocha',
    isDark: true,
    primary: '#cba6f7',
    secondary: '#89b4fa',
    accent: '#f5c2e7',
    muted: '#6c7086',
    background: '#1e1e2e',
    selectedBg: '#313244',
    overlayBg: '#181825',
    text: '#cdd6f4',
    textDim: '#6c7086',
    border: '#45475a',
    separator: '#313244',
    error: '#f38ba8',
    warning: '#f9e2af',
    info: '#89dceb',
    logoColors: ['#cba6f7', '#f5c2e7', '#89b4fa', '#cba6f7', '#f5c2e7', '#89b4fa'],
  },
  'dracula': {
    name: 'Dracula',
    isDark: true,
    primary: '#bd93f9',
    secondary: '#8be9fd',
    accent: '#ff79c6',
    muted: '#6272a4',
    background: '#282a36',
    selectedBg: '#44475a',
    overlayBg: '#21222c',
    text: '#f8f8f2',
    textDim: '#6272a4',
    border: '#44475a',
    separator: '#44475a',
    error: '#ff5555',
    warning: '#f1fa8c',
    info: '#8be9fd',
    logoColors: ['#bd93f9', '#ff79c6', '#8be9fd', '#bd93f9', '#ff79c6', '#8be9fd'],
  },
  'obsidian': {
    name: 'Obsidian',
    isDark: true,
    primary: '#a882ff',
    secondary: '#7c6f9e',
    accent: '#c792ea',
    muted: '#5c5c5c',
    background: '#1e1e1e',
    selectedBg: '#2d2d2d',
    overlayBg: '#161616',
    text: '#dcddde',
    textDim: '#5c5c5c',
    border: '#3c3c3c',
    separator: '#2d2d2d',
    error: '#e05561',
    warning: '#d19a66',
    info: '#56b6c2',
    logoColors: ['#a882ff', '#c792ea', '#7c6f9e', '#a882ff', '#c792ea', '#7c6f9e'],
  },
  'catppuccin-latte': {
    name: 'Catppuccin Latte',
    isDark: false,
    primary: '#8839ef',
    secondary: '#1e66f5',
    accent: '#ea76cb',
    muted: '#9ca0b0',
    background: '#ccd0da',
    selectedBg: '#bcc0cc',
    overlayBg: '#e6e9ef',
    text: '#4c4f69',
    textDim: '#9ca0b0',
    border: '#acb0be',
    separator: '#bcc0cc',
    error: '#d20f39',
    warning: '#df8e1d',
    info: '#04a5e5',
    logoColors: ['#8839ef', '#ea76cb', '#1e66f5', '#8839ef', '#ea76cb', '#1e66f5'],
  },
  'tokyo-day': {
    name: 'Tokyo Day',
    isDark: false,
    primary: '#2e7de9',
    secondary: '#9854f1',
    accent: '#007197',
    muted: '#8990b3',
    background: '#d5d6db',
    selectedBg: '#c4c8da',
    overlayBg: '#e9e9ec',
    text: '#3760bf',
    textDim: '#8990b3',
    border: '#a8aecb',
    separator: '#c4c8da',
    error: '#f52a65',
    warning: '#8c6c3e',
    info: '#007197',
    logoColors: ['#2e7de9', '#007197', '#9854f1', '#2e7de9', '#007197', '#9854f1'],
  },
};

export const themeOrder = [
  'tokyo-night',
  'catppuccin-mocha',
  'dracula',
  'obsidian',
  'catppuccin-latte',
  'tokyo-day',
];

const STORAGE_KEY = 'lumi-site-theme';

export function applyTheme(name) {
  const t = themes[name];
  if (!t) return;
  const root = document.documentElement;
  const props = {
    '--color-primary': t.primary,
    '--color-secondary': t.secondary,
    '--color-accent': t.accent,
    '--color-muted': t.muted,
    '--color-background': t.background,
    '--color-selected-bg': t.selectedBg,
    '--color-overlay-bg': t.overlayBg,
    '--color-text': t.text,
    '--color-text-dim': t.textDim,
    '--color-border': t.border,
    '--color-separator': t.separator,
    '--color-error': t.error,
    '--color-warning': t.warning,
    '--color-info': t.info,
  };
  for (const [k, v] of Object.entries(props)) {
    root.style.setProperty(k, v);
  }
  for (let i = 0; i < 6; i++) {
    root.style.setProperty(`--color-logo-${i}`, t.logoColors[i]);
  }
}

export function loadTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'tokyo-night';
}

export function saveTheme(name) {
  localStorage.setItem(STORAGE_KEY, name);
}
