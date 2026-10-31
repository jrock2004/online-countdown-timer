import { useEffect, useId, useRef, useState } from 'react';
import { formatChatMessage, getRemaining } from '../lib/countdown';
import type { Timer } from '../lib/timers';
import { Button } from './Button';

interface Props {
  timer: Timer;
  onAnnounce: (message: string) => void;
}

const FEEDBACK_MS = 2000;

export function CopyForChatButton({ timer, onAnnounce }: Props) {
  const [feedback, setFeedback] = useState('');
  const [manualText, setManualText] = useState('');
  const manualId = useId();
  const resetTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimeout.current), []);

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
      setManualText('');
      showFeedback('Copied!');
      onAnnounce('Countdown copied. Paste it into your chat.');
    } catch {
      setManualText(message);
      showFeedback('Couldn’t copy');
      onAnnounce(`Could not copy automatically. The text is: ${message}`);
    }
  };

  return (
    <>
      <Button onClick={copy}>
        {feedback || 'Copy for chat'} <span className="sr-only">countdown {timer.title}</span>
      </Button>
      {manualText && (
        <div className="order-last w-full text-left">
          <label htmlFor={manualId} className="text-sm text-slate-700 dark:text-slate-300">
            Your browser blocked copying. Copy this text instead:
          </label>
          <input
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
