"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { MobileScreenLayout } from "@/components/common/layout/MobileScreenLayout";

const CoverScreen = () => {
  const router = useRouter();
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowNext(true);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showNext) {
      return;
    }

    const timer = window.setTimeout(() => {
      router.push("/login");
    }, 700);

    return () => window.clearTimeout(timer);
  }, [router, showNext]);

  const handleStart = () => {
    setShowNext(true);
  };

  return (
    <MobileScreenLayout
      contentClassName="relative bg-[#efede8] text-[#15151a]"
      frameClassName="bg-[#f7f2eb]"
    >
      <button
        type="button"
        onClick={handleStart}
        aria-label="로그인 화면으로 이동"
        className={`relative flex h-full w-full flex-col overflow-hidden rounded-[36px] px-6 py-5 text-[#15151a] transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showNext ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute left-1/2 top-[332px] flex -translate-x-1/2 flex-col items-center">
          <h1 className="text-[50px] font-bold leading-none tracking-[-0.07em] text-[#15151a]">
            입을래?
          </h1>
          <p className="mt-[50px] text-[11px] font-bold leading-none tracking-[-0.02em] text-[#8b7355]">
            MCM AI LIFESTYLE
          </p>
        </div>
        <p className="absolute left-1/2 top-[691px] w-full -translate-x-1/2 px-4 text-center text-[12px] font-normal leading-none tracking-[-0.03em] text-[#777780]">
          나의 취향과 제품의 가치를 함께 기억해요
        </p>
      </button>
    </MobileScreenLayout>
  );
};

export default CoverScreen;
