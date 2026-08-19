"use client";

import { create } from "zustand";

import { placeDetails } from "@/data/placeRecommendations";
import { backendApi } from "@/services/api";
import type { ApiPlace } from "@/types/api";
import type { PlaceDetail, PlaceRecommendation } from "@/types/place";

const useApiMocks = process.env.NEXT_PUBLIC_USE_API_MOCKS !== "false";

function mapApiPlace(place: ApiPlace): PlaceDetail {
  const fallback = placeDetails.find((candidate) => candidate.id === place.placeId);

  return {
    id: place.placeId,
    name: place.name,
    description: fallback?.description ?? place.categoryName,
    category: place.categoryName,
    area: fallback?.area ?? place.roadAddress ?? place.address ?? "추천 지역",
    coordinates: {
      latitude: place.latitude,
      longitude: place.longitude,
    },
    summary:
      fallback?.summary ?? "현재 룩과 분위기가 잘 어울리는 추천 장소예요.",
    businessHours: fallback?.businessHours ?? "영업시간을 확인해 주세요",
    address: place.roadAddress ?? place.address ?? "주소 정보 없음",
    walkingMinutes: fallback?.walkingMinutes ?? null,
    recommendationCount: fallback?.recommendationCount ?? 0,
    thumbnailColor: fallback?.thumbnailColor ?? "#e8e3d9",
  };
}

function mergePlaces(current: PlaceDetail[], incoming: PlaceDetail[]) {
  const merged = new Map(current.map((place) => [place.id, place]));
  incoming.forEach((place) => merged.set(place.id, place));
  return Array.from(merged.values());
}

type PlaceState = {
  places: PlaceDetail[];
  savedPlaceIds: string[];
  pendingPlaceIds: string[];
  isLoadingSavedPlaces: boolean;
  error: string | null;
  registerPlaces: (places: PlaceRecommendation[]) => void;
  loadSavedPlaces: () => Promise<void>;
  toggleSavedPlace: (placeId: string) => Promise<boolean>;
};

export const usePlaceStore = create<PlaceState>((set, get) => ({
  places: [...placeDetails],
  savedPlaceIds: useApiMocks ? placeDetails.map((place) => place.id) : [],
  pendingPlaceIds: [],
  isLoadingSavedPlaces: false,
  error: null,

  registerPlaces: (recommendations) =>
    set((state) => {
      const details = recommendations.map((place) => {
        const existing = state.places.find((candidate) => candidate.id === place.id);
        return {
          ...existing,
          ...place,
          name: existing?.name ?? place.name,
          summary:
            existing?.summary ??
            "현재 룩과 분위기가 잘 어울리는 추천 장소예요.",
          businessHours:
            existing?.businessHours ?? "영업시간을 확인해 주세요",
          address: existing?.address ?? place.area,
          walkingMinutes: existing?.walkingMinutes ?? null,
          recommendationCount: existing?.recommendationCount ?? 0,
          thumbnailColor: existing?.thumbnailColor ?? "#e8e3d9",
        } satisfies PlaceDetail;
      });

      return { places: mergePlaces(state.places, details) };
    }),

  loadSavedPlaces: async () => {
    if (useApiMocks) {
      return;
    }

    set({ isLoadingSavedPlaces: true, error: null });
    try {
      const response = await backendApi.intelligence.getSavedPlaces({
        page: 0,
        size: 50,
      });
      const savedPlaces = response.data.data.items.map(mapApiPlace);
      set((state) => ({
        places: mergePlaces(state.places, savedPlaces),
        savedPlaceIds: savedPlaces.map((place) => place.id),
      }));
    } catch {
      set({ error: "저장한 장소를 불러오지 못했습니다." });
    } finally {
      set({ isLoadingSavedPlaces: false });
    }
  },

  toggleSavedPlace: async (placeId) => {
    const state = get();
    const isSaved = state.savedPlaceIds.includes(placeId);

    if (state.pendingPlaceIds.includes(placeId)) {
      return isSaved;
    }

    set((current) => ({
      pendingPlaceIds: [...current.pendingPlaceIds, placeId],
      error: null,
    }));

    try {
      if (!useApiMocks) {
        if (isSaved) {
          await backendApi.intelligence.removeSavedPlace(placeId);
        } else {
          await backendApi.intelligence.savePlace(placeId);
        }
      }

      set((current) => ({
        savedPlaceIds: isSaved
          ? current.savedPlaceIds.filter((id) => id !== placeId)
          : [...new Set([...current.savedPlaceIds, placeId])],
      }));
      return !isSaved;
    } catch (error) {
      set({ error: "장소 저장 상태를 변경하지 못했습니다." });
      throw error;
    } finally {
      set((current) => ({
        pendingPlaceIds: current.pendingPlaceIds.filter((id) => id !== placeId),
      }));
    }
  },
}));
