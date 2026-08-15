"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ChoiceChipGroup } from "@/components/common/selection/ChoiceChipGroup";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { ProductList } from "@/components/products/ProductList";
import { dummyRecommendedProducts } from "@/data/productRecommendations";
import { backendApi } from "@/services/api";
import { pollAiJob } from "@/services/aiJobPolling";
import { productTagLabels, styleTags, type StyleTag } from "@/types/api";
import type { RecommendedProduct } from "@/types/product";

const moodOptions = styleTags.map((value) => ({
  value,
  label: productTagLabels.style[value],
}));
const useApiMocks = process.env.NEXT_PUBLIC_USE_API_MOCKS !== "false";

function createIdempotencyKey() {
  return globalThis.crypto?.randomUUID?.() ?? `style-plan-${Date.now()}`;
}

function getFallbackProducts(styleIntensity: number) {
  const count = styleIntensity >= 65 ? 3 : 2;
  return dummyRecommendedProducts.slice(0, count);
}

export function SmartWearRecommendationScreen() {
  const router = useRouter();
  const [mood, setMood] = useState<StyleTag | "">("");
  const [styleIntensity, setStyleIntensity] = useState(50);
  const [products, setProducts] = useState<readonly RecommendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRequested, setHasRequested] = useState(false);

  const handleRecommend = async () => {
    if (!mood) {
      setError("원하는 무드를 선택해 주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasRequested(true);

    try {
      if (!useApiMocks) {
        const accepted = await backendApi.intelligence.createAiJob(
          {
            type: "STYLE_PLAN",
            context: {
              occasion: "DAILY",
              styleTags: [mood],
              styleIntensity,
              weatherCondition: null,
              prioritizeOwnedItems: true,
              language: "ko",
            },
          },
          createIdempotencyKey(),
        );
        const job = await pollAiJob(accepted.data.data.jobId);

        if (job.status === "FAILED") {
          throw new Error("스마트 착용 추천을 완성하지 못했습니다.");
        }
      }

      // 실제 STYLE_PLAN 응답 Mapper가 연결되기 전에는 동일한 카드 UI를 더미 데이터로 검증합니다.
      setProducts(getFallbackProducts(styleIntensity));
    } catch (recommendError) {
      setProducts([]);
      setError(
        recommendError instanceof Error
          ? recommendError.message
          : "스마트 착용 추천을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileScreenLayout
      contentClassName="bg-white px-6 pt-[47px] pb-8"
      bottomNavigation={<BottomNavigation activeItem="home" />}
    >
      <LuxuryReveal>
        <ScreenHeader
          eyebrow="SMART WEAR"
          title="스마트 착용 추천"
          description="원하는 무드와 스타일 강도를 정하면 어울리는 제품을 찾아드려요."
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-8" delay={60}>
        <section className="rounded-[22px] border border-[#e2ded8] bg-[#fbfaf8] p-5">
          <ChoiceChipGroup
            legend="원하는 무드"
            options={moodOptions}
            selectedValues={mood ? [mood] : []}
            onToggle={setMood}
            required
          />

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <label htmlFor="style-intensity" className="text-[13px] font-bold text-[#25252a]">스타일 강도</label>
              <output htmlFor="style-intensity" className="text-[12px] font-bold text-[#8b7355]">{styleIntensity}</output>
            </div>
            <input
              id="style-intensity"
              type="range"
              min="1"
              max="100"
              value={styleIntensity}
              onChange={(event) => setStyleIntensity(Number(event.target.value))}
              className="mt-4 w-full accent-[#15151a]"
            />
            <div className="mt-2 flex justify-between text-[10px] text-[#9999a1]">
              <span>담백하게</span>
              <span>확실하게</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleRecommend}
            className="mt-8 flex h-[50px] w-full items-center justify-center rounded-[15px] bg-[#15151a] text-[14px] font-bold text-white disabled:opacity-45"
          >
            {isLoading ? "추천을 만드는 중" : "스타일에 맞는 제품 추천"}
          </button>
        </section>
      </LuxuryReveal>

      {error ? (
        <p role="alert" className="mt-4 rounded-[14px] bg-[#f8eeee] px-4 py-3 text-[11px] text-[#9a4545]">{error}</p>
      ) : null}

      {hasRequested ? (
        <section className="mt-8">
          <h2 className="mb-4 text-[18px] font-bold tracking-[-0.03em] text-[#15151a]">오늘의 추천 제품</h2>
          <ProductList
            products={products}
            isLoading={isLoading}
            onProductSelect={(product) => router.push(`/recommendations/${product.id}`)}
          />
        </section>
      ) : null}
    </MobileScreenLayout>
  );
}
