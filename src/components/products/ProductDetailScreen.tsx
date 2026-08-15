import Link from "next/link";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import type { RecommendedProduct } from "@/types/product";

type ProductDetailScreenProps = {
  product: RecommendedProduct;
};

const priceFormatter = new Intl.NumberFormat("ko-KR");

const scoreLabels = {
  style: { label: "STYLE", maxScore: 30 },
  occasion: { label: "OCCASION", maxScore: 25 },
  season: { label: "SEASON", maxScore: 25 },
  feature: { label: "FEATURE", maxScore: 20 },
} as const;

export function ProductDetailScreen({ product }: ProductDetailScreenProps) {
  return (
    <MobileScreenLayout
      figmaNodeId="1:441"
      contentClassName="pt-4 pb-9"
    >
      <div className="px-6">
        <LuxuryReveal>
          <BackButton fallbackHref="/recommendations" />
        </LuxuryReveal>

        <LuxuryReveal className="mt-3" delay={40}>
          <ScreenHeader
            eyebrow={product.brand}
            title={product.modelName}
            description={`추천 점수 ${product.recommendationScore}점 · 취향과 상황에 잘 맞아요`}
          />
        </LuxuryReveal>
      </div>

      <LuxuryReveal className="mt-4" delay={70}>
        <div
          role="img"
          aria-label={`${product.displayName} 제품 이미지`}
          className="flex h-[332px] w-full items-center justify-center bg-[#f0ece7] bg-cover bg-center"
          style={
            product.imageUrl
              ? { backgroundImage: `url("${product.imageUrl}")` }
              : undefined
          }
        >
          {!product.imageUrl ? (
            <span className="text-[15px] font-bold text-[#a89b8a]">
              PRODUCT IMAGE
            </span>
          ) : null}
        </div>
      </LuxuryReveal>

      <div className="px-6 pt-5">
        <LuxuryReveal delay={130}>
          <h2 className="text-[20px] leading-6 font-bold tracking-[-0.025em] text-[#15151a]">
            {product.displayName}
          </h2>
          <p className="mt-2 text-[15px] leading-[18px] font-bold text-[#55555d]">
            ₩ {priceFormatter.format(product.price)}
          </p>
        </LuxuryReveal>

        <LuxuryReveal className="mt-[30px]" delay={190}>
          <div className="rounded-[18px] border border-[#dedee2] bg-[#f8f8f9] px-4 py-4">
            <p className="text-[13px] leading-5 font-bold text-[#15151a]">
              {product.recommendationReason}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4">
              {Object.entries(product.recommendationScoreBreakdown).map(
                ([key, score]) => {
                  const scoreKey = key as keyof typeof scoreLabels;
                  const { label, maxScore } = scoreLabels[scoreKey];

                  return (
                    <div key={key}>
                      <dt className="text-[10px] font-bold tracking-[0.04em] text-[#8b7355]">
                        {label}
                      </dt>
                      <dd className="mt-1 text-[14px] font-bold text-[#35353b]">
                        {score} / {maxScore}
                      </dd>
                    </div>
                  );
                },
              )}
            </dl>
          </div>
        </LuxuryReveal>

        <LuxuryReveal className="mt-5" delay={250}>
          <Link
            href={`/recommendations/${product.id}/value-check`}
            className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#15151a] text-[15px] font-bold text-white transition-colors hover:bg-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]"
          >
            내 아이템과 활용 가능성 확인
          </Link>
        </LuxuryReveal>
      </div>
    </MobileScreenLayout>
  );
}
