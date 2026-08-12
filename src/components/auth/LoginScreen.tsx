"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { getApiErrorMessage } from "@/lib/apiError";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import type { OAuthProvider } from "@/types/api";

function TextField({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? label}
        className="h-[54px] w-full rounded-[16px] border border-[#d8d6dd] bg-white px-4 text-[13px] leading-4 text-[#15151a] outline-none transition placeholder:text-[#9999a1] focus:border-[#15151a]"
      />
    </label>
  );
}

function SocialButton({
  children,
  brand,
  onClick,
}: {
  children: string;
  brand: OAuthProvider;
  onClick: () => void;
}) {
  const isKakao = brand === "kakao";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex h-[54px] w-full items-center justify-center rounded-[18px] border text-[15px] font-bold transition",
        isKakao
          ? "border-[#f4d44d] bg-[#fee500] text-[#15151a] hover:bg-[#f9df00]"
          : "border-[#2db400] bg-[#03c75a] text-white hover:bg-[#02b153]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function PrimaryButton({
  children,
  disabled,
}: {
  children: string;
  disabled: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="flex h-[54px] w-full items-center justify-center rounded-[18px] bg-[#15151a] text-[15px] font-bold text-white transition hover:bg-[#202028] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const loginId = id.trim();

    if (!loginId || !password) {
      setError("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await authApi.login({ loginId, password });
      setSession(response.data.data);
      router.replace("/dashboard");
    } catch (submitError) {
      setError(
        getApiErrorMessage(
          submitError,
          "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const startOAuth = (provider: OAuthProvider) => {
    try {
      window.location.assign(authApi.getOAuthStartUrl(provider));
    } catch (oauthError) {
      setError(getApiErrorMessage(oauthError, "로그인 주소를 확인해 주세요."));
    }
  };

  return (
    <MobileScreenLayout contentClassName="bg-white px-6 pb-[32px] pt-[48px] text-[#17181d]">
      <section className="flex min-h-full flex-col">
        <div>
          <p className="text-[11px] font-bold tracking-[0.01em] text-[#8b7355]">
            MEMBERSHIP
          </p>
          <h1 className="mt-2 text-[28px] leading-[1.2] font-bold tracking-[-0.035em] text-[#15151a]">
            다시 만나서 반가워요
          </h1>
          <p className="mt-2 text-[13px] leading-4 text-[#777780]">
            아이디와 비밀번호로 로그인하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          <div className="space-y-5">
            <TextField
              label="아이디"
              placeholder="아이디"
              value={id}
              onChange={setId}
            />
            <TextField
              label="비밀번호"
              placeholder="비밀번호"
              type="password"
              value={password}
              onChange={setPassword}
            />
          </div>

          {error ? (
            <p className="mt-3 text-[12px] font-medium text-[#c23535]">{error}</p>
          ) : null}

          <div className="mt-[40px] space-y-4">
            <PrimaryButton disabled={isSubmitting}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </PrimaryButton>
            <div className="grid grid-cols-2 gap-3">
              <SocialButton
                brand="kakao"
                onClick={() => startOAuth("kakao")}
              >
                카카오 로그인
              </SocialButton>
              <SocialButton
                brand="naver"
                onClick={() => startOAuth("naver")}
              >
                네이버 로그인
              </SocialButton>
            </div>
            <p className="text-center text-[12px] font-bold text-[#55555d]">
              계정이 없나요?{" "}
              <Link href="/signup" className="underline underline-offset-2">
                회원가입
              </Link>
            </p>
          </div>
        </form>
      </section>
    </MobileScreenLayout>
  );
}
