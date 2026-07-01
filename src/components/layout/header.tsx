import { Brand } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";

export function Header() {
  return (
    <header className="header">
      <Brand />
      <nav className="header__nav" aria-label="Navegación principal">
        <a href="#como-funciona">Cómo funciona</a>
        <a href="#comprar">Lista de espera</a>
        <ButtonLink href="#comprar">Preventa</ButtonLink>
      </nav>
      <ButtonLink className="header__mobile-cta" href="#comprar">
        Preventa
      </ButtonLink>
    </header>
  );
}
