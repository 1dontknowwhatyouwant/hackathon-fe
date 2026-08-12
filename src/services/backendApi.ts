import { api } from "@/lib/axios";
import type { UserInfo } from "@/store/useAuthStore";
import type {
  ClosetItem,
  ItemCreateInput,
  PostSummary,
} from "@/types/menu";
import type {
  ProductCategoryFilter,
  RecommendedProduct,
} from "@/types/product";

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type PageResponse<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type SignInRequest = {
  email: string;
  password: string;
};

/**
 * 백엔드 엔드포인트 초안입니다.
 * 호출 시 `withCredentials`가 적용되어 HttpOnly 인증 쿠키가 자동 전송됩니다.
 * 토큰을 응답 타입이나 Zustand/localStorage 상태에 추가하지 않습니다.
 */
export const backendApi = {
  auth: {
    signIn: (body: SignInRequest) =>
      api.post<ApiResponse<UserInfo>>("/auth/login", body),
    signOut: () => api.post<void>("/auth/logout"),
  },
  posts: {
    list: (page: number, size: number) =>
      api.get<PageResponse<PostSummary>>("/posts", {
        params: { page, size },
      }),
  },
  products: {
    recommendations: (
      category: ProductCategoryFilter,
      signal?: AbortSignal,
    ) =>
      api.get<ApiResponse<RecommendedProduct[]>>("/products/recommendations", {
        params: category === "ALL" ? undefined : { category },
        signal,
      }),
  },
  items: {
    list: () => api.get<ApiResponse<ClosetItem[]>>("/items"),
    create: (body: ItemCreateInput) =>
      api.post<ApiResponse<ClosetItem>>("/items", body),
  },
  users: {
    me: () => api.get<ApiResponse<UserInfo>>("/users/me"),
  },
};
