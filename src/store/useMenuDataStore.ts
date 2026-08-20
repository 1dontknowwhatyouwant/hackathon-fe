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
  ItemUpdateInput,
} from "@/types/menu";
import type {
  ItemCategory,
  MyItemDetail,
  MyItemSummary,
} from "@/types/api";

const useApiMocks = process.env.NEXT_PUBLIC_USE_API_MOCKS !== "false";

const itemCategoryLabels: Record<ItemCategory, string> = {
  BAG: "가방",
  LEATHER_GOODS: "가죽 소품",
  FASHION_ACCESSORY: "패션 액세서리",
  CLOTHING: "의류",
  SHOES: "신발",
};

function mapApiItemToClosetItem(item: MyItemSummary): ClosetItem {
  return {
    id: item.myItemId,
    name: item.name,
    category: itemCategoryLabels[item.category],
    color: item.primaryColor ?? "미입력",
    colorHex: "#d7cec2",
    imageUrl: item.primaryImageUrl ?? undefined,
    brandName: item.brandName,
    material: item.material ?? "미입력",
    purchaseDate: null,
    purchasePrice: null,
    memo: null,
    createdAt: item.createdAt,
  };
}

function mapApiItemDetailToClosetItem(item: MyItemDetail): ClosetItem {
  return {
    ...mapApiItemToClosetItem({
      myItemId: item.myItemId,
      name: item.name,
      brandName: item.brandName,
      category: item.category,
      primaryColor: item.primaryColor,
      material: item.material,
      primaryImageUrl: item.images[0]?.url ?? null,
      createdAt: item.createdAt,
    }),
    purchaseDate: item.purchaseDate,
    purchasePrice: item.purchasePrice,
    memo: item.memo,
    version: item.version,
  };
}

function replaceItem(items: ClosetItem[], nextItem: ClosetItem) {
  const hasItem = items.some((item) => item.id === nextItem.id);

  if (!hasItem) {
    return [nextItem, ...items];
  }

  return items.map((item) => (item.id === nextItem.id ? nextItem : item));
}

type MenuDataState = {
  items: ClosetItem[];
  profile: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  loadItem: (itemId: string) => Promise<ClosetItem | null>;
  loadProfile: () => Promise<void>;
  createItem: (input: ItemCreateInput) => Promise<ClosetItem>;
  updateItem: (
    itemId: string,
    input: ItemUpdateInput,
  ) => Promise<ClosetItem>;
  addCreatedItem: (item: ClosetItem) => void;
  updateItemImage: (itemId: string, imageUrl: string) => void;
};

export const useMenuDataStore = create<MenuDataState>((set, get) => ({
  items: useApiMocks ? dummyClosetItems : [],
  profile: useApiMocks ? dummyUser : null,
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
        const currentItems = new Map(
          state.items.map((item) => [item.id, item] as const),
        );
        const previewItems = state.items.filter((item) =>
          item.id.startsWith("preview-"),
        );
        const mockItems = dummyClosetItems.map(
          (item) => currentItems.get(item.id) ?? item,
        );

        return { items: [...previewItems, ...mockItems] };
      });
    } catch {
      set({ error: "아이템을 불러오지 못했습니다." });
    } finally {
      set({ isLoading: false });
    }
  },

  loadItem: async (itemId) => {
    set({ isLoading: true, error: null });

    try {
      if (!useApiMocks) {
        const response = await backendApi.closet.getItem(itemId);
        const item = mapApiItemDetailToClosetItem(response.data.data);
        set((state) => ({ items: replaceItem(state.items, item) }));
        return item;
      }

      const stateItem = get().items.find((item) => item.id === itemId);
      const item =
        stateItem ?? dummyClosetItems.find((candidate) => candidate.id === itemId);

      if (item) {
        set((state) => ({ items: replaceItem(state.items, item) }));
      }

      return item ?? null;
    } catch {
      set({ error: "아이템 정보를 불러오지 못했습니다." });
      return null;
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

  updateItem: async (itemId, input) => {
    set({ isLoading: true, error: null });

    try {
      const currentItem = get().items.find((item) => item.id === itemId);

      if (!useApiMocks) {
        let version = currentItem?.version;

        if (version === undefined) {
          const detailResponse = await backendApi.closet.getItem(itemId);
          version = detailResponse.data.data.version;
        }

        const response = await backendApi.closet.updateItem(itemId, {
          ...input,
          version,
        });
        const updatedItem = mapApiItemDetailToClosetItem(response.data.data);
        set((state) => ({ items: replaceItem(state.items, updatedItem) }));
        return updatedItem;
      }

      const fallbackItem = dummyClosetItems.find((item) => item.id === itemId);
      const sourceItem = currentItem ?? fallbackItem;

      if (!sourceItem) {
        throw new Error("수정할 아이템을 찾을 수 없습니다.");
      }

      const updatedItem: ClosetItem = {
        ...sourceItem,
        ...input,
        category: itemCategoryLabels[input.category],
        version: (sourceItem.version ?? 0) + 1,
      };

      set((state) => ({ items: replaceItem(state.items, updatedItem) }));
      return updatedItem;
    } catch (error) {
      set({ error: "아이템 정보를 수정하지 못했습니다." });
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
