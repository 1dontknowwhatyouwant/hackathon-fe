"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ImageGridCard,
  ImageGridSkeleton,
} from "@/components/common/card/ImageGridCard";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { useMenuDataStore } from "@/store/useMenuDataStore";

const categoryFilters = ["전체", "상의", "하의", "아우터", "신발", "가방"] as const;

type CategoryFilter = (typeof categoryFilters)[number];

export function ItemsScreen() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("전체");
  const [hasLoaded, setHasLoaded] = useState(false);
  const items = useMenuDataStore((state) => state.items);
  const isLoading = useMenuDataStore((state) => state.isLoading);
  const error = useMenuDataStore((state) => state.error);
  const loadItems = useMenuDataStore((state) => state.loadItems);

  useEffect(() => {
    void loadItems().finally(() => setHasLoaded(true));
  }, [loadItems]);

  const filteredItems = useMemo(
    () =>
      selectedCategory === "전체"
        ? items
        : items.filter((item) => item.category === selectedCategory),
    [items, selectedCategory],
  );

  const isInitialLoading = !hasLoaded || (isLoading && items.length === 0);

  return (
    <MobileScreenLayout
      contentClassName="px-6 pt-[47px] pb-8"
      bottomNavigation={<BottomNavigation activeItem="items" />}
    >
      <LuxuryReveal>
        <ScreenHeader
          eyebrow="MY CLOSET"
          title="나의 아이템"
          description={`직접 등록한 아이템 ${items.length}개를 모아봤어요`}
        />
      </LuxuryReveal>

      <LuxuryReveal delay={60}>
        <div
          aria-label="내 아이템 카테고리"
          className="-mx-6 mt-[30px] flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categoryFilters.map((category) => {
            const isSelected = category === selectedCategory;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isSelected}
                className={`h-[38px] shrink-0 rounded-full border px-5 text-[12px] font-bold transition-colors ${
                  isSelected
                    ? "border-[#15151a] bg-[#15151a] text-white"
                    : "border-[#d1d1d8] bg-white text-[#55555d] hover:border-[#a8a8af]"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            );
          })}
        </div>
      </LuxuryReveal>

      <section className="mt-6" aria-live="polite">
        {error ? (
          <div
            role="alert"
            className="mb-4 rounded-[16px] bg-[#f8eeee] px-4 py-3 text-[12px] text-[#9a4545]"
          >
            {error}
          </div>
        ) : null}

        {isInitialLoading ? (
          <ImageGridSkeleton label="내 아이템을 불러오는 중" />
        ) : filteredItems.length === 0 ? (
          <p className="rounded-[18px] border border-[#dedee2] bg-[#f8f8f9] px-5 py-10 text-center text-[13px] text-[#777780]">
            이 카테고리에 등록한 아이템이 없습니다.
          </p>
        ) : (
          <ul
            aria-label="내가 등록한 아이템 목록"
            className="grid grid-cols-2 gap-x-[10px] gap-y-6"
          >
            {filteredItems.map((item, index) => (
              <li key={item.id}>
                <LuxuryReveal delay={120 + Math.floor(index / 2) * 60}>
                  <ImageGridCard
                    title={item.name}
                    subtitle={`${item.category} · ${item.color}`}
                    imageAlt={`${item.name} 아이템 이미지`}
                    imageUrl={item.imageUrl}
                    fallbackColor={item.colorHex}
                    fallbackLabel="MY ITEM"
                  />
                </LuxuryReveal>
              </li>
            ))}
          </ul>
        )}
      </section>
    </MobileScreenLayout>
  );
}
