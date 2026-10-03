import { useEffect, useId, useRef } from 'react';
import { Button } from './Button';

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Modal confirmation built on the native <dialog>, which handles focus trapping and Escape. */
export function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal?.();
    if (!open && dialog.open) dialog.close?.();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descId}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-950/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    >
      {open && (
        <>
          <h2 id={titleId} className="text-lg font-bold">
            {title}
          </h2>
          <p id={descId} className="mt-2 text-slate-700 dark:text-slate-300">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            {/* eslint-disable-next-line jsx-a11y/no-autofocus -- safest default action in a modal */}
            <Button autoFocus onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </>
      )}
    </dialog>
  );
}
