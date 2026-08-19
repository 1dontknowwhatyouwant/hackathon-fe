import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  ApiSuccessResponse,
  AuthTokenData,
  EmailVerificationPurpose,
  LoginRequest,
  OAuthProvider,
  SocialSignupRequest,
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

function getAuthRedirectUrl(path: string) {
  const apiBaseUrl = api.defaults.baseURL?.replace(/\/$/, "");

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.");
  }

  return `${apiBaseUrl}${path}`;
}

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

  socialSignup: (body: SocialSignupRequest) =>
    api.post<ApiSuccessResponse<AuthTokenData>>("/auth/oauth/signup", body),

  login: (body: LoginRequest) =>
    api.post<ApiSuccessResponse<AuthTokenData>>("/auth/login", body),

  reauthenticateForAccountDeletion: (password: string) =>
    api.post<void>("/auth/reauthentications", { password }),

  logout: async () => {
    try {
      await api.post<void>("/auth/logout");
    } finally {
      useAuthStore.getState().clearSession();
    }
  },

  getOAuthStartUrl: (provider: OAuthProvider) => {
    return getAuthRedirectUrl(`/auth/oauth/${provider}`);
  },

  getAccountDeletionOAuthReauthUrl: (provider: OAuthProvider) =>
    getAuthRedirectUrl(`/auth/oauth/${provider}/reauthentication`),
};
