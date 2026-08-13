import Link from "next/link";

import { Brand } from "@/components/ui/brand";

export function Header() {
  return (
    <header className="header">
      <Brand />
      <Link href="/#comprar" className="button-link button-link--light header__mobile-cta" style={{ minHeight: 42, fontSize: "0.82rem" }}>
        Comprar →
      </Link>
    </header>
  );
}
