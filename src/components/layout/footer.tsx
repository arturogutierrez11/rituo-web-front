import { Brand } from "@/components/ui/brand";

export function Footer() {
  return (
    <footer className="footer">
      <Brand compact />
      <p>© 2026 Rituo · Todos los derechos reservados</p>
      <nav className="footer__links" aria-label="Navegación del pie de página">
        <a href="/redes">Redes y contacto</a>
        <a href="/soporte">Soporte</a>
        <a href="/legal/terminos-y-condiciones">Términos</a>
        <a href="/legal/politica-de-privacidad">Privacidad</a>
      </nav>
    </footer>
  );
}
