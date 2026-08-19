"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PulseLoader } from "@/components/common/feedback/PulseLoader";
import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";
import { refreshAccessToken } from "@/lib/axios";

export function OAuthSuccessScreen() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    void refreshAccessToken()
      .then(() => {
        if (active) {
          router.replace("/dashboard");
        }
      })
      .catch(() => {
        if (active) {
          setError(true);
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <MobileScreenLayout contentClassName="flex items-center justify-center bg-white px-6">
      {error ? (
        <div className="text-center">
          <p className="text-[14px] font-bold text-[#15151a]">
            로그인 정보를 확인하지 못했습니다.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex h-12 items-center justify-center rounded-[15px] bg-[#15151a] px-6 text-[13px] font-bold text-white"
          >
            로그인으로 돌아가기
          </Link>
        </div>
      ) : (
        <PulseLoader label="소셜 로그인을 완료하고 있습니다." />
      )}
    </MobileScreenLayout>
  );
}
