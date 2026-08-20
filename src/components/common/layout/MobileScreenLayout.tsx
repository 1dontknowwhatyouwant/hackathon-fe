"use client";

import type { ReactNode } from "react";

import { PulseLoader } from "@/components/common/feedback/PulseLoader";
import { PageTransition } from "@/components/common/motion/PageTransition";
import { useApiActivityStore } from "@/store/useApiActivityStore";

type MobileScreenLayoutProps = {
  animateContent?: boolean;
  children: ReactNode;
  bottomNavigation?: ReactNode;
  contentClassName?: string;
  frameClassName?: string;
  figmaNodeId?: string;
};

export function MobileScreenLayout({
  animateContent = true,
  children,
  bottomNavigation,
  contentClassName = "",
  frameClassName = "",
  figmaNodeId,
}: MobileScreenLayoutProps) {
  const hasActiveApiRequest = useApiActivityStore(
    (state) => Object.keys(state.activeRequestIds).length > 0,
  );

  return (
    <main className="min-h-dvh bg-[#efede8] sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-8">
      <div
        data-figma-node-id={figmaNodeId}
        className={`relative mx-auto flex h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-white py-2 sm:h-[844px] sm:max-h-[calc(100dvh-4rem)] sm:rounded-[36px] sm:border sm:border-[#d8d8dc] sm:shadow-[0_22px_70px_rgba(36,31,25,0.12)] ${frameClassName}`}
      >
        <div
          className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${contentClassName}`}
        >
          {animateContent ? <PageTransition>{children}</PageTransition> : children}
        </div>

        {bottomNavigation}

        {hasActiveApiRequest ? (
          <div
            className="absolute inset-0 z-[100] flex items-center justify-center bg-white"
            aria-busy="true"
          >
            <PulseLoader label="화면에 필요한 정보를 불러오는 중입니다." />
          </div>
        ) : null}
      </div>
    </main>
  );
}
