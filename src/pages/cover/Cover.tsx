"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Cover = () => {
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
    <main className="relative min-h-screen overflow-hidden bg-[#f5f5f3] text-[#17181d]">
      <div className="relative mx-auto h-[844px] w-[390px] overflow-hidden">
        <section
          className={`absolute inset-0 flex items-start justify-center pt-[18px] transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            showNext ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <div className="w-[390px] px-[22px]">
            <div className="mt-[40px] flex h-[786px] items-start justify-center">
              <div className="flex h-full w-full flex-col items-center rounded-[34px] bg-[#17181d] pt-[320px]">
                <h1 className="text-center text-[42px] font-black leading-[0.92] tracking-[-0.06em] text-white">
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Cover;
