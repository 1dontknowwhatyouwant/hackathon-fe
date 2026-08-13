import { api } from "@/lib/axios";
import type {
  ApiPage,
  ApiSuccessResponse,
  CurrentSeasonTag,
  FeatureTag,
  ItemCategory,
  OccasionTag,
  PageQuery,
  ProductDetail,
  ProductSummary,
  Recommendation,
} from "@/types/api";

type ProductListQuery = PageQuery & {
  keyword?: string;
  category?: ItemCategory[];
  color?: string[];
  minPrice?: number;
  maxPrice?: number;
};

type FavoriteProduct = ProductSummary & {
  favorited: true;
  favoritedAt: string;
};

type CreateRecommendationRequest = {
  occasion: OccasionTag;
  season: CurrentSeasonTag;
  preferredFeatures:
    | [FeatureTag]
    | [FeatureTag, FeatureTag]
    | [FeatureTag, FeatureTag, FeatureTag];
  category?: ItemCategory;
  limit?: 1 | 2 | 3;
};

export const catalogApi = {
  getProducts: (params: ProductListQuery, signal?: AbortSignal) =>
    api.get<ApiSuccessResponse<ApiPage<ProductSummary>>>("/products", {
      params,
      signal,
    }),

  getProduct: (productId: string, signal?: AbortSignal) =>
    api.get<ApiSuccessResponse<ProductDetail>>(`/products/${productId}`, {
      signal,
    }),

  createRecommendation: (
    body: CreateRecommendationRequest,
    signal?: AbortSignal,
  ) =>
    api.post<ApiSuccessResponse<Recommendation>>("/recommendations", body, {
      signal,
    }),

  getRecommendation: (recommendationId: string) =>
    api.get<ApiSuccessResponse<Recommendation>>(
      `/recommendations/${recommendationId}`,
    ),

  getFavorites: (params: PageQuery = {}) =>
    api.get<ApiSuccessResponse<ApiPage<FavoriteProduct>>>(
      "/products/favorites",
      { params },
    ),

  addFavorite: (productId: string) =>
    api.put<
      ApiSuccessResponse<{ productId: string; favorited: true }>
    >(`/products/${productId}/favorite`),

  removeFavorite: (productId: string) =>
    api.delete<void>(`/products/${productId}/favorite`),
};
