import { useEffect, useState } from 'react';
import { loadTheme, saveTheme, type ThemePreference } from '../lib/theme';

const query = () => window.matchMedia('(prefers-color-scheme: dark)');

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(loadTheme);
  const [systemDark, setSystemDark] = useState(() => query().matches);

  useEffect(() => {
    const mq = query();
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isDark = preference === 'dark' || (preference === 'system' && systemDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    saveTheme(preference);
  }, [isDark, preference]);

  return { preference, setPreference, isDark };
}
