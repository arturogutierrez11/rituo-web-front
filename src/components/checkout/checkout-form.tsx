"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

import { formatCurrency } from "@/lib/format-currency";
import { shippingLabels, shippingPrices } from "@/lib/shipping";
import type { ShippingMethod } from "@/types/checkout";
import type { Product } from "@/types/product";

interface CheckoutFormProps {
  product: Product;
}

const SHIPPING_METHODS: ShippingMethod[] = ["standard"];

export function CheckoutForm({ product }: CheckoutFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [isBusinessPurchase, setIsBusinessPurchase] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState(() =>
    crypto.randomUUID(),
  );

  const subtotal = product.price * quantity;
  const shippingPrice = shippingPrices[shipping];
  const total = useMemo(
    () => subtotal + shippingPrice,
    [shippingPrice, subtotal],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);

    const payload = {
      productSlug: product.slug,
      quantity,
      shippingMethod: shipping,
      customer: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
      },
      shippingAddress: {
        address: formData.get("address"),
        city: formData.get("city"),
        province: formData.get("province"),
        postalCode: formData.get("postalCode"),
      },
      billing: {
        dni: formData.get("dni"),
        useShippingAddress: useShippingAsBilling,
        ...(useShippingAsBilling
          ? {}
          : {
              address: formData.get("billingAddress"),
              city: formData.get("billingCity"),
              province: formData.get("billingProvince"),
              postalCode: formData.get("billingPostalCode"),
            }),
        isBusinessPurchase,
        ...(isBusinessPurchase
          ? {
              cuit: formData.get("cuit"),
              businessName: formData.get("businessName"),
            }
          : {}),
      },
    };

    let response: Response;

    try {
      response = await fetch("/api/checkout/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(payload),
      });
    } catch {
      setErrorMessage(
        "No pudimos conectar con el servidor. Probá de nuevo en unos segundos.",
      );
      setIsSubmitting(false);
      return;
    }

    const data = (await response.json().catch(() => ({}))) as {
      initPoint?: string;
      message?: string;
    };

    if (!response.ok || !data.initPoint) {
      // Respuesta definitiva (validación/negocio): el próximo intento es un
      // pedido lógicamente distinto, así que renovamos la idempotency key.
      setIdempotencyKey(crypto.randomUUID());
      setErrorMessage(data.message ?? "No pudimos iniciar el pago.");
      setIsSubmitting(false);
      return;
    }

    window.location.href = data.initPoint;
  }

  return (
    <main className="rt-page co-page">
      <div className="co-topbar">
        <Link className="co-logo" href="/">
          rituo
        </Link>
        <div className="co-secure">
          <LockIcon />
          Compra protegida
        </div>
      </div>

      <div className="co-grid">
        <section className="co-panel co-panel--form">
          <Link className="co-back" href="/#producto">
            ← Volver
          </Link>

          <p className="co-eyebrow">Finalizá tu compra</p>
          <h1 className="co-title">Tu rituo está más cerca.</h1>
          <p className="co-subtitle">Completá tus datos para coordinar el envío.</p>

          <form className="co-form" onSubmit={handleSubmit}>
            <fieldset className="co-section">
              <div className="co-section__head">
                <span className="co-step">01</span>
                <h2>Datos de contacto</h2>
              </div>
              <div className="co-row-2">
                <div className="co-field">
                  <label className="co-label">Nombre</label>
                  <input
                    className="co-input"
                    autoComplete="given-name"
                    name="firstName"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="co-field">
                  <label className="co-label">Apellido</label>
                  <input
                    className="co-input"
                    autoComplete="family-name"
                    name="lastName"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>
              <div className="co-row-2">
                <div className="co-field">
                  <label className="co-label">Email</label>
                  <input
                    className="co-input"
                    autoComplete="email"
                    name="email"
                    placeholder="nombre@email.com"
                    required
                    type="email"
                  />
                </div>
                <div className="co-field">
                  <label className="co-label">Teléfono</label>
                  <input
                    className="co-input"
                    autoComplete="tel"
                    name="phone"
                    placeholder="+54 9 11 0000 0000"
                    required
                    type="tel"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="co-section">
              <div className="co-section__head">
                <span className="co-step">02</span>
                <h2>Dirección de entrega</h2>
              </div>
              <div className="co-field">
                <label className="co-label">Calle y número</label>
                <input
                  className="co-input"
                  autoComplete="street-address"
                  name="address"
                  placeholder="Av. ejemplo 1234"
                  required
                />
              </div>
              <div className="co-row-3">
                <div className="co-field">
                  <label className="co-label">Ciudad</label>
                  <input
                    className="co-input"
                    autoComplete="address-level2"
                    name="city"
                    placeholder="Buenos Aires"
                    required
                  />
                </div>
                <div className="co-field">
                  <label className="co-label">Provincia</label>
                  <input
                    className="co-input"
                    autoComplete="address-level1"
                    name="province"
                    placeholder="Buenos Aires"
                    required
                  />
                </div>
                <div className="co-field">
                  <label className="co-label">Código postal</label>
                  <input
                    className="co-input"
                    autoComplete="postal-code"
                    name="postalCode"
                    placeholder="C1000"
                    required
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="co-section">
              <div className="co-section__head">
                <span className="co-step">03</span>
                <h2>Envío</h2>
              </div>
              <div className="co-shipping">
                {SHIPPING_METHODS.map((method) => (
                  <label
                    key={method}
                    className={`co-shipping-row${shipping === method ? " is-selected" : ""}`}
                  >
                    <input
                      checked={shipping === method}
                      name="shipping"
                      onChange={() => setShipping(method)}
                      type="radio"
                      value={method}
                    />
                    <span className="co-shipping-row__text">
                      <strong>{shippingLabels[method].title}</strong>
                      <small>{shippingLabels[method].description}</small>
                    </span>
                    <span className="co-shipping-row__price">
                      {shippingPrices[method] === 0
                        ? "Gratis"
                        : formatCurrency(shippingPrices[method], "ARS")}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="co-section">
              <div className="co-section__head">
                <span className="co-step">04</span>
                <h2>Facturación</h2>
              </div>
              <div className="co-field" style={{ maxWidth: 320 }}>
                <label className="co-label">DNI</label>
                <input
                  className="co-input"
                  inputMode="numeric"
                  name="dni"
                  pattern="\d{7,8}"
                  placeholder="30123456"
                  required
                  title="DNI sin puntos, 7 u 8 dígitos"
                />
              </div>
              <label className="co-checkbox">
                <input
                  checked={useShippingAsBilling}
                  onChange={(event) =>
                    setUseShippingAsBilling(event.target.checked)
                  }
                  type="checkbox"
                />
                Usar los mismos datos que el envío
              </label>
              {!useShippingAsBilling && (
                <>
                  <div className="co-field">
                    <label className="co-label">Calle y número</label>
                    <input
                      className="co-input"
                      name="billingAddress"
                      placeholder="Av. ejemplo 1234"
                      required
                    />
                  </div>
                  <div className="co-row-3">
                    <div className="co-field">
                      <label className="co-label">Ciudad</label>
                      <input className="co-input" name="billingCity" placeholder="Buenos Aires" required />
                    </div>
                    <div className="co-field">
                      <label className="co-label">Provincia</label>
                      <input
                        className="co-input"
                        name="billingProvince"
                        placeholder="Buenos Aires"
                        required
                      />
                    </div>
                    <div className="co-field">
                      <label className="co-label">Código postal</label>
                      <input className="co-input" name="billingPostalCode" placeholder="C1000" required />
                    </div>
                  </div>
                </>
              )}
              <label className="co-checkbox">
                <input
                  checked={isBusinessPurchase}
                  onChange={(event) =>
                    setIsBusinessPurchase(event.target.checked)
                  }
                  type="checkbox"
                />
                Comprar como empresa (factura A con CUIT)
              </label>
              {isBusinessPurchase && (
                <div className="co-row-2">
                  <div className="co-field">
                    <label className="co-label">CUIT</label>
                    <input
                      className="co-input"
                      inputMode="numeric"
                      name="cuit"
                      placeholder="30-12345678-9"
                      required
                    />
                  </div>
                  <div className="co-field">
                    <label className="co-label">Razón social</label>
                    <input
                      className="co-input"
                      name="businessName"
                      placeholder="Tu empresa S.A."
                      required
                    />
                  </div>
                </div>
              )}
            </fieldset>

            <fieldset className="co-section">
              <div className="co-section__head">
                <span className="co-step">05</span>
                <h2>Medio de pago</h2>
              </div>
              <p className="co-payment-note">
                En el siguiente paso vas a elegir cómo pagar (tarjeta, efectivo o
                transferencia) de forma segura con Mercado Pago.
              </p>
            </fieldset>

            <button className="rt-btn rt-btn--primary co-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Redirigiendo a Mercado Pago…" : "Continuar al pago →"}
            </button>

            {errorMessage && (
              <p className="co-notice co-notice--error" role="alert">
                {errorMessage}
              </p>
            )}
          </form>
        </section>

        <aside className="co-summary">
          <p className="co-eyebrow">Resumen</p>
          <h2 className="co-summary__title">Tu pedido</h2>

          <div className="co-summary__image">
            <Image alt={product.imageAlt} fill sizes="(max-width: 980px) 100vw, 38vw" src={product.image} />
          </div>

          <h3 className="co-summary__product">{product.name}</h3>
          {product.features && (
            <ul className="co-summary__features">
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          )}

          <div className="co-summary__price-row">
            <span className="co-summary__price">{formatCurrency(product.price, product.currency)}</span>
            <div className="co-qty" aria-label="Cantidad">
              <button
                aria-label="Quitar una unidad"
                disabled={quantity === 1}
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                type="button"
              >
                –
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Agregar una unidad"
                onClick={() => setQuantity((current) => current + 1)}
                type="button"
              >
                +
              </button>
            </div>
          </div>

          <dl className="co-totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatCurrency(subtotal, product.currency)}</dd>
            </div>
            <div>
              <dt>Envío</dt>
              <dd>{shippingPrice === 0 ? "Gratis" : formatCurrency(shippingPrice, product.currency)}</dd>
            </div>
          </dl>
          <div className="co-total-row">
            <span>Total</span>
            <strong>{formatCurrency(total, product.currency)}</strong>
          </div>

          <div className="co-benefits">
            <div>Pago seguro y datos protegidos</div>
            <div>30 días para cambios</div>
            <div>Soporte directo de Rituo</div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 10V7a5 5 0 0 1 10 0v3m-9 0h8a2 2 0 0 1 2 2v7H6v-7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
