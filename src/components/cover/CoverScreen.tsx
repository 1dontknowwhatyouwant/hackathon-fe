"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";

const CoverScreen = () => {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleStart = () => {
    if (isLeaving) {
      return;
    }

    setIsLeaving(true);

    window.setTimeout(() => {
      router.push("/login");
    }, 560);
  };

  return (
    <MobileScreenLayout
      animateContent={false}
      contentClassName="relative bg-[#0e0e12] text-white"
      frameClassName="!bg-[#0e0e12] sm:rounded-[28px]"
    >
      <div
        className="cover-screen-enter relative flex h-full w-full flex-col overflow-hidden bg-[#0e0e12] px-6 text-white"
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-[62%] px-6 text-center">
          <h1 className="text-[44px] font-bold leading-none tracking-[-0.05em] text-white">
            입을래?
          </h1>
          <p className="mt-5 text-[13px] font-normal leading-none tracking-[-0.02em] text-[#c2c4cc]">
            내 옷과 취향을 더 오래, 더 잘 쓰는 방법
          </p>
        </div>
        <div className="mt-auto pb-30">
          <button
            type="button"
            onClick={handleStart}
            disabled={isLeaving}
            aria-label="로그인 화면으로 이동"
            className="w-full rounded-[14px] bg-[#c2a67d] px-6 py-[15px] text-center text-[14px] font-bold leading-none tracking-[-0.02em] text-[#0e0e12] transition-transform duration-200 active:scale-[0.99]"
          >
            시작하기
          </button>
        </div>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-50 bg-white transition-opacity duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isLeaving ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </MobileScreenLayout>
  );
};

export default CoverScreen;
