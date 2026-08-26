"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { formatCurrency } from "@/lib/format-currency";
import type { ProductCommerce } from "@/types/product";

interface ManualOrderFormProps {
  products: ProductCommerce[];
}

const PAYMENT_METHODS = ["Efectivo", "Transferencia", "Otro"];

function emptyClass(value: string) {
  return value.trim() ? "" : "manual-order-field--empty";
}

function emptyForm(products: ProductCommerce[]) {
  return {
    productSlug: products[0]?.slug ?? "",
    quantity: "1",
    unitPrice: String(products[0]?.price ?? 0),
    shippingMethod: "standard" as "standard" | "express",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    dni: "",
    useShippingAddress: true,
    billingAddress: "",
    billingCity: "",
    billingProvince: "",
    billingPostalCode: "",
    isBusinessPurchase: false,
    cuit: "",
    businessName: "",
    manualPaymentMethod: PAYMENT_METHODS[0],
    manualPaymentNote: "",
  };
}

export function ManualOrderForm({ products }: ManualOrderFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => emptyForm(products));
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedProduct = products.find((product) => product.slug === form.productSlug);
  const unitPriceNumber = Number(form.unitPrice) || 0;
  const quantityNumber = Number(form.quantity) || 0;
  const subtotal = unitPriceNumber * quantityNumber;
  const isDiscounted =
    selectedProduct != null && unitPriceNumber !== selectedProduct.price;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const confirmed = window.confirm(
      `Vas a registrar una venta de ${selectedProduct?.name ?? form.productSlug} por ${form.manualPaymentMethod}, de verdad. La orden queda aprobada al instante y se le manda el mail de confirmación al cliente. ¿Confirmás?`,
    );

    if (!confirmed) {
      return;
    }

    setStatus("sending");
    setFeedback(null);

    try {
      const response = await fetch("/api/admin/orders/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: form.productSlug,
          quantity: Number(form.quantity),
          shippingMethod: form.shippingMethod,
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            address: form.address,
            city: form.city,
            province: form.province,
            postalCode: form.postalCode,
          },
          billing: {
            dni: form.dni,
            useShippingAddress: form.useShippingAddress,
            address: form.useShippingAddress ? undefined : form.billingAddress,
            city: form.useShippingAddress ? undefined : form.billingCity,
            province: form.useShippingAddress ? undefined : form.billingProvince,
            postalCode: form.useShippingAddress ? undefined : form.billingPostalCode,
            isBusinessPurchase: form.isBusinessPurchase,
            cuit: form.isBusinessPurchase ? form.cuit : undefined,
            businessName: form.isBusinessPurchase ? form.businessName : undefined,
          },
          manualPaymentMethod: form.manualPaymentMethod,
          manualPaymentNote: form.manualPaymentNote || undefined,
          unitPriceOverride: unitPriceNumber,
        }),
      });
      const data = (await response.json()) as { message?: string; id?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos registrar la venta");
      }

      setStatus("success");
      setFeedback(`Venta registrada. Orden ${data.id?.slice(0, 8) ?? ""} aprobada.`);
      setForm(emptyForm(products));
      router.refresh();
    } catch (err) {
      setStatus("error");
      setFeedback(err instanceof Error ? err.message : "Ocurrió un error");
    }
  }

  if (!open) {
    return (
      <button className="admin-refresh" onClick={() => setOpen(true)} type="button">
        Registrar venta manual
      </button>
    );
  }

  return (
    <section className="admin-card">
      <div className="admin-card__head">
        <div>
          <span>Fuera de Mercado Pago</span>
          <h2>Registrar venta manual</h2>
        </div>
        <button className="order-action" onClick={() => setOpen(false)} type="button">
          Cerrar
        </button>
      </div>

      <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: "-8px 0 12px" }}>
        Para ventas en efectivo, transferencia u otro medio fuera del checkout. La
        orden queda aprobada al instante y se le manda el mismo mail de confirmación
        que a una compra por Mercado Pago.
      </p>

      <form className="inventory-form" onSubmit={handleSubmit}>
        <label>
          Producto
          <select
            value={form.productSlug}
            onChange={(event) => {
              const productSlug = event.target.value;
              const product = products.find((item) => item.slug === productSlug);
              setForm((prev) => ({
                ...prev,
                productSlug,
                unitPrice: String(product?.price ?? 0),
              }));
            }}
          >
            {products.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name} ({formatCurrency(product.price, product.currency)})
              </option>
            ))}
          </select>
        </label>
        <label>
          Cantidad
          <input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, quantity: event.target.value }))
            }
          />
        </label>
        <label>
          Precio unitario
          <input
            type="number"
            min={0}
            value={form.unitPrice}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, unitPrice: event.target.value }))
            }
          />
        </label>
        <label>
          Envío
          <select
            value={form.shippingMethod}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                shippingMethod: event.target.value as "standard" | "express",
              }))
            }
          >
            <option value="standard">Estándar</option>
            <option value="express">Express</option>
          </select>
        </label>

        <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: "-4px 0 0" }}>
          Subtotal:{" "}
          <strong>{formatCurrency(subtotal, selectedProduct?.currency ?? "ARS")}</strong>
          {isDiscounted && " (precio unitario editado)"}
        </p>

        <p style={{ color: "var(--muted)", fontSize: "0.78rem", margin: "0" }}>
          Los campos de abajo son opcionales — dejalos vacíos si no tenés el dato
          (quedan marcados en naranja como recordatorio).
        </p>

        <label>
          Nombre
          <input
            type="text"
            className={emptyClass(form.firstName)}
            value={form.firstName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, firstName: event.target.value }))
            }
          />
        </label>
        <label>
          Apellido
          <input
            type="text"
            className={emptyClass(form.lastName)}
            value={form.lastName}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, lastName: event.target.value }))
            }
          />
        </label>
        <label>
          Email
          <input
            type="email"
            className={emptyClass(form.email)}
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
          />
        </label>
        <label>
          Teléfono
          <input
            type="text"
            className={emptyClass(form.phone)}
            value={form.phone}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, phone: event.target.value }))
            }
          />
        </label>

        <label>
          Dirección de envío
          <input
            type="text"
            className={emptyClass(form.address)}
            value={form.address}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, address: event.target.value }))
            }
          />
        </label>
        <label>
          Ciudad
          <input
            type="text"
            className={emptyClass(form.city)}
            value={form.city}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, city: event.target.value }))
            }
          />
        </label>
        <label>
          Provincia
          <input
            type="text"
            className={emptyClass(form.province)}
            value={form.province}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, province: event.target.value }))
            }
          />
        </label>
        <label>
          Código postal
          <input
            type="text"
            className={emptyClass(form.postalCode)}
            value={form.postalCode}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, postalCode: event.target.value }))
            }
          />
        </label>

        <label>
          DNI
          <input
            type="text"
            className={emptyClass(form.dni)}
            value={form.dni}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, dni: event.target.value }))
            }
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 400 }}>
          <input
            type="checkbox"
            checked={form.useShippingAddress}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, useShippingAddress: event.target.checked }))
            }
          />
          Facturar a la misma dirección de envío
        </label>

        {!form.useShippingAddress && (
          <>
            <label>
              Dirección de facturación
              <input
                type="text"
                className={emptyClass(form.billingAddress)}
                value={form.billingAddress}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, billingAddress: event.target.value }))
                }
              />
            </label>
            <label>
              Ciudad de facturación
              <input
                type="text"
                className={emptyClass(form.billingCity)}
                value={form.billingCity}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, billingCity: event.target.value }))
                }
              />
            </label>
            <label>
              Provincia de facturación
              <input
                type="text"
                className={emptyClass(form.billingProvince)}
                value={form.billingProvince}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, billingProvince: event.target.value }))
                }
              />
            </label>
            <label>
              Código postal de facturación
              <input
                type="text"
                className={emptyClass(form.billingPostalCode)}
                value={form.billingPostalCode}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    billingPostalCode: event.target.value,
                  }))
                }
              />
            </label>
          </>
        )}

        <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 400 }}>
          <input
            type="checkbox"
            checked={form.isBusinessPurchase}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, isBusinessPurchase: event.target.checked }))
            }
          />
          Comprar como empresa
        </label>

        {form.isBusinessPurchase && (
          <>
            <label>
              CUIT
              <input
                type="text"
                className={emptyClass(form.cuit)}
                value={form.cuit}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, cuit: event.target.value }))
                }
              />
            </label>
            <label>
              Razón social
              <input
                type="text"
                className={emptyClass(form.businessName)}
                value={form.businessName}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, businessName: event.target.value }))
                }
              />
            </label>
          </>
        )}

        <label>
          Medio de pago
          <select
            value={form.manualPaymentMethod}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, manualPaymentMethod: event.target.value }))
            }
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
        <label className="inventory-form__note">
          Nota (opcional)
          <input
            type="text"
            placeholder="Ej: transferencia recibida el 25/08"
            value={form.manualPaymentNote}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, manualPaymentNote: event.target.value }))
            }
          />
        </label>

        <button className="admin-refresh" disabled={status === "sending"} type="submit">
          {status === "sending" ? "Registrando…" : "Registrar venta"}
        </button>

        {feedback && (
          <div
            className={status === "error" ? "admin-error" : "admin-empty"}
            role={status === "error" ? "alert" : "status"}
          >
            <strong>{status === "error" ? "Error" : "Listo"}</strong>
            <p>{feedback}</p>
          </div>
        )}
      </form>
    </section>
  );
}
