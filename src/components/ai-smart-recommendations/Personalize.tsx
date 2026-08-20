"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { getApiErrorMessage } from "@/lib/apiError";
import { backendApi } from "@/services/api";
import {
  colorGroups,
  itemCategories,
  productTagLabels,
  styleTags,
  type ColorGroup,
  type ItemCategory,
  type StyleTag,
} from "@/types/api";

const colorLabels: Record<ColorGroup, string> = {
  BLACK: "블랙",
  WHITE: "화이트",
  GRAY: "그레이",
  BROWN: "브라운",
  BEIGE: "베이지",
  RED: "레드",
  ORANGE: "오렌지",
  YELLOW: "옐로우",
  GREEN: "그린",
  BLUE: "블루",
  PURPLE: "퍼플",
  PINK: "핑크",
  METALLIC: "메탈릭",
  MULTI: "멀티",
  OTHER: "기타",
};

const colorStyles: Record<
  ColorGroup,
  { background: string; color: string; borderColor: string }
> = {
  BLACK: { background: "#171717", color: "#ffffff", borderColor: "#171717" },
  WHITE: { background: "#ffffff", color: "#403d38", borderColor: "#d1cfc9" },
  GRAY: { background: "#989898", color: "#ffffff", borderColor: "#989898" },
  BROWN: { background: "#6b4a36", color: "#ffffff", borderColor: "#6b4a36" },
  BEIGE: { background: "#d6c2a6", color: "#2e2921", borderColor: "#c4ac8d" },
  RED: { background: "#af403d", color: "#ffffff", borderColor: "#af403d" },
  ORANGE: { background: "#d97835", color: "#ffffff", borderColor: "#d97835" },
  YELLOW: { background: "#e2bd4c", color: "#332b18", borderColor: "#d1a936" },
  GREEN: { background: "#55705d", color: "#ffffff", borderColor: "#55705d" },
  BLUE: { background: "#365a84", color: "#ffffff", borderColor: "#365a84" },
  PURPLE: { background: "#735f88", color: "#ffffff", borderColor: "#735f88" },
  PINK: { background: "#d59baa", color: "#35242a", borderColor: "#c88799" },
  METALLIC: {
    background: "linear-gradient(135deg, #8d9198 0%, #f1f2f3 48%, #9ca0a6 100%)",
    color: "#2e3034",
    borderColor: "#a5a8ad",
  },
  MULTI: {
    background: "linear-gradient(135deg, #b94e4b 0%, #dcb75a 35%, #5c8268 67%, #526f9d 100%)",
    color: "#ffffff",
    borderColor: "#8a796b",
  },
  OTHER: { background: "#e8e5df", color: "#4d4942", borderColor: "#d5d0c8" },
};

const categoryLabels: Record<ItemCategory, string> = {
  BAG: "가방",
  LEATHER_GOODS: "가죽 소품",
  FASHION_ACCESSORY: "패션 액세서리",
  CLOTHING: "의류",
  SHOES: "신발",
};

const styleLabels: Record<StyleTag, string> = {
  ...productTagLabels.style,
  NEAT: "단정한",
};

function toggleWithLimit<T extends string>(
  values: readonly T[],
  value: T,
  limit: number,
) {
  if (values.includes(value)) {
    return values.filter((item) => item !== value) as T[];
  }

  return values.length < limit ? [...values, value] : [...values];
}

function selectedLabels<T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
) {
  return values.length > 0
    ? values.map((value) => labels[value]).join(" · ")
    : "미선택";
}

function PreferenceChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-[34px] items-center justify-center rounded-full border px-4 text-[10px] transition-colors ${
        selected
          ? "border-[#131210] bg-[#131210] font-semibold text-white"
          : "border-[#e0d9cc] bg-[#f8f5f0] font-normal text-[#544f47] hover:border-[#bca98a]"
      }`}
    >
      {label}
    </button>
  );
}

export function Personalize() {
  const router = useRouter();
  const [preferredColors, setPreferredColors] = useState<ColorGroup[]>([]);
  const [preferredCategories, setPreferredCategories] = useState<ItemCategory[]>([]);
  const [preferredStyleTags, setPreferredStyleTags] = useState<StyleTag[]>([]);
  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void backendApi.profile
      .getPreferences()
      .then(({ data }) => {
        if (!active) {
          return;
        }

        setPreferredColors(data.data.preferredColors.slice(0, 3));
        setPreferredCategories(data.data.preferredCategories.slice(0, 3));
        setPreferredStyleTags(data.data.preferredStyleTags.slice(0, 2));
        setVersion(data.data.version);
      })
      .catch(() => {
        // 저장된 취향이 없는 사용자는 빈 선택 상태에서 시작합니다.
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedSummary = useMemo(
    () => ({
      colors: selectedLabels(preferredColors, colorLabels),
      categories: selectedLabels(preferredCategories, categoryLabels),
      styles: selectedLabels(preferredStyleTags, styleLabels),
    }),
    [preferredCategories, preferredColors, preferredStyleTags],
  );

  const canSave =
    preferredStyleTags.length >= 1 &&
    preferredStyleTags.length <= 2 &&
    preferredCategories.length >= 1 &&
    preferredCategories.length <= 3 &&
    preferredColors.length >= 1 &&
    preferredColors.length <= 3;

  const handleSave = async () => {
    if (!canSave || isSaving) {
      setError("스타일은 1~2개, 카테고리와 색상은 1~3개 선택해 주세요.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await backendApi.profile.savePreferences({
        preferredColors,
        preferredCategories,
        preferredStyleTags,
        version,
      });
      router.replace("/dashboard?preferences=updated");
    } catch (saveError) {
      setError(
        getApiErrorMessage(
          saveError,
          "취향을 저장하지 못했습니다. 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MobileScreenLayout
      figmaNodeId="142:123"
      contentClassName="bg-white px-6 pb-8 pt-6 text-[#131210]"
      bottomNavigation={<BottomNavigation activeItem="recommendation" />}
    >
      <LuxuryReveal>
        <p className="text-[11px] font-bold tracking-[0.01em] text-[#9c754a]">
          PERSONALIZE
        </p>
        <h1 className="mt-4 text-[27px] font-bold leading-[1.15] tracking-[-0.04em]">
          어떤 제품을 찾고 있나요?
        </h1>
        <p className="mt-2 text-[14px] leading-5 text-[#78736b]">
          저장한 스타일 취향과 선택 조건을 반영해요.
        </p>
      </LuxuryReveal>

      <div className="mt-5 space-y-6">
        <LuxuryReveal delay={50}>
          <fieldset>
            <legend className="text-[11px] font-semibold">스타일 · 1~2개</legend>
            <div className="mt-4 flex flex-wrap gap-3">
              {styleTags.map((style) => (
                <PreferenceChip
                  key={style}
                  label={styleLabels[style]}
                  selected={preferredStyleTags.includes(style)}
                  onClick={() =>
                    setPreferredStyleTags((current) =>
                      toggleWithLimit(current, style, 2),
                    )
                  }
                />
              ))}
            </div>
          </fieldset>
        </LuxuryReveal>

        <LuxuryReveal delay={90}>
          <fieldset>
            <legend className="text-[11px] font-semibold">
              카테고리 선택 · 1~3개
            </legend>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {itemCategories.map((category) => (
                <PreferenceChip
                  key={category}
                  label={categoryLabels[category]}
                  selected={preferredCategories.includes(category)}
                  onClick={() =>
                    setPreferredCategories((current) =>
                      toggleWithLimit(current, category, 3),
                    )
                  }
                />
              ))}
            </div>
          </fieldset>
        </LuxuryReveal>

        <LuxuryReveal delay={130}>
          <fieldset>
            <legend className="text-[11px] font-semibold">선호 색상 · 1~3개</legend>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {colorGroups.map((color) => {
                const selected = preferredColors.includes(color);
                const colorStyle = colorStyles[color];

                return (
                  <button
                    key={color}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setPreferredColors((current) =>
                        toggleWithLimit(current, color, 3),
                      )
                    }
                    className={`flex h-[38px] items-center justify-center rounded-full border px-1.5 text-[9px] transition-[transform,box-shadow] active:scale-[0.97] ${
                      selected
                        ? "font-bold ring-2 ring-[#131210] ring-offset-2"
                        : "font-medium hover:shadow-[0_4px_12px_rgba(38,32,24,0.12)]"
                    }`}
                    style={colorStyle}
                  >
                    {colorLabels[color]}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </LuxuryReveal>

        <LuxuryReveal delay={170}>
          <section className="rounded-[14px] border border-[#dedbd9] bg-[#f7f7f7] px-4 py-3">
            <h2 className="text-[11px] font-semibold">선택한 취향</h2>
            <dl className="mt-2 text-[11px] leading-[17px] text-[#78736b]">
              <div className="grid grid-cols-[64px_1fr] gap-2">
                <dt>색상</dt>
                <dd>{selectedSummary.colors}</dd>
              </div>
              <div className="grid grid-cols-[64px_1fr] gap-2">
                <dt>카테고리</dt>
                <dd>{selectedSummary.categories}</dd>
              </div>
              <div className="grid grid-cols-[64px_1fr] gap-2">
                <dt>스타일</dt>
                <dd>{selectedSummary.styles}</dd>
              </div>
            </dl>
          </section>
        </LuxuryReveal>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-[12px] bg-[#f8eeee] px-4 py-3 text-[11px] text-[#9a4545]"
        >
          {error}
        </p>
      ) : null}

      <LuxuryReveal className="mt-7" delay={210}>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={isLoading || isSaving}
          className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#17171c] text-[14px] font-bold text-white transition-colors hover:bg-[#2a292e] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isSaving ? "저장 중" : "취향 저장"}
        </button>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
