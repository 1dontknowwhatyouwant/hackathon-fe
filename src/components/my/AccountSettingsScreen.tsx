"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiBellBold, PiLockKeyBold, PiUserCircleBold } from "react-icons/pi";

import { DetailActionCard } from "@/components/common/card/DetailActionCard";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { authApi } from "@/services/api";

const accountMenus = [
  {
    title: "프로필 수정",
    description: "닉네임과 취향 변경",
    href: "/my/settings/profile",
    leading: <PiUserCircleBold aria-hidden="true" className="size-6" />,
  },
  {
    title: "비밀번호 변경",
    description: "보안을 위해 주기적으로 변경",
    leading: <PiLockKeyBold aria-hidden="true" className="size-6" />,
  },
  {
    title: "알림·마케팅 설정",
    description: "수신 항목 선택",
    leading: <PiBellBold aria-hidden="true" className="size-6" />,
  },
];

export function AccountSettingsScreen() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await authApi.logout();
    } catch {
      // 서버 로그아웃 실패 시에도 authApi.logout의 finally에서 로컬 세션은 정리됩니다.
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <MobileScreenLayout
      figmaNodeId="390:280"
      contentClassName="flex min-h-full flex-col bg-white px-6 pt-4 pb-8 text-[#121217]"
    >
      <LuxuryReveal>
        <BackButton variant="plain" />
        <h1 className="mt-2 text-[28px] leading-[34px] font-bold tracking-[-0.04em]">
          계정 설정
        </h1>
      </LuxuryReveal>

      <section className="mt-9 space-y-4" aria-label="계정 설정 메뉴">
        {accountMenus.map((menu, index) => (
          <LuxuryReveal key={menu.title} delay={60 + index * 50}>
            <DetailActionCard {...menu} />
          </LuxuryReveal>
        ))}
      </section>

      <LuxuryReveal className="mt-auto pt-10" delay={240}>
        <button
          type="button"
          disabled={isLoggingOut}
          onClick={handleLogout}
          className="flex h-[52px] w-full items-center justify-center rounded-[14px] border border-[#dedee2] bg-white text-[14px] font-bold text-[#15151a] transition-colors hover:bg-[#f8f8f9] disabled:cursor-wait disabled:opacity-60"
        >
          {isLoggingOut ? "로그아웃 중" : "로그아웃"}
        </button>
        <Link
          href="/my/account-deletion"
          className="mt-4 flex h-[52px] w-full items-center justify-center rounded-[14px] border border-[#e6b8b8] bg-white text-[14px] font-bold text-[#c72e2e] transition-colors hover:bg-[#fff8f8]"
        >
          회원 탈퇴
        </Link>
      </LuxuryReveal>
    </MobileScreenLayout>
  );
}
