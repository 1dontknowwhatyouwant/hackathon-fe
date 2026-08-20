"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { backendApi } from "@/services/api";
import type { CareGuide, StorageGuide } from "@/types/api";

type CareOverviewScreenProps = { itemId?: string };

function displayEntries(data: CareGuide | StorageGuide) {
  return Object.entries(data).filter(([key, value]) => !["myItemId", "available"].includes(key) && value !== null && value !== undefined);
}

function formatValue(value: unknown) {
  if (Array.isArray(value)) return value.map(String).join(" · ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function CareOverviewScreen({ itemId }: CareOverviewScreenProps) {
  const [guide, setGuide] = useState<CareGuide | null>(null);
  const [storage, setStorage] = useState<StorageGuide | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) return;
    void Promise.all([backendApi.closet.getCareGuide(itemId), backendApi.closet.getStorageGuide(itemId)])
      .then(([guideResponse, storageResponse]) => {
        setGuide(guideResponse.data.data);
        setStorage(storageResponse.data.data);
      })
      .catch(() => setError("관리 가이드를 불러오지 못했습니다."));
  }, [itemId]);

  return (
    <MobileScreenLayout contentClassName="bg-white px-6 pt-4 pb-10">
      <BackButton />
      <div className="mt-5"><ScreenHeader eyebrow="CARE" title="맞춤 관리 가이드" description="등록된 소재를 기준으로 제공하는 관리 안내예요" /></div>
      {!itemId ? <p className="mt-8 rounded-[16px] border border-[#dedee2] px-5 py-8 text-center text-[13px] text-[#777780]">내 아이템 상세에서 관리할 제품을 선택해 주세요.</p> : null}
      {itemId && !guide && !error ? <p className="mt-8 text-center text-[12px] text-[#777780]">관리 가이드를 불러오는 중입니다.</p> : null}
      {error ? <p role="alert" className="mt-8 rounded-[14px] bg-[#f8eeee] px-4 py-3 text-[12px] text-[#9a4545]">{error}</p> : null}
      {guide ? (
        <section className="mt-8 space-y-4">
          {!guide.available ? <p className="rounded-[16px] bg-[#f8f8f9] px-5 py-8 text-center text-[13px] text-[#777780]">확정된 소재 정보가 없어 관리 가이드를 제공할 수 없습니다.</p> : null}
          {displayEntries(guide).map(([key, value]) => <div key={key} className="rounded-[16px] border border-[#dedee2] bg-[#f8f8f9] px-4 py-4"><p className="text-[10px] font-bold text-[#8b7355]">{key}</p><p className="mt-2 text-[13px] leading-5 text-[#35353b]">{formatValue(value)}</p></div>)}
          {storage && storage.available ? <><h2 className="pt-3 text-[17px] font-bold">보관 안내</h2>{displayEntries(storage).map(([key, value]) => <div key={key} className="rounded-[16px] border border-[#dedee2] px-4 py-4"><p className="text-[10px] font-bold text-[#8b7355]">{key}</p><p className="mt-2 text-[13px] leading-5 text-[#35353b]">{formatValue(value)}</p></div>)}</> : null}
          <Link href={`/care/calendar?itemId=${encodeURIComponent(itemId!)}`} className="flex h-[52px] items-center justify-center rounded-[14px] bg-[#15151a] text-[14px] font-bold text-white">관리 캘린더 보기</Link>
        </section>
      ) : null}
    </MobileScreenLayout>
  );
}
