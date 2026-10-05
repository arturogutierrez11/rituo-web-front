import { notFound } from "next/navigation";

import { Brand } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { formatCurrency } from "@/lib/format-currency";
import { getOrder } from "@/services/checkout-api";
import type { Order } from "@/types/order";

const WHATSAPP_PROOF_URL = "https://w.app/0qunme";

interface CheckoutTransferPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutTransferPage({
  searchParams,
}: CheckoutTransferPageProps) {
  const { order: orderId } = await searchParams;

  if (!orderId) {
    notFound();
  }

  let order: Order | null = null;

  try {
    order = await getOrder(orderId);
  } catch (error) {
    console.error("No pudimos cargar la orden por transferencia", error);
  }

  if (!order || order.salesChannel !== "bank_transfer") {
    notFound();
  }

  const isConfirmed = order.status === "approved";
  const bank = order.bankTransfer;
  const rows: { label: string; value: string | null | undefined }[] = [
    { label: "Importe", value: formatCurrency(order.total, order.currency) },
    { label: "Titular", value: bank?.holder },
    { label: "CUIT/CUIL", value: bank?.cuit },
    { label: "Banco", value: bank?.bank },
    { label: "CBU", value: bank?.cbu },
    { label: "Alias", value: bank?.alias },
    { label: "N° de orden", value: order.id },
  ];

  return (
    <main className="order-status">
      <Brand />
      <div className="order-status__card order-status__card--pending">
        <p className="eyebrow">
          {isConfirmed ? "Pago confirmado" : "Pedido recibido"}
        </p>
        <h1>
          {isConfirmed
            ? "¡Gracias por tu compra!"
            : "Estamos verificando tu transferencia"}
        </h1>
        <p>
          {isConfirmed
            ? "Ya acreditamos tu pago. En breve nos contactamos para coordinar el envío."
            : `Recibimos tu pedido por ${formatCurrency(order.total, order.currency)} (ya incluye el 10% de descuento). Mandanos el comprobante por WhatsApp (o respondiendo el email que te enviamos), indicando tu N° de orden, para acelerar la confirmación. Apenas acreditemos el pago, te confirmamos y coordinamos el envío.`}
        </p>

        {!isConfirmed && (
          <dl className="transfer-details">
            {rows
              .filter((row) => row.value)
              .map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
          </dl>
        )}

        {!isConfirmed && (
          <ButtonLink
            className="button-link--whatsapp"
            href={WHATSAPP_PROOF_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <WhatsAppIcon />
            Enviar el comprobante por WhatsApp
          </ButtonLink>
        )}

        <ButtonLink href="/" variant={isConfirmed ? "light" : "ghost"}>
          Volver al inicio
        </ButtonLink>
      </div>
    </main>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2a9.93 9.93 0 0 0-8.5 15.07L2 22l5.07-1.5A9.94 9.94 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.45 1.34-2 1.4-.52.06-1.18.09-1.9-.12a17 17 0 0 1-1.72-.64c-3.03-1.3-5-4.34-5.15-4.54-.15-.2-1.23-1.64-1.23-3.12 0-1.49.78-2.22 1.06-2.52.28-.3.6-.38.8-.38l.58.01c.19 0 .43-.07.67.5.25.6.84 2.07.91 2.22.08.15.13.32.03.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.77 1.27 1.65 2.06 1.13 1 2.09 1.32 2.39 1.47.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.28.1 1.75.83 2.05.98.3.15.5.22.57.35.08.12.08.73-.17 1.43Z" />
    </svg>
  );
}
