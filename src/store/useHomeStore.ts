"use client";

import { create } from "zustand";

import { backendApi } from "@/services/api";
import type { HomeData } from "@/types/api";

type HomeState = {
  data: HomeData | null;
  isLoading: boolean;
  error: string | null;
  loadHome: () => Promise<void>;
};

export const useHomeStore = create<HomeState>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  loadHome: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = (await backendApi.profile.getHome()).data.data;
      set({ data, error: null });
    } catch {
      set({
        data: null,
        error: "홈 정보를 불러오지 못했습니다.",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
