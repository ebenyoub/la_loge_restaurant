import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, labelProps, children, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            {...labelProps}
            className={`block text-[10px] tracking-[0.4em] uppercase font-body text-[#c9a96e]/70 mb-2 ${
              labelProps?.className || ""
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`w-full box-border max-w-full bg-[#1e1e1b] border text-[#f0e8d8] pl-4 pr-10 py-3.5 text-sm font-body font-light placeholder:text-[#f0e8d8]/25 focus:outline-none transition-colors duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? "border-red-400/50 focus:border-red-400"
                : "border-[#c9a96e]/15 focus:border-[#c9a96e]/50"
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#c9a96e]/70">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && (
          <span className="text-red-400 text-[11px] font-body mt-1 block">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
