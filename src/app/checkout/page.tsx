import { notFound } from "next/navigation";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { mergeProduct } from "@/lib/merge-products";
import { listProducts } from "@/services/checkout-api";

interface CheckoutPageProps {
  searchParams: Promise<{ product?: string }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { product } = await searchParams;

  if (!product) {
    notFound();
  }

  const commerce = await listProducts();
  const selectedProduct = mergeProduct(commerce, product);

  if (!selectedProduct) {
    notFound();
  }

  return <CheckoutForm product={selectedProduct} />;
}
