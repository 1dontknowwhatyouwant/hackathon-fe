import { api } from "@/lib/axios";
import type {
  AiJob,
  AiJobAccepted,
  ApiPage,
  ApiPlace,
  ApiPlaceRecommendation,
  ApiSuccessResponse,
  ItemCategory,
  OccasionTag,
  PageQuery,
  PlaceCategory,
  StylePlanSummary,
  StyleTag,
} from "@/types/api";

type AiJobRequest =
  | {
      type: "PREFERENCE_ANALYSIS";
      context: {
        selectedColors: string[];
        selectedCategories: ItemCategory[];
        selectedStyleTags: StyleTag[];
        language: "ko";
      };
    }
  | {
      type: "ITEM_ANALYSIS";
      imageIds: string[];
      context: { language: "ko" };
    }
  | {
      type: "STYLE_PLAN";
      context: {
        occasion: OccasionTag;
        styleTags: StyleTag[];
        styleIntensity: number;
        weatherCondition: string | null;
        prioritizeOwnedItems: boolean;
        language: "ko";
      };
    };

type CreateStylePlanRequest = {
  aiJobId: string | null;
  title: string;
  occasion: OccasionTag;
  plannedAt: string | null;
  weatherCondition: string | null;
  description: string | null;
  status: "DRAFT" | "CONFIRMED";
  ownedItems: Array<{
    myItemId: string;
    role: "MAIN" | "TOP" | "BOTTOM" | "SHOES" | "BAG" | "ACCESSORY";
    sortOrder: number;
  }>;
  recommendedProducts: Array<{
    productId: string;
    rank: number;
    reason: string;
  }>;
};

type StylePlanDetail = Pick<
  StylePlanSummary,
  "stylePlanId" | "title" | "occasion" | "plannedAt" | "status" | "createdAt"
> & {
  weatherCondition: string | null;
  description: string | null;
  generationType: "AI" | "RULE_BASED" | "MANUAL";
  ownedItems: Array<{
    myItemId: string;
    name: string;
    imageUrl: string | null;
    role: string;
    sortOrder: number;
  }>;
  recommendedProducts: Array<{
    productId: string;
    name: string;
    imageUrl: string | null;
    rank: number;
    reason: string;
  }>;
  places: ApiPlace[];
  version: number;
  updatedAt: string;
};

type PlaceSearchQuery = {
  query?: string;
  category?: PlaceCategory;
  latitude?: number;
  longitude?: number;
  radius?: number;
};

export const aiJobPollingPolicy = {
  intervalMs: 2_000,
  timeoutMs: 30_000,
  maxAttempts: 15,
} as const;

export const intelligenceApi = {
  createAiJob: (body: AiJobRequest, idempotencyKey: string) =>
    api.post<ApiSuccessResponse<AiJobAccepted>>("/ai-jobs", body, {
      headers: { "Idempotency-Key": idempotencyKey },
      timeout: 20_000,
    }),

  getAiJob: (jobId: string, signal?: AbortSignal) =>
    api.get<ApiSuccessResponse<AiJob>>(`/ai-jobs/${jobId}`, { signal }),

  createStylePlan: (body: CreateStylePlanRequest) =>
    api.post<ApiSuccessResponse<{ stylePlanId: string }>>("/style-plans", body),

  getStylePlans: (params: PageQuery = {}) =>
    api.get<ApiSuccessResponse<ApiPage<StylePlanSummary>>>("/style-plans", {
      params,
    }),

  getStylePlan: (stylePlanId: string) =>
    api.get<ApiSuccessResponse<StylePlanDetail>>(
      `/style-plans/${stylePlanId}`,
    ),

  updateStylePlan: (
    stylePlanId: string,
    body: {
      title?: string;
      plannedAt?: string | null;
      status?: StylePlanSummary["status"];
      version: number;
    },
  ) =>
    api.patch<ApiSuccessResponse<StylePlanDetail>>(
      `/style-plans/${stylePlanId}`,
      body,
    ),

  deleteStylePlan: (stylePlanId: string) =>
    api.delete<void>(`/style-plans/${stylePlanId}`),

  searchPlaces: (params: PlaceSearchQuery) =>
    api.get<ApiSuccessResponse<{ items: ApiPlace[] }>>("/places", { params }),

  recommendPlaces: (
    stylePlanId: string,
    body: {
      query: string | null;
      category: PlaceCategory | null;
      latitude: number;
      longitude: number;
      radius?: number;
    },
    signal?: AbortSignal,
  ) =>
    api.post<
      ApiSuccessResponse<{
        stylePlanId: string;
        rankingPolicyVersion: string;
        places: ApiPlaceRecommendation[];
      }>
    >(`/style-plans/${stylePlanId}/place-recommendations`, body, { signal }),

  getSavedPlaces: (params: PageQuery = {}) =>
    api.get<ApiSuccessResponse<ApiPage<ApiPlace & { savedAt: string }>>>(
      "/places/saved",
      { params },
    ),

  savePlace: (placeId: string) =>
    api.put<ApiSuccessResponse<{ placeId: string; saved: true }>>(
      `/places/${placeId}/saved`,
    ),

  removeSavedPlace: (placeId: string) =>
    api.delete<void>(`/places/${placeId}/saved`),
};
