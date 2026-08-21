import type { SelectHTMLAttributes } from "react";

import { controlStyles } from "@/components/ui/input";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", ...props }: SelectProps) {
  return (
    <select className={`${controlStyles} cursor-pointer pr-10 ${className}`} {...props} />
  );
}
