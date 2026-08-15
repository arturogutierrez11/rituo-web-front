import type { AnchorHTMLAttributes, PropsWithChildren } from "react";

interface RtButtonProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    PropsWithChildren {
  variant?: "primary" | "ghost" | "on-dark";
}

export function RtButton({
  children,
  className = "",
  variant = "primary",
  ...props
}: RtButtonProps) {
  return (
    <a className={`rt-btn rt-btn--${variant} ${className}`.trim()} {...props}>
      {children}
    </a>
  );
}
