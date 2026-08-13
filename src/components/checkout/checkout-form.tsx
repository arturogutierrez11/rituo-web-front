"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

import { Brand } from "@/components/ui/brand";
import { formatCurrency } from "@/lib/format-currency";
import { shippingPrices } from "@/lib/shipping";
import type { ShippingMethod } from "@/types/checkout";
import type { Product } from "@/types/product";

interface CheckoutFormProps {
  product: Product;
}

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
    <main className="checkout">
      <header className="checkout-header">
        <Brand />
        <div className="checkout-header__security">
          <LockIcon />
          Compra protegida
        </div>
      </header>

      <div className="checkout-layout">
        <section className="checkout-panel checkout-panel--form">
          <Link className="checkout-back" href="/#comprar">
            <ArrowLeftIcon />
            Volver
          </Link>

          <div className="checkout-title">
            <p className="eyebrow">Finalizá tu compra</p>
            <h1>Tu Rituo está más cerca</h1>
            <p>Completá tus datos para coordinar el envío.</p>
          </div>

          <form className="checkout-form" onSubmit={handleSubmit}>
            <fieldset className="checkout-section">
              <legend>
                <span>01</span>
                Datos de contacto
              </legend>
              <div className="checkout-fields checkout-fields--two">
                <label>
                  Nombre
                  <input
                    autoComplete="given-name"
                    name="firstName"
                    placeholder="Tu nombre"
                    required
                  />
                </label>
                <label>
                  Apellido
                  <input
                    autoComplete="family-name"
                    name="lastName"
                    placeholder="Tu apellido"
                    required
                  />
                </label>
              </div>
              <div className="checkout-fields checkout-fields--two">
                <label>
                  Email
                  <input
                    autoComplete="email"
                    name="email"
                    placeholder="nombre@email.com"
                    required
                    type="email"
                  />
                </label>
                <label>
                  Teléfono
                  <input
                    autoComplete="tel"
                    name="phone"
                    placeholder="+54 9 11 0000 0000"
                    required
                    type="tel"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset className="checkout-section">
              <legend>
                <span>02</span>
                Dirección de entrega
              </legend>
              <div className="checkout-fields">
                <label>
                  Calle y número
                  <input
                    autoComplete="street-address"
                    name="address"
                    placeholder="Av. ejemplo 1234"
                    required
                  />
                </label>
              </div>
              <div className="checkout-fields checkout-fields--address">
                <label>
                  Ciudad
                  <input
                    autoComplete="address-level2"
                    name="city"
                    placeholder="Buenos Aires"
                    required
                  />
                </label>
                <label>
                  Provincia
                  <input
                    autoComplete="address-level1"
                    name="province"
                    placeholder="Buenos Aires"
                    required
                  />
                </label>
                <label>
                  Código postal
                  <input
                    autoComplete="postal-code"
                    name="postalCode"
                    placeholder="C1000"
                    required
                  />
                </label>
              </div>
            </fieldset>

            <fieldset className="checkout-section">
              <legend>
                <span>03</span>
                Envío
              </legend>
              <div className="checkout-options">
                <label
                  className={`checkout-option ${
                    shipping === "standard" ? "is-selected" : ""
                  }`}
                >
                  <input
                    checked={shipping === "standard"}
                    name="shipping"
                    onChange={() => setShipping("standard")}
                    type="radio"
                    value="standard"
                  />
                  <span className="checkout-option__icon">
                    <PackageIcon />
                  </span>
                  <span>
                    <strong>Envío estándar</strong>
                    <small>3 a 5 días hábiles</small>
                  </span>
                  <b>Gratis</b>
                </label>
                <label
                  className={`checkout-option ${
                    shipping === "express" ? "is-selected" : ""
                  }`}
                >
                  <input
                    checked={shipping === "express"}
                    name="shipping"
                    onChange={() => setShipping("express")}
                    type="radio"
                    value="express"
                  />
                  <span className="checkout-option__icon">
                    <BoltIcon />
                  </span>
                  <span>
                    <strong>Envío express</strong>
                    <small>1 a 2 días hábiles</small>
                  </span>
                  <b>{formatCurrency(shippingPrices.express, "ARS")}</b>
                </label>
              </div>
            </fieldset>

            <fieldset className="checkout-section">
              <legend>
                <span>04</span>
                Facturación
              </legend>
              <div className="checkout-fields checkout-fields--two">
                <label>
                  DNI
                  <input
                    inputMode="numeric"
                    name="dni"
                    pattern="\d{7,8}"
                    placeholder="30123456"
                    required
                    title="DNI sin puntos, 7 u 8 dígitos"
                  />
                </label>
              </div>
              <label className="checkout-checkbox">
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
                  <div className="checkout-fields">
                    <label>
                      Calle y número
                      <input
                        name="billingAddress"
                        placeholder="Av. ejemplo 1234"
                        required
                      />
                    </label>
                  </div>
                  <div className="checkout-fields checkout-fields--address">
                    <label>
                      Ciudad
                      <input name="billingCity" placeholder="Buenos Aires" required />
                    </label>
                    <label>
                      Provincia
                      <input
                        name="billingProvince"
                        placeholder="Buenos Aires"
                        required
                      />
                    </label>
                    <label>
                      Código postal
                      <input name="billingPostalCode" placeholder="C1000" required />
                    </label>
                  </div>
                </>
              )}
              <label className="checkout-checkbox">
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
                <div className="checkout-fields checkout-fields--two">
                  <label>
                    CUIT
                    <input
                      inputMode="numeric"
                      name="cuit"
                      placeholder="30-12345678-9"
                      required
                    />
                  </label>
                  <label>
                    Razón social
                    <input
                      name="businessName"
                      placeholder="Tu empresa S.A."
                      required
                    />
                  </label>
                </div>
              )}
            </fieldset>

            <fieldset className="checkout-section">
              <legend>
                <span>05</span>
                Medio de pago
              </legend>
              <p className="checkout-payment-note">
                <CardIcon />
                En el siguiente paso vas a elegir cómo pagar (tarjeta,
                efectivo o transferencia) de forma segura con Mercado Pago.
              </p>
            </fieldset>

            <button
              className="checkout-submit"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Redirigiendo a Mercado Pago…" : "Continuar al pago"}
              <ArrowRightIcon />
            </button>

            {errorMessage && (
              <p className="checkout-notice checkout-notice--error" role="alert">
                {errorMessage}
              </p>
            )}
          </form>
        </section>

        <aside className="checkout-panel checkout-summary">
          <div className="checkout-summary__sticky">
            <p className="eyebrow">Resumen</p>
            <h2>Tu pedido</h2>

            <div
              className={`checkout-product checkout-product--${product.variant}`}
            >
              <div className="checkout-product__image">
                <Image
                  alt={product.imageAlt}
                  fill
                  loading="eager"
                  priority
                  sizes="(max-width: 900px) 100vw, 38vw"
                  src={product.image}
                />
              </div>
              <div className="checkout-product__details">
                <span>Rituo</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="checkout-product__bottom">
                  <div className="checkout-product__price">
                    <strong>
                      {formatCurrency(product.price, product.currency)}
                    </strong>
                  </div>
                  <div className="quantity" aria-label="Cantidad">
                    <button
                      aria-label="Quitar una unidad"
                      disabled={quantity === 1}
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                      type="button"
                    >
                      −
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
              </div>
            </div>

            <dl className="checkout-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatCurrency(subtotal, product.currency)}</dd>
              </div>
              <div>
                <dt>Envío</dt>
                <dd>
                  {shippingPrice === 0
                    ? "Gratis"
                    : formatCurrency(shippingPrice, product.currency)}
                </dd>
              </div>
              <div className="checkout-totals__total">
                <dt>Total</dt>
                <dd>{formatCurrency(total, product.currency)}</dd>
              </div>
            </dl>

            <div className="checkout-benefits">
              <p>
                <ShieldIcon />
                Pago seguro y datos protegidos
              </p>
              <p>
                <RefreshIcon />
                30 días para cambios
              </p>
              <p>
                <MessageIcon />
                Soporte directo de Rituo
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

