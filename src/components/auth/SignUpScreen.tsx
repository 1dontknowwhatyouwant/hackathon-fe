"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { useAuthStore } from "@/store/useAuthStore";
import {
  createUserInfo,
  registerLocalAccount,
  type StoredAccount,
} from "@/components/auth/authStorage";

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

function EmailFieldWithAction({
  value,
  onChange,
  onSendCode,
}: {
  value: string;
  onChange: (value: string) => void;
  onSendCode: () => void;
}) {
  return (
    <label className="block">
      <span className="sr-only">이메일</span>
      <div className="flex h-[54px] items-center gap-3 rounded-[16px] border border-[#d8d6dd] bg-white px-4 focus-within:border-[#15151a]">
        <input
          type="email"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="이메일"
          className="min-w-0 flex-1 bg-transparent text-[13px] leading-4 text-[#15151a] outline-none placeholder:text-[#9999a1]"
        />
        <button
          type="button"
          onClick={onSendCode}
          className="ml-3 shrink-0 rounded-full border border-[#d8d6dd] px-3 py-1.5 text-[12px] font-bold text-[#15151a] transition hover:bg-[#f7f6f8]"
        >
          인증번호 받기
        </button>
      </div>
    </label>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-[13px] font-bold tracking-[-0.02em] text-[#15151a]">
      {children}
    </h2>
  );
}

function CheckboxRow({
  label,
  required,
  checked,
  onChange,
}: {
  label: string;
  required?: boolean;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-[16px] border border-[#d8d6dd] bg-white px-4 py-4 text-[13px] leading-5 text-[#55555d]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 rounded border-[#c8c8d0] text-[#15151a]"
      />
      <span>
        {label}
        {required ? " (필수)" : " (선택)"}
      </span>
    </label>
  );
}

function GenderChoice({
  value,
  onChange,
}: {
  value: "female" | "male" | "";
  onChange: (value: "female" | "male") => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <label className="cursor-pointer">
        <input
          type="radio"
          name="gender"
          value="female"
          checked={value === "female"}
          onChange={() => onChange("female")}
          className="peer sr-only"
        />
        <div className="flex h-[54px] items-center justify-center rounded-[16px] border border-[#d8d6dd] bg-white text-[13px] font-bold text-[#15151a] transition peer-checked:border-[#15151a] peer-checked:bg-[#15151a] peer-checked:text-white">
          여성
        </div>
      </label>
      <label className="cursor-pointer">
        <input
          type="radio"
          name="gender"
          value="male"
          checked={value === "male"}
          onChange={() => onChange("male")}
          className="peer sr-only"
        />
        <div className="flex h-[54px] items-center justify-center rounded-[16px] border border-[#d8d6dd] bg-white text-[13px] font-bold text-[#15151a] transition peer-checked:border-[#15151a] peer-checked:bg-[#15151a] peer-checked:text-white">
          남성
        </div>
      </label>
    </div>
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
      type="submit"
      className="flex h-[54px] w-full items-center justify-center rounded-[18px] bg-[#15151a] text-[15px] font-bold text-white transition hover:bg-[#202028]"
    >
      {children}
    </button>
  );
}

export function SignUpScreen() {
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<"female" | "male" | "">("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("이메일을 입력해 주세요.");
      return;
    }

    if (!id.trim()) {
      setError("아이디를 입력해 주세요.");
      return;
    }

    if (!password) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }

    if (!passwordConfirm) {
      setError("비밀번호 확인을 입력해 주세요.");
      return;
    }

    if (!nickname.trim()) {
      setError("닉네임을 입력해 주세요.");
      return;
    }

    if (!gender) {
      setError("성별을 선택해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!privacyConsent) {
      setError("개인정보수집동의는 필수입니다.");
      return;
    }

    const account: StoredAccount = {
      id: id.trim(),
      password,
      email: email.trim(),
      nickname: nickname.trim(),
      gender: gender || undefined,
      provider: "local",
      privacyConsent,
      marketingConsent,
    };

    registerLocalAccount(account);
    setUser(createUserInfo(account));
    setError("");
    router.push("/login");
  };

  return (
    <MobileScreenLayout contentClassName="bg-white px-6 pb-[32px] pt-[48px] text-[#17181d]">
      <section className="flex min-h-full flex-col">
        <div>
          <p className="text-[11px] font-bold tracking-[0.01em] text-[#8b7355]">
            MEMBERSHIP
          </p>
          <h1 className="mt-2 text-[28px] leading-[1.2] font-bold tracking-[-0.035em] text-[#15151a]">
            회원가입
          </h1>
          <p className="mt-2 text-[13px] leading-4 text-[#777780]">
            자체 서비스 가입 또는 간편 로그인 가입을 선택하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <SectionTitle>자체 서비스 회원가입</SectionTitle>
              <div className="space-y-5">
                <EmailFieldWithAction
                  value={email}
                  onChange={setEmail}
                  onSendCode={() => setEmailCodeSent(true)}
                />
                {emailCodeSent ? (
                  <TextField
                    label="인증번호"
                    placeholder="인증번호"
                    value={emailCode}
                    onChange={setEmailCode}
                  />
                ) : null}
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
                <TextField
                  label="비밀번호 확인"
                  placeholder="비밀번호 확인"
                  type="password"
                  value={passwordConfirm}
                  onChange={setPasswordConfirm}
                />
                <TextField
                  label="닉네임"
                  placeholder="닉네임"
                  value={nickname}
                  onChange={setNickname}
                />
                <GenderChoice value={gender} onChange={setGender} />
              </div>
            </div>

            <div className="space-y-3">
              <SectionTitle>동의 사항</SectionTitle>
              <div className="space-y-3">
                <CheckboxRow
                  label="개인정보수집동의"
                  required
                  checked={privacyConsent}
                  onChange={setPrivacyConsent}
                />
                <CheckboxRow
                  label="마케팅 수신동의"
                  checked={marketingConsent}
                  onChange={setMarketingConsent}
                />
              </div>
            </div>

            {error ? (
              <p className="text-[12px] font-medium text-[#c23535]">{error}</p>
            ) : null}

            <div className="space-y-4">
              <PrimaryButton>가입하기</PrimaryButton>
              <div className="grid grid-cols-2 gap-3">
                <SocialButton brand="kakao">카카오로 시작하기</SocialButton>
                <SocialButton brand="naver">네이버로 시작하기</SocialButton>
              </div>
              <p className="text-center text-[12px] font-bold text-[#55555d]">
                간편로그인 회원가입은{" "}
                <span className="underline underline-offset-2">
                  프로필 설정 후 완료
                </span>
              </p>
            </div>
          </div>
        </form>
      </section>
    </MobileScreenLayout>
  );
}
