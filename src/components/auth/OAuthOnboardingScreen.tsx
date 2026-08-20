"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { getApiErrorMessage } from "@/lib/apiError";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import type { Gender } from "@/types/api";

const termsVersion = "2026-08-01";

export function OAuthOnboardingScreen() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<Gender>("NOT_SPECIFIED");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [serviceTerms, setServiceTerms] = useState(false);
  const [privacyTerms, setPrivacyTerms] = useState(false);
  const [marketingTerms, setMarketingTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedNickname = nickname.trim();
    if (normalizedNickname.length < 2 || normalizedNickname.length > 20) {
      setError("닉네임은 2~20자로 입력해 주세요.");
      return;
    }

    if (!serviceTerms || !privacyTerms) {
      setError("필수 약관에 동의해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authApi.socialSignup({
        nickname: normalizedNickname,
        gender,
        notificationEmail: notificationEmail.trim() || null,
        termsAgreements: [
          {
            termsType: "SERVICE_TERMS",
            termsVersion,
            agreed: serviceTerms,
          },
          {
            termsType: "PRIVACY_POLICY",
            termsVersion,
            agreed: privacyTerms,
          },
          {
            termsType: "EMAIL_MARKETING",
            termsVersion,
            agreed: marketingTerms,
          },
        ],
      });

      setSession(response.data.data);
      router.replace("/personalize");
    } catch (submitError) {
      setError(
        getApiErrorMessage(
          submitError,
          "소셜 회원가입을 완료하지 못했습니다. 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileScreenLayout contentClassName="bg-white px-6 pt-12 pb-8">
      <p className="text-[11px] font-bold text-[#8b7355]">SOCIAL ONBOARDING</p>
      <h1 className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-[#15151a]">
        프로필 설정
      </h1>
      <p className="mt-2 text-[13px] text-[#777780]">
        간편 로그인에 사용할 기본 정보를 입력해 주세요.
      </p>

      <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
        <label className="block text-[12px] font-bold text-[#55555d]">
          닉네임
          <input
            value={nickname}
            maxLength={20}
            onChange={(event) => setNickname(event.target.value)}
            className="mt-2 h-[52px] w-full rounded-[16px] border border-[#d8d6dd] px-4 text-[13px] outline-none focus:border-[#15151a]"
          />
        </label>

        <label className="block text-[12px] font-bold text-[#55555d]">
          성별
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value as Gender)}
            className="mt-2 h-[52px] w-full rounded-[16px] border border-[#d8d6dd] bg-white px-4 text-[13px] outline-none focus:border-[#15151a]"
          >
            <option value="NOT_SPECIFIED">선택하지 않음</option>
            <option value="FEMALE">여성</option>
            <option value="MALE">남성</option>
          </select>
        </label>

        <label className="block text-[12px] font-bold text-[#55555d]">
          알림 이메일 · 선택
          <input
            type="email"
            value={notificationEmail}
            maxLength={320}
            onChange={(event) => setNotificationEmail(event.target.value)}
            className="mt-2 h-[52px] w-full rounded-[16px] border border-[#d8d6dd] px-4 text-[13px] outline-none focus:border-[#15151a]"
          />
        </label>

        <div className="space-y-3 pt-2">
          {[
            ["서비스 이용약관 동의 (필수)", serviceTerms, setServiceTerms],
            ["개인정보 처리방침 동의 (필수)", privacyTerms, setPrivacyTerms],
            ["이메일 마케팅 동의 (선택)", marketingTerms, setMarketingTerms],
          ].map(([label, checked, onChange]) => (
            <label
              key={String(label)}
              className="flex items-center gap-3 rounded-[14px] border border-[#dedee2] px-4 py-3 text-[12px] text-[#55555d]"
            >
              <input
                type="checkbox"
                checked={Boolean(checked)}
                onChange={(event) =>
                  (onChange as (value: boolean) => void)(event.target.checked)
                }
              />
              {String(label)}
            </label>
          ))}
        </div>

        {error ? (
          <p role="alert" className="text-[12px] text-[#9a4545]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-[54px] w-full items-center justify-center rounded-[18px] bg-[#15151a] text-[15px] font-bold text-white disabled:opacity-50"
        >
          {isSubmitting ? "가입 완료 중" : "가입 완료"}
        </button>
      </form>
    </MobileScreenLayout>
  );
}
