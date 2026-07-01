"use client";

import { useState, type FormEvent } from "react";

import { joinWaitlist } from "@/services/api";
import type { OperatingSystem, WaitlistPayload } from "@/types/waitlist";

const osOptions: Array<{ value: OperatingSystem; label: string; icon: React.ReactNode }> = [
  {
    value: "iOS",
    label: "iPhone",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="6" y="2" width="10" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 4.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="17.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: "Android",
    label: "Android",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M5 13.5V9a6 6 0 0 1 12 0v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="3" y="9" width="3" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="16" y="9" width="3" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 17h6M9 19h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 3.5l1 1.5M14 3.5l-1 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  operatingSystem: OperatingSystem;
}

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  operatingSystem: "iOS",
};

export function WaitlistForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const payload: WaitlistPayload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phoneNumber: form.phoneNumber.trim(),
      operatingSystem: form.operatingSystem,
    };

    try {
      await joinWaitlist(payload);
      setStatus("success");
      setForm(initialState);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("No pudimos guardar tus datos. Probá de nuevo en unos segundos.");
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
            autoComplete="given-name"
            name="firstName"
            onChange={(e) => updateField("firstName", e.target.value)}
            placeholder="Tu nombre"
            required
            value={form.firstName}
          />
        </label>
        <label>
          Apellido
          <input
            autoComplete="family-name"
            name="lastName"
            onChange={(e) => updateField("lastName", e.target.value)}
            placeholder="Tu apellido"
            required
            value={form.lastName}
          />
        </label>
      </div>

      <div className="waitlist-form__grid">
        <label>
          Email
          <input
            autoComplete="email"
            name="email"
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="nombre@email.com"
            required
            type="email"
            value={form.email}
          />
        </label>
      </div>

      <div className="waitlist-form__grid">
        <label>
          Teléfono
          <input
            autoComplete="tel"
            name="phoneNumber"
            onChange={(e) => updateField("phoneNumber", e.target.value)}
            placeholder="+54 9 11 0000 0000"
            required
            type="tel"
            value={form.phoneNumber}
          />
        </label>
      </div>

      <fieldset style={{ margin: 0, padding: 0, border: 0 }}>
        <legend
          style={{
            color: "rgba(240,243,250,0.78)",
            fontSize: "0.74rem",
            fontWeight: 800,
            marginBottom: 0,
            padding: 0,
          }}
        >
          ¿Qué teléfono usás?
        </legend>
        <div className="os-toggle">
          {osOptions.map((opt) => (
            <label
              key={opt.value}
              className={`os-toggle__option${form.operatingSystem === opt.value ? " is-selected" : ""}`}
            >
              <input
                checked={form.operatingSystem === opt.value}
                name="operatingSystem"
                onChange={() => updateField("operatingSystem", opt.value)}
                type="radio"
                value={opt.value}
              />
              <span className="os-toggle__icon">{opt.icon}</span>
              <span className="os-toggle__label">{opt.label}</span>
              <span className="os-toggle__dot" />
            </label>
          ))}
        </div>
      </fieldset>

      <div className="waitlist-form__footer">
        <p>
          Te avisamos antes de abrir la primera tanda con prioridad de compra.
        </p>
        <button
          className="button-link button-link--light waitlist-form__submit"
          disabled={status === "loading"}
          type="submit"
        >
          {status === "loading" ? "Guardando..." : "Sumarme →"}
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
