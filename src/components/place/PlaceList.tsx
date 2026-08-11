"use client";

import { PlaceCard } from "@/components/place/PlaceCard";
import type { PlaceRecommendation } from "@/types/place";

type PlaceListProps = {
  places: PlaceRecommendation[];
  selectedPlaceId?: string;
  onPlaceSelect?: (place: PlaceRecommendation) => void;
};

export function PlaceList({
  places,
  selectedPlaceId,
  onPlaceSelect,
}: PlaceListProps) {
  return (
    <ul className="space-y-5" aria-label="추천 장소 목록">
      {places.map((place, index) => (
        <li key={place.id}>
          <PlaceCard
            place={place}
            index={index}
            selected={selectedPlaceId === place.id}
            onSelect={onPlaceSelect}
          />
        </li>
      ))}
    </ul>
  );
}
