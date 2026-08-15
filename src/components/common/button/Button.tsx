"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

type CommonButtonProps = {
  children: ReactNode;
  active?: boolean;
  className?: string;
  variant?: "default" | "cta";
};

type ButtonProps = CommonButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonButtonProps> & {
    href?: never;
  };

type LinkButtonProps = CommonButtonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonButtonProps>;

type Props = ButtonProps | LinkButtonProps;

function getButtonClassName(
  active = false,
  variant: CommonButtonProps["variant"] = "default",
  className = "",
) {
  const base =
    "inline-flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70";
  const state =
    variant === "cta"
      ? "h-[52px] rounded-[16px] bg-[#17181d] text-[15px] font-bold text-white hover:bg-[#17181d]"
      : active
        ? "rounded-full border border-lime-300 bg-lime-300 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-lime-200"
        : "rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-lime-300 hover:bg-lime-50 hover:text-slate-950";
  return `${base} ${state} ${className}`.trim();
}

const Button = (props: Props) => {
  if (props.href !== undefined) {
    const { children, className, active, variant, ...linkProps } = props;
    const classes = getButtonClassName(active, variant, className);

    return (
      <Link {...linkProps} className={classes}>
        {children}
      </Link>
    );
  }

  const { children, className, active, variant, ...buttonProps } = props;
  const classes = getButtonClassName(active, variant, className);

  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  );
};

export default Button;
