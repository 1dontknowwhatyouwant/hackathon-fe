"use client";

import {
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";

import styles from "./ProductPassportScreen.module.css";

const passport = {
  brand: "MCM",
  modelName: "Aren Shopper in Visetos",
  passportId: "MCM-AR-0826-024",
  registeredAt: "2026. 08. 13",
  owner: "MY COLLECTION",
  material: "Visetos · Nappa leather",
  origin: "Made in Korea",
} as const;

const passportDetails = [
  { label: "제품명", value: passport.modelName },
  { label: "패스포트 ID", value: passport.passportId },
  { label: "소재", value: passport.material },
  { label: "등록일", value: passport.registeredAt },
] as const;

function VerifiedMark() {
  return (
    <span className="flex size-5 items-center justify-center rounded-full bg-[#b9a17e] text-[#171719]">
      <svg aria-hidden="true" className="size-3" viewBox="0 0 16 16" fill="none">
        <path
          d="m3.2 8.2 2.7 2.7 6.2-6.2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </span>
  );
}

function ProductPassportCard() {
  const prefersReducedMotion = useReducedMotion();
  const [isFlipped, setIsFlipped] = useState(false);
  const [shinePass, setShinePass] = useState(0);

  const handleFlip = () => {
    setIsFlipped((current) => !current);
    setShinePass((current) => current + 1);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    event.currentTarget.style.setProperty("--shine-x", `${x}%`);
    event.currentTarget.style.setProperty("--shine-y", `${y}%`);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--shine-x", "32%");
    event.currentTarget.style.setProperty("--shine-y", "18%");
  };

  return (
    <motion.button
      type="button"
      className={styles.card}
      aria-label={
        isFlipped
          ? "제품 패스포트 카드 앞면 보기"
          : "제품 패스포트 카드 뒷면 보기"
      }
      aria-pressed={isFlipped}
      onClick={handleFlip}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
    >
      <motion.span
        className={styles.cardInner}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.72, ease: [0.22, 0.74, 0.18, 1] }
        }
      >
        <span className={styles.cardFace}>
          <span aria-hidden="true" className={styles.watermark}>
            MCM
          </span>

          <span className="absolute inset-0 z-10 flex flex-col p-6 text-left">
            <span className="flex items-start justify-between">
              <span>
                <span className="block text-[9px] font-bold tracking-[0.24em] text-white/55">
                  DIGITAL PRODUCT
                </span>
                <span className="mt-1 block text-[13px] font-bold tracking-[0.16em] text-white">
                  PASSPORT
                </span>
              </span>
              <span className="text-[18px] font-black tracking-[-0.06em] text-white/85">
                MCM
              </span>
            </span>

            <span className="mt-auto flex items-end justify-between">
              <span>
                <span className="block text-[17px] font-semibold tracking-[-0.03em] text-white">
                  {passport.modelName}
                </span>
                <span className="mt-2 block font-mono text-[10px] tracking-[0.12em] text-white/48">
                  {passport.passportId}
                </span>
              </span>
              <span className="mb-[2px] flex items-center gap-2 text-[9px] font-bold tracking-[0.12em] text-[#c6b18f]">
                <VerifiedMark />
                VERIFIED
              </span>
            </span>
          </span>
        </span>

        <span className={`${styles.cardFace} ${styles.cardBack}`}>
          <span aria-hidden="true" className={styles.watermark}>
            MCM
          </span>

          <span className="absolute inset-0 z-10 flex flex-col p-6 text-left">
            <span className="flex items-center justify-between border-b border-white/12 pb-4">
              <span className="text-[9px] font-bold tracking-[0.22em] text-white/55">
                AUTHENTICITY DATA
              </span>
              <span className="flex items-center gap-2 text-[9px] font-bold tracking-[0.1em] text-[#c6b18f]">
                <VerifiedMark />
                AUTHENTIC
              </span>
            </span>

            <span className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
              <span>
                <span className="block text-[8px] tracking-[0.12em] text-white/38">
                  OWNER
                </span>
                <span className="mt-1 block text-[11px] font-semibold text-white/88">
                  {passport.owner}
                </span>
              </span>
              <span>
                <span className="block text-[8px] tracking-[0.12em] text-white/38">
                  REGISTERED
                </span>
                <span className="mt-1 block text-[11px] font-semibold text-white/88">
                  {passport.registeredAt}
                </span>
              </span>
              <span className="col-span-2">
                <span className="block text-[8px] tracking-[0.12em] text-white/38">
                  ORIGIN
                </span>
                <span className="mt-1 block text-[11px] font-semibold text-white/88">
                  {passport.origin}
                </span>
              </span>
            </span>

            <span className="mt-auto flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-[0.1em] text-white/42">
                {passport.passportId}
              </span>
              <span className="grid size-8 grid-cols-3 gap-[2px] opacity-55" aria-hidden="true">
                {Array.from({ length: 9 }, (_, index) => (
                  <span
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-white/25"}
                  />
                ))}
              </span>
            </span>
          </span>
        </span>
      </motion.span>

      <span className={styles.shineLayer}>
        <AnimatePresence>
          {!prefersReducedMotion && shinePass > 0 ? (
            <motion.span
              key={shinePass}
              aria-hidden="true"
              className={styles.shineSweep}
              initial={{ x: "-165%", opacity: 0 }}
              animate={{ x: "360%", opacity: [0, 0.8, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.88, ease: [0.22, 0.72, 0.18, 1] }}
            />
          ) : null}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

export function ProductPassportScreen() {
  return (
    <MobileScreenLayout contentClassName="bg-[#f7f5f1] px-6 pt-4 pb-10">
      <LuxuryReveal>
        <BackButton fallbackHref="/screen22" />
      </LuxuryReveal>

      <LuxuryReveal className="mt-4" delay={40}>
        <ScreenHeader
          eyebrow="PRODUCT PASSPORT"
          title="제품 패스포트"
          description="제품의 정품 정보와 소유 기록을 확인해요"
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-8" delay={90}>
        <ProductPassportCard />
        <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#85858d]">
          <span
            aria-hidden="true"
            className="flex size-5 items-center justify-center rounded-full border border-[#d6d0c8] text-[13px] text-[#8b7355]"
          >
            ↻
          </span>
          카드를 눌러 상세 인증 정보를 확인하세요
        </p>
      </LuxuryReveal>

      <LuxuryReveal className="mt-8" delay={150}>
        <section aria-labelledby="passport-details-title">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] text-[#9a8060]">
                VERIFIED INFORMATION
              </p>
              <h2
                id="passport-details-title"
                className="mt-1 text-[20px] font-bold tracking-[-0.035em] text-[#17171b]"
              >
                인증된 제품 정보
              </h2>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-[#e9e1d5] px-3 py-[7px] text-[10px] font-bold text-[#6f593d]">
              <VerifiedMark />
              정품 인증 완료
            </span>
          </div>

          <dl className="mt-4 overflow-hidden rounded-[20px] border border-[#e2ded8] bg-white px-4 shadow-[0_10px_26px_rgba(36,31,25,0.05)]">
            {passportDetails.map((detail, index) => (
              <div
                key={detail.label}
                className={`flex items-start justify-between gap-5 py-4 ${
                  index < passportDetails.length - 1
                    ? "border-b border-[#ece9e5]"
                    : ""
                }`}
              >
                <dt className="shrink-0 text-[11px] text-[#8c8c94]">
                  {detail.label}
                </dt>
                <dd className="text-right text-[12px] font-bold leading-[17px] text-[#27272c]">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-7" delay={210}>
        <section
          aria-labelledby="ownership-title"
          className="rounded-[20px] bg-[#eae3d9] px-5 py-5"
        >
          <p className="text-[10px] font-bold tracking-[0.12em] text-[#8b7355]">
            OWNERSHIP
          </p>
          <h2
            id="ownership-title"
            className="mt-1 text-[17px] font-bold tracking-[-0.03em] text-[#232327]"
          >
            첫 번째 소유자로 등록되었어요
          </h2>
          <p className="mt-2 text-[11px] leading-[17px] text-[#747078]">
            소유권과 제품 관리 이력은 이 패스포트에 안전하게 이어집니다.
          </p>
        </section>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
