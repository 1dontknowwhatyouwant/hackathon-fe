import { backendApi } from "@/services/api";
import { pollAiJob } from "@/services/aiJobPolling";
import type {
  PurchaseUtilityAnalysis,
  PurchaseUtilityJobResult,
} from "@/types/api";

export class PurchaseUtilityInsufficientDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PurchaseUtilityInsufficientDataError";
  }
}

function createIdempotencyKey(productId: string) {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `purchase-utility-${productId}-${Date.now()}`
  );
}

function parsePurchaseUtilityJobResult(
  value: unknown,
): PurchaseUtilityJobResult | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const result = value as {
    status?: unknown;
    analysisId?: unknown;
    message?: unknown;
  };

  if (result.status === "READY" && typeof result.analysisId === "string") {
    return { status: "READY", analysisId: result.analysisId };
  }

  if (
    result.status === "INSUFFICIENT_DATA" &&
    result.analysisId === null &&
    typeof result.message === "string"
  ) {
    return {
      status: "INSUFFICIENT_DATA",
      analysisId: null,
      message: result.message,
    };
  }

  return null;
}

export async function requestPurchaseUtilityAnalysis(
  productId: string,
  signal?: AbortSignal,
): Promise<PurchaseUtilityAnalysis> {
  const accepted = await backendApi.intelligence.createAiJob(
    { type: "PURCHASE_UTILITY", context: { productId } },
    createIdempotencyKey(productId),
  );
  const job = await pollAiJob(accepted.data.data.jobId, signal);

  if (job.status === "FAILED") {
    throw new Error(
      job.error?.message ?? "구매 전 활용 가능성 분석에 실패했습니다.",
    );
  }

  const result = parsePurchaseUtilityJobResult(job.result);
  if (!result) {
    throw new Error("구매 전 활용 가능성 분석 결과를 확인하지 못했습니다.");
  }

  if (result.status === "INSUFFICIENT_DATA") {
    throw new PurchaseUtilityInsufficientDataError(result.message);
  }

  const response = await backendApi.utility.getPurchaseUtilityAnalysis(
    result.analysisId,
    signal,
  );
  return response.data.data;
}
