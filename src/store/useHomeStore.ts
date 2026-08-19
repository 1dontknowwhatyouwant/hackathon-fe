"use client";

import { create } from "zustand";

import { dummyRecommendedProducts } from "@/data/productRecommendations";
import { backendApi } from "@/services/api";
import type { HomeData } from "@/types/api";

type HomeState = {
  data: HomeData | null;
  isLoading: boolean;
  error: string | null;
  loadHome: () => Promise<void>;
};

const useApiMocks = process.env.NEXT_PUBLIC_USE_API_MOCKS !== "false";

const dummyHomeData: HomeData = {
  user: {
    nickname: "사용자",
    preferenceCompleted: true,
    myItemCount: 12,
  },
  latestStylePlan: null,
  recommendedProducts: dummyRecommendedProducts.slice(0, 2).map((product) => ({
    productId: product.id,
    name: product.displayName,
    matchScore: product.recommendationScore,
    primaryImageUrl: product.imageUrl ?? null,
  })),
};

export const useHomeStore = create<HomeState>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  loadHome: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = useApiMocks
        ? dummyHomeData
        : (await backendApi.profile.getHome()).data.data;
      set({ data, error: null });
    } catch {
      set({
        data: dummyHomeData,
        error: "홈 추천을 갱신하지 못해 미리보기 데이터를 표시합니다.",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
