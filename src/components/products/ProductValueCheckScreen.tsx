"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { DetailActionCard } from "@/components/common/card/DetailActionCard";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { AnimatedCounter } from "@/components/common/motion/AnimatedCounter";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { backendApi } from "@/services/api";
import type { PurchaseUtilityAnalysis } from "@/types/api";
import type { RecommendedProduct } from "@/types/product";

type ProductValueCheckScreenProps = {
  product: RecommendedProduct;
};

type UtilityViewModel = {
  score: number;
  preferenceTagFitScore: number;
  styleCombinationScore: number;
  seasonUsabilityScore: number;
  ownedCategoryCombinationScore: number;
  summary: string;
};

const useApiMocks = process.env.NEXT_PUBLIC_USE_API_MOCKS !== "false";

function toMockAnalysis(product: RecommendedProduct): UtilityViewModel {
  return {
    score: product.valueScore,
    preferenceTagFitScore: product.preferenceTagFitScore,
    styleCombinationScore: product.styleCombinationScore,
    seasonUsabilityScore: product.seasonUsabilityScore,
    ownedCategoryCombinationScore: product.ownedCategoryCombinationScore,
    summary: "내 아이템과 취향, 보유 카테고리, 계절 활용성을 기준으로 계산했습니다.",
  };
}

function toViewModel(analysis: PurchaseUtilityAnalysis): UtilityViewModel {
  return {
    score: analysis.utilityScore,
    preferenceTagFitScore: analysis.factors.preferenceTagFitScore,
    styleCombinationScore: analysis.factors.styleCombinationScore,
    seasonUsabilityScore: analysis.factors.seasonUsabilityScore,
    ownedCategoryCombinationScore:
      analysis.factors.ownedCategoryCombinationScore,
    summary: analysis.summary,
  };
}

export function ProductValueCheckScreen({
  product,
}: ProductValueCheckScreenProps) {
  const [analysis, setAnalysis] = useState<UtilityViewModel | null>(
    useApiMocks ? toMockAnalysis(product) : null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (useApiMocks) {
      return;
    }

    const controller = new AbortController();

    void backendApi.utility
      .analyzePurchaseUtility(
        { productId: product.id },
        controller.signal,
      )
      .then(({ data }) => setAnalysis(toViewModel(data.data)))
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("활용 가능성을 계산하지 못했습니다. 다시 시도해 주세요.");
        }
      });

    return () => controller.abort();
  }, [product]);

  return (
    <MobileScreenLayout
      figmaNodeId="1:467"
      contentClassName="px-6 pt-4 pb-8"
    >
      <LuxuryReveal>
        <BackButton fallbackHref={`/recommendations/${product.id}`} />
      </LuxuryReveal>

      <LuxuryReveal className="mt-5" delay={40}>
        <ScreenHeader
          eyebrow="VALUE CHECK"
          title="구매 전 활용 가능성"
          description="AI 없이 서버의 규칙 기반 점수로 내 옷장 활용도를 계산해요."
        />
      </LuxuryReveal>

      {!analysis && !error ? (
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

          <LuxuryReveal className="mt-11" delay={390}>
            <Link
              href={`/recommendations/${product.id}/analysis`}
              className="flex h-[52px] w-full items-center justify-center rounded-[16px] bg-[#15151a] text-[15px] font-bold text-white transition-colors hover:bg-[#2a2a30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]"
            >
              상세 리포트 보기
            </Link>
          </LuxuryReveal>

        </>
      ) : null}
    </MobileScreenLayout>
  );
}
