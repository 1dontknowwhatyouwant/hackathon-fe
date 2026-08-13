import { api } from "@/lib/axios";
import type {
  ApiPage,
  ApiSuccessResponse,
  CareGuide,
  ImagePurpose,
  ItemUtilization,
  ItemCategory,
  MyItemDetail,
  MyItemSummary,
  OccasionTag,
  PageQuery,
  ProductPassport,
  ReuseRecommendations,
  UsageRecord,
} from "@/types/api";

type MyItemListQuery = PageQuery & {
  keyword?: string;
  category?: ItemCategory;
  color?: string;
  view?: "ALL" | "LOW_USAGE";
};

type CreateMyItemRequest = {
  productId: string | null;
  name: string;
  brandName: string | null;
  category: ItemCategory;
  primaryColor: string;
  material: string;
  materialSource: "PRODUCT_DATA" | "USER_CONFIRMED" | "AI_ESTIMATED";
  purchaseDate: string | null;
  purchasePrice: number | null;
  memo: string | null;
  aiJobId: string | null;
};

type UpdateMyItemRequest = Partial<
  Pick<
    MyItemDetail,
    | "name"
    | "brandName"
    | "category"
    | "primaryColor"
    | "material"
    | "purchaseDate"
    | "purchasePrice"
    | "memo"
  >
> & {
  version: number;
};

type ImageUploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  publicId: string;
  expiresAt: string;
};

type CompleteImageUploadRequest = {
  purpose: ImagePurpose;
  referenceId: string | null;
  sortOrder?: number;
  publicId: string;
  secureUrl: string;
  format: "jpg" | "jpeg" | "png" | "webp";
  bytes: number;
  width: number;
  height: number;
  version: number;
  responseSignature: string;
};

type CreateUsageRecordRequest = {
  myItemIds: [string, ...string[]];
  wornAt: string;
  occasion: OccasionTag;
  placeName?: string | null;
  weatherSummary?: string | null;
  memo?: string | null;
};

type UpdateUsageRecordRequest = {
  wornAt?: string;
  occasion?: OccasionTag;
  placeName?: string | null;
  weatherSummary?: string | null;
  memo?: string | null;
  version: number;
};

export const closetApi = {
  getItems: (params: MyItemListQuery = {}) =>
    api.get<ApiSuccessResponse<ApiPage<MyItemSummary>>>("/my-items", {
      params,
    }),

  getItem: (myItemId: string) =>
    api.get<ApiSuccessResponse<MyItemDetail>>(`/my-items/${myItemId}`),

  createItem: (body: CreateMyItemRequest) =>
    api.post<ApiSuccessResponse<{ myItemId: string }>>("/my-items", body),

  updateItem: (myItemId: string, body: UpdateMyItemRequest) =>
    api.patch<ApiSuccessResponse<MyItemDetail>>(
      `/my-items/${myItemId}`,
      body,
    ),

  deleteItem: (myItemId: string) =>
    api.delete<void>(`/my-items/${myItemId}`),

  getProductPassport: (myItemId: string) =>
    api.get<ApiSuccessResponse<ProductPassport>>(
      `/my-items/${myItemId}/passport`,
    ),

  getItemUtilization: (myItemId: string) =>
    api.get<ApiSuccessResponse<ItemUtilization>>(
      `/my-items/${myItemId}/utilization`,
    ),

  getItemUsageRecords: (myItemId: string, params: PageQuery = {}) =>
    api.get<ApiSuccessResponse<ApiPage<UsageRecord>>>(
      `/my-items/${myItemId}/usage-records`,
      { params },
    ),

  getCareGuide: (myItemId: string) =>
    api.get<ApiSuccessResponse<CareGuide>>(
      `/my-items/${myItemId}/care-guide`,
    ),

  createUsageRecord: (body: CreateUsageRecordRequest) =>
    api.post<
      ApiSuccessResponse<{ usageRecordId: string; version: number }>
    >("/usage-records", body),

  getUsageRecords: (params: PageQuery = {}) =>
    api.get<ApiSuccessResponse<ApiPage<UsageRecord>>>("/usage-records", {
      params,
    }),

  getUsageRecord: (usageRecordId: string) =>
    api.get<ApiSuccessResponse<UsageRecord>>(
      `/usage-records/${usageRecordId}`,
    ),

  updateUsageRecord: (
    usageRecordId: string,
    body: UpdateUsageRecordRequest,
  ) =>
    api.patch<ApiSuccessResponse<UsageRecord>>(
      `/usage-records/${usageRecordId}`,
      body,
    ),

  deleteUsageRecord: (usageRecordId: string) =>
    api.delete<void>(`/usage-records/${usageRecordId}`),

  getReuseRecommendations: (limit = 3) =>
    api.get<ApiSuccessResponse<ReuseRecommendations>>(
      "/reuse-recommendations",
      { params: { limit } },
    ),

  createImageUploadSignature: (
    purpose: ImagePurpose,
    referenceId: string | null,
  ) =>
    api.post<ApiSuccessResponse<ImageUploadSignature>>(
      "/image-uploads/signature",
      { purpose, referenceId },
    ),

  completeImageUpload: (body: CompleteImageUploadRequest) =>
    api.post<
      ApiSuccessResponse<{
        imageId: string;
        purpose: ImagePurpose;
        url: string;
        sortOrder: number;
      }>
    >("/image-uploads/complete", body),

  deleteImage: (imageId: string) =>
    api.delete<void>(`/images/${imageId}`),
};
