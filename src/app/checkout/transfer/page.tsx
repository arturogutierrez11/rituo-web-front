import { notFound } from "next/navigation";

import { Brand } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { CopyButton } from "@/components/ui/copy-button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
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
                  <dd>
                    {row.value}
                    {(row.label === "Alias" || row.label === "CBU") && (
                      <CopyButton label={row.label} value={row.value as string} />
                    )}
                  </dd>
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
