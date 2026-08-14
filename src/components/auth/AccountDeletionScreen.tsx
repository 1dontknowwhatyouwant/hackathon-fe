"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { ScreenHeader } from "@/components/common/section/ScreenHeader";
import { getApiErrorMessage } from "@/lib/apiError";
import { backendApi } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import type { OAuthProvider, UserProfile } from "@/types/api";

type ReauthenticationStatus = "IDLE" | "PROCESSING" | "READY";

function toOAuthProvider(loginType: UserProfile["loginType"]): OAuthProvider | null {
  if (loginType === "KAKAO") {
    return "kakao";
  }

  if (loginType === "NAVER") {
    return "naver";
  }

  return null;
}

export function AccountDeletionScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clearSession = useAuthStore((state) => state.clearSession);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<ReauthenticationStatus>(
    searchParams.get("reauthenticated") === "true" ? "READY" : "IDLE",
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(() =>
    searchParams.get("reauthError")
      ? "소셜 계정 재인증에 실패했습니다. 다시 시도해 주세요."
      : null,
  );

  useEffect(() => {
    let active = true;

    void backendApi.profile
      .getMe()
      .then(({ data }) => {
        if (active) {
          setProfile(data.data);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            getApiErrorMessage(
              loadError,
              "회원 정보를 확인하지 못했습니다. 다시 시도해 주세요.",
            ),
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLocalReauthentication = async (event: FormEvent) => {
    event.preventDefault();
    if (!password.trim()) {
      setError("현재 비밀번호를 입력해 주세요.");
      return;
    }

    setStatus("PROCESSING");
    setError(null);

    try {
      await backendApi.auth.reauthenticateForAccountDeletion(password);
      setPassword("");
      setStatus("READY");
    } catch (reauthError) {
      setStatus("IDLE");
      setError(
        getApiErrorMessage(
          reauthError,
          "비밀번호 재인증에 실패했습니다.",
        ),
      );
    }
  };

  const handleSocialReauthentication = async () => {
    if (!profile) {
      return;
    }

    const provider = toOAuthProvider(profile.loginType);
    if (!provider) {
      return;
    }

    setStatus("PROCESSING");
    setError(null);

    try {
      const returnTo = `${window.location.origin}/auth/reauth/account-deletion/callback`;
      const response = await backendApi.auth.startAccountDeletionOAuthReauth(
        provider,
        returnTo,
      );
      window.location.assign(response.data.data.authorizationUrl);
    } catch (oauthError) {
      setStatus("IDLE");
      setError(
        oauthError instanceof Error
          ? oauthError.message
          : "소셜 재인증을 시작하지 못했습니다.",
      );
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await backendApi.profile.deleteMe();
      clearSession();
      router.replace("/login?accountDeletion=accepted");
    } catch (deleteError) {
      setError(
        getApiErrorMessage(
          deleteError,
          "회원 탈퇴 요청을 처리하지 못했습니다. 재인증 후 다시 시도해 주세요.",
        ),
      );
      setStatus("IDLE");
    } finally {
      setIsDeleting(false);
    }
  };

  const isLocal = profile?.loginType === "LOCAL";
  const provider = profile ? toOAuthProvider(profile.loginType) : null;

  return (
    <MobileScreenLayout contentClassName="bg-white px-6 pt-4 pb-9">
      <LuxuryReveal>
        <BackButton fallbackHref="/my" />
      </LuxuryReveal>

      <LuxuryReveal className="mt-5" delay={40}>
        <ScreenHeader
          eyebrow="ACCOUNT"
          title="회원 탈퇴"
          description="계정을 보호하기 위해 한 번 더 본인 확인을 진행합니다."
        />
      </LuxuryReveal>

      <LuxuryReveal className="mt-8" delay={90}>
        <section className="rounded-[22px] border border-[#e2ded8] bg-[#f8f6f3] p-5">
          {!profile && !error ? (
            <p className="text-[13px] text-[#777780]">로그인 방식을 확인하고 있습니다.</p>
          ) : null}

          {profile && status !== "READY" && isLocal ? (
            <form onSubmit={handleLocalReauthentication}>
              <label className="block text-[12px] font-bold text-[#35353b]">
                현재 비밀번호
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-3 h-[50px] w-full rounded-[15px] border border-[#dedee2] bg-white px-4 text-[13px] outline-none focus:border-[#8b7355]"
                />
              </label>
              <button
                type="submit"
                disabled={status === "PROCESSING"}
                className="mt-4 flex h-[50px] w-full items-center justify-center rounded-[15px] bg-[#15151a] text-[14px] font-bold text-white disabled:opacity-45"
              >
                {status === "PROCESSING" ? "확인 중" : "비밀번호로 재인증"}
              </button>
            </form>
          ) : null}

          {profile && status !== "READY" && provider ? (
            <div>
              <p className="text-[13px] leading-5 text-[#55555d]">
                {profile.loginType === "KAKAO" ? "카카오" : "네이버"} 계정으로 다시 로그인해 주세요.
              </p>
              <button
                type="button"
                disabled={status === "PROCESSING"}
                onClick={handleSocialReauthentication}
                className="mt-4 flex h-[50px] w-full items-center justify-center rounded-[15px] bg-[#15151a] text-[14px] font-bold text-white disabled:opacity-45"
              >
                {status === "PROCESSING" ? "재인증 준비 중" : "소셜 계정으로 재인증"}
              </button>
            </div>
          ) : null}

          {status === "READY" ? (
            <div>
              <p className="text-[13px] font-bold text-[#4f7154]">본인 확인이 완료되었습니다.</p>
              <p className="mt-2 text-[11px] leading-4 text-[#777780]">
                재인증은 5분 동안 한 번만 사용할 수 있습니다.
              </p>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="mt-5 flex h-[50px] w-full items-center justify-center rounded-[15px] bg-[#9a4545] text-[14px] font-bold text-white disabled:opacity-45"
              >
                {isDeleting ? "탈퇴 요청 중" : "회원 탈퇴 요청"}
              </button>
            </div>
          ) : null}
        </section>
      </LuxuryReveal>

      {error ? (
        <p role="alert" className="mt-4 rounded-[14px] bg-[#f8eeee] px-4 py-3 text-[12px] text-[#9a4545]">
          {error}
        </p>
      ) : null}
    </MobileScreenLayout>
  );
}
