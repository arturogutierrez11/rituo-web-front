import { Brand } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";

export default function CheckoutFailurePage() {
  return (
    <main className="order-status">
      <Brand />
      <div className="order-status__card order-status__card--failure">
        <p className="eyebrow">Pago no procesado</p>
        <h1>No pudimos procesar tu pago</h1>
        <p>
          Mercado Pago rechazó o canceló la operación. No te preocupes, no se
          realizó ningún cobro. Podés intentar de nuevo con otro medio de
          pago.
        </p>
        <ButtonLink href="/#comprar">Volver a intentar</ButtonLink>
      </div>
    </main>
  );
}
