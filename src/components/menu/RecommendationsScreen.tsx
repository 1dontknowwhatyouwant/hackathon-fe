"use client";

import { useEffect } from "react";

import { MenuPageLayout } from "@/components/menu/MenuPageLayout";
import { useMenuDataStore } from "@/store/useMenuDataStore";

export function RecommendationsScreen() {
  const recommendations = useMenuDataStore((state) => state.recommendations);
  const isLoading = useMenuDataStore((state) => state.isLoading);
  const error = useMenuDataStore((state) => state.error);
  const loadRecommendations = useMenuDataStore(
    (state) => state.loadRecommendations,
  );

  useEffect(() => {
    void loadRecommendations();
  }, [loadRecommendations]);

  return (
    <MenuPageLayout
      activeItem="recommendation"
      eyebrow="FOR YOUR STYLE"
      title="오늘의 추천"
      description="취향과 보유 아이템을 바탕으로 준비한 더미 추천입니다."
    >
      {isLoading ? (
        <p className="text-sm text-[#777780]">추천을 불러오는 중입니다.</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <ul className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <li
            key={recommendation.id}
            className="rounded-[20px] border border-[#e2ded8] bg-[#f8f6f3] p-4"
          >
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-[15px] bg-[#ded5ca] text-xs font-bold text-[#715f49]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="truncate text-sm font-bold text-[#15151a]">
                    {recommendation.title}
                  </h2>
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#8b7355]">
                    {recommendation.keyword}
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-4 text-[#777780]">
                  {recommendation.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </MenuPageLayout>
  );
}
