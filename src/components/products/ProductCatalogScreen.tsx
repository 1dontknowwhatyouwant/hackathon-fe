"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { ChoiceChipGroup } from "@/components/common/selection/ChoiceChipGroup";
import { ProductList } from "@/components/products/ProductList";
import { backendApi } from "@/services/api";
import type { ItemCategory, ProductSummary } from "@/types/api";
import {
  type RecommendedProduct,
} from "@/types/product";

type LoadStatus = "idle" | "loading" | "success" | "error";

export function ProductCatalogScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [category, setCategory] = useState<ItemCategory | "ALL">("ALL");
  const pageSize = 12;

  useEffect(() => {
    const controller = new AbortController();

    void backendApi.catalog
      .getProducts(
        {
          page,
          size: pageSize,
          category: category === "ALL" ? undefined : category,
        },
        controller.signal,
      )
      .then((response) => {
        if (controller.signal.aborted) return;

        const pageData = response.data.data;
        const nextProducts = response.data.data.items.map(
          (product: ProductSummary) => mapProductSummary(product),
        );
        setProducts(nextProducts);
        setTotalPages(pageData.totalPages);
        setStatus("success");
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setStatus("error");
        setError("제품 목록을 불러오지 못했습니다.");
      });

    return () => {
      controller.abort();
    };
  }, [page, category]);

  return (
    <MobileScreenLayout
      contentClassName="px-6 pt-[47px] pb-8"
      bottomNavigation={<BottomNavigation activeItem="recommendation" />}
    >
      <ScreenHeader
        eyebrow="DISCOVER MORE"
        title="전체 제품"
        description="MCM 제품 전체를 둘러보고 원하는 제품 상세로 이동할 수 있어요"
      />

      <section className="mt-9" aria-live="polite">
        <ChoiceChipGroup
          legend="카테고리"
          options={[
          { value: "ALL", label: "전체" },
            ...itemCategoryOptions.map((value) => ({
              value,
              label: categoryLabelMap[value],
            })),
          ]}
          selectedValues={[category]}
          onToggle={(value) => {
            setStatus("loading");
            setError(null);
            setPage(0);
            setCategory(value as ItemCategory | "ALL");
          }}
        />

        {status === "error" ? (
          <div
            role="alert"
            className="mt-4 mb-4 rounded-[16px] bg-[#f8eeee] px-4 py-3 text-[12px] text-[#9a4545]"
          >
            <p>{error}</p>
          </div>
        ) : null}

        <ProductList
          key={category}
          products={products}
          isLoading={status === "loading"}
          emptyMessage="등록된 제품이 없습니다."
          onProductSelect={(product) => router.push(`/recommendations/${product.id}`)}
          revealStartDelay={40}
        />

        {status === "success" && totalPages > 1 ? (
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setStatus("loading");
                setError(null);
                setPage((current) => Math.max(current - 1, 0));
              }}
              disabled={page === 0}
              className="h-11 rounded-[14px] border border-[#dedee2] px-4 text-[13px] font-bold text-[#15151a] disabled:opacity-40"
            >
              이전
            </button>
            <p className="text-[12px] font-bold text-[#777780]">
              {page + 1} / {totalPages}
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("loading");
                setError(null);
                setPage((current) => Math.min(current + 1, totalPages - 1));
              }}
              disabled={page >= totalPages - 1}
              className="h-11 rounded-[14px] border border-[#dedee2] px-4 text-[13px] font-bold text-[#15151a] disabled:opacity-40"
            >
              다음
            </button>
          </div>
        ) : null}
      </section>
    </MobileScreenLayout>
  );
}

function mapProductSummary(product: ProductSummary): RecommendedProduct {
  return {
    id: product.productId,
    name: product.name,
    brand: product.brand,
    modelName: product.name,
    displayName: product.name,
    category: product.category,
    price: product.price,
    imageUrl: product.primaryImageUrl ?? undefined,
  };
}

const categoryLabelMap: Record<ItemCategory, string> = {
  BAG: "가방",
  LEATHER_GOODS: "레더 굿즈",
  FASHION_ACCESSORY: "패션 액세서리",
  CLOTHING: "의류",
  SHOES: "신발",
};

const itemCategoryOptions: ItemCategory[] = [
  "BAG",
  "LEATHER_GOODS",
  "FASHION_ACCESSORY",
  "CLOTHING",
  "SHOES",
];
