"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  active?: boolean;
  variant?: "default" | "cta";
};

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  active?: boolean;
  href: string;
  variant?: "default" | "cta";
};

type Props = ButtonProps | LinkButtonProps;

const Button = (props: Props) => {
  const { children, className = "", active, variant = "default", ...rest } = props;
  const base =
    "inline-flex items-center justify-center transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-70";
  const state =
    variant === "cta"
      ? "h-[52px] rounded-[16px] bg-[#17181d] text-[15px] font-bold text-white hover:bg-[#17181d]"
      : active
        ? "rounded-full border border-lime-300 bg-lime-300 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-lime-200"
        : "rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-lime-300 hover:bg-lime-50 hover:text-slate-950";
  const classes = `${base} ${state} ${className}`.trim();

  if ("href" in props) {
    return (
      <Link className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;
