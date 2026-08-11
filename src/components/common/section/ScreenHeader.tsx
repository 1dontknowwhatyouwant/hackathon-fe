import type { ReactNode } from "react";

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
};

export function ScreenHeader({
  eyebrow,
  title,
  description,
}: ScreenHeaderProps) {
  return (
    <header>
      <p className="text-[11px] font-bold tracking-[0.01em] text-[#8b7355]">
        {eyebrow}
      </p>
      <h1 className="mt-1 text-[28px] leading-[1.2] font-bold tracking-[-0.035em] text-[#15151a]">
        {title}
      </h1>
      {description ? (
        <div className="mt-2 text-[13px] leading-4 text-[#777780]">
          {description}
        </div>
      ) : null}
    </header>
  );
}
