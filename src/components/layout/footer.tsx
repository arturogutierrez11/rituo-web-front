import { Brand } from "@/components/ui/brand";

export function Footer() {
  return (
    <footer className="footer">
      <Brand compact />
      <p>© 2026 Rituo · Todos los derechos reservados</p>
      <nav className="footer__links" aria-label="Legal">
        <a href="#">Términos</a>
        <a href="#">Privacidad</a>
      </nav>
    </footer>
  );
}
