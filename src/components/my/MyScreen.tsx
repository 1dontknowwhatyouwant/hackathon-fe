"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DetailActionCard } from "@/components/common/card/DetailActionCard";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BackButton } from "@/components/common/navigation/BackButton";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { authApi } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useMenuDataStore } from "@/store/useMenuDataStore";

const myMenuItems = [
  {
    title: "찜한 제품",
    description: "저장한 상품 목록",
    href: "/recommendations",
  },
  {
    title: "장바구니",
    description: "구매 예정 제품",
    href: "/recommendations",
  },
  {
    title: "저장한 장소",
    description: "장소별 맞춤 추천",
    href: "/place",
  },
  {
    title: "제품 패스포트",
    description: "제품 정보와 구매 내역",
    href: "/recommendations/mcm-item-01/passport",
  },
] as const;

export function MyScreen() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const profile = useMenuDataStore((state) => state.profile);
  const isLoading = useMenuDataStore((state) => state.isLoading);
  const error = useMenuDataStore((state) => state.error);
  const loadProfile = useMenuDataStore((state) => state.loadProfile);

  useEffect(() => {
    if (hasHydrated) {
      void loadProfile();
    }
  }, [hasHydrated, loadProfile]);

  const nickname = profile?.nickname?.trim() || "SUJEONG";

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await authApi.logout();
    } catch {
      // API 실패 여부와 무관하게 authApi.logout의 finally에서 로컬 세션을 정리합니다.
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <MobileScreenLayout
      figmaNodeId="311:127"
      contentClassName="bg-white px-6 pt-[18px] pb-8 text-[#121217]"
      bottomNavigation={<BottomNavigation activeItem="my" />}
    >
      <LuxuryReveal>
        <div className="flex h-9 items-center">
          <BackButton fallbackHref="/dashboard" variant="plain" />
          <p className="text-[11px] font-bold text-[#bda178]">
            20 · 마이페이지
          </p>
        </div>

        <h1 className="mt-2 text-[28px] leading-[34px] font-bold tracking-[-0.04em]">
          MY
        </h1>
        <p className="mt-[6px] text-[13px] leading-4 text-[#7a7a85]">
          {nickname.toUpperCase()}님의 라이프스타일 프로필
        </p>
      </LuxuryReveal>

      <LuxuryReveal className="mt-[28px]" delay={60}>
        <section className="flex h-28 items-start justify-between rounded-[18px] bg-[#121217] px-6 py-7">
          <div className="min-w-0">
            <h2 className="truncate text-[20px] leading-6 font-bold text-white">
              {nickname.toUpperCase()}
            </h2>
            <p className="mt-[7px] truncate text-[12px] leading-[15px] text-[#c7c7cc]">
              미니멀 · 클래식 · 전시
            </p>
          </div>

          <Link
            href="/preferences"
            className="flex h-[34px] w-[72px] shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#121217] transition-colors hover:bg-[#f0eee9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            수정
          </Link>
        </section>
      </LuxuryReveal>

      <section className="mt-[34px] space-y-4" aria-label="마이페이지 메뉴">
        {myMenuItems.map((item, index) => (
          <LuxuryReveal key={item.title} delay={100 + index * 50}>
            <DetailActionCard {...item} />
          </LuxuryReveal>
        ))}
      </section>

      <LuxuryReveal className="mt-8 border-t border-[#e4e4e8] pt-5" delay={320}>
        <section aria-labelledby="account-management-title">
          <h2
            id="account-management-title"
            className="text-[11px] font-bold tracking-[0.04em] text-[#8b7355]"
          >
            ACCOUNT
          </h2>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="mt-3 flex h-12 w-full items-center justify-between rounded-[14px] bg-[#f5f5f7] px-4 text-[12px] font-bold text-[#35353b] disabled:cursor-wait disabled:opacity-60"
          >
            {isLoggingOut ? "로그아웃 중" : "로그아웃"}
            <span aria-hidden="true" className="text-[20px] font-normal text-[#7a7a85]">
              ›
            </span>
          </button>

          <Link
            href="/my/account-deletion"
            className="mt-3 flex h-12 w-full items-center justify-between rounded-[14px] bg-[#f5f5f7] px-4 text-[12px] font-medium text-[#9a4545]"
          >
            회원 탈퇴
            <span aria-hidden="true" className="text-[20px] font-normal text-[#b87373]">
              ›
            </span>
          </Link>
        </section>
      </LuxuryReveal>

      {!hasHydrated || isLoading ? (
        <p className="mt-5 text-center text-[11px] text-[#7a7a85]" role="status">
          사용자 정보를 준비하고 있습니다.
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 text-center text-[11px] text-[#9a4545]" role="alert">
          {error}
        </p>
      ) : null}
    </MobileScreenLayout>
  );
}
