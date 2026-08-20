"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type PageTransitionProps = { children: ReactNode };

/** 모든 App Router 화면에 동일한 절제된 페이드·상승 전환을 적용합니다. */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial>
      <motion.div
        key={pathname}
        className="min-h-full w-full"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -5, filter: "blur(1px)" }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
