"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  active?: boolean;
};

const Button = ({ children, className = "", active, ...props }: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400";
  const state = active
    ? "border-lime-300 bg-lime-300 text-slate-950 hover:bg-lime-200"
    : "border-slate-300 bg-white text-slate-700 hover:border-lime-300 hover:bg-lime-50 hover:text-slate-950";

  return (
    <button className={`${base} ${state} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default Button;
