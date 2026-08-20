"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { signupTerms, type SignupTermId } from "@/content/signupTerms";

type SignupTermsDialogProps = {
  activeTermId: SignupTermId | null;
  onClose: () => void;
};

export function SignupTermsDialog({ activeTermId, onClose }: SignupTermsDialogProps) {
  const prefersReducedMotion = useReducedMotion();
  const term = activeTermId ? signupTerms[activeTermId] : null;

  useEffect(() => {
    if (!term) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, term]);

  return (
    <AnimatePresence>
      {term ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: "easeOut" }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-term-title"
            className="flex h-[62dvh] max-h-[540px] min-h-[360px] w-[82%] max-w-[340px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_26px_80px_rgba(0,0,0,0.24)]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="border-b border-[#ece9e5] px-5 pb-4 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.1em] text-[#8b7355]">{term.eyebrow}</p>
                  <h2 id="signup-term-title" className="mt-2 text-[18px] font-bold tracking-[-0.035em] text-[#15151a]">{term.title}</h2>
                </div>
                <button type="button" aria-label="약관 상세 닫기" onClick={onClose} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f2f0ed] text-[20px] text-[#55555d]">×</button>
              </div>
              <p className="mt-2 text-[11px] leading-4 text-[#777780]">{term.summary}</p>
            </header>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5 overscroll-contain">
              {term.sections.map((section) => (
                <section key={section.heading}>
                  <h3 className="text-[14px] font-bold text-[#202026]">{section.heading}</h3>
                  {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-3 text-[12px] leading-[1.75] text-[#66666f]">{paragraph}</p>)}
                  {section.items ? <ul className="mt-3 space-y-2 text-[12px] leading-[1.7] text-[#66666f]">{section.items.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true" className="mt-[9px] size-1 shrink-0 rounded-full bg-[#a88f70]" /><span>{item}</span></li>)}</ul> : null}
                </section>
              ))}
            </div>

            <footer className="border-t border-[#ece9e5] bg-white px-5 py-3">
              <button type="button" onClick={onClose} className="flex h-[44px] w-full items-center justify-center rounded-[14px] bg-[#15151a] text-[13px] font-bold text-white">내용 확인</button>
            </footer>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
