"use client";

import Link from "next/link";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";

function TextField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        type={type}
        placeholder={placeholder ?? label}
        className="h-[54px] w-full rounded-[16px] border border-[#d8d6dd] bg-white px-4 text-[13px] leading-4 text-[#15151a] outline-none transition placeholder:text-[#9999a1] focus:border-[#15151a]"
      />
    </label>
  );
}

function SocialButton({
  children,
  brand,
}: {
  children: string;
  brand: "kakao" | "naver";
}) {
  const isKakao = brand === "kakao";

  return (
    <button
      type="button"
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

function PrimaryButton({ children }: { children: string }) {
  return (
    <button
      type="button"
      className="flex h-[54px] w-full items-center justify-center rounded-[18px] bg-[#15151a] text-[15px] font-bold text-white transition hover:bg-[#202028]"
    >
      {children}
    </button>
  );
}

export function LoginScreen() {
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

        <div className="mt-10 space-y-5">
          <TextField label="아이디" placeholder="아이디" />
          <TextField label="비밀번호" placeholder="비밀번호" type="password" />
        </div>

        <div className="mt-[40px] space-y-4">
          <PrimaryButton>로그인</PrimaryButton>
          <div className="grid grid-cols-2 gap-3">
            <SocialButton brand="kakao">카카오 로그인</SocialButton>
            <SocialButton brand="naver">네이버 로그인</SocialButton>
          </div>
          <p className="text-center text-[12px] font-bold text-[#55555d]">
            계정이 없나요?{" "}
            <Link href="/signup" className="underline underline-offset-2">
              회원가입
            </Link>
          </p>
        </div>
      </section>
    </MobileScreenLayout>
  );
}
