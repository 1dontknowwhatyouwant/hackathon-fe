import Link from "next/link";
import type { ReactNode } from "react";

type DetailActionCardProps = {
  title: string;
  description?: string;
  leading?: ReactNode;
  href?: string;
  onClick?: () => void;
};

export function DetailActionCard({
  title,
  description = "세부 정보를 확인하세요",
  leading,
  href,
  onClick,
}: DetailActionCardProps) {
  const content = (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#e9e5df]">
        {leading}
      </span>

      <span className="ml-4 min-w-0 flex-1">
        <span className="block truncate text-[14px] leading-[17px] font-bold text-[#15151a]">
          {title}
        </span>
        <span className="mt-[7px] block truncate text-[11px] leading-[13px] text-[#888890]">
          {description}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="ml-3 text-[22px] leading-none text-[#777780]"
      >
        ›
      </span>
    </>
  );

  const className =
    "flex h-[72px] w-full items-center rounded-[16px] border border-[#dedee2] bg-[#f8f8f9] px-[13px] text-left transition-colors hover:border-[#c8c2b9] hover:bg-[#f5f3f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
