import { api } from "@/lib/axios";
import type {
  ApiSuccessResponse,
  PurchaseUtilityAnalysis,
} from "@/types/api";

export type CreatePurchaseUtilityAnalysisRequest = {
  productId: string;
};

export const utilityApi = {
  analyzePurchaseUtility: (
    body: CreatePurchaseUtilityAnalysisRequest,
    signal?: AbortSignal,
  ) =>
    api.post<ApiSuccessResponse<PurchaseUtilityAnalysis>>(
      "/purchase-utility-analyses",
      body,
      { signal },
    ),

  getPurchaseUtilityAnalysis: (analysisId: string) =>
    api.get<ApiSuccessResponse<PurchaseUtilityAnalysis>>(
      `/purchase-utility-analyses/${analysisId}`,
    ),
};
