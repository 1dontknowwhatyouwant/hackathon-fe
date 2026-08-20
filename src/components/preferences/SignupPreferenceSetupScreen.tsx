"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { getApiErrorMessage } from "@/lib/apiError";
import { backendApi } from "@/services/api";
import {
  colorGroups,
  itemCategories,
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

const categoryLabels: Record<ItemCategory, string> = {
  BAG: "가방",
  LEATHER_GOODS: "가죽 소품",
  FASHION_ACCESSORY: "패션 액세서리",
  CLOTHING: "의류",
  SHOES: "신발",
};

const styleLabels: Record<StyleTag, string> = {
  CASUAL: "캐주얼",
  FORMAL: "포멀",
  NEAT: "단정한",
  GLAMOROUS: "화려한",
};

const colorOptions = colorGroups.map((value) => ({
  value,
  label: colorLabels[value],
}));

const categoryOptions = itemCategories.map((value) => ({
  value,
  label: categoryLabels[value],
}));

const styleOptions = styleTags.map((value) => ({
  value,
  label: styleLabels[value],
}));

const useApiMocks = process.env.NEXT_PUBLIC_USE_API_MOCKS !== "false";
const mockPreferenceStorageKey = "mock-preference-profile";

function toggleValue<T extends string>(values: readonly T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function toggleValueWithLimit<T extends string>(
  values: readonly T[],
  value: T,
  limit: number,
) {
  if (values.includes(value)) {
    return values.filter((item) => item !== value) as T[];
  }

  if (values.length >= limit) {
    return [...values];
  }

  return [...values, value];
}

function joinSelected<T extends string>(
  values: readonly T[],
  labels: Record<T, string>,
) {
  if (values.length === 0) {
    return "미선택";
  }

  return values.map((value) => labels[value]).join(" · ");
}

function PreferenceChip<T extends string>({
  label,
  selected,
  onClick,
  compact = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full border text-center transition-colors ${
        compact ? "min-h-[34px] px-4 text-[10px]" : "min-h-[38px] px-4 text-[12px]"
      } ${
        selected
          ? "border-[#17171c] bg-[#17171c] font-semibold text-white"
          : "border-[#e0d9cc] bg-[#f8f5f0] text-[#544f47] hover:border-[#bca98a]"
      }`}
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <h2 className="text-[13px] font-bold text-[#131210]">{children}</h2>;
}

export function SignupPreferenceSetupScreen() {
  const router = useRouter();
  const [preferredColors, setPreferredColors] = useState<ColorGroup[]>([
    "BLACK",
    "BEIGE",
  ]);
  const [preferredCategories, setPreferredCategories] = useState<ItemCategory[]>(
    ["BAG", "SHOES"],
  );
  const [preferredStyleTags, setPreferredStyleTags] = useState<StyleTag[]>([
    "CASUAL",
    "NEAT",
  ]);
  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isStyleSelectionValid = preferredStyleTags.length >= 1 && preferredStyleTags.length <= 2;
  const isCategorySelectionValid =
    preferredCategories.length >= 1 && preferredCategories.length <= 3;
  const isColorSelectionValid = preferredColors.length >= 1 && preferredColors.length <= 3;

  useEffect(() => {
    let active = true;

    if (useApiMocks) {
      void Promise.resolve().then(() => {
        if (!active) {
          return;
        }

        const stored = window.localStorage.getItem(mockPreferenceStorageKey);
        if (stored) {
          try {
            const preview = JSON.parse(stored) as {
              preferredColors?: ColorGroup[];
              preferredCategories?: ItemCategory[];
              preferredStyleTags?: StyleTag[];
            };
            setPreferredColors(preview.preferredColors ?? []);
            setPreferredCategories(preview.preferredCategories ?? []);
            setPreferredStyleTags(preview.preferredStyleTags ?? []);
          } catch {
            window.localStorage.removeItem(mockPreferenceStorageKey);
          }
        }
        setIsLoading(false);
      });

      return () => {
        active = false;
      };
    }

    void backendApi.profile
      .getPreferences()
      .then(({ data }) => {
        if (!active) {
          return;
        }

        setPreferredColors(data.data.preferredColors);
        setPreferredCategories(data.data.preferredCategories);
        setPreferredStyleTags(data.data.preferredStyleTags);
        setVersion(data.data.version);
      })
      .catch(() => {
        if (active) {
          setMessage("선택한 취향을 저장해 주세요.");
        }
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
      colors: joinSelected(preferredColors, colorLabels),
      categories: joinSelected(preferredCategories, categoryLabels),
      styles: joinSelected(preferredStyleTags, styleLabels),
    }),
    [preferredCategories, preferredColors, preferredStyleTags],
  );

  const canSubmit =
    isColorSelectionValid && isCategorySelectionValid && isStyleSelectionValid;

  const handleSave = async () => {
    if (!canSubmit || isSaving) {
      setError("스타일은 1~2개, 카테고리와 색상은 1~3개까지 선택해 주세요.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage("선택한 취향을 저장하고 있습니다.");

    try {
      if (useApiMocks) {
        window.localStorage.setItem(
          mockPreferenceStorageKey,
          JSON.stringify({
            preferredColors,
            preferredCategories,
            preferredStyleTags,
          }),
        );
        router.replace("/dashboard?preferences=updated");
        return;
      }

      await backendApi.profile.savePreferences({
        preferredColors,
        preferredCategories,
        preferredStyleTags,
        version,
      });

      router.replace("/dashboard?preferences=updated");
    } catch (saveError) {
      setMessage(null);
      setError(
        getApiErrorMessage(saveError, "취향을 저장하지 못했습니다. 다시 시도해 주세요."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MobileScreenLayout
      contentClassName="bg-[#ffffff] px-6 pb-[32px] pt-[24px]"
    >
      <div className="flex min-h-full flex-col">
        <LuxuryReveal>
          <p className="text-[11px] font-bold tracking-[0.01em] text-[#9c754a]">
            PERSONALIZE
          </p>
          <h1 className="mt-4 text-[27px] font-bold leading-[1.15] tracking-[-0.04em] text-[#131210]">
            어떤 제품을 찾고 있나요?
          </h1>
          <p className="mt-2 text-[14px] leading-5 text-[#78736b]">
            저장한 스타일 취향과 선택 조건을 반영해요.
          </p>
          <div className="mt-6 h-1 rounded-full bg-[#e5e3e0]">
            <div className="h-1 w-[75%] rounded-full bg-[#b89463]" />
          </div>
        </LuxuryReveal>

        <div className="mt-8 space-y-8">
          <LuxuryReveal delay={40}>
            <h2 className="text-[24px] font-bold tracking-[-0.035em] text-[#131210]">
              취향 프로필
            </h2>
          </LuxuryReveal>

          <LuxuryReveal delay={80}>
          <SectionLabel>스타일 · 1~2개</SectionLabel>
          <div className="mt-4 flex flex-wrap gap-3">
              {styleOptions.map((option) => (
                <PreferenceChip
                  key={option.value}
                  label={option.label}
                  selected={preferredStyleTags.includes(option.value)}
                  onClick={() =>
                    setPreferredStyleTags((current) =>
                      toggleValueWithLimit(current, option.value, 2),
                    )
                  }
                />
              ))}
            </div>
          </LuxuryReveal>

          <LuxuryReveal delay={120}>
            <SectionLabel>카테고리 선택 · 1~3개</SectionLabel>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {categoryOptions.map((option) => (
                <PreferenceChip
                  key={option.value}
                  label={option.label.toUpperCase()}
                  selected={preferredCategories.includes(option.value)}
                  onClick={() =>
                    setPreferredCategories((current) =>
                      toggleValueWithLimit(current, option.value, 3),
                    )
                  }
                  compact
                />
              ))}
            </div>
          </LuxuryReveal>

          <LuxuryReveal delay={160}>
            <SectionLabel>선호 색상 · 1~3개</SectionLabel>
            <div className="mt-4 flex flex-wrap gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={preferredColors.includes(option.value)}
                  onClick={() =>
                    setPreferredColors((current) =>
                      toggleValueWithLimit(current, option.value, 3),
                    )
                  }
                  className={`inline-flex min-h-[34px] items-center justify-center rounded-[16px] border px-4 text-[10px] transition-colors ${
                    preferredColors.includes(option.value)
                      ? "border-[#17171c] bg-[#17171c] font-semibold text-white"
                      : "border-[#d1cfc9] bg-white text-[#403d38] hover:border-[#bca98a]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </LuxuryReveal>

          <LuxuryReveal delay={200}>
            <div className="rounded-[16px] border border-[#dedbd9] bg-[#f7f7f7] px-5 py-4">
              <p className="text-[11px] font-semibold text-[#131210]">
                선택한 취향
              </p>
              <div className="mt-4 space-y-2 text-[11px] leading-[19px] text-[#78736b]">
                <div className="grid grid-cols-[72px_1fr] gap-3">
                  <span>색상</span>
                  <span>{selectedSummary.colors}</span>
                </div>
                <div className="grid grid-cols-[72px_1fr] gap-3">
                  <span>카테고리</span>
                  <span>{selectedSummary.categories}</span>
                </div>
                <div className="grid grid-cols-[72px_1fr] gap-3">
                  <span>스타일</span>
                  <span>{selectedSummary.styles}</span>
                </div>
              </div>
            </div>
          </LuxuryReveal>
        </div>

        <div className="mt-10">
          {message ? (
            <p className="mb-3 rounded-[14px] bg-[#f4f1ec] px-4 py-3 text-[11px] text-[#715b41]">
              {message}
            </p>
          ) : null}
          {error ? (
            <p
              role="alert"
              className="mb-3 rounded-[14px] bg-[#f8eeee] px-4 py-3 text-[11px] text-[#9a4545]"
            >
              {error}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={isLoading || isSaving}
            className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#17171c] text-[14px] font-bold text-white transition hover:bg-[#23232a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "저장 중" : "취향 저장"}
          </button>
        </div>
      </div>
    </MobileScreenLayout>
  );
}
