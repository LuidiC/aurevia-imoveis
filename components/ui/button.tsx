import type { ButtonHTMLAttributes } from "react";

const buttonVariants = {
  primary:
    "border-primary bg-primary text-primary-foreground shadow-control hover:border-primary-hover hover:bg-primary-hover",
  secondary:
    "border-secondary bg-secondary text-secondary-foreground shadow-control hover:border-secondary-hover hover:bg-secondary-hover",
  outline:
    "border-border-strong bg-transparent text-foreground hover:border-primary hover:bg-accent hover:text-accent-foreground",
  ghost:
    "border-transparent bg-transparent text-foreground hover:bg-muted",
} as const;

const buttonSizes = {
  default: "min-h-11 px-5 py-2.5",
  small: "min-h-10 px-4 py-2 text-sm",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

type ButtonStyleOptions = Readonly<{
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}>;

export function buttonStyles({
  variant = "primary",
  size = "default",
  className = "",
}: ButtonStyleOptions = {}) {
  return `inline-flex items-center justify-center gap-2 rounded-md border font-semibold transition-[background-color,border-color,color,box-shadow] duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Readonly<{
    variant?: ButtonVariant;
    size?: ButtonSize;
  }>;

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      type={type}
      {...props}
    />
  );
}
