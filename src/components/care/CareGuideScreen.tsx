import Link from "next/link";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { dummyCareGuide } from "@/data/closetCare";
import { dummyClosetItems } from "@/data/menuPageDummies";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Seoul",
});

const guideIcons: Record<string, string> = {
  STORAGE: "⌂",
  CLEANING: "✦",
  MOISTURE: "◌",
};

export function CareGuideScreen() {
  const item = dummyClosetItems.find(
    (closetItem) => closetItem.id === dummyCareGuide.myItemId,
  );

  if (!item) {
    return null;
  }

  const nextCareAt = dummyCareGuide.schedule.recommendedNextCareAt;
  const intervalDays = dummyCareGuide.schedule.recommendedIntervalDays;

  return (
    <MobileScreenLayout contentClassName="bg-[#f7f5f1] px-6 pt-4 pb-10">
      <LuxuryReveal>
        <BackButton fallbackHref="/screen26" />
      </LuxuryReveal>

      <LuxuryReveal className="mt-4" delay={40}>
        <ScreenHeader
          eyebrow="CARE GUIDE"
          title="아이템 관리 가이드"
          description="소재에 맞는 관리 방법과 권장 일정을 확인해요"
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-7" delay={90}>
        <section
          aria-labelledby="care-item-title"
          className="overflow-hidden rounded-[24px] border border-[#dfdad3] bg-white p-3 shadow-[0_12px_30px_rgba(36,31,25,0.06)]"
        >
          <div
            role="img"
            aria-label={`${item.name} 아이템 이미지`}
            className="relative flex h-[190px] items-center justify-center overflow-hidden rounded-[18px]"
            style={{
              backgroundColor: item.colorHex,
              backgroundImage:
                "linear-gradient(145deg, rgba(255,255,255,0.45), transparent 48%, rgba(21,21,26,0.12))",
            }}
          >
            <span className="rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[9px] font-bold tracking-[0.16em] text-white/75 backdrop-blur-sm">
              MCM CARE
            </span>
          </div>
          <div className="flex items-end justify-between px-2 pb-2 pt-4">
            <div className="min-w-0">
              <p className="text-[9px] font-bold tracking-[0.14em] text-[#9a8060]">
                {item.brandName}
              </p>
              <h2
                id="care-item-title"
                className="mt-1 truncate text-[17px] font-bold tracking-[-0.035em] text-[#1f1f24]"
              >
                {item.name}
              </h2>
            </div>
            <span className="ml-4 shrink-0 rounded-full bg-[#ebe4da] px-3 py-[7px] text-[9px] font-bold text-[#725d43]">
              {dummyCareGuide.material}
            </span>
          </div>
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-8" delay={150}>
        <section aria-labelledby="care-schedule-title">
          <p className="text-[9px] font-bold tracking-[0.14em] text-[#9a8060]">
            CARE SCHEDULE
          </p>
          <h2
            id="care-schedule-title"
            className="mt-1 text-[20px] font-bold tracking-[-0.035em] text-[#17171b]"
          >
            권장 관리 일정
          </h2>

          <div className="mt-4 rounded-[20px] bg-[#17171c] px-5 py-5 text-white">
            {nextCareAt ? (
              <>
                <p className="text-[10px] text-white/45">다음 권장 관리일</p>
                <p className="mt-2 text-[21px] font-bold tracking-[-0.04em]">
                  {dateFormatter.format(new Date(nextCareAt))}
                </p>
              </>
            ) : (
              <>
                <p className="text-[10px] text-white/45">다음 권장 관리일</p>
                <p className="mt-2 text-[19px] font-bold tracking-[-0.035em]">
                  아직 계산 전이에요
                </p>
                <p className="mt-3 text-[10px] leading-[16px] text-white/48">
                  사용 기록이 더 쌓이면 소재와 사용 간격을 바탕으로 안내할게요.
                </p>
              </>
            )}

            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="text-[9px] text-white/38">권장 관리 주기</p>
              <p className="mt-1 text-[12px] font-bold text-[#c8ad88]">
                {intervalDays ? `${intervalDays}일마다` : "정책 산정 준비 중"}
              </p>
            </div>
          </div>
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-8" delay={210}>
        <section aria-labelledby="guide-list-title">
          <p className="text-[9px] font-bold tracking-[0.14em] text-[#9a8060]">
            MATERIAL GUIDE
          </p>
          <h2
            id="guide-list-title"
            className="mt-1 text-[20px] font-bold tracking-[-0.035em] text-[#17171b]"
          >
            레더 관리 방법
          </h2>

          {dummyCareGuide.available ? (
            <ol className="mt-4 space-y-3">
              {dummyCareGuide.guide.map((guide, index) => (
                <li
                  key={guide.code}
                  className="flex rounded-[20px] border border-[#e0dcd6] bg-white px-4 py-4"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[#eee8df] text-[18px] text-[#8b7355]">
                    {guideIcons[guide.code] ?? index + 1}
                  </span>
                  <div className="ml-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-[#b0a18e]">
                        0{index + 1}
                      </span>
                      <h3 className="text-[14px] font-bold text-[#242429]">
                        {guide.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-[11px] leading-[17px] text-[#77737a]">
                      {guide.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 rounded-[18px] bg-[#eee9e2] px-5 py-6 text-center text-[12px] text-[#777780]">
              등록된 소재 정보가 없어 관리 가이드를 제공할 수 없습니다.
            </p>
          )}
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-6" delay={270}>
        <aside className="rounded-[18px] bg-[#eae3d9] px-5 py-4">
          <p className="text-[10px] font-bold text-[#795f40]">안내</p>
          <p className="mt-2 text-[10px] leading-[16px] text-[#756f69]">
            현재 MVP는 소재별 관리 안내와 권장 일정만 제공합니다. 세척·수선 등 관리 기록은 저장하지 않습니다.
          </p>
        </aside>
      </LuxuryReveal>

      <LuxuryReveal className="mt-6" delay={320}>
        <Link
          href="/screen26"
          className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#15151a] text-[15px] font-bold text-white transition-colors hover:bg-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]"
        >
          관리 알림으로 돌아가기
        </Link>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
