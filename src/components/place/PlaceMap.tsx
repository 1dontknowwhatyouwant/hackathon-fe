"use client";

import type { PlaceRecommendation } from "@/types/place";

type PlaceMapProps = {
  places: PlaceRecommendation[];
  areaLabel?: string;
  selectedPlaceId?: string;
  onMarkerSelect?: (place: PlaceRecommendation) => void;
};

export function PlaceMap({
  places,
  areaLabel = "추천 지역",
  selectedPlaceId,
  onMarkerSelect,
}: PlaceMapProps) {
  return (
    <section
      id="place-map"
      aria-label="추천 장소 지도"
      className="relative h-[180px] overflow-hidden rounded-[20px] border border-[#ebe7e1] bg-[#efebe5]"
    >
      <div aria-hidden="true" className="absolute inset-0 opacity-80">
        <span className="absolute top-[22px] left-[-30px] h-[16px] w-[440px] rotate-[7deg] bg-white/80" />
        <span className="absolute top-[98px] left-[-34px] h-[20px] w-[430px] -rotate-[12deg] bg-white/80" />
        <span className="absolute top-[-40px] left-[86px] h-[270px] w-[14px] rotate-[18deg] bg-white/70" />
        <span className="absolute top-[-30px] right-[68px] h-[250px] w-[18px] -rotate-[20deg] bg-white/70" />
        <span className="absolute top-[59px] left-0 h-px w-full bg-[#d9d3ca]" />
        <span className="absolute top-[139px] left-0 h-px w-full bg-[#d9d3ca]" />
      </div>

      <div className="absolute top-4 left-4 z-10 rounded-full bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur">
        <p className="text-[9px] font-bold tracking-[0.14em] text-[#8b7355]">
          PLACE MAP
        </p>
      </div>

      {places.map((place, index) => {
        const isSelected = selectedPlaceId === place.id;

        return (
          <button
            key={place.id}
            type="button"
            aria-label={`${place.name} 마커`}
            aria-pressed={isSelected}
            title={place.name}
            onClick={() => onMarkerSelect?.(place)}
            className={`absolute z-20 flex -translate-x-1/2 -translate-y-full items-center justify-center rounded-full border-2 border-white font-bold shadow-[0_4px_12px_rgba(56,45,33,0.25)] transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b7355] ${
              isSelected
                ? "size-9 bg-[#15151a] text-[12px] text-white"
                : "size-7 bg-[#a88f70] text-[10px] text-white"
            }`}
            style={{
              left: `${place.mapPosition.x}%`,
              top: `${place.mapPosition.y}%`,
            }}
          >
            {index + 1}
          </button>
        );
      })}

      <p className="absolute right-4 bottom-3 text-[9px] font-medium tracking-[0.08em] text-[#a89b8a]">
        {areaLabel} · SEOUL
      </p>
    </section>
  );
}
