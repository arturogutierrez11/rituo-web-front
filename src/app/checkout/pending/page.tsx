import { Brand } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";
import { getOrder } from "@/services/checkout-api";

interface CheckoutPendingPageProps {
  searchParams: Promise<{ external_reference?: string; payment_id?: string }>;
}

export default async function CheckoutPendingPage({
  searchParams,
}: CheckoutPendingPageProps) {
  const { external_reference: orderId, payment_id: paymentId } =
    await searchParams;

  if (orderId) {
    try {
      await getOrder(orderId);
    } catch (error) {
      console.error("No pudimos verificar la orden", error);
    }
  }

  return (
    <main className="order-status">
      <Brand />
      <div className="order-status__card order-status__card--pending">
        <p className="eyebrow">Pago pendiente</p>
        <h1>Tu pago está pendiente</h1>
        <p>
          Elegiste un medio de pago que puede tardar en acreditarse (por
          ejemplo, efectivo o transferencia). Te enviaremos un email en
          cuanto Mercado Pago confirme el pago.
        </p>
        {paymentId && (
          <p className="order-status__reference">N° de pago: {paymentId}</p>
        )}
        <ButtonLink href="/">Volver al inicio</ButtonLink>
      </div>
    </main>
  );
}
