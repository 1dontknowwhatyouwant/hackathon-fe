import { DetailActionCard } from "@/components/common/card/DetailActionCard";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import {
  dummyItemUtilization,
  dummyRecentUsageRecords,
  dummyReuseRecommendations,
} from "@/data/closetCare";

const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "long",
  day: "numeric",
  timeZone: "Asia/Seoul",
});

const occasionLabels = {
  DAILY: "데일리",
  DATE: "데이트",
  TRAVEL: "여행",
  GATHERING: "모임",
  CEREMONY: "격식 있는 자리",
  OUTDOOR: "야외 활동",
  OTHER: "기타",
} as const;

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "사용 기록 없음";
}

export function CareOverviewScreen() {
  const recentRecord = dummyRecentUsageRecords[0];
  const reuseItem = dummyReuseRecommendations.items[0];

  return (
    <MobileScreenLayout
      contentClassName="bg-[#f7f5f1] px-6 pt-4 pb-9"
      bottomNavigation={<BottomNavigation activeItem="home" />}
    >
      <LuxuryReveal>
        <BackButton fallbackHref="/dashboard" />
      </LuxuryReveal>

      <LuxuryReveal className="mt-4" delay={40}>
        <ScreenHeader
          eyebrow="CARE & REUSE"
          title="아이템 관리 알림"
          description="사용 기록을 바탕으로 다시 꺼낼 아이템과 관리 방법을 알려드려요"
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-7" delay={90}>
        <section
          aria-labelledby="utilization-title"
          className="overflow-hidden rounded-[24px] bg-[#17171c] px-5 py-5 text-white shadow-[0_14px_32px_rgba(23,23,28,0.16)]"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-bold tracking-[0.16em] text-[#baa17f]">
                UTILIZATION
              </p>
              <h2
                id="utilization-title"
                className="mt-2 text-[19px] font-bold tracking-[-0.035em]"
              >
                Aren Shopper 활용도
              </h2>
              <p className="mt-2 text-[11px] leading-[17px] text-white/55">
                최근 사용 {formatDate(dummyItemUtilization.lastUsedAt)}
              </p>
            </div>

            <div
              role="img"
              aria-label={`활용도 ${dummyItemUtilization.utilizationScore}점`}
              className="flex size-[76px] shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#b89a72 0 ${dummyItemUtilization.utilizationScore}%, rgba(255,255,255,0.12) ${dummyItemUtilization.utilizationScore}% 100%)`,
              }}
            >
              <div className="flex size-[62px] items-baseline justify-center rounded-full bg-[#17171c] pt-[19px]">
                <strong className="text-[22px] tracking-[-0.05em]">
                  {dummyItemUtilization.utilizationScore}
                </strong>
                <span className="ml-1 text-[9px] text-white/45">점</span>
              </div>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-3 border-t border-white/10 pt-4">
            <div>
              <dt className="text-[9px] text-white/40">사용 횟수</dt>
              <dd className="mt-1 text-[15px] font-bold">
                {dummyItemUtilization.usageCount}회
              </dd>
            </div>
            <div className="border-x border-white/10 px-4">
              <dt className="text-[9px] text-white/40">마지막 사용</dt>
              <dd className="mt-1 text-[15px] font-bold">
                {dummyItemUtilization.daysSinceLastUse}일 전
              </dd>
            </div>
            <div className="pl-4">
              <dt className="text-[9px] text-white/40">활용 레벨</dt>
              <dd className="mt-1 text-[15px] font-bold">보통</dd>
            </div>
          </dl>

          <p className="mt-4 text-[9px] text-white/28">
            {dummyItemUtilization.policyVersion} · 규칙 기반 계산
          </p>
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-8" delay={150}>
        <section aria-labelledby="reuse-title">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-bold tracking-[0.14em] text-[#9a8060]">
                REUSE PICK
              </p>
              <h2
                id="reuse-title"
                className="mt-1 text-[20px] font-bold tracking-[-0.035em] text-[#17171b]"
              >
                다시 활용해볼까요?
              </h2>
            </div>
            <span className="rounded-full bg-[#ebe3d8] px-3 py-[6px] text-[9px] font-bold text-[#795f40]">
              RULE-BASED
            </span>
          </div>

          <article className="mt-4 flex items-center rounded-[20px] border border-[#e0dbd4] bg-white p-3 shadow-[0_9px_24px_rgba(36,31,25,0.05)]">
            <div
              role="img"
              aria-label={`${reuseItem.name} 아이템 이미지`}
              className="flex size-[82px] shrink-0 items-center justify-center rounded-[16px] bg-[#e9e4da] text-[9px] font-bold tracking-[0.1em] text-[#8c806f]"
            >
              MY ITEM
            </div>
            <div className="ml-4 min-w-0 flex-1">
              <h3 className="truncate text-[14px] font-bold text-[#202025]">
                {reuseItem.name}
              </h3>
              <p className="mt-2 text-[10px] text-[#8d8d94]">
                마지막 사용 {formatDate(reuseItem.lastUsedAt)} · 총 {reuseItem.usageCount}회
              </p>
              <p className="mt-3 text-[11px] font-bold text-[#8b7355]">
                한동안 쉬고 있는 아이템이에요
              </p>
            </div>
          </article>
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-8" delay={210}>
        <section aria-labelledby="recent-usage-title">
          <p className="text-[9px] font-bold tracking-[0.14em] text-[#9a8060]">
            RECENT USAGE
          </p>
          <h2
            id="recent-usage-title"
            className="mt-1 text-[20px] font-bold tracking-[-0.035em] text-[#17171b]"
          >
            최근 사용 기록
          </h2>

          <article className="mt-4 rounded-[20px] bg-[#eee9e2] px-5 py-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-bold text-[#242429]">
                  {occasionLabels[recentRecord.occasion]} · {recentRecord.placeName}
                </p>
                <p className="mt-1 text-[10px] text-[#88858a]">
                  {formatDate(recentRecord.wornAt)} · {recentRecord.weatherSummary}
                </p>
              </div>
              <span className="rounded-full bg-white/75 px-3 py-[6px] text-[9px] font-bold text-[#7b6750]">
                {recentRecord.items.length}개 조합
              </span>
            </div>
            <p className="mt-4 border-t border-black/6 pt-3 text-[11px] leading-[17px] text-[#6f6a66]">
              {recentRecord.memo}
            </p>
          </article>
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-8" delay={270}>
        <section aria-labelledby="care-guide-link-title">
          <p className="text-[9px] font-bold tracking-[0.14em] text-[#9a8060]">
            MATERIAL CARE
          </p>
          <h2
            id="care-guide-link-title"
            className="mt-1 text-[20px] font-bold tracking-[-0.035em] text-[#17171b]"
          >
            소재별 관리 안내
          </h2>
          <div className="mt-4">
            <DetailActionCard
              href="/screen27"
              title="레더 아이템 관리 가이드"
              description="보관·표면 관리·수분 주의사항 확인"
              leading={
                <span className="text-[20px] text-[#8b7355]" aria-hidden="true">
                  ◇
                </span>
              }
            />
          </div>
        </section>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
