"use client";

import { useEffect } from "react";

import { MenuPageLayout } from "@/components/common/layout/MenuPageLayout";
import { useMenuDataStore } from "@/store/useMenuDataStore";

export function ItemsScreen() {
  const items = useMenuDataStore((state) => state.items);
  const isLoading = useMenuDataStore((state) => state.isLoading);
  const error = useMenuDataStore((state) => state.error);
  const loadItems = useMenuDataStore((state) => state.loadItems);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  return (
    <MenuPageLayout
      activeItem="items"
      eyebrow="MY CLOSET"
      title="내 아이템"
      description="등록한 옷과 소품을 한곳에서 확인합니다."
    >
      {isLoading ? (
        <p className="text-sm text-[#777780]">아이템을 불러오는 중입니다.</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <ul className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-[20px] border border-[#e2ded8] bg-[#faf9f7] p-3"
          >
            <div
              className="h-24 rounded-[14px] border border-black/5"
              style={{ backgroundColor: item.colorHex }}
            />
            <p className="mt-3 truncate text-[13px] font-bold text-[#15151a]">
              {item.name}
            </p>
            <p className="mt-1 text-[10px] text-[#85858d]">
              {item.category} · {item.color}
            </p>
          </li>
        ))}
      </ul>
    </MenuPageLayout>
  );
}
