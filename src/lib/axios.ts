import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/store/useAuthStore";
import {
  createApiRequestId,
  useApiActivityStore,
} from "@/store/useApiActivityStore";
import type { ApiErrorResponse, ApiSuccessResponse, AuthTokenData } from "@/types/api";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
const timeout = 10_000;
const paramsSerializer = { indexes: null } as const;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  paramsSerializer,
  timeout,
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  paramsSerializer,
  timeout,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _authRetry?: boolean;
  _activityRequestId?: string;
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
  const trackedConfig = config as RetryableRequestConfig;
  const accessToken = useAuthStore.getState().accessToken;

  if (!trackedConfig._activityRequestId) {
    trackedConfig._activityRequestId = createApiRequestId();
    useApiActivityStore
      .getState()
      .beginRequest(trackedConfig._activityRequestId);
  }

  if (accessToken) {
    trackedConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  return trackedConfig;
});

api.interceptors.response.use(
  (response) => {
    const request = response.config as RetryableRequestConfig;

    if (request._activityRequestId) {
      useApiActivityStore
        .getState()
        .finishRequest(request._activityRequestId);
    }

    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const request = error.config as RetryableRequestConfig | undefined;
    const requestUrl = request?.url ?? "";
    const isPublicAuthRequest = [
      "/auth/login",
      "/auth/signup",
      "/auth/email-verifications",
      "/auth/login-ids/",
      "/auth/oauth/",
    ].some((path) => requestUrl.startsWith(path));

    try {
      if (
        error.response?.status !== 401 ||
        !request ||
        request._authRetry ||
        isPublicAuthRequest
      ) {
        return Promise.reject(error);
      }

      request._authRetry = true;

      try {
        const accessToken = await refreshAccessToken();
        request.headers.Authorization = `Bearer ${accessToken}`;
        return await api.request(request);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    } finally {
      if (request?._activityRequestId) {
        useApiActivityStore
          .getState()
          .finishRequest(request._activityRequestId);
      }
    }
  },
);
