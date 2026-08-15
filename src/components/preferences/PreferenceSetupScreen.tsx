"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ChoiceChipGroup } from "@/components/common/selection/ChoiceChipGroup";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { getApiErrorMessage } from "@/lib/apiError";
import { backendApi } from "@/services/api";
import { pollAiJob } from "@/services/aiJobPolling";
import {
  itemCategories,
  productTagLabels,
  styleTags,
  type ItemCategory,
  type StyleTag,
} from "@/types/api";

const colorOptions = [
  { value: "BLACK", label: "블랙" },
  { value: "WHITE", label: "화이트" },
  { value: "BROWN", label: "브라운" },
  { value: "BEIGE", label: "베이지" },
  { value: "GRAY", label: "그레이" },
  { value: "RED", label: "레드" },
] as const;

const categoryLabels: Record<ItemCategory, string> = {
  BAG: "가방",
  BACKPACK: "백팩",
  WALLET: "지갑",
  CARD_HOLDER: "카드 홀더",
  CLOTHING: "의류",
  SHOES: "신발",
  JEWELRY: "주얼리",
  ACCESSORY: "액세서리",
  OTHER: "기타",
};

const categoryOptions = itemCategories.map((value) => ({
  value,
  label: categoryLabels[value],
}));

const styleOptions = styleTags.map((value) => ({
  value,
  label: productTagLabels.style[value],
}));

const useApiMocks = process.env.NEXT_PUBLIC_USE_API_MOCKS !== "false";
const mockPreferenceStorageKey = "mock-preference-profile";

function toggleValue<T extends string>(values: readonly T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function createIdempotencyKey() {
  return globalThis.crypto?.randomUUID?.() ?? `preference-${Date.now()}`;
}

export function PreferenceSetupScreen() {
  const router = useRouter();
  const [preferredColors, setPreferredColors] = useState<string[]>([]);
  const [preferredCategories, setPreferredCategories] = useState<ItemCategory[]>([]);
  const [preferredStyleTags, setPreferredStyleTags] = useState<StyleTag[]>([]);
  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
              preferredColors?: string[];
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
          setMessage("아직 저장된 취향이 없습니다. 처음 취향을 선택해 주세요.");
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

  const canSubmit =
    preferredColors.length > 0 &&
    preferredCategories.length > 0 &&
    preferredStyleTags.length > 0;

  const handleSave = async () => {
    if (!canSubmit || isSaving) {
      setError("선호 색상, 제품 카테고리, STYLE을 하나 이상 선택해 주세요.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage("선택한 취향을 분석하고 있습니다.");

    let aiJobId: string | null = null;

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

      try {
        const accepted = await backendApi.intelligence.createAiJob(
          {
            type: "PREFERENCE_ANALYSIS",
            context: {
              selectedColors: preferredColors,
              selectedCategories: preferredCategories,
              selectedStyleTags: preferredStyleTags,
              language: "ko",
            },
          },
          createIdempotencyKey(),
        );
        const job = await pollAiJob(accepted.data.data.jobId);

        if (job.status === "SUCCEEDED") {
          aiJobId = job.jobId;
        }
      } catch {
        // AI가 실패해도 사용자가 직접 선택한 취향 값은 그대로 저장합니다.
        aiJobId = null;
      }

      await backendApi.profile.savePreferences({
        preferredColors,
        preferredCategories,
        preferredStyleTags,
        aiJobId,
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
    <MobileScreenLayout contentClassName="bg-white px-6 pt-4 pb-9">
      <LuxuryReveal>
        <BackButton fallbackHref="/my" />
      </LuxuryReveal>

      <LuxuryReveal className="mt-5" delay={40}>
        <ScreenHeader
          eyebrow="MY PREFERENCE"
          title="취향 분석"
          description="한 번 저장한 STYLE은 이후 MCM 추천 점수에 자동으로 반영됩니다."
        />
      </LuxuryReveal>

      <div className="mt-8 space-y-8">
        <LuxuryReveal delay={80}>
          <ChoiceChipGroup
            legend="선호 색상"
            description="좋아하는 색상을 모두 선택할 수 있어요."
            options={colorOptions}
            selectedValues={preferredColors}
            onToggle={(value) =>
              setPreferredColors((current) => toggleValue(current, value))
            }
            required
          />
        </LuxuryReveal>

        <LuxuryReveal delay={120}>
          <ChoiceChipGroup
            legend="선호 제품 카테고리"
            options={categoryOptions}
            selectedValues={preferredCategories}
            onToggle={(value) =>
              setPreferredCategories((current) => toggleValue(current, value))
            }
            required
          />
        </LuxuryReveal>

        <LuxuryReveal delay={160}>
          <ChoiceChipGroup
            legend="선호 STYLE"
            description="추천 시 서버가 저장된 STYLE을 불러와 최대 30점에 반영합니다."
            options={styleOptions}
            selectedValues={preferredStyleTags}
            onToggle={(value) =>
              setPreferredStyleTags((current) => toggleValue(current, value))
            }
            required
          />
        </LuxuryReveal>
      </div>

      {message ? (
        <p className="mt-6 rounded-[14px] bg-[#f4f1ec] px-4 py-3 text-[11px] text-[#715b41]">
          {message}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-4 rounded-[14px] bg-[#f8eeee] px-4 py-3 text-[11px] text-[#9a4545]">
          {error}
        </p>
      ) : null}

      <LuxuryReveal className="mt-7" delay={220}>
        <button
          type="button"
          disabled={isLoading || isSaving || !canSubmit}
          onClick={handleSave}
          className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#15151a] text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isSaving ? "분석하고 저장하는 중" : "취향 저장"}
        </button>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
