import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, labelProps, rows = 5, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            {...labelProps}
            className={`block text-[10px] tracking-[0.4em] uppercase font-body text-[#c9a96e]/70 mb-2 ${
              labelProps?.className || ""
            }`}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`w-full box-border max-w-full bg-[#1e1e1b] border text-[#f0e8d8] px-4 py-3.5 text-sm font-body font-light placeholder:text-[#f0e8d8]/25 focus:outline-none transition-colors duration-200 resize-none ${
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

Textarea.displayName = "Textarea";
