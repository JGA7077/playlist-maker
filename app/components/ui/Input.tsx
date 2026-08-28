import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-colors focus:border-[#A238FF] focus:ring-1 focus:ring-[#A238FF] placeholder:text-zinc-400 dark:placeholder:text-zinc-500 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
