"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import Button from "@/components/common/button/Button";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";

const preferenceTags = [
  "미니멀",
  "스트릿",
  "클래식",
  "Y2K",
  "전시",
  "카페",
  "여행",
  "데이트",
];

const PERSONALIZE_STORAGE_KEY = "personalize:selected-tags";

export function Personalize() {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "미니멀",
    "전시",
  ]);
  const selectedTagSet = useMemo(() => new Set(selectedTags), [selectedTags]);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((current) => {
      if (current.includes(tag)) {
        return current.filter((item) => item !== tag);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, tag];
    });
  };

  const handleComplete = () => {
    window.localStorage.setItem(
      PERSONALIZE_STORAGE_KEY,
      JSON.stringify(selectedTags),
    );
    router.push("/personalize/condition");
  };

  return (
    <MobileScreenLayout
      figmaNodeId="96:113"
      contentClassName="relative min-h-full bg-white px-6 pb-[104px] pt-[72px] text-[#17181d]"
    >
      <div className="absolute left-6 top-4 z-10">
        <BackButton fallbackHref="/" />
      </div>

      <LuxuryReveal>
        <p className="text-[11px] font-bold leading-none tracking-[0.04em] text-[#8b7355]">
          PERSONALIZE
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-[1.14] tracking-[-0.04em] text-[#15151a]">
          좋아하는 무드는?
        </h1>
        <p className="mt-2 text-[13px] font-normal leading-none text-[#777780]">
          최대 3개를 선택해 주세요
        </p>
      </LuxuryReveal>

      <LuxuryReveal className="mt-[56px]" delay={70}>
        <section className="grid grid-cols-3 gap-x-3 gap-y-3">
          {preferenceTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleToggleTag(tag)}
              aria-pressed={selectedTagSet.has(tag)}
              className={`h-[44px] rounded-full border text-[14px] font-bold leading-none transition-colors ${
                selectedTagSet.has(tag)
                  ? "border-[#17161b] bg-[#17161b] text-white"
                  : "border-[#bfc3cc] bg-white text-[#55555d]"
              }`}
            >
              {tag}
            </button>
          ))}
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-[52px]" delay={140}>
        <section className="flex h-[191px] items-center justify-center rounded-[24px] border border-[#e3e4e8] bg-[#f8f8f9] px-6 text-center">
          <p className="text-[15px] font-bold leading-none text-[#777780]">
            선택에 따라 추천이 달라져요
          </p>
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
            선택 완료
          </Button>
        </section>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
