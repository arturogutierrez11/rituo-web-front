import { Brand } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { getOrder } from "@/services/checkout-api";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    external_reference?: string;
    payment_id?: string;
    status?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const {
    external_reference: orderId,
    payment_id: paymentId,
    status,
  } = await searchParams;

  let confirmed = status === "approved";

  if (orderId) {
    try {
      const order = await getOrder(orderId);
      if (order) {
        confirmed = order.status === "approved";
      }
    } catch (error) {
      console.error("No pudimos verificar la orden", error);
    }
  }

  return (
    <main className="order-status">
      <Brand />
      <div className="order-status__card order-status__card--success">
        <p className="eyebrow">
          {confirmed ? "Pago confirmado" : "Pago en revisión"}
        </p>
        <h1>
          {confirmed ? "¡Gracias por tu compra!" : "Estamos confirmando tu pago"}
        </h1>
        <p>
          {confirmed
            ? "Te enviamos un email con el resumen del pedido. En breve nos contactamos para coordinar el envío."
            : "Tu pago está siendo procesado por Mercado Pago. Te avisaremos por email en cuanto se confirme."}
        </p>
        {paymentId && (
          <p className="order-status__reference">N° de pago: {paymentId}</p>
        )}
        <ButtonLink href="/">Volver al inicio</ButtonLink>
      </div>
    </main>
  );
}
