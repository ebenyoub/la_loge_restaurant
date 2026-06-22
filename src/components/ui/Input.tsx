import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, labelProps, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            {...labelProps}
            className={`block text-[10px] tracking-[0.4em] uppercase font-body text-[#c9a96e]/70 mb-2 ${
              labelProps?.className || ""
            }`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full box-border max-w-full bg-[#1e1e1b] border text-[#f0e8d8] px-4 py-3.5 text-sm font-body font-light placeholder:text-[#f0e8d8]/25 focus:outline-none transition-colors duration-200 ${
            error
              ? "border-red-400/50 focus:border-red-400"
              : "border-[#c9a96e]/15 focus:border-[#c9a96e]/50"
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-red-400 text-[11px] font-body mt-1 block">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
