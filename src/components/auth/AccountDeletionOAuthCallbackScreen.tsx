"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";

export function AccountDeletionOAuthCallbackScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const destination = error
      ? `/my/account-deletion?reauthError=${encodeURIComponent(error)}`
      : "/my/account-deletion?reauthenticated=true";

    router.replace(destination);
  }, [router, searchParams]);

  return (
    <MobileScreenLayout contentClassName="flex items-center justify-center bg-white px-6">
      <p className="text-[13px] text-[#777780]" role="status">
        소셜 계정 재인증 결과를 확인하고 있습니다.
      </p>
    </MobileScreenLayout>
  );
}
