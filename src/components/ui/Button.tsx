import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  primary: "bg-charcoal text-cream hover:bg-[#4a4a42]",
  secondary: "border border-charcoal/25 bg-transparent text-charcoal hover:border-charcoal hover:bg-paper",
  inverse: "bg-cream text-charcoal hover:bg-sand",
  ghost: "bg-transparent text-charcoal underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-[0.95rem]",
  lg: "min-h-13 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: CommonProps & ComponentProps<"button">) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
