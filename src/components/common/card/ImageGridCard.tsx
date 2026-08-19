import type { CSSProperties } from "react";
import Link from "next/link";

type ImageGridCardProps = {
  title: string;
  subtitle: string;
  imageAlt: string;
  imageUrl?: string;
  fallbackColor?: string;
  fallbackLabel?: string;
  href?: string;
  onClick?: () => void;
};

export const imageGridClassName =
  "h-[206px] w-full rounded-[18px] border border-[#dedee2] bg-[#f8f8f9] p-[11px] text-left";

export function ImageGridCard({
  title,
  subtitle,
  imageAlt,
  imageUrl,
  fallbackColor = "#e9e5df",
  fallbackLabel,
  href,
  onClick,
}: ImageGridCardProps) {
  const imageStyle: CSSProperties = imageUrl
    ? { backgroundImage: `url("${imageUrl}")` }
    : {
        backgroundColor: fallbackColor,
        backgroundImage:
          "linear-gradient(145deg, rgba(255,255,255,0.48), transparent 48%, rgba(21,21,26,0.08))",
      };

  const content = (
    <>
      <span
        aria-label={imageAlt}
        role="img"
        className="flex h-[126px] w-full items-center justify-center rounded-[14px] bg-cover bg-center"
        style={imageStyle}
      >
        {!imageUrl && fallbackLabel ? (
          <span className="text-[10px] font-bold tracking-[0.12em] text-black/35">
            {fallbackLabel}
          </span>
        ) : null}
      </span>
      <span className="mt-3 block truncate text-[13px] leading-4 font-bold text-[#15151a]">
        {title}
      </span>
      <span className="mt-1 block truncate text-[11px] leading-[13px] text-[#777780]">
        {subtitle}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={`${imageGridClassName} transition-[border-color,transform] hover:border-[#c8c2b9] active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]`}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className={`${imageGridClassName} block transition-[border-color,transform] hover:border-[#c8c2b9] active:scale-[0.985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15151a]`}
      >
        {content}
      </Link>
    );
  }

  return <article className={imageGridClassName}>{content}</article>;
}

export function ImageGridSkeleton({
  label,
  count = 4,
}: {
  label: string;
  count?: number;
}) {
  return (
    <div
      aria-label={label}
      className="grid grid-cols-2 gap-x-[10px] gap-y-6"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={`${imageGridClassName} animate-pulse`}
        >
          <div className="h-[126px] rounded-[14px] bg-[#e9e5df]" />
          <div className="mt-3 h-4 w-20 rounded bg-[#e3e0dc]" />
          <div className="mt-2 h-3 w-14 rounded bg-[#e9e6e2]" />
        </div>
      ))}
    </div>
  );
}
