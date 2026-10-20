import { formatCurrency } from "@/lib/format-currency";
import { comboDiscountFor, comboDiscountRate } from "@/lib/payment";
import { WHATSAPP_URL } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

import { RtButton } from "./rt-button";

/** Tiene que coincidir con el precio de tag-one en checkout.api (el checkout siempre cobra el de allá). */
const UNIT_PRICE = 49990;
const CURRENCY = "ARS";
const COMBO_QUANTITIES = [2, 3];

function comboPricing(quantity: number) {
  const subtotal = UNIT_PRICE * quantity;
  const total = subtotal - comboDiscountFor(subtotal, quantity);
  return {
    subtotal,
    total,
    perUnit: Math.round(total / quantity),
    percent: Math.round(comboDiscountRate(quantity) * 100),
  };
}

export function Combos() {
  return (
    <section id="combos" className="rt-section-pad rt-combos">
      <div className="rt-combos__inner">
        <p className="rt-combos__eyebrow">Combos</p>
        <h2 className="rt-combos__title">Llevate más, pagá menos.</h2>
        <p className="rt-combos__lead">
          Para vos, para tu equipo o para regalar. El descuento se aplica solo
          en el checkout.
        </p>

        <div className="rt-combos__grid">
          {COMBO_QUANTITIES.map((quantity) => {
            const pricing = comboPricing(quantity);

            return (
              <article className="rt-combo-card" key={quantity}>
                <span className="rt-combo-card__badge">{pricing.percent}% OFF</span>
                <h3>Combo x{quantity}</h3>
                <p className="rt-combo-card__desc">
                  {quantity} tarjetas Rituo con acceso lifetime a la app.
                </p>
                <div className="rt-combo-card__price">
                  <strong>{formatCurrency(pricing.total, CURRENCY)}</strong>
                  <s>{formatCurrency(pricing.subtotal, CURRENCY)}</s>
                </div>
                <p className="rt-combo-card__unit">
                  {formatCurrency(pricing.perUnit, CURRENCY)} cada una
                </p>
                <RtButton
                  href={`/checkout?product=tag-one&quantity=${quantity}`}
                  variant="primary"
                >
                  Quiero el combo x{quantity}
                </RtButton>
              </article>
            );
          })}

          <article className="rt-combo-card rt-combo-card--business">
            <span className="rt-combo-card__badge rt-combo-card__badge--soft">
              Empresas
            </span>
            <h3>Regalos empresariales</h3>
            <p className="rt-combo-card__desc">
              ¿Necesitás más unidades para tu equipo o tus clientes? Escribinos
              y armamos una propuesta a medida.
            </p>
            <div className="rt-combo-card__price">
              <strong>A medida</strong>
            </div>
            <p className="rt-combo-card__unit">Precio especial por volumen</p>
            <RtButton
              href={WHATSAPP_URL}
              rel="noopener noreferrer"
              target="_blank"
              variant="ghost"
            >
              <WhatsAppIcon size={16} />
              Hablar por WhatsApp
            </RtButton>
          </article>
        </div>

        <p className="rt-combos__note">
          Pagando por transferencia bancaria sumás un 10% de descuento extra.
        </p>
      </div>
    </section>
  );
}
