"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { backendApi } from "@/services/api";
import type { CareCalendar } from "@/types/api";

type CareScheduleScreenProps = { itemId?: string };

export function CareScheduleScreen({ itemId }: CareScheduleScreenProps) {
  const month = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const [calendar, setCalendar] = useState<CareCalendar | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId) return;
    void backendApi.closet.getCareCalendar(itemId, month)
      .then((response) => setCalendar(response.data.data))
      .catch(() => setError("관리 캘린더를 불러오지 못했습니다."));
  }, [itemId, month]);

  const entries = calendar ? Object.entries(calendar).filter(([key, value]) => !["myItemId", "month", "available"].includes(key) && value !== null && value !== undefined) : [];

  return (
    <MobileScreenLayout contentClassName="bg-white px-6 pt-4 pb-10">
      <div className="flex min-h-full flex-col">
        <BackButton />
        <div className="mt-5">
          <ScreenHeader
            eyebrow="REMINDER"
            title="관리 캘린더"
            description={`${month} 소재별 관리 일정`}
          />
        </div>
        {!itemId ? (
          <p className="mt-8 rounded-[16px] border border-[#dedee2] px-5 py-8 text-center text-[13px] text-[#777780]">
            내 아이템 상세에서 관리할 제품을 선택해 주세요.
          </p>
        ) : null}
        {itemId && !calendar && !error ? (
          <p className="mt-8 text-center text-[12px] text-[#777780]">
            관리 일정을 불러오는 중입니다.
          </p>
        ) : null}
        {error ? (
          <p
            role="alert"
            className="mt-8 rounded-[14px] bg-[#f8eeee] px-4 py-3 text-[12px] text-[#9a4545]"
          >
            {error}
          </p>
        ) : null}
        {calendar ? (
          <section className="mt-8 space-y-4">
            {!calendar.available ? (
              <p className="rounded-[16px] bg-[#f8f8f9] px-5 py-8 text-center text-[13px] text-[#777780]">
                구매일 또는 소재 정보가 없어 일정을 계산할 수 없습니다.
              </p>
            ) : null}
            {entries.map(([key, value]) => (
              <div
                key={key}
                className="rounded-[16px] border border-[#dedee2] bg-[#f8f8f9] px-4 py-4"
              >
                <p className="text-[10px] font-bold text-[#8b7355]">{key}</p>
                <p className="mt-2 whitespace-pre-wrap text-[13px] leading-5 text-[#35353b]">
                  {typeof value === "string"
                    ? value
                    : JSON.stringify(value, null, 2)}
                </p>
              </div>
            ))}
          </section>
        ) : null}
        <div className="mt-auto pt-8">
          <Link
            href={
              itemId
                ? `/care/guide?itemId=${encodeURIComponent(itemId)}`
                : "/care/guide"
            }
            className="flex h-[52px] items-center justify-center rounded-[14px] bg-[#15151a] text-[14px] font-bold text-white"
          >
            관리 가이드로 이동
          </Link>
        </div>
      </div>
    </MobileScreenLayout>
  );
}
