import { Brand } from "@/components/ui/brand";

export function Header() {
  return (
    <header className="header">
      <Brand />
      <a href="#lista-de-espera" className="button-link button-link--light header__mobile-cta" style={{ minHeight: 42, fontSize: "0.82rem" }}>
        Unirme →
      </a>
    </header>
  );
}
