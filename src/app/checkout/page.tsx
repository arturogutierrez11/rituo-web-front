import { notFound } from "next/navigation";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { mergeProduct } from "@/lib/merge-products";
import { listProducts } from "@/services/checkout-api";

interface CheckoutPageProps {
  searchParams: Promise<{ product?: string; quantity?: string }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { product, quantity } = await searchParams;

  if (!product) {
    notFound();
  }

  const commerce = await listProducts();
  const selectedProduct = mergeProduct(commerce, product);

  if (!selectedProduct) {
    notFound();
  }

  const parsedQuantity = Number.parseInt(quantity ?? "", 10);
  const initialQuantity = Number.isInteger(parsedQuantity)
    ? Math.min(Math.max(parsedQuantity, 1), 20)
    : 1;

  return (
    <CheckoutForm initialQuantity={initialQuantity} product={selectedProduct} />
  );
}
