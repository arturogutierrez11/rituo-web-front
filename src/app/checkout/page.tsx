import { notFound } from "next/navigation";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { products } from "@/data/landing";

interface CheckoutPageProps {
  searchParams: Promise<{ product?: string }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { product } = await searchParams;
  const selectedProduct = products.find((item) => item.id === product);

  if (!selectedProduct) {
    notFound();
  }

  return <CheckoutForm product={selectedProduct} />;
}
