import type { HTMLAttributes } from "react";

const badgeVariants = {
  primary: "border-transparent bg-accent text-accent-foreground",
  neutral: "border-transparent bg-muted text-foreground",
  outline: "border-border-strong bg-surface text-muted-foreground",
} as const;

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  Readonly<{
    variant?: keyof typeof badgeVariants;
  }>;

export function Badge({
  variant = "primary",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wide ${badgeVariants[variant]} ${className}`}
      {...props}
    />
  );
}
