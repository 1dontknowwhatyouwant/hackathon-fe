"use client";

import { useEffect, useId, useRef } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  isPending?: boolean;
  pendingLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "취소",
  isPending = false,
  pendingLabel = "처리 중...",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    confirmButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPending, onCancel, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/35 px-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="w-full rounded-[24px] bg-white px-6 pt-7 pb-6 shadow-[0_24px_70px_rgba(14,14,18,0.24)]">
        <p
          id={titleId}
          className="text-[20px] leading-[1.35] font-bold tracking-[-0.025em] text-[#15151a]"
        >
          {title}
        </p>
        <p
          id={descriptionId}
          className="mt-2 text-[13px] leading-5 text-[#777780]"
        >
          {description}
        </p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isPending}
            className="h-[48px] rounded-[14px] border border-[#d8d8dc] bg-white text-[13px] font-bold text-[#55555d] disabled:opacity-45"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            disabled={isPending}
            className="h-[48px] rounded-[14px] bg-[#0e0e12] text-[13px] font-bold text-white disabled:opacity-55"
            onClick={onConfirm}
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
