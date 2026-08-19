"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { PlaceKeywords } from "@/components/place/PlaceKeywords";
import { PlaceList } from "@/components/place/PlaceList";
import { PlaceMap } from "@/components/place/PlaceMap";
import { backendApi } from "@/services/api";
import { usePlaceStore } from "@/store/usePlaceStore";
import type { ApiPlaceRecommendation } from "@/types/api";
import type { PlaceRecommendation } from "@/types/place";

type PlaceResultScreenProps = {
  keywords: string[];
  places: PlaceRecommendation[];
  stylePlanId?: string;
  latitude?: number;
  longitude?: number;
};

function mapBackendPlace(
  recommendation: ApiPlaceRecommendation,
  fallbackArea: string,
): PlaceRecommendation {
  return {
    id: recommendation.place.placeId,
    name: recommendation.place.name,
    description: recommendation.reasonCode,
    category: recommendation.place.categoryName,
    area:
      recommendation.place.roadAddress ??
      recommendation.place.address ??
      fallbackArea,
    coordinates: {
      latitude: recommendation.place.latitude,
      longitude: recommendation.place.longitude,
    },
  };
}

export function PlaceResultScreen({
  keywords,
  places,
  stylePlanId,
  latitude,
  longitude,
}: PlaceResultScreenProps) {
  const router = useRouter();
  const hasBackendRequest =
    Boolean(stylePlanId) && latitude !== undefined && longitude !== undefined;
  const [displayPlaces, setDisplayPlaces] = useState(places);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>();
  const [detailReadyPlaceId, setDetailReadyPlaceId] = useState<string>();
  const [isLoading, setIsLoading] = useState(hasBackendRequest);
  const [error, setError] = useState<string | null>(null);
  const registerPlaces = usePlaceStore((state) => state.registerPlaces);

  useEffect(() => {
    registerPlaces(displayPlaces);
  }, [displayPlaces, registerPlaces]);

  useEffect(() => {
    if (
      !stylePlanId ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return;
    }

    const controller = new AbortController();

    void backendApi.intelligence
      .recommendPlaces(
        stylePlanId,
        {
          query: null,
          category: null,
          latitude,
          longitude,
        },
        controller.signal,
      )
      .then(({ data }) => {
        const nextPlaces = data.data.places.map((recommendation) =>
          mapBackendPlace(recommendation, keywords[0] ?? "추천 지역"),
        );

        setDisplayPlaces(nextPlaces);
        setSelectedPlaceId(undefined);
        setDetailReadyPlaceId(undefined);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("장소 좌표를 불러오지 못해 미리보기 위치를 표시합니다.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [keywords, latitude, longitude, stylePlanId]);

  const handlePlaceSelect = (place: PlaceRecommendation) => {
    if (detailReadyPlaceId === place.id) {
      router.push(`/place/${encodeURIComponent(place.id)}`);
      return;
    }

    setSelectedPlaceId(place.id);
    setDetailReadyPlaceId(place.id);
  };

  const handleMarkerSelect = (place: PlaceRecommendation) => {
    setSelectedPlaceId(place.id);
    setDetailReadyPlaceId(undefined);
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
        {isLoading ? (
          <p className="mb-3 text-[11px] text-[#777780]">백엔드에서 추천 장소 좌표를 불러오고 있습니다.</p>
        ) : null}
        {error ? (
          <p role="status" className="mb-3 text-[11px] text-[#9a6d45]">{error}</p>
        ) : null}
        <PlaceList
          places={displayPlaces}
          selectedPlaceId={selectedPlaceId}
          detailReadyPlaceId={detailReadyPlaceId}
          onPlaceSelect={handlePlaceSelect}
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-[52px]" delay={140}>
        <PlaceMap
          places={displayPlaces}
          areaLabel={displayPlaces[0]?.area ?? keywords[0]}
          selectedPlaceId={selectedPlaceId}
          onMarkerSelect={handleMarkerSelect}
        />
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
