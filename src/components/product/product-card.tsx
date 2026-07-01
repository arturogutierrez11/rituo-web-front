import Image from "next/image";

import { ButtonLink } from "@/components/ui/button-link";
import { formatCurrency } from "@/lib/format-currency";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const minimumQuantity = product.minimumQuantity ?? 1;
  const displayedPrice = product.price * minimumQuantity;

  return (
    <article className={`product-card product-card--${product.variant}`}>
      <div className="product-card__content">
        <span className="product-card__label">{product.label}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        {product.features && (
          <ul className="product-card__features">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        )}

        <div className="product-card__purchase">
          <span>{minimumQuantity > 1 ? "Desde" : "Precio final"}</span>
          <strong>{formatCurrency(displayedPrice, product.currency)}</strong>
          {minimumQuantity > 1 && (
            <small>{minimumQuantity} unidades incluidas</small>
          )}
        </div>

        <ButtonLink href={`/checkout?product=${product.id}`}>
          {product.ctaLabel ?? "Iniciar compra"}
        </ButtonLink>
      </div>
      <div className="product-card__media">
        {product.variant === "business" ? (
          <div className="business-stack" aria-label={product.imageAlt}>
            {[0, 1, 2].map((card) => (
              <Image
                alt={card === 0 ? product.imageAlt : ""}
                aria-hidden={card > 0}
                className={`business-stack__card business-stack__card--${card + 1}`}
                height={1280}
                key={card}
                sizes="(max-width: 800px) 82vw, 45vw"
                src={product.image}
                width={1564}
              />
            ))}
            <div className="business-stack__badge">
              <span>10+</span>
              Tags para tu equipo
            </div>
          </div>
        ) : (
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 800px) 100vw, 55vw"
          />
        )}
      </div>
    </article>
  );
}
