import React from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  error?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", id, labelProps, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="space-y-2">
        <div className="flex items-start gap-3 py-1">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`mt-1 h-4 w-4 bg-[#1e1e1b] border text-[#c9a96e] focus:ring-[#c9a96e]/50 focus:ring-opacity-25 shrink-0 cursor-pointer accent-[#c9a96e] transition-colors duration-200 ${
              error ? "border-red-400/50" : "border-[#c9a96e]/20"
            } ${className}`}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              {...labelProps}
              className={`text-xs text-[#f0e8d8]/60 leading-tight select-none cursor-pointer ${
                labelProps?.className || ""
              }`}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <span className="text-red-400 text-[11px] font-body block mt-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
