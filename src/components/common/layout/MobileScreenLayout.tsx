import type { ReactNode } from "react";

type MobileScreenLayoutProps = {
  children: ReactNode;
  bottomNavigation?: ReactNode;
  contentClassName?: string;
  frameClassName?: string;
  figmaNodeId?: string;
};

export function MobileScreenLayout({
  children,
  bottomNavigation,
  contentClassName = "",
  frameClassName = "",
  figmaNodeId,
}: MobileScreenLayoutProps) {
  return (
    <main className="min-h-dvh bg-[#efede8] sm:flex sm:items-center sm:justify-center sm:px-6 sm:py-8">
      <div
        data-figma-node-id={figmaNodeId}
        className={`mx-auto flex h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-white sm:h-[844px] sm:max-h-[calc(100dvh-4rem)] sm:rounded-[36px] sm:border sm:border-[#d8d8dc] sm:shadow-[0_22px_70px_rgba(36,31,25,0.12)] ${frameClassName}`}
      >
        <div
          className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${contentClassName}`}
        >
          {children}
        </div>

        {bottomNavigation}
      </div>
    </main>
  );
}
