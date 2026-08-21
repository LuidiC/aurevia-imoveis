import type { InputHTMLAttributes } from "react";

const controlStyles =
  "min-h-12 w-full rounded-md border border-border-strong bg-surface px-4 text-base text-foreground shadow-control outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-focus/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-destructive/15";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return <input className={`${controlStyles} ${className}`} {...props} />;
}

export { controlStyles };
