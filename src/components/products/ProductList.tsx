import type { RecommendedProduct } from "@/types/product";

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
  const content = (
    <>
      <div
        aria-label={`${product.name} 제품 이미지`}
        role="img"
        className="h-[126px] w-full rounded-[14px] bg-[#e9e5df] bg-cover bg-center"
        style={
          product.imageUrl
            ? { backgroundImage: `url("${product.imageUrl}")` }
            : undefined
        }
      />
      <h2 className="mt-3 truncate text-[13px] leading-4 font-bold text-[#15151a]">
        {product.name}
      </h2>
      <p className="mt-1 text-[11px] leading-[13px] text-[#777780]">
        활용도 {product.utilityScore}%
      </p>
    </>
  );

  const className =
    "h-[206px] w-full rounded-[18px] border border-[#dedee2] bg-[#f8f8f9] p-[11px] text-left";

  if (onSelect) {
    return (
      <button
        type="button"
        className={`${className} transition-colors hover:border-[#c8c2b9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]`}
        onClick={() => onSelect(product)}
      >
        {content}
      </button>
    );
  }

  return <article className={className}>{content}</article>;
}

function ProductListSkeleton() {
  return (
    <div
      aria-label="추천 제품을 불러오는 중"
      className="grid grid-cols-2 gap-x-[10px] gap-y-6"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="h-[206px] animate-pulse rounded-[18px] border border-[#dedee2] bg-[#f8f8f9] p-[11px]"
        >
          <div className="h-[126px] rounded-[14px] bg-[#e9e5df]" />
          <div className="mt-3 h-4 w-20 rounded bg-[#e3e0dc]" />
          <div className="mt-2 h-3 w-14 rounded bg-[#e9e6e2]" />
        </div>
      ))}
    </div>
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
    return <ProductListSkeleton />;
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
