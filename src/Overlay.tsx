import { useEffect } from 'react';
import { CountdownDisplay } from './components/CountdownDisplay';
import { useNow } from './hooks/useNow';
import type { OverlayParams } from './lib/overlay';

export function Overlay({ title, subtitle, target, theme }: OverlayParams) {
  const now = useNow();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('overlay');
    if (theme) root.classList.toggle('dark', theme === 'dark');
    document.title = title || 'Countdown';
  }, [theme, title]);

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      {/* Semi-opaque panel keeps text readable over any stream video behind it. */}
      <div className="rounded-3xl bg-slate-50/90 p-8 dark:bg-slate-950/85">
        <CountdownDisplay title={title} subtitle={subtitle} target={target} now={now} headingLevel="h1" overlay />
      </div>
    </main>
  );
}
