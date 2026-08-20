"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/common/button/Button";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { BackButton } from "@/components/common/navigation/BackButton";
import { getApiErrorMessage } from "@/lib/apiError";
import { readStylePlanSliderContext, stylePlanIdempotencyStorageKey } from "@/lib/stylePlanDraft";
import { backendApi } from "@/services/api";
import { requestStylePlanPreview } from "@/services/stylePlanWorkflow";
import type { StylePlanSliderContext } from "@/types/api";

type PreviewItem = { myItemId: string; name: string; imageUrl: string | null; role: string; sortOrder: number };
type PreviewProduct = { productId: string; name: string; imageUrl: string | null; rank: number; reason: string };
type StylePlanPreview = { title: string; description: string | null; ownedItems: PreviewItem[]; recommendedProducts: PreviewProduct[]; generationType: "AI" | "RULE_BASED" };

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
function parsePreview(value: unknown): StylePlanPreview | null {
  if (!isRecord(value) || typeof value.title !== "string" || !Array.isArray(value.ownedItems) || !Array.isArray(value.recommendedProducts)) return null;
  return value as StylePlanPreview;
}
function getIdempotencyKey() {
  const current = sessionStorage.getItem(stylePlanIdempotencyStorageKey);
  if (current) return current;
  const key = crypto.randomUUID();
  sessionStorage.setItem(stylePlanIdempotencyStorageKey, key);
  return key;
}

export default function AiRecommendPage() {
  const router = useRouter();
  const [context, setContext] = useState<StylePlanSliderContext | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [preview, setPreview] = useState<StylePlanPreview | null>(null);
  const [status, setStatus] = useState("스타일을 분석하고 있어요.");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const nextContext = readStylePlanSliderContext();
    if (!nextContext) {
      void Promise.resolve().then(() => {
        if (!controller.signal.aborted) {
          setStatus("");
          setError("스타일 강도 설정을 확인하지 못했습니다. 다시 선택해 주세요.");
        }
      });
      return () => controller.abort();
    }
    void requestStylePlanPreview(nextContext, getIdempotencyKey(), controller.signal)
      .then((job) => {
        const result = parsePreview(job.result ?? job.fallback);
        if (!result) throw new Error(job.error?.message ?? "추천 결과 형식이 올바르지 않습니다.");
        setContext(nextContext);
        setJobId(job.jobId);
        setPreview(result);
        setStatus(result.generationType === "RULE_BASED" ? "규칙 기반 추천으로 구성했어요." : "스타일 분석이 완료됐어요.");
      })
      .catch((failure) => { if (!controller.signal.aborted) { setStatus(""); setError(getApiErrorMessage(failure, "스타일 추천을 불러오지 못했습니다.")); } })
      .finally(() => sessionStorage.removeItem(stylePlanIdempotencyStorageKey));
    return () => controller.abort();
  }, []);

  const saveStylePlan = async () => {
    if (!preview || !context || !jobId) return;
    setIsSaving(true); setError(null);
    try {
      const roles = new Set(["MAIN", "TOP", "BOTTOM", "SHOES", "BAG", "ACCESSORY"]);
      const response = await backendApi.intelligence.createStylePlan({
        aiJobId: Number(jobId), title: preview.title, occasion: context.occasion,
        plannedAt: null, weatherCondition: context.weatherCondition ?? null,
        description: preview.description, status: "CONFIRMED",
        ownedItems: preview.ownedItems.filter((item) => Number.isFinite(Number(item.myItemId)) && roles.has(item.role)).map((item) => ({ myItemId: Number(item.myItemId), role: item.role as "MAIN" | "TOP" | "BOTTOM" | "SHOES" | "BAG" | "ACCESSORY", sortOrder: item.sortOrder })),
        recommendedProducts: preview.recommendedProducts.filter((item) => Number.isFinite(Number(item.productId))).map((item) => ({ productId: Number(item.productId), rank: item.rank, reason: item.reason })),
      });
      router.replace(`/place?stylePlanId=${encodeURIComponent(response.data.data.stylePlanId)}`);
    } catch (failure) {
      setError(getApiErrorMessage(failure, "스타일 플랜을 저장하지 못했습니다."));
      setIsSaving(false);
    }
  };

  const images = preview ? [...preview.ownedItems, ...preview.recommendedProducts].filter((item) => item.imageUrl) : [];

  return (
    <MobileScreenLayout contentClassName="relative min-h-full bg-white px-6 pb-[104px] pt-[72px] text-[#17181d]">
      <div className="absolute left-6 top-4"><BackButton /></div>
      <p className="text-[11px] font-bold text-[#8b7355]">AI RECOMMEND</p>
      <h1 className="mt-2 text-[28px] font-bold">스마트 착용 추천</h1>
      <p className="mt-2 text-[13px] text-[#777780]">내 아이템을 중심으로 코디해요</p>

      <section className="mt-8">
        {status ? <p role="status" className="mb-3 text-[11px] text-[#777780]">{status}</p> : null}
        {error ? <p role="alert" className="mb-3 rounded-[12px] bg-[#f8eeee] px-3 py-3 text-[11px] text-[#9a4545]">{error}</p> : null}
        <div className="grid min-h-[350px] grid-cols-2 gap-2 overflow-hidden rounded-[28px] bg-[#ece8e1] p-3">
          {images.map((item, index) => <div key={`${item.name}-${index}`} className="rounded-[18px] bg-cover bg-center" style={{ backgroundImage: `url("${item.imageUrl}")` }} aria-label={item.name} />)}
          {!preview ? <p className="col-span-2 self-center text-center text-[13px] font-bold text-[#9a8d7a]">분석 결과를 기다리고 있어요</p> : null}
          {preview && images.length === 0 ? <p className="col-span-2 self-center text-center text-[13px] text-[#777780]">추천 이미지가 등록되지 않았습니다.</p> : null}
        </div>
      </section>

      {preview ? <section className="mt-7 rounded-[20px] border border-[#e1e2e6] bg-[#f8f8f9] px-4 py-5"><h2 className="text-[16px] font-bold">{preview.title}</h2>{preview.description ? <p className="mt-2 text-[12px] leading-5 text-[#777780]">{preview.description}</p> : null}<p className="mt-3 text-[11px] text-[#8b7355]">보유 아이템 {preview.ownedItems.length}개 · 추천 제품 {preview.recommendedProducts.length}개</p></section> : null}

      <div className="absolute bottom-7 left-6 right-6"><Button variant="cta" className="w-full" disabled={!preview || isSaving} onClick={() => void saveStylePlan()}>{isSaving ? "저장 중..." : "이 스타일로 결정"}</Button></div>
    </MobileScreenLayout>
  );
}
