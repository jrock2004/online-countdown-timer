import { useState, type KeyboardEvent } from 'react';
import { MotionConfig, Reorder, useDragControls } from 'motion/react';
import type { Timer } from '../lib/timers';
import { formatTarget } from '../lib/countdown';

interface Props {
  timers: Timer[];
  activeId: string | null;
  onSelect: (id: string) => void;
  /** Called continuously while dragging with the new order of timer ids. */
  onReorder: (ids: string[]) => void;
  /** Move one timer by an offset (keyboard reordering). */
  onMove: (id: string, offset: number) => void;
}

export function TimerList({ timers, activeId, onSelect, onReorder, onMove }: Props) {
  const [announcement, setAnnouncement] = useState('');

  if (timers.length === 0) {
    return <p className="text-sm text-slate-600 dark:text-slate-300">No countdowns yet.</p>;
  }

  const ids = timers.map((t) => t.id);
  const canReorder = timers.length > 1;

  const handleMove = (timer: Timer, offset: number) => {
    const from = ids.indexOf(timer.id);
    const to = Math.min(Math.max(from + offset, 0), ids.length - 1);
    if (to === from) return;
    onMove(timer.id, offset);
    setAnnouncement(`${timer.title} moved to position ${to + 1} of ${ids.length}.`);
  };

  return (
    <MotionConfig reducedMotion="user">
      <Reorder.Group axis="y" values={ids} onReorder={onReorder} className="space-y-2">
        {timers.map((t, index) => (
          <TimerListItem
            key={t.id}
            timer={t}
            position={index + 1}
            total={timers.length}
            current={t.id === activeId}
            canReorder={canReorder}
            onSelect={onSelect}
            onMove={(offset) => handleMove(t, offset)}
          />
        ))}
      </Reorder.Group>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </MotionConfig>
  );
}

interface ItemProps {
  timer: Timer;
  position: number;
  total: number;
  current: boolean;
  canReorder: boolean;
  onSelect: (id: string) => void;
  onMove: (offset: number) => void;
}

function TimerListItem({ timer, position, total, current, canReorder, onSelect, onMove }: ItemProps) {
  const controls = useDragControls();
  const [dragging, setDragging] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const offsets: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, Home: -total, End: total };
    const offset = offsets[e.key];
    if (offset === undefined) return;
    e.preventDefault();
    onMove(offset);
  };

  return (
    <Reorder.Item
      value={timer.id}
      dragListener={false}
      dragControls={controls}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      whileDrag={{ scale: 1.03, boxShadow: '0 12px 24px -8px rgb(15 23 42 / 0.35)' }}
      transition={{ type: 'spring', stiffness: 600, damping: 40 }}
      className={`relative flex items-stretch rounded-lg ${dragging ? 'z-10' : ''}`}
    >
      <button
        type="button"
        onClick={() => onSelect(timer.id)}
        aria-current={current ? 'true' : undefined}
        className={`block min-w-0 flex-1 rounded-lg border px-3 py-2 text-left transition-colors ${
          canReorder ? 'pr-10' : ''
        } ${
          current
            ? 'border-violet-700 bg-violet-50 dark:border-violet-400 dark:bg-violet-950'
            : 'border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800'
        }`}
      >
        <span className="block truncate font-semibold">{timer.title}</span>
        <span className="block text-sm text-slate-600 dark:text-slate-300">{formatTarget(timer.target)}</span>
      </button>
      {canReorder && (
        <button
          type="button"
          aria-label={`Reorder ${timer.title}, position ${position} of ${total}. Use arrow keys to move.`}
          title="Drag to reorder"
          onPointerDown={(e) => controls.start(e)}
          onKeyDown={handleKeyDown}
          className={`absolute inset-y-1 right-1 flex w-8 touch-none items-center justify-center rounded-md text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700/70 dark:hover:text-slate-100 ${
            dragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 fill-current">
            <circle cx="5.5" cy="3.5" r="1.25" />
            <circle cx="10.5" cy="3.5" r="1.25" />
            <circle cx="5.5" cy="8" r="1.25" />
            <circle cx="10.5" cy="8" r="1.25" />
            <circle cx="5.5" cy="12.5" r="1.25" />
            <circle cx="10.5" cy="12.5" r="1.25" />
          </svg>
        </button>
      )}
    </Reorder.Item>
  );
}
