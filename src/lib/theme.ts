export type ThemePreference = 'system' | 'light' | 'dark';

export const THEME_KEY = 'countdown:theme';

export function loadTheme(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

export function saveTheme(pref: ThemePreference): void {
  try {
    if (pref === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch {
    // ignore
  }
}
