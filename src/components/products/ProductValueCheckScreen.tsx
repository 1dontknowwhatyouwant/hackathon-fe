import { DetailActionCard } from "@/components/common/card/DetailActionCard";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { AnimatedCounter } from "@/components/common/motion/AnimatedCounter";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import type { RecommendedProduct } from "@/types/product";

type ProductValueCheckScreenProps = {
  product: RecommendedProduct;
};

export function ProductValueCheckScreen({
  product,
}: ProductValueCheckScreenProps) {
  return (
    <MobileScreenLayout
      figmaNodeId="1:467"
      contentClassName="px-6 pt-[47px] pb-8"
    >
      <LuxuryReveal>
        <ScreenHeader
          eyebrow="VALUE CHECK"
          title="구매 전 활용 가능성"
          description="내 옷장 기준으로 미리 확인해요"
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-[54px] flex justify-center" delay={70}>
        <div
          role="img"
          aria-label={`활용 가능성 점수 ${product.valueScore}점`}
          className="flex size-[188px] items-center justify-center rounded-full"
          style={{
            background:
              "repeating-conic-gradient(from -18deg, #8b7355 0deg 36deg, #e5e6e8 36deg 72deg)",
          }}
        >
          <div className="flex size-[150px] flex-col items-center justify-center rounded-full bg-white">
            <AnimatedCounter
              value={product.valueScore}
              className="text-[50px] leading-[54px] font-bold tracking-[-0.04em] text-[#15151a] tabular-nums"
            />
            <span className="mt-[-1px] text-[11px] leading-[13px] font-bold text-[#8b7355]">
              VALUE SCORE
            </span>
          </div>
        </div>
      </LuxuryReveal>

      <div className="mt-9 space-y-5">
        <LuxuryReveal delay={140}>
          <DetailActionCard
            title={`내 아이템과 스타일 조합 ${product.itemStyleCompatibilityScore}점`}
          />
        </LuxuryReveal>

        <LuxuryReveal delay={200}>
          <DetailActionCard
            title={`취향 태그 일치 ${product.preferenceTagMatchScore}점`}
          />
        </LuxuryReveal>

        <LuxuryReveal delay={260}>
          <DetailActionCard
            title={`보유 카테고리 조합 ${product.ownedCategoryCompatibilityScore}점`}
          />
        </LuxuryReveal>

        <LuxuryReveal delay={320}>
          <DetailActionCard
            title={`계절 활용성 ${product.seasonalUtilityScore}점`}
          />
        </LuxuryReveal>
      </div>

      <LuxuryReveal className="mt-11" delay={390}>
        <button
          type="button"
          className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#15151a] text-[15px] font-bold text-white transition-colors hover:bg-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]"
        >
          상세 리포트 보기
        </button>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
