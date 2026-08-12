import { api } from "@/lib/axios";
import type {
  ApiPage,
  ApiSuccessResponse,
  ImagePurpose,
  ItemCategory,
  MyItemDetail,
  MyItemSummary,
  PageQuery,
} from "@/types/api";

type MyItemListQuery = PageQuery & {
  keyword?: string;
  category?: ItemCategory;
  color?: string;
};

type CreateMyItemRequest = {
  linkedProductId: string | null;
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
    | "status"
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
