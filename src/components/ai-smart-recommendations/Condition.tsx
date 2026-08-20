"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/common/button/Button";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";

const CONDITION_STORAGE_KEY = "personalize:condition-levels";

const CONDITION_ITEMS = [
  {
    leftLabel: "캐주얼",
    rightLabel: "포멀",
    defaultValue: 3,
  },
  {
    leftLabel: "깔끔하게",
    rightLabel: "화려하게",
    defaultValue: 7,
  },
] as const;

function ConditionSlider({
  leftLabel,
  rightLabel,
  value,
  onChange,
}: {
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const fillPercent = ((value - 1) / 9) * 100;

  return (
    <div>
      <div className="flex items-end justify-between gap-4 text-[14px] font-bold leading-none text-[#15151a]">
        <p>{leftLabel}</p>
        <p>{rightLabel}</p>
      </div>
      <div className="mt-6">
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-valuemin={1}
          aria-valuemax={10}
          aria-valuenow={value}
          style={{ "--condition-fill": `${fillPercent}%` } as CSSProperties}
          className="condition-range w-full"
        />
      </div>
    </div>
  );
}

function ConditionCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-[18px] border border-[#e1e2e6] bg-[#f8f8f9] px-4 py-3 text-left"
    >
      <div className="h-[46px] w-[46px] rounded-[14px] bg-[#e7e0d8]" />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold leading-none text-[#15151a]">
          {title}
        </p>
        <p className="mt-2 text-[11px] leading-none text-[#888890]">
          {description}
        </p>
      </div>
      <span className="text-[22px] leading-none text-[#777780]">›</span>
    </button>
  );
}

export default function ConditionPage() {
  const router = useRouter();
  const [values, setValues] = useState<number[]>(
    CONDITION_ITEMS.map((item) => item.defaultValue),
  );

  const handleComplete = () => {
    window.localStorage.setItem(
      CONDITION_STORAGE_KEY,
      JSON.stringify(
        CONDITION_ITEMS.map((item, index) => ({
          pair: `${item.leftLabel}-${item.rightLabel}`,
          level: values[index],
        })),
      ),
    );

    router.push("/personalize/condition/ai-recommend");
  };

  return (
    <MobileScreenLayout contentClassName="relative min-h-full bg-white px-6 pb-[104px] pt-[72px] text-[#17181d]">
      <div className="absolute left-6 top-4 z-10">
        <BackButton />
      </div>

      <LuxuryReveal>
        <p className="text-[11px] font-bold leading-none tracking-[0.04em] text-[#8b7355]">
          CONDITION
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-[1.14] tracking-[-0.04em] text-[#15151a]">
          원하는 분위기는?
        </h1>
        <p className="mt-2 text-[13px] font-normal leading-none text-[#777780]">
          스타일 강도를 조절하세요
        </p>
      </LuxuryReveal>

      <LuxuryReveal className="mt-[54px]" delay={70}>
        <section className="space-y-[62px]">
          {CONDITION_ITEMS.map((item, index) => (
            <ConditionSlider
              key={item.leftLabel}
              leftLabel={item.leftLabel}
              rightLabel={item.rightLabel}
              value={values[index]}
              onChange={(nextValue) => {
                setValues((current) =>
                  current.map((value, valueIndex) =>
                    valueIndex === index ? nextValue : value,
                  ),
                );
              }}
            />
          ))}
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-[61px]" delay={140}>
        <section className="space-y-4">
          <ConditionCard
            title="날씨 자동 반영"
            description="세부 정보를 확인하세요"
          />
          <ConditionCard
            title="보유 제품 우선"
            description="세부 정보를 확인하세요"
          />
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="absolute bottom-[28px] left-6 right-6" delay={210}>
        <section>
          <Button
            variant="cta"
            type="button"
            onClick={handleComplete}
            className="w-full"
          >
            결과 보기
          </Button>
        </section>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
