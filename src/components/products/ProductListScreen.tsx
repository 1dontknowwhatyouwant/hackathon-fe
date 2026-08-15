"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { ProductList } from "@/components/products/ProductList";
import { useProductRecommendationStore } from "@/store/useProductRecommendationStore";

export function ProductListScreen() {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  const products = useProductRecommendationStore((state) => state.products);
  const status = useProductRecommendationStore((state) => state.status);
  const error = useProductRecommendationStore((state) => state.error);
  const loadProducts = useProductRecommendationStore(
    (state) => state.loadProducts,
  );

  useEffect(() => {
    return loadProducts("ALL");
  }, [loadProducts, retryCount]);

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
          description="내 아이템과 조합하기 좋은 제품"
        />
      </LuxuryReveal>

      <section className="mt-8" aria-live="polite">
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
          revealStartDelay={80}
          revealRowInterval={60}
        />
      </section>
    </MobileScreenLayout>
  );
}
