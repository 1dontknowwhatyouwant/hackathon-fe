"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AccountConfirmationScreen } from "@/components/my/AccountConfirmationScreen";
import { authApi } from "@/services/api";

export function LogoutConfirmationScreen() {
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
      // 서버 요청이 실패해도 authApi.logout의 finally에서 로컬 세션은 정리합니다.
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <AccountConfirmationScreen
      sectionTitle="로그아웃"
      title="로그아웃하시겠어요?"
      description="언제든지 다시 로그인해 서비스를 이용할 수 있어요."
      cancelLabel="계속 이용하기"
      confirmLabel="로그아웃"
      pendingLabel="로그아웃 중"
      isPending={isLoggingOut}
      onCancel={() => router.back()}
      onConfirm={handleLogout}
    />
  );
}
