"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { ProductList } from "@/components/products/ProductList";
import { useProductRecommendationStore } from "@/store/useProductRecommendationStore";
import type { ProductCategoryFilter } from "@/types/product";

const categoryFilters: ReadonlyArray<{
  value: ProductCategoryFilter;
  label: string;
}> = [
  { value: "ALL", label: "전체" },
  { value: "BAG", label: "가방" },
  { value: "CLOTHING", label: "의류" },
];

export function ProductListScreen() {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  const selectedCategory = useProductRecommendationStore(
    (state) => state.selectedCategory,
  );
  const products = useProductRecommendationStore((state) => state.products);
  const status = useProductRecommendationStore((state) => state.status);
  const error = useProductRecommendationStore((state) => state.error);
  const setSelectedCategory = useProductRecommendationStore(
    (state) => state.setSelectedCategory,
  );
  const loadProducts = useProductRecommendationStore(
    (state) => state.loadProducts,
  );

  useEffect(() => {
    return loadProducts(selectedCategory);
  }, [loadProducts, retryCount, selectedCategory]);

  return (
    <MobileScreenLayout
      figmaNodeId="1:398"
      contentClassName="px-6 pt-[47px] pb-8"
      bottomNavigation={<BottomNavigation activeItem="recommendation" />}
    >
      <LuxuryReveal>
        <ScreenHeader
          eyebrow="DISCOVER MORE"
          title="추천 제품"
          description="내 취향과 상황에 잘 맞는 MCM 제품"
        />
      </LuxuryReveal>

      <LuxuryReveal delay={40}>
        <div className="mt-5 rounded-[16px] border border-[#e1ddd7] bg-[#f8f6f3] px-4 py-3">
          <p className="text-[11px] font-bold text-[#55555d]">추천 점수 기준</p>
          <p className="mt-1 text-[11px] leading-4 text-[#777780]">
            STYLE 30 · OCCASION 25 · SEASON 25 · FEATURE 20
          </p>
        </div>
      </LuxuryReveal>

      <LuxuryReveal delay={60}>
        <div aria-label="상품 카테고리" className="mt-[30px] flex gap-2">
          {categoryFilters.map((filter) => {
            const isSelected = filter.value === selectedCategory;

            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={isSelected}
                className={`h-[38px] min-w-[70px] rounded-full border px-5 text-[12px] font-bold transition-colors ${
                  isSelected
                    ? "border-[#15151a] bg-[#15151a] text-white"
                    : "border-[#d1d1d8] bg-white text-[#55555d] hover:border-[#a8a8af]"
                }`}
                onClick={() => setSelectedCategory(filter.value)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </LuxuryReveal>

      <section className="mt-6" aria-live="polite">
        {error ? (
          <div
            role="alert"
            className="mb-4 rounded-[16px] bg-[#f8eeee] px-4 py-3 text-[12px] text-[#9a4545]"
          >
            <p>{error}</p>
            <button
              type="button"
              className="mt-2 font-bold underline underline-offset-2"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              다시 시도
            </button>
          </div>
        ) : null}

        <ProductList
          products={products}
          isLoading={status === "idle" || status === "loading"}
          onProductSelect={(product) =>
            router.push(`/recommendations/${product.id}`)
          }
          revealStartDelay={120}
          revealRowInterval={60}
        />
      </section>
    </MobileScreenLayout>
  );
}
