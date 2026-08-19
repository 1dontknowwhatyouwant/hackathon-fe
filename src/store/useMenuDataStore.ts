"use client";

import { create } from "zustand";

import { backendApi } from "@/services/api";
import {
  dummyClosetItems,
  dummyUser,
} from "@/data/menuPageDummies";
import { useAuthStore, type UserInfo } from "@/store/useAuthStore";
import type {
  ClosetItem,
  ItemCreateInput,
} from "@/types/menu";
import type { MyItemSummary } from "@/types/api";

const useApiMocks = process.env.NEXT_PUBLIC_USE_API_MOCKS !== "false";

function mapApiItemToClosetItem(item: MyItemSummary): ClosetItem {
  return {
    id: item.myItemId,
    name: item.name,
    category: item.category,
    color: item.primaryColor ?? "미입력",
    colorHex: "#d7cec2",
    imageUrl: item.primaryImageUrl ?? undefined,
    brandName: item.brandName,
    material: item.material ?? "미입력",
    purchaseDate: null,
    purchasePrice: null,
    memo: null,
  };
}

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
      if (!useApiMocks) {
        const response = await backendApi.closet.getItems();
        set({ items: response.data.data.items.map(mapApiItemToClosetItem) });
        return;
      }

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
      if (!useApiMocks) {
        const response = await backendApi.profile.getMe();
        const user = response.data.data;
        useAuthStore.getState().setUser(user);
        set({ profile: user });
        return;
      }

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
