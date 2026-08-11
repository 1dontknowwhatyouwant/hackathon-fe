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
  }, [router]);

  useEffect(() => {
    if (!showNext) {
      return;
    }

    const timer = window.setTimeout(() => {
      router.push("/design-system");
    }, 700);

    return () => window.clearTimeout(timer);
  }, [router, showNext]);

  const handleStart = () => {
    setShowNext(true);
  };

  return (
    <MobileScreenLayout contentClassName="relative bg-[#17181d] text-[#17181d]">
      <section
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          showNext ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <h1 className="text-center text-[42px] leading-[0.92] font-black tracking-[-0.06em] text-white">
          입을래?
        </h1>
        <p className="mt-[18px] text-[16px] font-normal tracking-[-0.03em] text-[#a9abb1]">
          Luxury lifecycle styling service
        </p>

        <button
          type="button"
          className="mt-[88px] h-[54px] w-[176px] rounded-full bg-[#be9d71]"
          aria-label="로그인"
          onClick={handleStart}
        />
      </section>
    </MobileScreenLayout>
  );
};

export default CoverScreen;
