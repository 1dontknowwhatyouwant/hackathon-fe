"use client";

import { create } from "zustand";

// 실제 백엔드 연결 시 활성화합니다.
// import { backendApi } from "@/services/api";
import {
  dummyClosetItems,
  dummyUser,
} from "@/data/menuPageDummies";
import { useAuthStore, type UserInfo } from "@/store/useAuthStore";
import type {
  ClosetItem,
  ItemCreateInput,
} from "@/types/menu";

type MenuDataState = {
  items: ClosetItem[];
  profile: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  loadProfile: () => Promise<void>;
  createItem: (input: ItemCreateInput) => Promise<ClosetItem>;
  addCreatedItem: (item: ClosetItem) => void;
  updateItemImage: (itemId: string, imageUrl: string) => void;
};

export const useMenuDataStore = create<MenuDataState>((set) => ({
  items: [],
  profile: null,
  isLoading: false,
  error: null,

  loadItems: async () => {
    set({ isLoading: true, error: null });

    try {
      // 백엔드 연결 시 아래 호출로 더미 데이터 대입을 교체합니다.
      // const response = await backendApi.closet.getItems();
      // const items = response.data.data.items.map(mapApiItemToClosetItem);
      // set({ items });
      set((state) => {
        const previewItems = state.items.filter((item) =>
          item.id.startsWith("preview-"),
        );

        return { items: [...previewItems, ...dummyClosetItems] };
      });
    } catch {
      set({ error: "아이템을 불러오지 못했습니다." });
    } finally {
      set({ isLoading: false });
    }
  },

  loadProfile: async () => {
    set({ isLoading: true, error: null });

    try {
      // 백엔드 연결 시 응답의 공개 사용자 정보만 useAuthStore에 저장합니다.
      // const response = await backendApi.profile.getMe();
      // useAuthStore.getState().setUser(response.data.data);
      // set({ profile: response.data.data });
      const storedUser = useAuthStore.getState().user;
      set({ profile: storedUser ?? dummyUser });
    } catch {
      set({ error: "사용자 정보를 불러오지 못했습니다." });
    } finally {
      set({ isLoading: false });
    }
  },

  createItem: async (input) => {
    set({ isLoading: true, error: null });

    try {
      // 백엔드 연결 시 아래 호출 결과를 items에 추가합니다.
      // const response = await backendApi.closet.createItem(toCreateMyItemRequest(input));
      // const createdItem = await loadCreatedItem(response.data.data.myItemId);
      const createdItem: ClosetItem = {
        ...input,
        id: `preview-${Date.now()}`,
        colorHex: input.colorHex ?? "#d7cec2",
        brandName: input.brandName ?? null,
        material: input.material ?? "미입력",
        purchaseDate: input.purchaseDate ?? null,
        purchasePrice: input.purchasePrice ?? null,
        memo: input.memo ?? null,
      };

      set((state) => ({ items: [createdItem, ...state.items] }));
      return createdItem;
    } catch (error) {
      set({ error: "아이템을 등록하지 못했습니다." });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addCreatedItem: (item) =>
    set((state) => ({
      items: [item, ...state.items.filter((existing) => existing.id !== item.id)],
    })),

  updateItemImage: (itemId, imageUrl) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, imageUrl } : item,
      ),
    })),
}));
