"use client";

import { useState } from "react";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { PlaceKeywords } from "@/components/place/PlaceKeywords";
import { PlaceList } from "@/components/place/PlaceList";
import { PlaceMap } from "@/components/place/PlaceMap";
import type { PlaceRecommendation } from "@/types/place";

type PlaceResultScreenProps = {
  keywords: string[];
  places: PlaceRecommendation[];
};

export function PlaceResultScreen({
  keywords,
  places,
}: PlaceResultScreenProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState(
    () => places[0]?.id,
  );

  const handlePlaceSelect = (place: PlaceRecommendation) => {
    setSelectedPlaceId(place.id);
  };

  return (
    <MobileScreenLayout
      figmaNodeId="96:244"
      contentClassName="px-6 pt-[47px] pb-6"
      bottomNavigation={<BottomNavigation activeItem="home" />}
    >
      <LuxuryReveal>
        <ScreenHeader
          eyebrow="PLACE MATCH"
          title="이 룩과 어울리는 곳"
          description={<PlaceKeywords keywords={keywords} />}
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-10" delay={70}>
        <PlaceList
          places={places}
          selectedPlaceId={selectedPlaceId}
          onPlaceSelect={handlePlaceSelect}
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-[52px]" delay={140}>
        <PlaceMap
          places={places}
          areaLabel={places[0]?.area ?? keywords[0]}
          selectedPlaceId={selectedPlaceId}
          onMarkerSelect={handlePlaceSelect}
        />
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
