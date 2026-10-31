import { useEffect, useId, useRef, useState } from 'react';
import { formatChatMessage, getRemaining } from '../lib/countdown';
import type { Timer } from '../lib/timers';
import { Button } from './Button';

interface Props {
  timer: Timer;
  now: number;
  obsOpen: boolean;
  onEdit: () => void;
  onToggleObs: () => void;
  onDelete: () => void;
  onAnnounce: (message: string) => void;
}

const FEEDBACK_MS = 2000;

export function CountdownActions({ timer, now, obsOpen, onEdit, onToggleObs, onDelete, onAnnounce }: Props) {
  const [feedback, setFeedback] = useState('');
  const [copyBlocked, setCopyBlocked] = useState(false);
  const manualId = useId();
  const manualInput = useRef<HTMLInputElement>(null);
  const resetTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const manualText = formatChatMessage(timer.title, getRemaining(timer.target, now));

  useEffect(() => () => clearTimeout(resetTimeout.current), []);

  // The fallback text ticks with the clock, and each update would otherwise drop the selection.
  useEffect(() => {
    if (document.activeElement === manualInput.current) manualInput.current?.select();
  }, [manualText]);

  const showFeedback = (label: string) => {
    setFeedback(label);
    clearTimeout(resetTimeout.current);
    resetTimeout.current = setTimeout(() => setFeedback(''), FEEDBACK_MS);
  };

  const copy = async () => {
    // Read the clock at click time so the copied text is as fresh as possible.
    const message = formatChatMessage(timer.title, getRemaining(timer.target));
    try {
      await navigator.clipboard.writeText(message);
      setCopyBlocked(false);
      showFeedback('Copied!');
      onAnnounce('Countdown copied. Paste it into your chat.');
    } catch {
      setCopyBlocked(true);
      showFeedback('Couldn’t copy');
      onAnnounce(`Could not copy automatically. The text is: ${message}`);
    }
  };

  return (
    <>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button onClick={onEdit}>
          Edit <span className="sr-only">countdown {timer.title}</span>
        </Button>
        <Button onClick={copy}>
          {feedback || 'Copy for chat'} <span className="sr-only">countdown {timer.title}</span>
        </Button>
        <Button aria-expanded={obsOpen} aria-controls="obs-panel" onClick={onToggleObs}>
          Show on stream
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete <span className="sr-only">countdown {timer.title}</span>
        </Button>
      </div>
      {copyBlocked && (
        <div className="mt-4 text-left">
          <label htmlFor={manualId} className="text-sm text-slate-700 dark:text-slate-300">
            Your browser blocked copying. Copy this text instead:
          </label>
          <input
            ref={manualInput}
            id={manualId}
            type="text"
            readOnly
            value={manualText}
            onFocus={(e) => e.target.select()}
            className="mt-1 block w-full rounded-lg border border-slate-400 bg-white px-3 py-2 font-mono text-sm text-slate-900 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:[color-scheme:dark]"
          />
        </div>
      )}
    </>
  );
}
