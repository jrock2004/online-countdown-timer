import { useEffect, useRef, useState } from 'react';
import { Button } from './components/Button';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ObsPanel } from './components/ObsPanel';
import { CountdownDisplay } from './components/CountdownDisplay';
import { ThemeToggle } from './components/ThemeToggle';
import { TimerForm } from './components/TimerForm';
import { TimerList } from './components/TimerList';
import { useNow } from './hooks/useNow';
import { useTheme } from './hooks/useTheme';
import { useTimers } from './hooks/useTimers';
import { getRemaining } from './lib/countdown';
import type { TimerInput } from './lib/timers';

type Mode = 'view' | 'create' | 'edit';

const pad = (n: number) => String(n).padStart(2, '0');

export default function App() {
  const { preference, setPreference } = useTheme();
  const { timers, active, add, update, remove, select } = useTimers();
  const [mode, setMode] = useState<Mode>(() => (active ? 'view' : 'create'));
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [obsOpen, setObsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [focusRequest, setFocusRequest] = useState(0);
  const now = useNow();

  const remaining = active ? getRemaining(active.target, now) : null;

  // Move focus to the new view's heading after navigation so keyboard and screen reader users keep context.
  useEffect(() => {
    if (focusRequest) document.getElementById('view-heading')?.focus();
  }, [focusRequest]);

  const goTo = (next: Mode, message?: string) => {
    setMode(next);
    if (message) setAnnouncement(message);
    setFocusRequest((n) => n + 1);
  };

  // Announce once when the active countdown hits zero.
  const wasDone = useRef(remaining?.done);
  const lastActiveId = useRef(active?.id);
  useEffect(() => {
    if (lastActiveId.current !== active?.id) {
      lastActiveId.current = active?.id;
      wasDone.current = remaining?.done;
      return;
    }
    if (active && remaining?.done && wasDone.current === false) setAnnouncement(`${active.title} is live!`);
    wasDone.current = remaining?.done;
  }, [active, remaining?.done]);

  useEffect(() => {
    if (mode !== 'view' || !active || !remaining) {
      document.title = 'Launch Countdown';
      return;
    }
    const { days, hours, minutes, seconds, done } = remaining;
    const clock = done ? 'LIVE' : `${days ? `${days}d ` : ''}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    document.title = `${clock} · ${active.title}`;
  }, [mode, active, remaining]);

  // Clear first so repeating the same message (e.g. copying twice) is announced again.
  const announce = (message: string) => {
    setAnnouncement('');
    setTimeout(() => setAnnouncement(message), 50);
  };

  const handleCreate = (input: TimerInput) => {
    add(input);
    goTo('view', `Countdown "${input.title}" created.`);
  };

  const handleUpdate = (input: TimerInput) => {
    if (!active) return;
    update(active.id, input);
    goTo('view', `Countdown "${input.title}" updated. If it's in OBS, copy the new link.`);
  };

  const handleDelete = () => {
    if (!active) return;
    const title = active.title;
    const hasOthers = timers.length > 1;
    remove(active.id);
    setConfirmingDelete(false);
    goTo(hasOthers ? 'view' : 'create', `Countdown "${title}" deleted.`);
  };

  const handleSelect = (id: string) => {
    select(id);
    goTo('view');
  };

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-violet-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <img src="/favicon.svg" alt="" className="size-7" />
            Launch Countdown
          </h1>
          <ThemeToggle value={preference} onChange={setPreference} />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[18rem_1fr]">
        <nav aria-labelledby="timers-heading" className="order-2 lg:order-1">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 id="timers-heading" className="text-lg font-bold">
              Your countdowns
            </h2>
          </div>
          <TimerList timers={timers} activeId={mode === 'create' ? null : (active?.id ?? null)} onSelect={handleSelect} />
          <Button variant="primary" className="mt-4 w-full" onClick={() => goTo('create')} disabled={mode === 'create'}>
            <span aria-hidden="true">+</span> New countdown
          </Button>
        </nav>

        <main
          id="main"
          tabIndex={-1}
          className="order-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:order-2 dark:border-slate-800 dark:bg-slate-900/60"
        >
          {mode === 'create' && (
            <TimerForm
              key="create"
              onSubmit={handleCreate}
              onCancel={active ? () => goTo('view') : undefined}
            />
          )}

          {mode === 'edit' && active && (
            <TimerForm key={active.id} timer={active} onSubmit={handleUpdate} onCancel={() => goTo('view')} />
          )}

          {mode === 'view' && active && (
            <>
              <CountdownDisplay
                title={active.title}
                subtitle={active.subtitle}
                target={active.target}
                now={now}
                headingProps={{ id: 'view-heading', tabIndex: -1 }}
              />
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Button onClick={() => goTo('edit')}>
                  Edit <span className="sr-only">countdown {active.title}</span>
                </Button>
                <Button aria-expanded={obsOpen} aria-controls="obs-panel" onClick={() => setObsOpen((o) => !o)}>
                  Show on stream
                </Button>
                <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
                  Delete <span className="sr-only">countdown {active.title}</span>
                </Button>
              </div>
              <div id="obs-panel" hidden={!obsOpen}>
                {obsOpen && <ObsPanel timer={active} onAnnounce={announce} />}
              </div>
            </>
          )}
        </main>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this countdown?"
        description={active ? `"${active.title}" will be permanently removed from this browser.` : ''}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />

      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
