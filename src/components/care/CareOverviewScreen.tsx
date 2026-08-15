import { DetailActionCard } from "@/components/common/card/DetailActionCard";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { dummyCareGuide } from "@/data/closetCare";

export function CareOverviewScreen() {
  const intervalDays = dummyCareGuide.schedule.recommendedIntervalDays;
  const intervalWeeks = intervalDays ? Math.round(intervalDays / 7) : null;

  return (
    <MobileScreenLayout
      figmaNodeId="96:506"
      contentClassName="bg-white px-6 pt-[47px] pb-[102px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <LuxuryReveal>
        <ScreenHeader
          eyebrow="CARE"
          title="맞춤 관리 가이드"
          description="가죽 컨디션에 맞춘 오늘의 관리"
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-[31px]" delay={70}>
        <section
          aria-labelledby="today-care-title"
          className="h-[150px] rounded-[24px] bg-[#edeae5] px-5 pt-[29px]"
        >
          <p className="text-[11px] font-bold text-[#8b7355]">TODAY</p>
          <h2
            id="today-care-title"
            className="mt-[15px] text-[21px] leading-[28px] font-bold tracking-[-0.035em] text-[#15151a]"
          >
            <span className="block">부드러운 마른 천으로</span>
            <span className="block">표면 먼지를 제거해 주세요</span>
          </h2>
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-[30px]" delay={120}>
        <section aria-label="관리 세부 안내" className="space-y-5">
          <DetailActionCard
            href="/screen27"
            title={`권장 관리 주기 · ${intervalWeeks ? `${intervalWeeks}주` : "확인 중"}`}
          />
          <DetailActionCard title="피해야 할 환경 · 습기" />
          <DetailActionCard title="추천 보관법 보기" />
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-[100px]" delay={180}>
        <button
          type="button"
          disabled
          aria-describedby="care-record-unavailable"
          className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#15151a] text-[15px] font-bold text-white"
        >
          관리 완료 기록
        </button>
        <span id="care-record-unavailable" className="sr-only">
          관리 기록 기능은 현재 MVP 범위에 포함되지 않습니다.
        </span>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
