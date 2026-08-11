"use client";

import { useEffect } from "react";

import { MenuPageLayout } from "@/components/common/layout/MenuPageLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { useMenuDataStore } from "@/store/useMenuDataStore";

export function MyScreen() {
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

  return (
    <MenuPageLayout
      activeItem="my"
      eyebrow="MY PROFILE"
      title="마이페이지"
      description="화면용 사용자 정보는 Zustand와 localStorage 정책을 따릅니다."
    >
      {!hasHydrated || isLoading ? (
        <p className="text-sm text-[#777780]">사용자 정보를 준비하고 있습니다.</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {profile ? (
        <section className="rounded-[24px] border border-[#e2ded8] bg-[#f8f6f3] p-5">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-full bg-[#d9cec0] text-xl font-black text-[#715f49]">
              {(profile.nickname ?? "MY").slice(0, 1)}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-[#15151a]">
                {profile.nickname ?? "사용자"}
              </h2>
              <p className="mt-1 truncate text-xs text-[#777780]">
                {profile.email ?? "이메일 정보 없음"}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-[16px] bg-white p-4">
              <dt className="text-[10px] text-[#85858d]">보유 아이템</dt>
              <dd className="mt-1 text-lg font-bold text-[#15151a]">12</dd>
            </div>
            <div className="rounded-[16px] bg-white p-4">
              <dt className="text-[10px] text-[#85858d]">저장한 추천</dt>
              <dd className="mt-1 text-lg font-bold text-[#15151a]">8</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </MenuPageLayout>
  );
}
