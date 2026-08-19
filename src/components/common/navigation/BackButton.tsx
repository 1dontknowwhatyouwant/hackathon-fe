"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  label?: string;
  variant?: "default" | "plain";
};

export function BackButton({
  label = "이전 화면으로 이동",
  variant = "default",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleBack}
      className={
        variant === "plain"
          ? "group flex size-9 items-center justify-start bg-transparent text-[#121217] transition-colors hover:text-[#8b7355] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]"
          : "group flex size-9 items-center justify-center rounded-full border border-white bg-white text-[#55555d] shadow-[0_5px_18px_rgba(36,31,25,0.06)] backdrop-blur-sm transition-colors hover:border-[#bdb8b1] hover:bg-[#f8f6f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]"
      }
    >
      <span
        aria-hidden="true"
        className="-mt-px pb-1.5 text-[26px] leading-none "
      >
        ‹
      </span>
    </button>
  );
}
