import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  AccountDeletionReauthentication,
  ApiSuccessResponse,
  AuthTokenData,
  EmailVerificationPurpose,
  LoginRequest,
  OAuthProvider,
  SignupRequest,
} from "@/types/api";

type EmailVerificationAccepted = {
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
};

type EmailVerificationConfirmed = {
  signupToken: string;
  expiresInSeconds: number;
};

type LoginIdAvailability = {
  loginId: string;
  available: boolean;
};

export const authApi = {
  sendEmailVerification: (
    email: string,
    purpose: EmailVerificationPurpose = "SIGNUP",
  ) =>
    api.post<ApiSuccessResponse<EmailVerificationAccepted>>(
      "/auth/email-verifications",
      { email, purpose },
    ),

  confirmEmailVerification: (
    email: string,
    verificationCode: string,
    purpose: EmailVerificationPurpose = "SIGNUP",
  ) =>
    api.post<ApiSuccessResponse<EmailVerificationConfirmed>>(
      "/auth/email-verifications/confirm",
      { email, purpose, verificationCode },
    ),

  checkLoginIdAvailability: (loginId: string) =>
    api.get<ApiSuccessResponse<LoginIdAvailability>>(
      `/auth/login-ids/${encodeURIComponent(loginId)}/availability`,
    ),

  signup: (body: SignupRequest) =>
    api.post<ApiSuccessResponse<AuthTokenData>>("/auth/signup", body),

  login: (body: LoginRequest) =>
    api.post<ApiSuccessResponse<AuthTokenData>>("/auth/login", body),

  reauthenticateForAccountDeletion: (password: string) =>
    api.post<ApiSuccessResponse<AccountDeletionReauthentication>>(
      "/auth/reauth/password",
      { password },
    ),

  logout: async () => {
    try {
      await api.post<void>("/auth/logout");
    } finally {
      useAuthStore.getState().clearSession();
    }
  },

  getOAuthStartUrl: (provider: OAuthProvider) => {
    const apiBaseUrl = api.defaults.baseURL?.replace(/\/$/, "");

    if (!apiBaseUrl) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.");
    }

    return `${apiBaseUrl}/auth/oauth/${provider}`;
  },

  startAccountDeletionOAuthReauth: (
    provider: OAuthProvider,
    returnTo: string,
  ) =>
    api.post<ApiSuccessResponse<{ authorizationUrl: string }>>(
      `/auth/reauth/oauth/${provider}/start`,
      { returnTo },
    ),
};
