import type { RecommendedProduct } from "@/types/product";

import {
  ImageGridCard,
  ImageGridSkeleton,
} from "@/components/common/card/ImageGridCard";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";

type ProductListProps = {
  products: readonly RecommendedProduct[];
  isLoading?: boolean;
  emptyMessage?: string;
  onProductSelect?: (product: RecommendedProduct) => void;
  revealStartDelay?: number;
  revealRowInterval?: number;
};

type ProductCardProps = {
  product: RecommendedProduct;
  onSelect?: (product: RecommendedProduct) => void;
};

function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <ImageGridCard
      title={product.name}
      subtitle={`활용도 ${product.utilityScore}%`}
      imageAlt={`${product.name} 제품 이미지`}
      imageUrl={product.imageUrl}
      fallbackLabel="PRODUCT"
      onClick={onSelect ? () => onSelect(product) : undefined}
    />
  );
}

export function ProductList({
  products,
  isLoading = false,
  emptyMessage = "조건에 맞는 추천 제품이 없습니다.",
  onProductSelect,
  revealStartDelay = 0,
  revealRowInterval = 60,
}: ProductListProps) {
  if (isLoading && products.length === 0) {
    return <ImageGridSkeleton label="추천 제품을 불러오는 중" />;
  }

  if (products.length === 0) {
    return (
      <p className="rounded-[18px] border border-[#dedee2] bg-[#f8f8f9] px-5 py-10 text-center text-[13px] text-[#777780]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul
      aria-label="추천 제품 목록"
      className="grid grid-cols-2 gap-x-[10px] gap-y-6"
    >
      {products.map((product, index) => (
        <li key={product.id}>
          <LuxuryReveal
            delay={revealStartDelay + Math.floor(index / 2) * revealRowInterval}
          >
            <ProductCard product={product} onSelect={onProductSelect} />
          </LuxuryReveal>
        </li>
      ))}
    </ul>
  );
}