interface IconProps {
  className?: string;
}

function Icon({
  children,
  className,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <Icon>
      <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="1.8" />
    </Icon>
  );
}

function ArrowRightIcon() {
  return (
    <Icon>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" />
    </Icon>
  );
}

function LockIcon() {
  return (
    <Icon>
      <path
        d="M7 10V7a5 5 0 0 1 10 0v3m-9 0h8a2 2 0 0 1 2 2v7H6v-7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </Icon>
  );
}

function PackageIcon() {
  return (
    <Icon>
      <path
        d="m4 8 8-4 8 4-8 4-8-4Zm0 0v9l8 4 8-4V8m-8 4v9"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </Icon>
  );
}

function BoltIcon() {
  return (
    <Icon>
      <path
        d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </Icon>
  );
}

function CardIcon() {
  return (
    <Icon>
      <path
        d="M3 6h18v12H3V6Zm0 4h18M7 15h4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </Icon>
  );
}

function ShieldIcon() {
  return (
    <Icon>
      <path
        d="M12 3 5 6v5c0 4.7 2.8 8 7 10 4.2-2 7-5.3 7-10V6l-7-3Zm-3 9 2 2 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </Icon>
  );
}

function RefreshIcon() {
  return (
    <Icon>
      <path
        d="M20 7v5h-5M4 17v-5h5m10.2-2A8 8 0 0 0 5.5 7M4.8 14A8 8 0 0 0 18.5 17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </Icon>
  );
}

function MessageIcon() {
  return (
    <Icon>
      <path
        d="M4 5h16v11H9l-5 4V5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </Icon>
  );
}
