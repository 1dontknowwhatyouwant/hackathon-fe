"use client";

import type { PlaceRecommendation } from "@/types/place";

type PlaceCardProps = {
  place: PlaceRecommendation;
  index: number;
  selected?: boolean;
  onSelect?: (place: PlaceRecommendation) => void;
};

export function PlaceCard({
  place,
  index,
  selected = false,
  onSelect,
}: PlaceCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${place.name}, 지도에서 위치 확인`}
      onClick={() => onSelect?.(place)}
      className="flex h-[72px] w-full items-center rounded-[16px] border border-[#dedee2] bg-[#f8f8f9] px-[13px] text-left transition hover:border-[#c8c2b9] hover:bg-[#f5f3f0]"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-[#e9e5df] text-[11px] font-bold text-[#8b7355]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="ml-4 min-w-0 flex-1">
        <span className="block truncate text-[14px] leading-[17px] font-bold text-[#15151a]">
          {place.name}
        </span>
        <span className="mt-[7px] block truncate text-[11px] leading-[13px] text-[#888890]">
          {place.description}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="ml-3 text-[22px] leading-none text-[#777780]"
      >
        ›
      </span>
    </button>
  );
}
