"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";

const ANALYSIS_DURATION_SECONDS = 5.4;

const analysisSteps = [
  {
    title: "내 아이템 살펴보기",
    description: "등록한 아이템의 스타일을 확인해요",
    start: 0,
    end: 34,
  },
  {
    title: "취향 데이터 매칭",
    description: "선호 태그와 어울림을 비교해요",
    start: 34,
    end: 68,
  },
  {
    title: "추천 결과 만들기",
    description: "가장 잘 맞는 조합을 정리해요",
    start: 68,
    end: 100,
  },
] as const;

type AnalysisStepProps = {
  description: string;
  end: number;
  index: number;
  progress: MotionValue<number>;
  progressValue: number;
  start: number;
  title: string;
};

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
      <motion.path
        d="M5 12.5 9.3 17 19 7"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </motion.svg>
  );
}

function AnalysisStep({
  description,
  end,
  index,
  progress,
  progressValue,
  start,
  title,
}: AnalysisStepProps) {
  const stepProgress = useTransform(progress, [start, end], [0, 1], {
    clamp: true,
  });
  const isComplete = progressValue >= end;
  const isActive = progressValue >= start && !isComplete;

  return (
    <li
      aria-current={isActive ? "step" : undefined}
      className={`relative min-h-[78px] overflow-hidden rounded-[18px] border px-4 py-[14px] transition-colors duration-300 ${
        isComplete
          ? "border-[#d9cfbf] bg-[#fbf8f3]"
          : isActive
            ? "border-[#cbb89d] bg-white shadow-[0_10px_30px_rgba(139,115,85,0.10)]"
            : "border-[#e7e7ea] bg-[#f8f8f9]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-colors duration-300 ${
            isComplete
              ? "bg-[#8b7355] text-white"
              : isActive
                ? "bg-[#eee7dc] text-[#715b41]"
                : "bg-[#e9e9ec] text-[#9999a1]"
          }`}
        >
          {isComplete ? (
            <CheckIcon className="size-5" />
          ) : isActive ? (
            <motion.span
              aria-hidden="true"
              className="size-[15px] rounded-full border-2 border-[#bda98d] border-t-[#6f573a]"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.85, ease: "linear", repeat: Infinity }}
            />
          ) : (
            String(index + 1).padStart(2, "0")
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[14px] leading-[17px] font-bold text-[#15151a]">
            {title}
          </span>
          <span className="mt-[5px] block text-[11px] leading-[14px] text-[#888890]">
            {isComplete ? "완료했어요" : description}
          </span>
        </span>

        <span
          className={`text-[11px] font-bold ${
            isComplete
              ? "text-[#8b7355]"
              : isActive
                ? "text-[#715b41]"
                : "text-[#aaaab1]"
          }`}
        >
          {isComplete ? "DONE" : isActive ? "진행 중" : "대기"}
        </span>
      </div>

      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#e8e5e1]">
        <motion.span
          className="block h-full origin-left bg-[#9a7d5a]"
          style={{ scaleX: stepProgress }}
        />
      </span>
    </li>
  );
}

export function AnalysisProgressScreen() {
  const prefersReducedMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const ringProgress = useTransform(progress, [0, 100], [0, 1]);
  const [progressValue, setProgressValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    progress.set(0);

    if (prefersReducedMotion) {
      const reducedMotionFrame = window.requestAnimationFrame(() => {
        progress.set(100);
        setProgressValue(100);
        setIsComplete(true);
      });

      return () => window.cancelAnimationFrame(reducedMotionFrame);
    }

    const progressAnimation = animate(progress, 100, {
      duration: ANALYSIS_DURATION_SECONDS,
      ease: [0.22, 0.72, 0.18, 1],
      onUpdate: (latest) => setProgressValue(Math.round(latest)),
      onComplete: () => setIsComplete(true),
    });

    return () => progressAnimation.stop();
  }, [prefersReducedMotion, progress]);

  return (
    <MobileScreenLayout contentClassName="px-6 pt-[47px] pb-8">
      <LuxuryReveal>
        <ScreenHeader
          eyebrow="AI STYLE ANALYSIS"
          title={isComplete ? "분석을 완료했어요" : "스타일을 분석하고 있어요"}
          description={
            isComplete
              ? "내 취향에 꼭 맞는 추천을 준비했어요"
              : "내 아이템과 취향을 꼼꼼히 살펴볼게요"
          }
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-10 flex justify-center" delay={70}>
        <div
          className="relative flex size-[190px] items-center justify-center"
          role="progressbar"
          aria-label={isComplete ? "스타일 분석 완료" : "스타일 분석 진행률"}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressValue}
        >
          <div className="absolute inset-0">
            <svg
              aria-hidden="true"
              className="size-full -rotate-90"
              viewBox="0 0 190 190"
              fill="none"
            >
              <circle
                cx="95"
                cy="95"
                r="84"
                stroke="#ececee"
                strokeWidth="10"
              />
              <motion.circle
                cx="95"
                cy="95"
                r="84"
                stroke="#8b7355"
                strokeLinecap="round"
                strokeWidth="10"
                style={{ pathLength: ringProgress }}
              />
            </svg>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {isComplete ? (
              <motion.div
                key="complete"
                className="flex size-[148px] flex-col items-center justify-center rounded-full bg-[#8b7355] text-white shadow-[0_16px_36px_rgba(139,115,85,0.26)]"
                initial={{ opacity: 0, rotate: -12, scale: 0.72 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                <CheckIcon className="size-[54px]" />
                <span className="mt-1 text-[11px] font-bold tracking-[0.08em]">
                  COMPLETE
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="progress"
                className="flex size-[148px] flex-col items-center justify-center rounded-full bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.84 }}
              >
                <span className="flex items-end text-[#15151a]">
                  <span className="text-[50px] leading-[52px] font-bold tracking-[-0.05em] tabular-nums">
                    {progressValue}
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
        <ol className="space-y-3" aria-label="스타일 분석 단계">
          {analysisSteps.map((step, index) => (
            <AnalysisStep
              key={step.title}
              {...step}
              index={index}
              progress={progress}
              progressValue={progressValue}
            />
          ))}
        </ol>
      </LuxuryReveal>

      <p
        className="mt-6 text-center text-[12px] leading-[18px] text-[#8c8c94]"
        aria-live="polite"
      >
        {isComplete
          ? "분석이 끝났어요. 추천 결과를 확인해 보세요."
          : "화면을 닫지 않고 잠시만 기다려 주세요."}
      </p>

      <AnimatePresence>
        {isComplete ? (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/screen24"
              className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#15151a] text-[15px] font-bold text-white shadow-[0_12px_28px_rgba(21,21,26,0.16)] transition-colors hover:bg-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]"
            >
              제품 패스포트 보러가기
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </MobileScreenLayout>
  );
}
