import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

/**
 * 인증 토큰은 백엔드가 HttpOnly 쿠키로 발급·만료합니다.
 * 프런트엔드는 토큰을 읽거나 Zustand/localStorage에 저장하지 않습니다.
 *
 * 백엔드의 재발급 API가 확정되면 다음 형태로 401 재시도 로직을 추가합니다.
 * 중복 재발급 방지와 재시도 횟수 제한도 함께 구현해야 합니다.
 *
 * api.interceptors.response.use(
 *   (response) => response,
 *   async (error) => {
 *     if (error.response?.status === 401) {
 *       await api.post("/auth/refresh"); // Refresh 쿠키도 자동 전송
 *       return api.request(error.config);
 *     }
 *     return Promise.reject(error);
 *   },
 * );
 */
