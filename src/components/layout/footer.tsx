import { Brand } from "@/components/ui/brand";

export function Footer() {
  return (
    <footer className="footer">
      <Brand compact />
      <p>Una tecnología simple para estar donde elegís estar.</p>
      <div className="footer__right">
        <p className="footer__legal">© 2026 Rituo · Todos los derechos reservados</p>
        <div className="footer__links">
          <a href="#">Términos</a>
          <a href="#">Privacidad</a>
        </div>
      </div>
    </footer>
  );
}
