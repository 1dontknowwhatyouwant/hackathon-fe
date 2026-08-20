"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { LuxuryReveal } from "@/components/common/motion/LuxuryReveal";
import { BottomNavigation } from "@/components/common/navigation/BottomNavigation";
import { HomePreferenceProducts } from "@/components/dashboard/HomePreferenceProducts";
import { useAuthStore } from "@/store/useAuthStore";
import { useHomeStore } from "@/store/useHomeStore";
import { useMenuDataStore } from "@/store/useMenuDataStore";
import { useProductRecommendationStore } from "@/store/useProductRecommendationStore";

const actionCards = [
  {
    title: "스마트 착용 추천",
    description: "세부 정보를 확인하세요",
    href: "/personalize",
  },
  {
    title: "내 제품 관리 알림",
    description: "소재별 관리 안내와 일정을 확인하세요",
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

function ProductRowCard({
  title,
  subtitle,
  href,
  imageUrl,
}: {
  title: string;
  subtitle: string;
  href: string;
  imageUrl?: string;
}) {
  return (
    <Link
      href={href}
      className="flex h-[72px] items-center gap-3 rounded-[18px] border border-[#e5e2de] bg-[#faf9f7] px-[14px] transition-transform active:scale-[0.99]"
    >
      <div
        className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[14px] bg-[#ece6dc] bg-cover bg-center"
        style={imageUrl ? { backgroundImage: `url("${imageUrl}")` } : undefined}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold leading-[18px] text-[#15151a]">
          {title}
        </p>
        <p className="mt-[3px] truncate text-[12px] leading-[14px] text-[#9898a0]">
          {subtitle}
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
  const homeData = useHomeStore((state) => state.data);
  const isHomeLoading = useHomeStore((state) => state.isLoading);
  const homeError = useHomeStore((state) => state.error);
  const loadHome = useHomeStore((state) => state.loadHome);
  const products = useProductRecommendationStore((state) => state.products);
  const productStatus = useProductRecommendationStore((state) => state.status);
  const loadProducts = useProductRecommendationStore((state) => state.loadProducts);

  useEffect(() => {
    if (hasHydrated && !profile) {
      void loadProfile();
    }
    if (hasHydrated && !homeData) {
      void loadHome();
    }
  }, [hasHydrated, homeData, loadHome, loadProfile, profile]);

  useEffect(() => {
    if (!hasHydrated) return;
    return loadProducts("ALL");
  }, [hasHydrated, loadProducts]);

  const nickname = profile?.nickname?.trim() || "사용자";

  return (
    <MobileScreenLayout
      figmaNodeId="96:142"
      contentClassName="bg-white px-6 pt-[46px] pb-8"
      bottomNavigation={<BottomNavigation activeItem="home" />}
    >
      <section className="text-[#15151a]">
        <LuxuryReveal>
          <p className="text-[11px] font-bold tracking-[0.02em] text-[#8b7355]">
            GOOD MORNING, {nickname.toUpperCase()}
          </p>
          <h1 className="mt-[6px] text-[28px] leading-[1.14] font-bold tracking-[-0.05em]">
            오늘 뭐 입을래?
          </h1>
          <p className="mt-[10px] text-[13px] leading-4 text-[#777780]">내 취향과 아이템을 바탕으로 오늘을 준비해요.</p>
        </LuxuryReveal>

        <LuxuryReveal className="mt-10" delay={80}>
          <article className="overflow-hidden rounded-[22px] bg-[#16161b] px-5 py-[22px] shadow-[0_12px_30px_rgba(22,22,27,0.12)]">
            <p className="text-[12px] font-bold tracking-[0.02em] text-[#b89a72]">최근 스타일 플랜</p>
            <h2 className="mt-4 max-w-[230px] text-[22px] font-bold leading-[1.2] tracking-[-0.04em] text-white">
              {homeData?.latestStylePlan?.title ?? "아직 저장한 스타일 플랜이 없어요"}
            </h2>
          </article>
        </LuxuryReveal>

        <div className="mt-8 space-y-4">
          {actionCards.map((card, index) => (
            <LuxuryReveal key={card.title} delay={160 + index * 70}>
              <ActionCard {...card} />
            </LuxuryReveal>
          ))}
        </div>

        <LuxuryReveal className="mt-10" delay={390}>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.04em] text-[#8b7355]">
                ALL MCM PRODUCTS
              </p>
              <h2 className="mt-1 text-[20px] font-bold tracking-[-0.035em]">
                전체 MCM 제품
              </h2>
            </div>
            <Link
              href="/recommendations"
              className="text-[11px] font-bold text-[#777780]"
            >
              더보기
            </Link>
          </div>
          <ul className="space-y-[10px]">
            {products.slice(0, 4).map((product) => (
              <li key={product.id}>
                <ProductRowCard
                  href={`/recommendations/${product.id}`}
                  title={product.displayName}
                  subtitle={product.modelName}
                  imageUrl={product.imageUrl}
                />
              </li>
            ))}
          </ul>
          {productStatus === "loading" && products.length === 0 ? <p className="py-6 text-center text-[12px] text-[#777780]">제품을 불러오는 중입니다.</p> : null}
          {productStatus === "error" ? <p className="py-6 text-center text-[12px] text-[#9a4545]">제품 목록을 불러오지 못했습니다.</p> : null}
        </LuxuryReveal>

        <LuxuryReveal className="mt-10" delay={460}>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.04em] text-[#8b7355]">FOR YOUR TASTE</p>
              <h2 className="mt-1 text-[20px] font-bold tracking-[-0.035em]">취향에 맞는 제품</h2>
            </div>
            <Link href="/preferences" className="text-[11px] font-bold text-[#777780]">취향 수정</Link>
          </div>
          {homeError ? (
            <p className="mb-3 text-[10px] leading-4 text-[#9a6d45]">{homeError}</p>
          ) : null}
          <HomePreferenceProducts
            products={homeData?.recommendedProducts ?? []}
            isLoading={isHomeLoading}
          />
        </LuxuryReveal>
      </section>
    </MobileScreenLayout>
  );
}
