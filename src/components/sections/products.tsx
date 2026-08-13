import { ProductCard } from "@/components/product/product-card";
import { mergeProducts } from "@/lib/merge-products";
import { listProducts } from "@/services/checkout-api";

export async function Products() {
  const commerce = await listProducts();
  const products = mergeProducts(commerce);

  return (
    <section className="products" id="comprar">
      <div className="section-heading section-heading--center" id="tag">
        <p className="eyebrow">Elegí cómo empezar</p>
        <h2>Un tag para cada ritual</h2>
      </div>
      <div className="products__list">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
