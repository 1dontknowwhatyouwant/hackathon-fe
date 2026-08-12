import type { CSSProperties, ReactNode } from "react";

type LuxuryRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

type LuxuryRevealStyle = CSSProperties & {
  "--luxury-reveal-delay": string;
};

/**
 * 페이지 진입 시 콘텐츠를 절제된 상승·페이드·블러 효과로 보여줍니다.
 * delay를 조절하면 여러 영역을 순차적으로 등장시킬 수 있습니다.
 */
export function LuxuryReveal({
  children,
  className = "",
  delay = 0,
}: LuxuryRevealProps) {
  const safeDelay = Math.min(Math.max(delay, 0), 1_000);
  const style: LuxuryRevealStyle = {
    "--luxury-reveal-delay": `${safeDelay}ms`,
  };

  return (
    <div className={`luxury-reveal ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
