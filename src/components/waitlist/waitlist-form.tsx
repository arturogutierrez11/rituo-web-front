"use client";

import { useMemo, useState, type FormEvent } from "react";

import { joinWaitlist } from "@/services/api";
import type { WaitlistInterest, WaitlistPayload } from "@/types/waitlist";

const interestOptions: Array<{
  value: WaitlistInterest;
  label: string;
  description: string;
}> = [
  {
    value: "personal",
    label: "Para mí",
    description: "Quiero reservar una tarjeta para uso personal.",
  },
  {
    value: "family",
    label: "Familia",
    description: "Me interesa bloquear apps y acompañar hábitos en casa.",
  },
  {
    value: "business",
    label: "Empresa",
    description: "Necesito más de 10 tarjetas para un equipo.",
  },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  interest: WaitlistInterest;
  quantity: string;
  company: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  interest: "personal",
  quantity: "1",
  company: "",
  message: "",
};

export function WaitlistForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const selectedInterest = useMemo(
    () => interestOptions.find((option) => option.value === form.interest),
    [form.interest],
  );

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (key === "interest") {
        next.quantity = value === "business" ? "11" : "1";
      }

      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const quantity = Number.parseInt(form.quantity, 10);
    const safeQuantity = Number.isFinite(quantity) ? quantity : 1;

    const payload: WaitlistPayload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || undefined,
      interest: form.interest,
      quantity: form.interest === "business" ? Math.max(11, safeQuantity) : safeQuantity,
      company: form.company.trim() || undefined,
      message: form.message.trim() || undefined,
      source: "web-presale",
    };

    try {
      await joinWaitlist(payload);
      setStatus("success");
      setForm(initialState);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage(
        "No pudimos guardar tus datos. Probá de nuevo en unos segundos.",
      );
    }
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit}>
      <div className="waitlist-form__header">
        <span>Preventa privada</span>
        <strong>Reservá tu lugar</strong>
      </div>

      <div className="waitlist-form__grid waitlist-form__grid--two">
        <label>
          Nombre
          <input
            autoComplete="name"
            name="name"
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Tu nombre"
            required
            value={form.name}
          />
        </label>
        <label>
          Email
          <input
            autoComplete="email"
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="nombre@email.com"
            required
            type="email"
            value={form.email}
          />
        </label>
      </div>

      <div className="waitlist-form__grid waitlist-form__grid--two">
        <label>
          Teléfono
          <input
            autoComplete="tel"
            name="phone"
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+54 9 11 0000 0000"
            type="tel"
            value={form.phone}
          />
        </label>
        <label>
          Cantidad estimada
          <input
            min={form.interest === "business" ? 11 : 1}
            name="quantity"
            onChange={(event) => updateField("quantity", event.target.value)}
            type="number"
            value={form.quantity}
          />
        </label>
      </div>

      <fieldset className="waitlist-form__interest">
        <legend>¿Qué querés reservar?</legend>
        <div className="waitlist-form__options">
          {interestOptions.map((option) => (
            <label
              className={
                form.interest === option.value
                  ? "waitlist-option is-selected"
                  : "waitlist-option"
              }
              key={option.value}
            >
              <input
                checked={form.interest === option.value}
                name="interest"
                onChange={() => updateField("interest", option.value)}
                type="radio"
                value={option.value}
              />
              <span />
              <strong>{option.label}</strong>
              <small>{option.description}</small>
            </label>
          ))}
        </div>
      </fieldset>

      {form.interest === "business" && (
        <label>
          Empresa
          <input
            autoComplete="organization"
            name="company"
            onChange={(event) => updateField("company", event.target.value)}
            placeholder="Nombre de la empresa"
            value={form.company}
          />
        </label>
      )}

      <label>
        Mensaje opcional
        <textarea
          name="message"
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="Contanos qué tipo de ritual querés armar"
          rows={4}
          value={form.message}
        />
      </label>

      <div className="waitlist-form__footer">
        <p>
          {selectedInterest?.description} Te vamos a escribir cuando abramos la
          primera tanda.
        </p>
        <button
          className="button-link button-link--light waitlist-form__submit"
          disabled={status === "loading"}
          type="submit"
        >
          {status === "loading" ? "Guardando..." : "Sumarme a la lista"}
        </button>
      </div>

      {status === "success" && (
        <p className="waitlist-form__notice waitlist-form__notice--success" role="status">
          Listo. Ya estás en la lista de preventa de Rituo.
        </p>
      )}

      {status === "error" && (
        <p className="waitlist-form__notice waitlist-form__notice--error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
