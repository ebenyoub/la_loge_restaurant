import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "filled" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  className = "",
  variant = "default",
  padding = "md",
  ...props
}: CardProps) {
  const variantClasses = {
    default: "border border-[#c9a96e]/10 bg-[#141412]/30 rounded-sm",
    outline: "border border-[#c9a96e]/10 bg-transparent rounded-sm",
    filled: "border border-[#c9a96e]/10 bg-[#141412]/40 rounded-sm",
    interactive: "border border-[#c9a96e]/10 bg-[#141412]/40 hover:border-[#c9a96e]/25 transition-colors duration-300 rounded-sm",
  };

  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-5",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
