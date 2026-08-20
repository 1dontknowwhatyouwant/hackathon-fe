import Link from "next/link";

import { ImageGridCard, ImageGridSkeleton } from "@/components/common/card/ImageGridCard";
import type { HomeData } from "@/types/api";

type HomePreferenceProductsProps = {
  products: HomeData["recommendedProducts"];
  isLoading?: boolean;
};

export function HomePreferenceProducts({
  products,
  isLoading = false,
}: HomePreferenceProductsProps) {
  if (isLoading && products.length === 0) {
    return <ImageGridSkeleton label="취향 제품을 불러오는 중" count={2} />;
  }

  if (products.length === 0) {
    return (
      <div className="rounded-[18px] border border-[#dedee2] bg-[#f8f8f9] px-5 py-7 text-center">
        <p className="text-[12px] text-[#777780]">취향 분석을 완료하면 제품이 표시됩니다.</p>
        <Link href="/preferences" className="mt-3 inline-block text-[12px] font-bold text-[#715b41] underline underline-offset-2">
          취향 분석하기
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-[10px]">
      {products.map((product) => (
        <li key={product.productId}>
          <Link href={`/recommendations/${product.productId}`}>
            <ImageGridCard
              title={product.name}
              subtitle={`추천 일치 ${product.matchScore}점`}
              imageAlt={`${product.name} 제품 이미지`}
              imageUrl={product.primaryImageUrl ?? undefined}
              fallbackLabel="MCM"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
