import { ProductCard } from "@/components/product/product-card";
import { products } from "@/data/landing";

export function Products() {
  return (
    <section className="products" id="comprar">
      <div className="section-heading section-heading--center" id="tag">
        <p className="eyebrow">Elegí cómo empezar</p>
        <h2>Un tag para cada ritual</h2>
      </div>
      <div className="products__list">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
