"use client";

import { useEffect } from "react";
import Link from "next/link";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useMenuDataStore } from "@/store/useMenuDataStore";

const actionCards = [
  {
    title: "스마트 착용 추천",
    description: "세부 정보를 확인하세요",
    href: "/recommendations",
  },
  {
    title: "내 제품 관리 알림",
    description: "세부 정보를 확인하세요",
    href: "/items",
  },
  {
    title: "구매 전 활용 체크",
    description: "세부 정보를 확인하세요",
    href: "/recommendations",
  },
];

function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-[72px] items-center gap-3 rounded-[18px] border border-[#e5e2de] bg-[#faf9f7] px-[14px] transition-transform active:scale-[0.99]"
    >
      <div className="h-[44px] w-[44px] shrink-0 rounded-[14px] bg-[#ece6dc]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold leading-[18px] text-[#15151a]">
          {title}
        </p>
        <p className="mt-[3px] text-[12px] leading-[14px] text-[#9898a0]">
          {description}
        </p>
      </div>
      <span aria-hidden="true" className="text-[28px] leading-none text-[#7d7d86]">
        ›
      </span>
    </Link>
  );
}

export function DashboardScreen() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const profile = useMenuDataStore((state) => state.profile);
  const loadProfile = useMenuDataStore((state) => state.loadProfile);

  useEffect(() => {
    if (hasHydrated && !profile) {
      void loadProfile();
    }
  }, [hasHydrated, loadProfile, profile]);

  const nickname = profile?.nickname?.trim() || "사용자";

  return (
    <MobileScreenLayout
      figmaNodeId="96:142"
      contentClassName="bg-white px-6 pt-[46px] pb-8"
      bottomNavigation={<BottomNavigation activeItem="home" />}
    >
      <section className="text-[#15151a]">
        <p className="text-[11px] font-bold tracking-[0.02em] text-[#8b7355]">
          GOOD MORNING, {nickname.toUpperCase()}
        </p>
        <h1 className="mt-[6px] text-[28px] leading-[1.14] font-bold tracking-[-0.05em]">
          오늘 뭐 입을래?
        </h1>
        <p className="mt-[10px] text-[13px] leading-4 text-[#777780]">
          24° · 맑음 · 성수동
        </p>

        <Link
          href="/personalize"
          className="mt-10 block overflow-hidden rounded-[22px] bg-[#16161b] px-5 py-[22px] shadow-[0_12px_30px_rgba(22,22,27,0.12)] transition-transform active:scale-[0.99]"
        >
          <p className="text-[12px] font-bold tracking-[0.02em] text-[#b89a72]">
            오늘의 AI 스타일 플랜
          </p>
          <h2 className="mt-4 max-w-[230px] text-[22px] font-bold leading-[1.2] tracking-[-0.04em] text-white">
            MCM 쇼퍼와 데님으로
            <br />
            가볍게 완성해볼까요?
          </h2>
        </Link>

        <div className="mt-8 space-y-4">
          {actionCards.map((card) => (
            <ActionCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </MobileScreenLayout>
  );
}
