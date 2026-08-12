"use client";

import { useEffect, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  from?: number;
  duration?: number;
  delay?: number;
  className?: string;
};

function easeInOutCosine(progress: number) {
  return (1 - Math.cos(Math.PI * progress)) / 2;
}

export function AnimatedCounter({
  value,
  from = 1,
  duration = 3_200,
  delay = 180,
  className = "",
}: AnimatedCounterProps) {
  const startValue = Math.min(from, value);
  const [displayValue, setDisplayValue] = useState(startValue);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || value <= startValue || duration <= 0) {
      const reducedMotionFrame = window.requestAnimationFrame(() => {
        setDisplayValue(value);
      });

      return () => window.cancelAnimationFrame(reducedMotionFrame);
    }

    let animationFrame = 0;
    let startedAt: number | null = null;
    const resetFrame = window.requestAnimationFrame(() => {
      setDisplayValue(startValue);
    });

    const animate = (timestamp: number) => {
      if (startedAt === null) {
        startedAt = timestamp;
      }

      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const easedProgress = easeInOutCosine(progress);
      const nextValue = Math.round(
        startValue + (value - startValue) * easedProgress,
      );

      setDisplayValue(nextValue);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const delayTimer = window.setTimeout(() => {
      animationFrame = window.requestAnimationFrame(animate);
    }, Math.max(delay, 0));

    return () => {
      window.clearTimeout(delayTimer);
      window.cancelAnimationFrame(resetFrame);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [delay, duration, startValue, value]);

  return (
    <span className={className} aria-label={String(value)}>
      <span aria-hidden="true">{displayValue}</span>
    </span>
  );
}
