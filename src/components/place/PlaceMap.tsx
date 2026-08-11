"use client";

import { useEffect, useRef, useState } from "react";

import type { PlaceRecommendation } from "@/types/place";

type PlaceMapProps = {
  places: PlaceRecommendation[];
  areaLabel?: string;
  selectedPlaceId?: string;
  onMarkerSelect?: (place: PlaceRecommendation) => void;
};

type MarkerEntry = {
  marker: KakaoMarker;
  position: KakaoLatLng;
  clickHandler: () => void;
};

let kakaoMapsSdkPromise: Promise<KakaoMapsNamespace> | undefined;

function loadKakaoMapsSdk(appKey: string) {
  if (window.kakao?.maps) {
    return new Promise<KakaoMapsNamespace>((resolve) => {
      window.kakao?.maps.load(() => resolve(window.kakao!.maps));
    });
  }

  if (kakaoMapsSdkPromise) {
    return kakaoMapsSdkPromise;
  }

  kakaoMapsSdkPromise = new Promise<KakaoMapsNamespace>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error("카카오 지도 SDK를 초기화하지 못했습니다."));
        return;
      }

      window.kakao.maps.load(() => resolve(window.kakao!.maps));
    };
    script.onerror = () => reject(new Error("카카오 지도 SDK를 불러오지 못했습니다."));
    document.head.appendChild(script);
  });

  return kakaoMapsSdkPromise;
}

export function PlaceMap({
  places,
  areaLabel = "추천 지역",
  selectedPlaceId,
  onMarkerSelect,
}: PlaceMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const mapsRef = useRef<KakaoMapsNamespace | null>(null);
  const markersRef = useRef(new Map<string, MarkerEntry>());
  const infoWindowRef = useRef<KakaoInfoWindow | null>(null);
  const onMarkerSelectRef = useRef(onMarkerSelect);
  const [sdkStatus, setSdkStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_JAVASCRIPT_KEY;

  useEffect(() => {
    onMarkerSelectRef.current = onMarkerSelect;
  }, [onMarkerSelect]);

  useEffect(() => {
    if (
      !appKey ||
      !mapContainerRef.current ||
      places.length === 0 ||
      mapRef.current
    ) {
      return;
    }

    let isCancelled = false;

    loadKakaoMapsSdk(appKey)
      .then((maps) => {
        if (isCancelled || !mapContainerRef.current) {
          return;
        }

        const firstPlace = places[0];
        const center = new maps.LatLng(
          firstPlace.coordinates.latitude,
          firstPlace.coordinates.longitude,
        );

        mapsRef.current = maps;
        mapRef.current = new maps.Map(mapContainerRef.current, {
          center,
          level: 5,
        });
        infoWindowRef.current = new maps.InfoWindow();
        setSdkStatus("ready");
      })
      .catch(() => {
        if (!isCancelled) {
          setSdkStatus("error");
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [appKey, places]);

  useEffect(() => {
    const maps = mapsRef.current;
    const map = mapRef.current;
    const markers = markersRef.current;

    if (sdkStatus !== "ready" || !maps || !map) {
      return;
    }

    markers.forEach(({ marker, clickHandler }) => {
      maps.event.removeListener(marker, "click", clickHandler);
      marker.setMap(null);
    });
    markers.clear();

    const bounds = new maps.LatLngBounds();

    places.forEach((place) => {
      const position = new maps.LatLng(
        place.coordinates.latitude,
        place.coordinates.longitude,
      );
      const marker = new maps.Marker({ map, position, title: place.name });
      const clickHandler = () => onMarkerSelectRef.current?.(place);

      maps.event.addListener(marker, "click", clickHandler);
      markers.set(place.id, { marker, position, clickHandler });
      bounds.extend(position);
    });

    if (places.length > 1) {
      map.setBounds(bounds);
    }

    return () => {
      markers.forEach(({ marker, clickHandler }) => {
        maps.event.removeListener(marker, "click", clickHandler);
        marker.setMap(null);
      });
      markers.clear();
    };
  }, [places, sdkStatus]);

  useEffect(() => {
    const map = mapRef.current;
    const infoWindow = infoWindowRef.current;
    const selectedPlace = places.find((place) => place.id === selectedPlaceId);
    const selectedMarker = selectedPlaceId
      ? markersRef.current.get(selectedPlaceId)
      : undefined;

    if (!map || !infoWindow || !selectedPlace || !selectedMarker) {
      infoWindow?.close();
      return;
    }

    const label = document.createElement("div");
    label.className = "px-3 py-2 text-xs font-semibold whitespace-nowrap";
    label.textContent = selectedPlace.name;

    infoWindow.setContent(label);
    infoWindow.open(map, selectedMarker.marker);
    map.panTo(selectedMarker.position);
  }, [places, sdkStatus, selectedPlaceId]);

  return (
    <section
      id="place-map"
      aria-label="추천 장소 지도"
      className="relative h-[180px] overflow-hidden rounded-[20px] border border-[#ebe7e1] bg-[#efebe5]"
    >
      <div ref={mapContainerRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute top-4 left-4 z-10 rounded-full bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur">
        <p className="text-[9px] font-bold tracking-[0.14em] text-[#8b7355]">
          PLACE MAP
        </p>
      </div>

      {!appKey && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#efebe5] px-8 text-center">
          <p className="text-xs leading-5 text-[#6f665b]">
            카카오 지도 JavaScript 키를 환경변수에 등록해 주세요.
          </p>
        </div>
      )}

      {appKey && sdkStatus === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#efebe5] text-xs text-[#6f665b]">
          지도를 불러오는 중입니다.
        </div>
      )}

      {appKey && sdkStatus === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#efebe5] px-8 text-center">
          <p className="text-xs leading-5 text-[#6f665b]">
            지도를 불러오지 못했습니다. 키와 등록 도메인을 확인해 주세요.
          </p>
        </div>
      )}

      <p className="pointer-events-none absolute right-4 bottom-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-medium tracking-[0.08em] text-[#7f7569] shadow-sm">
        {areaLabel} · SEOUL
      </p>
    </section>
  );
}
