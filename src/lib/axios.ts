import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/store/useAuthStore";
import type { ApiErrorResponse, ApiSuccessResponse, AuthTokenData } from "@/types/api";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const timeout = 10_000;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout,
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _authRetry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<ApiSuccessResponse<AuthTokenData>>("/auth/refresh")
      .then(({ data }) => {
        useAuthStore.getState().setAccessToken(data.data.accessToken);
        return data.data.accessToken;
      })
      .catch((error: unknown) => {
        useAuthStore.getState().clearSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function initializeAuthSession() {
  try {
    await refreshAccessToken();
  } catch {
    // Refresh Cookie가 없는 비로그인 방문은 정상적인 초기 상태입니다.
  } finally {
    useAuthStore.getState().setHasHydrated(true);
  }
}

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const request = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status !== 401 || !request || request._authRetry) {
      return Promise.reject(error);
    }

    request._authRetry = true;

    try {
      const accessToken = await refreshAccessToken();
      request.headers.Authorization = `Bearer ${accessToken}`;
      return api.request(request);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
