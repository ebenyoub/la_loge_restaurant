import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-body uppercase font-semibold tracking-[0.3em] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#c9a96e]/50 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-sm";

    const variantClasses = {
      primary: "bg-[#c9a96e] text-[#0b0b09] hover:bg-[#dbbe86]",
      secondary:
        "border border-[#c9a96e]/35 text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0b0b09]",
      danger: "bg-[#d4183d] text-white hover:bg-[#e62e52]",
      ghost: "text-[#f0e8d8] hover:bg-[#1e1e1b] hover:text-[#c9a96e]",
    };

    const sizeClasses = {
      sm: "py-2 px-4 text-[10px]",
      md: "py-3.5 px-6 text-[11px]",
      lg: "py-4 px-8 text-[11px]",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-3 w-3 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Chargement...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
