"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";

const analysisSteps = [
  {
    title: "내 아이템 살펴보기",
    description: "보유한 아이템과의 조합을 확인해요",
    end: 34,
  },
  {
    title: "취향 데이터 매칭",
    description: "선호 태그와 제품의 어울림을 비교해요",
    end: 68,
  },
  {
    title: "활용 가능성 분석",
    description: "구매 후 활용도를 최종 정리해요",
    end: 100,
  },
] as const;

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5 9.3 17 19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

export function RecommendationAnalysisProgressScreen() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;
    const duration = prefersReducedMotion ? 0.01 : 5.4;
    const controls = animate(0, 100, {
      duration,
      ease: [0.22, 0.72, 0.18, 1],
      onUpdate: (latest) => setProgress(Math.round(latest)),
      onComplete: () => {
        setIsComplete(true);
        redirectTimer = setTimeout(
          () => router.replace("/screen24"),
          prefersReducedMotion ? 0 : 650,
        );
      },
    });

    return () => {
      controls.stop();
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [prefersReducedMotion, router]);

  return (
    <MobileScreenLayout contentClassName="px-6 pt-[47px] pb-8">
      <LuxuryReveal>
        <ScreenHeader
          eyebrow="PRODUCT ANALYSIS"
          title={isComplete ? "제품 분석을 완료했어요" : "제품을 분석하고 있어요"}
          description={
            isComplete
              ? "제품 패스포트로 이동할게요"
              : "내 아이템과 취향을 꼼꼼히 살펴볼게요"
          }
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-10 flex justify-center" delay={70}>
        <div
          className="relative flex size-[190px] items-center justify-center"
          role="progressbar"
          aria-label={isComplete ? "제품 분석 완료" : "제품 분석 진행률"}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <svg
            aria-hidden="true"
            className="absolute inset-0 size-full -rotate-90"
            viewBox="0 0 190 190"
            fill="none"
          >
            <circle cx="95" cy="95" r="84" stroke="#ececee" strokeWidth="10" />
            <motion.circle
              cx="95"
              cy="95"
              r="84"
              stroke="#8b7355"
              strokeLinecap="round"
              strokeWidth="10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.12, ease: "linear" }}
            />
          </svg>

          <AnimatePresence mode="wait" initial={false}>
            {isComplete ? (
              <motion.div
                key="complete"
                className="flex size-[148px] items-center justify-center rounded-full bg-[#8b7355] text-white shadow-[0_16px_36px_rgba(139,115,85,0.26)]"
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckIcon />
              </motion.div>
            ) : (
              <motion.div
                key="progress"
                className="flex size-[148px] flex-col items-center justify-center rounded-full bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.86 }}
              >
                <span className="flex items-end text-[#15151a]">
                  <span className="text-[50px] leading-[52px] font-bold tracking-[-0.05em] tabular-nums">
                    {progress}
                  </span>
                  <span className="mb-[5px] ml-1 text-[18px] font-bold">%</span>
                </span>
                <span className="mt-1 text-[11px] font-bold text-[#8b7355]">
                  ANALYZING
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LuxuryReveal>

      <LuxuryReveal className="mt-9" delay={140}>
        <ol className="space-y-3" aria-label="제품 분석 단계">
          {analysisSteps.map((step, index) => {
            const previousEnd = index === 0 ? 0 : analysisSteps[index - 1].end;
            const isDone = progress >= step.end;
            const isActive = progress >= previousEnd && !isDone;

            return (
              <li
                key={step.title}
                className={`flex min-h-[78px] items-center gap-3 rounded-[18px] border px-4 py-[14px] ${
                  isDone
                    ? "border-[#d9cfbf] bg-[#fbf8f3]"
                    : isActive
                      ? "border-[#cbb89d] bg-white shadow-[0_10px_30px_rgba(139,115,85,0.10)]"
                      : "border-[#e7e7ea] bg-[#f8f8f9]"
                }`}
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                    isDone
                      ? "bg-[#8b7355] text-white"
                      : isActive
                        ? "bg-[#eee7dc] text-[#715b41]"
                        : "bg-[#e9e9ec] text-[#9999a1]"
                  }`}
                >
                  {isDone ? <CheckIcon /> : String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-[14px] font-bold text-[#15151a]">
                    {step.title}
                  </span>
                  <span className="mt-1 block text-[11px] text-[#888890]">
                    {isDone ? "완료했어요" : step.description}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </LuxuryReveal>

      <p className="mt-6 text-center text-[12px] text-[#8c8c94]" aria-live="polite">
        {isComplete
          ? "분석이 끝났어요. 제품 패스포트를 준비하고 있어요."
          : "화면을 닫지 않고 잠시만 기다려 주세요."}
      </p>
    </MobileScreenLayout>
  );
}
