import type { AnchorHTMLAttributes, PropsWithChildren } from "react";

interface ButtonLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    PropsWithChildren {
  variant?: "light" | "ghost";
}

export function ButtonLink({
  children,
  className = "",
  variant = "light",
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={`button-link button-link--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </a>
  );
}
