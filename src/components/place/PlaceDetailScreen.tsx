"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { usePlaceStore } from "@/store/usePlaceStore";

type PlaceDetailScreenProps = {
  placeId: string;
};

export function PlaceDetailScreen({ placeId }: PlaceDetailScreenProps) {
  const places = usePlaceStore((state) => state.places);
  const savedPlaceIds = usePlaceStore((state) => state.savedPlaceIds);
  const pendingPlaceIds = usePlaceStore((state) => state.pendingPlaceIds);
  const storeError = usePlaceStore((state) => state.error);
  const toggleSavedPlace = usePlaceStore((state) => state.toggleSavedPlace);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const place = useMemo(
    () => places.find((candidate) => candidate.id === placeId),
    [placeId, places],
  );

  if (!place) {
    return (
      <MobileScreenLayout contentClassName="flex bg-white px-6 pt-[47px] pb-8">
        <div className="flex min-h-full w-full flex-col">
          <BackButton />
          <div className="mt-6">
            <ScreenHeader
              eyebrow="PLACE DETAIL"
              title="장소를 찾을 수 없어요"
              description="추천 장소 목록에서 다시 선택해 주세요"
            />
          </div>
          <Link
            href="/place"
            className="mt-auto flex h-[52px] items-center justify-center rounded-[14px] bg-[#0e0e12] text-[14px] font-bold text-white"
          >
            장소 추천으로 돌아가기
          </Link>
        </div>
      </MobileScreenLayout>
    );
  }

  const isSaved = savedPlaceIds.includes(place.id);
  const isSaving = pendingPlaceIds.includes(place.id);
  const walkingLabel =
    place.walkingMinutes === null ? "이동 시간 확인" : `도보 ${place.walkingMinutes}분`;

  const handleToggleSaved = async () => {
    setActionMessage(null);
    try {
      const nextSaved = await toggleSavedPlace(place.id);
      setActionMessage(nextSaved ? "장소를 저장했어요." : "저장을 취소했어요.");
    } catch {
      setActionMessage("장소 저장 상태를 변경하지 못했어요.");
    }
  };

  return (
    <MobileScreenLayout
      figmaNodeId="390:185"
      contentClassName="flex bg-white px-6 pt-[47px] pb-8"
    >
      <div className="flex min-h-full w-full flex-col">
        <LuxuryReveal>
          <Link
            href="/place"
            aria-label="장소 매치 페이지로 이동"
            className="flex size-9 items-center justify-center rounded-full border border-white bg-white text-[#55555d] shadow-[0_5px_18px_rgba(36,31,25,0.06)]"
          >
            <span aria-hidden="true" className="pb-1.5 text-[26px] leading-none">
              ‹
            </span>
          </Link>
          <div className="mt-6">
            <ScreenHeader
              eyebrow="PLACE DETAIL"
              title={place.name}
              description={`${place.area} · ${place.category} · ${walkingLabel}`}
            />
          </div>
        </LuxuryReveal>

        <LuxuryReveal className="mt-8" delay={60}>
          <div
            role="img"
            aria-label={`${place.name} 장소 이미지`}
            className="h-[260px] w-full rounded-[18px]"
            style={{
              backgroundColor: place.thumbnailColor,
              backgroundImage:
                "linear-gradient(145deg, rgba(255,255,255,0.45), transparent 48%, rgba(14,14,18,0.06))",
            }}
          />
        </LuxuryReveal>

        <LuxuryReveal className="mt-8" delay={110}>
          <h2 className="text-[14px] leading-5 font-bold text-[#0e0e12]">
            {place.summary}
          </h2>
          <div className="mt-6 text-[13px] leading-[18px] text-[#6e707a]">
            <p>영업시간 {place.businessHours}</p>
            <p>{place.address}</p>
          </div>
          {actionMessage || storeError ? (
            <p
              role="status"
              className="mt-4 text-[11px] text-[#7a6650]"
            >
              {actionMessage ?? storeError}
            </p>
          ) : null}
        </LuxuryReveal>

        <LuxuryReveal className="mt-auto space-y-4 pt-8" delay={170}>
          <button
            type="button"
            disabled={isSaving}
            className="flex h-[52px] w-full items-center justify-center rounded-[14px] border border-[#dbdee3] bg-white text-[14px] font-bold text-[#0e0e12] disabled:opacity-50"
            onClick={() => void handleToggleSaved()}
          >
            {isSaving ? "처리 중..." : isSaved ? "저장 취소" : "장소 저장"}
          </button>
          <Link
            href={`/place/${encodeURIComponent(place.id)}/recommendations`}
            className="flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#0e0e12] text-[14px] font-bold text-white"
          >
            이 장소에 맞는 제품 보기
          </Link>
        </LuxuryReveal>
      </div>
    </MobileScreenLayout>
  );
}
