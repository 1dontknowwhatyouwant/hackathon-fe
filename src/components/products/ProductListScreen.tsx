"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { ProductList } from "@/components/products/ProductList";
import { useProductRecommendationStore } from "@/store/useProductRecommendationStore";
import { featureTags, occasionTags, productTagLabels, seasonTags, type CurrentSeasonTag, type FeatureTag, type OccasionTag } from "@/types/api";
import type { RecommendationCriteria } from "@/types/product";

const selectableSeasons = seasonTags.filter((season): season is CurrentSeasonTag => season !== "ALL_SEASON");

export function ProductListScreen() {
  const router = useRouter();
  const cleanupRef = useRef<(() => void) | null>(null);
  const [hasRequested, setHasRequested] = useState(false);
  const [criteria, setCriteria] = useState<RecommendationCriteria>({ occasion: "", season: "", preferredFeatures: [] });
  const products = useProductRecommendationStore((state) => state.products);
  const status = useProductRecommendationStore((state) => state.status);
  const error = useProductRecommendationStore((state) => state.error);
  const loadRecommendations = useProductRecommendationStore((state) => state.loadRecommendations);
  const canSubmit = Boolean(criteria.occasion && criteria.season && criteria.preferredFeatures.length > 0);

  useEffect(() => () => cleanupRef.current?.(), []);

  const submit = () => {
    if (!canSubmit) return;
    setHasRequested(true);
    cleanupRef.current?.();
    cleanupRef.current = loadRecommendations(criteria);
  };

  const toggleFeature = (feature: FeatureTag) => setCriteria((current) => ({ ...current, preferredFeatures: current.preferredFeatures.includes(feature) ? current.preferredFeatures.filter((item) => item !== feature) : [...current.preferredFeatures, feature] }));

  return (
    <MobileScreenLayout contentClassName="px-6 pt-[47px] pb-8" bottomNavigation={<BottomNavigation activeItem="recommendation" />}>
      <ScreenHeader eyebrow="DISCOVER MORE" title="추천 제품" description="상황·계절·특징을 선택하면 저장된 취향과 함께 분석해요" />
      <section className="mt-7 space-y-5" aria-label="제품 추천 조건">
        <Choice title="OCCASION" values={occasionTags} selected={criteria.occasion ? [criteria.occasion] : []} label={(value) => productTagLabels.occasion[value as OccasionTag]} onClick={(value) => setCriteria((current) => ({ ...current, occasion: value as OccasionTag }))} />
        <Choice title="SEASON" values={selectableSeasons} selected={criteria.season ? [criteria.season] : []} label={(value) => productTagLabels.season[value as CurrentSeasonTag]} onClick={(value) => setCriteria((current) => ({ ...current, season: value as CurrentSeasonTag }))} />
        <Choice title="FEATURE" values={featureTags} selected={criteria.preferredFeatures} label={(value) => productTagLabels.feature[value as FeatureTag]} onClick={(value) => toggleFeature(value as FeatureTag)} />
        <button type="button" disabled={!canSubmit || status === "loading"} onClick={submit} className="flex h-[50px] w-full items-center justify-center rounded-[15px] bg-[#15151a] text-[14px] font-bold text-white disabled:opacity-40">{status === "loading" ? "추천 계산 중..." : "추천 보기"}</button>
      </section>

      <section className="mt-9" aria-live="polite">
        {hasRequested && error ? <div role="alert" className="mb-4 rounded-[16px] bg-[#f8eeee] px-4 py-3 text-[12px] text-[#9a4545]"><p>{error}</p><button type="button" className="mt-2 font-bold underline" onClick={submit}>다시 시도</button></div> : null}
        {!hasRequested ? <p className="rounded-[18px] border border-[#dedee2] bg-[#f8f8f9] px-5 py-10 text-center text-[13px] text-[#777780]">추천 조건을 선택해 주세요.</p> : <ProductList products={products} isLoading={status === "loading"} onProductSelect={(product) => router.push(`/recommendations/${product.id}`)} />}
      </section>
    </MobileScreenLayout>
  );
}

function Choice({ title, values, selected, label, onClick }: { title: string; values: readonly string[]; selected: readonly string[]; label: (value: string) => string; onClick: (value: string) => void }) {
  return <div><p className="mb-2 text-[10px] font-bold tracking-[0.08em] text-[#8b7355]">{title}</p><div className="flex flex-wrap gap-2">{values.map((value) => <button key={value} type="button" aria-pressed={selected.includes(value)} onClick={() => onClick(value)} className={`rounded-full border px-4 py-2 text-[12px] font-bold ${selected.includes(value) ? "border-[#15151a] bg-[#15151a] text-white" : "border-[#d1d1d8] bg-white text-[#55555d]"}`}>{label(value)}</button>)}</div></div>;
}
