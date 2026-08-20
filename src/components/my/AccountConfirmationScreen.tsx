"use client";

import type { ReactNode } from "react";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";

type AccountConfirmationScreenProps = {
  sectionTitle: string;
  title: string;
  description: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  pendingLabel?: string;
  danger?: boolean;
  isPending?: boolean;
  figmaNodeId?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AccountConfirmationScreen({
  sectionTitle,
  title,
  description,
  cancelLabel,
  confirmLabel,
  pendingLabel = "처리 중",
  danger = false,
  isPending = false,
  figmaNodeId,
  onCancel,
  onConfirm,
}: AccountConfirmationScreenProps) {
  return (
    <MobileScreenLayout
      figmaNodeId={figmaNodeId}
      contentClassName="flex min-h-full flex-col bg-white px-6 pt-6 pb-8 text-[#0e0e12]"
    >
      <div className="flex min-h-full flex-col">
      <LuxuryReveal>
        <p className="text-[17px] leading-6 font-bold">{sectionTitle}</p>
        <h1 className="mt-[58px] text-[28px] leading-[36px] font-bold tracking-[-0.04em]">
          {title}
        </h1>
        <div className="mt-2 text-[13px] leading-5 text-[#6e707a]">
          {description}
        </div>
      </LuxuryReveal>

      <LuxuryReveal className="mt-auto space-y-4 pt-10" delay={90}>
        <button
          type="button"
          disabled={isPending}
          onClick={onCancel}
          className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#0e0e12] text-[14px] font-bold text-white transition-colors hover:bg-[#26262c] disabled:cursor-wait disabled:opacity-55"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={onConfirm}
          className={`flex h-[52px] w-full items-center justify-center rounded-[14px] border bg-white text-[14px] font-bold transition-colors disabled:cursor-wait disabled:opacity-55 ${
            danger
              ? "border-[#e5b8b8] text-[#c72e2e] hover:bg-[#fff8f8]"
              : "border-[#d8d8dc] text-[#0e0e12] hover:bg-[#f8f8f9]"
          }`}
        >
          {isPending ? pendingLabel : confirmLabel}
        </button>
      </LuxuryReveal>
      </div>
    </MobileScreenLayout>
  );
}
