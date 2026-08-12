import { api } from "@/lib/axios";
import type {
  ApiPage,
  ApiSuccessResponse,
  ItemCategory,
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

  createRecommendation: (body: {
    category: ItemCategory | null;
    limit: number;
  }, signal?: AbortSignal) =>
    api.post<ApiSuccessResponse<Recommendation>>("/recommendations", body, {
      signal,
    }),

  getRecommendation: (recommendationId: string) =>
    api.get<ApiSuccessResponse<Recommendation>>(
      `/recommendations/${recommendationId}`,
    ),

  getFavorites: (params: PageQuery = {}) =>
    api.get<ApiSuccessResponse<ApiPage<FavoriteProduct>>>("/favorites", {
      params,
    }),

  addFavorite: (productId: string) =>
    api.put<
      ApiSuccessResponse<{ productId: string; favorited: true }>
    >(`/favorites/${productId}`),

  removeFavorite: (productId: string) =>
    api.delete<void>(`/favorites/${productId}`),
};
