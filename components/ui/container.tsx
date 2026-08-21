import type { ReactNode } from "react";

type ContainerProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`site-container ${className}`}>
      {children}
    </div>
  );
}
