"use client";

import { useEffect, useState } from "react";

import { DetailActionCard } from "@/components/common/card/DetailActionCard";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { AnimatedCounter } from "@/components/common/motion/AnimatedCounter";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import {
  PurchaseUtilityInsufficientDataError,
  requestPurchaseUtilityAnalysis,
} from "@/services/purchaseUtilityWorkflow";
import type { PurchaseUtilityAnalysis } from "@/types/api";
type ProductValueCheckScreenProps = { productId?: string };

type UtilityViewModel = {
  score: number;
  preferenceTagFitScore: number;
  styleCombinationScore: number;
  seasonUsabilityScore: number;
  ownedCategoryCombinationScore: number;
  summary: string;
  compatibleItemCount: number;
  compatibleItems: PurchaseUtilityAnalysis["compatibleItems"];
  careDifficulty: PurchaseUtilityAnalysis["careDifficulty"];
  explanationGenerationType: PurchaseUtilityAnalysis["explanationGenerationType"];
};

function toViewModel(analysis: PurchaseUtilityAnalysis): UtilityViewModel {
  return {
    score: analysis.utilityScore,
    preferenceTagFitScore: analysis.factors.preferenceTagFitScore,
    styleCombinationScore: analysis.factors.styleCombinationScore,
    seasonUsabilityScore: analysis.factors.seasonUsabilityScore,
    ownedCategoryCombinationScore:
      analysis.factors.ownedCategoryCombinationScore,
    summary: analysis.summary,
    compatibleItemCount: analysis.compatibleItemCount,
    compatibleItems: analysis.compatibleItems,
    careDifficulty: analysis.careDifficulty,
    explanationGenerationType: analysis.explanationGenerationType,
  };
}

export function ProductValueCheckScreen({ productId }: ProductValueCheckScreenProps) {
  const [analysis, setAnalysis] = useState<UtilityViewModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      return;
    }

    const controller = new AbortController();

    void requestPurchaseUtilityAnalysis(productId, controller.signal)
      .then((result) => setAnalysis(toViewModel(result)))
      .catch((analysisError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            analysisError instanceof PurchaseUtilityInsufficientDataError
              ? analysisError.message
              : "활용 가능성을 계산하지 못했습니다. 다시 시도해 주세요.",
          );
        }
      });

    return () => controller.abort();
  }, [productId]);

  return (
    <MobileScreenLayout
      figmaNodeId="1:467"
      contentClassName="px-6 pt-4 pb-8"
    >
      <LuxuryReveal>
        <BackButton />
      </LuxuryReveal>

      <LuxuryReveal className="mt-5" delay={40}>
        <ScreenHeader
          eyebrow="VALUE CHECK"
          title="구매 전 활용 가능성"
          description="AI 없이 서버의 규칙 기반 점수로 내 옷장 활용도를 계산해요."
        />
      </LuxuryReveal>

      {!productId ? (
        <div className="mt-12 space-y-3 rounded-[18px] border border-[#dedee2] bg-[#f8f8f9] px-4 py-4">
          <p className="text-[13px] font-bold text-[#15151a]">제품이 없어도 확인할 수 있어요</p>
          <p className="text-[12px] leading-5 text-[#777780]">
            지금은 특정 제품 없이 진입한 상태예요. 제품 상세에서 다시 들어오면
            아이템 기준으로 활용 가능성을 계산합니다.
          </p>
        </div>
      ) : !analysis && !error ? (
        <p className="mt-12 text-center text-[12px] text-[#777780]">활용 가능성을 계산하고 있습니다.</p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-8 rounded-[14px] bg-[#f8eeee] px-4 py-3 text-[12px] text-[#9a4545]">{error}</p>
      ) : null}

      {analysis ? (
        <>
          <LuxuryReveal className="mt-[54px] flex justify-center" delay={70}>
            <div
              role="img"
              aria-label={`활용 가능성 점수 ${analysis.score}점`}
              className="flex size-[188px] items-center justify-center rounded-full"
              style={{
                background:
                  "repeating-conic-gradient(from -18deg, #8b7355 0deg 36deg, #e5e6e8 36deg 72deg)",
              }}
            >
              <div className="flex size-[150px] flex-col items-center justify-center rounded-full bg-white">
                <AnimatedCounter
                  value={analysis.score}
                  className="text-[50px] leading-[54px] font-bold tracking-[-0.04em] text-[#15151a] tabular-nums"
                />
                <span className="mt-[-1px] text-[11px] leading-[13px] font-bold text-[#8b7355]">
                  RULE SCORE
                </span>
              </div>
            </div>
          </LuxuryReveal>

          <p className="mt-7 rounded-[16px] bg-[#f8f6f3] px-4 py-3 text-[11px] leading-5 text-[#66666f]">
            {analysis.summary}
          </p>

          <div className="mt-7 space-y-5">
            <LuxuryReveal delay={140}>
              <DetailActionCard title={`취향 태그 일치 · ${analysis.preferenceTagFitScore}점`} />
            </LuxuryReveal>
            <LuxuryReveal delay={200}>
              <DetailActionCard title={`내 아이템과 스타일 조합 · ${analysis.styleCombinationScore}점`} />
            </LuxuryReveal>
            <LuxuryReveal delay={260}>
              <DetailActionCard title={`계절 활용성 · ${analysis.seasonUsabilityScore}점`} />
            </LuxuryReveal>
            <LuxuryReveal delay={320}>
              <DetailActionCard title={`보유 카테고리 조합 · ${analysis.ownedCategoryCombinationScore}점`} />
            </LuxuryReveal>
          </div>

          <LuxuryReveal className="mt-8" delay={380}>
            <section className="rounded-[18px] border border-[#dedee2] bg-[#f8f8f9] px-4 py-4">
              <h2 className="text-[14px] font-bold text-[#15151a]">함께 활용할 수 있는 내 아이템 {analysis.compatibleItemCount}개</h2>
              {analysis.compatibleItems.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {analysis.compatibleItems.map((item) => (
                    <li key={item.myItemId} className="rounded-[14px] bg-white px-4 py-3">
                      <p className="text-[12px] font-bold text-[#35353b]">{item.name}</p>
                      <p className="mt-1 text-[11px] leading-4 text-[#777780]">{item.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-3 text-[11px] text-[#777780]">호환 아이템이 없습니다.</p>}
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-[#dedee2] pt-4 text-[11px]">
                <div><dt className="text-[#888890]">관리 난이도</dt><dd className="mt-1 font-bold text-[#35353b]">{analysis.careDifficulty}</dd></div>
                <div><dt className="text-[#888890]">설명 생성 방식</dt><dd className="mt-1 font-bold text-[#35353b]">{analysis.explanationGenerationType}</dd></div>
              </dl>
            </section>
          </LuxuryReveal>

        </>
      ) : null}
    </MobileScreenLayout>
  );
}
