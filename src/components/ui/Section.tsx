import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: "default" | "dark" | "muted" | "card";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export function Section({
  children,
  className = "",
  variant = "default",
  padding = "md",
  ...props
}: SectionProps) {
  const variantClasses = {
    default: "bg-transparent",
    dark: "bg-[#0e0e0c]",
    muted: "bg-[#141412]/30",
    card: "bg-[#141412]/40",
  };

  const paddingClasses = {
    none: "py-0",
    sm: "py-8 sm:py-12",
    md: "py-16 sm:py-20",
    lg: "py-20 lg:py-28",
    xl: "py-24 lg:py-32",
  };

  return (
    <section
      className={`${variantClasses[variant]} ${paddingClasses[padding]} w-full ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
