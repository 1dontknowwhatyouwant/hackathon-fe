import { api } from "@/lib/axios";
import type {
  ApiSuccessResponse,
  PurchaseUtilityAnalysis,
} from "@/types/api";

export const utilityApi = {
  getPurchaseUtilityAnalysis: (
    analysisId: string,
    signal?: AbortSignal,
  ) =>
    api.get<ApiSuccessResponse<PurchaseUtilityAnalysis>>(
      `/purchase-utility-analyses/${analysisId}`,
      { signal },
    ),
};
