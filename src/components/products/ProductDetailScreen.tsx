import Link from "next/link";

import { DetailActionCard } from "@/components/common/card/DetailActionCard";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import type { RecommendedProduct } from "@/types/product";

type ProductDetailScreenProps = {
  product: RecommendedProduct;
};

const priceFormatter = new Intl.NumberFormat("ko-KR");

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
            description={`활용 예상 ${product.expectedUseCount}회 · 매치도 ${product.closetMatchScore}%`}
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

        <div className="mt-[30px] space-y-5">
          <LuxuryReveal delay={190}>
            <DetailActionCard
              title={`내 옷장 매치도 ${product.closetMatchScore}%`}
            />
          </LuxuryReveal>

          <LuxuryReveal delay={250}>
            <DetailActionCard
              title={`예상 활용 횟수 ${product.expectedUseCount}회`}
            />
          </LuxuryReveal>
        </div>

        <LuxuryReveal className="mt-5" delay={310}>
          <Link
            href={`/recommendations/${product.id}/value-check`}
            className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#15151a] text-[15px] font-bold text-white transition-colors hover:bg-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]"
          >
            활용 가능성 확인
          </Link>
        </LuxuryReveal>
      </div>
    </MobileScreenLayout>
  );
}
