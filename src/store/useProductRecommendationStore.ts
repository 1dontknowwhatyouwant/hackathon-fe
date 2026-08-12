"use client";

import { create } from "zustand";

import { getDummyRecommendedProducts } from "@/data/productRecommendations";
// import { backendApi } from "@/services/backendApi";
import type {
  ProductCategoryFilter,
  RecommendedProduct,
} from "@/types/product";

type LoadStatus = "idle" | "loading" | "success" | "error";

type ProductRecommendationState = {
  selectedCategory: ProductCategoryFilter;
  products: RecommendedProduct[];
  status: LoadStatus;
  error: string | null;
  setSelectedCategory: (category: ProductCategoryFilter) => void;
  loadProducts: (category: ProductCategoryFilter) => () => void;
};

type ActiveRequest = {
  id: number;
  controller: AbortController;
};

let requestSequence = 0;
let activeRequest: ActiveRequest | null = null;

export const useProductRecommendationStore =
  create<ProductRecommendationState>((set, get) => ({
    selectedCategory: "ALL",
    products: [],
    status: "idle",
    error: null,

    setSelectedCategory: (selectedCategory) => {
      set({ selectedCategory });
    },

    loadProducts: (category) => {
      activeRequest?.controller.abort();

      const request: ActiveRequest = {
        id: ++requestSequence,
        controller: new AbortController(),
      };
      activeRequest = request;
      set({ status: "loading", error: null });

      void (async () => {
        try {
          // 백엔드 연결 시 아래 호출로 더미 데이터 조회를 교체합니다.
          // const response = await backendApi.products.recommendations(
          //   category,
          //   request.controller.signal,
          // );
          // const nextProducts = response.data.data;
          const nextProducts = getDummyRecommendedProducts(category);

          await Promise.resolve();

          if (
            request.controller.signal.aborted ||
            activeRequest?.id !== request.id
          ) {
            return;
          }

          // 완성된 응답 스냅샷을 한 번에 반영해 일부 항목만 쓰이는 상태를 막습니다.
          set({ products: nextProducts, status: "success", error: null });
        } catch {
          if (
            request.controller.signal.aborted ||
            activeRequest?.id !== request.id
          ) {
            return;
          }

          set({
            status: "error",
            error: "추천 제품을 불러오지 못했습니다.",
          });
        } finally {
          if (activeRequest?.id === request.id) {
            activeRequest = null;
          }
        }
      })();

      return () => {
        if (activeRequest?.id !== request.id) {
          return;
        }

        request.controller.abort();
        activeRequest = null;

        if (get().status === "loading") {
          set({ status: "idle" });
        }
      };
    },
  }));
