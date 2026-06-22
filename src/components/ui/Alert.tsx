import React from "react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "warning" | "info" | "gold";
  layout?: "banner" | "card";
  title?: string;
  icon?: React.ReactNode;
}

export function Alert({
  children,
  className = "",
  variant = "info",
  layout = "banner",
  title,
  icon,
  ...props
}: AlertProps) {
  // Select standard SVG icon if none provided
  const renderDefaultIcon = () => {
    switch (variant) {
      case "success":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "gold":
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "info":
      default:
        return (
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const currentIcon = icon !== undefined ? icon : renderDefaultIcon();

  if (layout === "card") {
    const cardVariantClasses = {
      success: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      error: "border border-red-500/20 bg-red-500/10 text-red-400",
      warning: "border border-amber-500/20 bg-amber-500/10 text-amber-400",
      info: "border border-blue-500/20 bg-blue-500/10 text-blue-400",
      gold: "border border-[#c9a96e]/20 bg-[#c9a96e]/8 text-[#c9a96e]",
    };

    return (
      <div
        className={`p-6 text-center rounded-sm ${cardVariantClasses[variant]} ${className}`}
        {...props}
      >
        {currentIcon && (
          <div className="flex justify-center mb-4 scale-150">
            {currentIcon}
          </div>
        )}
        {title && (
          <h2 className="font-body font-medium tracking-[-0.02em] text-2xl text-[#f0e8d8] mb-3">
            {title}
          </h2>
        )}
        <div className="text-sm font-body font-light leading-relaxed max-w-sm mx-auto text-[#f0e8d8]/80">
          {children}
        </div>
      </div>
    );
  }

  // Default layout: banner
  const bannerVariantClasses = {
    success: "bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400",
    error: "bg-red-500/10 border-l-4 border-red-500 text-red-400",
    warning: "bg-amber-500/10 border-l-4 border-amber-500 text-amber-400",
    info: "bg-blue-500/10 border-l-4 border-blue-500 text-blue-400",
    gold: "bg-[#c9a96e]/8 border border-[#c9a96e]/25 text-[#f0e8d8]",
  };

  const bannerIconColorClasses = {
    success: "text-emerald-400",
    error: "text-red-400",
    warning: "text-amber-400",
    info: "text-blue-400",
    gold: "text-[#c9a96e]",
  };

  return (
    <div
      className={`flex gap-3 p-5 rounded-sm ${bannerVariantClasses[variant]} ${className}`}
      {...props}
    >
      {currentIcon && (
        <div className={`mt-0.5 shrink-0 ${bannerIconColorClasses[variant]}`}>
          {currentIcon}
        </div>
      )}
      <div className="space-y-1">
        {title && (
          <p className={`text-sm font-body font-medium ${variant === 'gold' ? 'text-[#c9a96e]' : 'text-current'}`}>
            {title}
          </p>
        )}
        <div className="text-xs font-body font-light leading-relaxed text-[#f0e8d8]/80">
          {children}
        </div>
      </div>
    </div>
  );
}
