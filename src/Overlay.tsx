import { useEffect } from 'react';
import { CountdownDisplay } from './components/CountdownDisplay';
import { useNow } from './hooks/useNow';
import { DEFAULT_DONE, type OverlayParams } from './lib/overlay';

export function Overlay({ title, subtitle, target, theme, bg, compact, scale, done }: OverlayParams) {
  const now = useNow();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('overlay');
    if (theme) root.classList.toggle('dark', theme === 'dark');
    // Everything is sized in rem, so scaling the root font size scales the whole overlay crisply.
    root.style.fontSize = `${scale * 100}%`;
    document.title = title || 'Countdown';
  }, [theme, title, scale]);

  if (!target) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-6">
        <div className="rounded-2xl bg-white p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <h1 className="text-2xl font-bold">Countdown link is missing a launch date</h1>
          <p className="mt-2">Copy the OBS link again from the countdown app.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      {/* The default panel keeps text readable over any stream video; bg=none leaves styling to OBS. */}
      <div className={bg === 'panel' ? 'rounded-3xl bg-slate-50/90 p-8 dark:bg-slate-950/85' : ''}>
        <CountdownDisplay
          title={title}
          subtitle={subtitle}
          target={target}
          now={now}
          headingLevel="h1"
          overlay
          compact={compact}
          doneLabel={done || DEFAULT_DONE}
        />
      </div>
    </main>
  );
}
