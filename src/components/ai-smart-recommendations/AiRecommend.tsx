"use client";

import Button from "@/components/common/button/Button";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AiRecommendPage() {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <MobileScreenLayout contentClassName="relative min-h-full bg-white px-6 pb-[104px] pt-[72px] text-[#17181d]">
      <div className="absolute left-6 top-4 z-10">
        <BackButton fallbackHref="/personalize/condition" />
      </div>

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

      <LuxuryReveal
        className="absolute bottom-[28px] left-6 right-6"
        delay={210}
      >
        <section>
          <Button
            variant="cta"
            className="w-full"
            onClick={() => setIsConfirmOpen(true)}
          >
            이 스타일로 결정
          </Button>
        </section>
      </LuxuryReveal>

      {isConfirmOpen ? (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 px-6 py-6"
          role="presentation"
          onClick={() => setIsConfirmOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-recommend-confirm-title"
            className="w-full max-w-[320px] rounded-[24px] bg-white px-5 py-6 text-[#17181d] shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p
              id="ai-recommend-confirm-title"
              className="text-[17px] font-bold leading-[1.35] tracking-[-0.03em]"
            >
              스타일을 저장할까요?
            </p>
            <p className="mt-2 text-[13px] leading-[1.5] text-[#777780]">
              컬렉션에서 다시 볼 수 있어요.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Button
                type="button"
                variant="cta"
                className="h-[48px] rounded-[14px] text-[14px]"
                onClick={() => router.push("/place")}
              >
                저장하기
              </Button>
              <Button
                type="button"
                className="h-[48px] rounded-[14px] !border-0 bg-white text-[14px] font-bold text-[#17181d]"
                onClick={() => {
                  setIsConfirmOpen(false);
                  router.back();
                }}
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </MobileScreenLayout>
  );
}
