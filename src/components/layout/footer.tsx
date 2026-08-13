import Link from "next/link";

import { Brand } from "@/components/ui/brand";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Brand compact />
          <p>
            Rituo convierte el impulso de abrir el celular en una decisión
            consciente, con una tarjeta NFC y un pequeño ritual.
          </p>
        </div>

        <nav className="footer__col" aria-label="Producto">
          <p className="footer__col-title">Producto</p>
          <Link href="/#comprar">Comprar</Link>
          <Link href="/#descargar">Descargar la app</Link>
          <Link href="/#como-funciona">Cómo funciona</Link>
        </nav>

        <nav className="footer__col" aria-label="Ecosistema Rituo">
          <p className="footer__col-title">Ecosistema</p>
          <Link href="/#comprar">Rituo — foco personal</Link>
          <span className="footer__col-soon">Rituo Spaces — próximamente</span>
        </nav>

        <nav className="footer__col" aria-label="Soporte y legales">
          <p className="footer__col-title">Ayuda</p>
          <Link href="/redes">Redes y contacto</Link>
          <Link href="/soporte">Soporte</Link>
          <Link href="/legal/terminos-y-condiciones">Términos</Link>
          <Link href="/legal/politica-de-privacidad">Privacidad</Link>
        </nav>
      </div>

      <div className="footer__bottom">
        <p>© 2026 Rituo · Todos los derechos reservados</p>
      </div>
    </footer>
  );
}
