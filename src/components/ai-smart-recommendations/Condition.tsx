"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/common/button/Button";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import {
  createStylePlanSliderContext,
  personalizeTagsStorageKey,
  stylePlanContextStorageKey,
} from "@/lib/stylePlanDraft";

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
  selected,
  onClick,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-[18px] border px-4 py-3 text-left ${selected ? "border-[#8b7355] bg-[#f4f0e9]" : "border-[#e1e2e6] bg-[#f8f8f9]"}`}
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
  const [prioritizeOwnedItems, setPrioritizeOwnedItems] = useState(true);

  const handleComplete = () => {
    let selectedTags: string[];
    try {
      const storedTags = window.localStorage.getItem(personalizeTagsStorageKey);
      selectedTags = storedTags ? (JSON.parse(storedTags) as string[]) : [];
    } catch {
      selectedTags = [];
    }

    const context = createStylePlanSliderContext(
      selectedTags,
      values[0],
      values[1],
      prioritizeOwnedItems,
    );

    window.localStorage.setItem(
      stylePlanContextStorageKey,
      JSON.stringify(context),
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
            title="보유 제품 우선"
            description={prioritizeOwnedItems ? "보유 아이템을 우선 활용합니다" : "MCM 제품 중심으로 추천합니다"}
            selected={prioritizeOwnedItems}
            onClick={() => setPrioritizeOwnedItems((current) => !current)}
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
