"use client";

import Button from "@/components/common/button/Button";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";

export default function AiRecommendPage() {
  return (
    <MobileScreenLayout contentClassName="flex min-h-full flex-col bg-white px-6 pb-[28px] pt-[48px] text-[#17181d]">
      <LuxuryReveal>
        <p className="text-[11px] font-bold leading-none tracking-[0.04em] text-[#8b7355]">
          AI RECOMMEND
        </p>
        <h1 className="mt-2 text-[28px] font-bold leading-[1.14] tracking-[-0.04em] text-[#15151a]">
          스마트 착용 추천
        </h1>
        <p className="mt-2 text-[13px] font-normal leading-none text-[#777780]">
          내 아이템을 중심으로 코디해요
        </p>
      </LuxuryReveal>

      <LuxuryReveal className="mt-[32px]" delay={70}>
        <section className="flex h-[350px] items-center justify-center rounded-[28px] bg-[#ece8e1]">
          <p className="text-[15px] font-bold tracking-[0.02em] text-[#b3a590]">
            OUTFIT PREVIEW
          </p>
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-[47px]" delay={140}>
        <section className="rounded-[20px] border border-[#e1e2e6] bg-[#f8f8f9] px-4 py-[22px]">
          <p className="text-[13px] font-bold leading-none text-[#15151a]">
            보유 아이템 2개 활용
          </p>
          <p className="mt-[18px] text-[12px] leading-none text-[#888890]">
            매치도 92% · 예상 착용 8회
          </p>
        </section>
      </LuxuryReveal>

      <LuxuryReveal className="mt-auto pt-[120px]" delay={210}>
        <section>
          <Button variant="cta" href="/recommendations" className="w-full">
            이 스타일로 결정
          </Button>
        </section>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
