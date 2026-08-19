"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { PlaceMatchedProductCard } from "@/components/place/PlaceMatchedProductCard";
import { placeMatchedProducts } from "@/data/placeRecommendations";
import { usePlaceStore } from "@/store/usePlaceStore";

type PlaceTailoredRecommendationsScreenProps = {
  placeId: string;
};

export function PlaceTailoredRecommendationsScreen({
  placeId,
}: PlaceTailoredRecommendationsScreenProps) {
  const places = usePlaceStore((state) => state.places);
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const place = useMemo(
    () => places.find((candidate) => candidate.id === placeId),
    [placeId, places],
  );
  const recommendationTitle =
    place?.id === "daelim-warehouse-gallery"
      ? "대림창고 맞춤 추천"
      : `${place?.name ?? "장소"} 맞춤 추천`;

  const toggleFavorite = (productId: string) => {
    setFavoriteProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  return (
    <MobileScreenLayout
      figmaNodeId="390:219"
      contentClassName="flex bg-white px-6 pt-[47px] pb-8"
      bottomNavigation={<BottomNavigation activeItem="recommendation" />}
    >
      <div className="flex min-h-full w-full flex-col">
        <LuxuryReveal>
          <ScreenHeader
            eyebrow="PLACE RECOMMENDATION"
            title={recommendationTitle}
            description="저장한 장소와 현재 룩을 함께 분석했어요"
          />
        </LuxuryReveal>

        <section className="mt-9 space-y-4" aria-label="장소 맞춤 추천 제품">
          {placeMatchedProducts.map((product, index) => (
            <LuxuryReveal key={product.id} delay={60 + index * 50}>
              <PlaceMatchedProductCard
                name={product.name}
                matchScore={product.matchScore}
                priceLabel={product.priceLabel}
                thumbnailColor={product.thumbnailColor}
                favorite={favoriteProductIds.includes(product.id)}
                onFavoriteChange={() => toggleFavorite(product.id)}
              />
            </LuxuryReveal>
          ))}
        </section>

        <LuxuryReveal className="mt-auto pt-8" delay={220}>
          <Link
            href={`/place/${encodeURIComponent(placeId)}`}
            className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#0e0e12] text-[14px] font-bold text-white"
          >
            장소 상세로 돌아가기
          </Link>
        </LuxuryReveal>
      </div>
    </MobileScreenLayout>
  );
}
