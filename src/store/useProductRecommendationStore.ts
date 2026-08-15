"use client";

import { create } from "zustand";

import { getDummyRecommendedProducts } from "@/data/productRecommendations";
// import { backendApi } from "@/services/api";
import type { ProductCategoryFilter, RecommendedProduct } from "@/types/product";

type LoadStatus = "idle" | "loading" | "success" | "error";

type ProductRecommendationState = {
  products: RecommendedProduct[];
  status: LoadStatus;
  error: string | null;
  loadProducts: (category?: ProductCategoryFilter) => () => void;
};

type ActiveRequest = {
  id: number;
  controller: AbortController;
};

let requestSequence = 0;
let activeRequest: ActiveRequest | null = null;

export const useProductRecommendationStore =
  create<ProductRecommendationState>((set, get) => ({
    products: [],
    status: "idle",
    error: null,

    loadProducts: (category = "ALL") => {
      activeRequest?.controller.abort();

      const request: ActiveRequest = {
        id: ++requestSequence,
        controller: new AbortController(),
      };
      activeRequest = request;
      set({ status: "loading", error: null });

      void (async () => {
        try {
          // 백엔드 연결 시 더미 조회를 추천 API 호출로 교체합니다.
          // 요청이 끝나기 전 새 요청이 시작되면 이전 요청을 취소합니다.
          const nextProducts = getDummyRecommendedProducts(category);

          await Promise.resolve();

          if (
            request.controller.signal.aborted ||
            activeRequest?.id !== request.id
          ) {
            return;
          }

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
