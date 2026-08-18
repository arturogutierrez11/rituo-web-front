"use client";

import { useState, type FormEvent } from "react";

import type { ContactPayload } from "@/types/contact";

const initialForm: ContactPayload = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

interface ContactFormProps {
  description?: string;
  eyebrow?: string;
  footerText?: string;
  subjectPlaceholder?: string;
  title?: string;
}

export function ContactForm({
  description = "Contanos en qué podemos ayudarte y te respondemos por email.",
  eyebrow = "Contacto",
  footerText = "También podés escribirnos a hello@rituo.io.",
  subjectPlaceholder = "¿Sobre qué querés hablar?",
  title = "Escribinos",
}: ContactFormProps = {}) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField<K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          website: form.website,
        } satisfies ContactPayload),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos enviar tu mensaje.");
      }

      setForm(initialForm);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No pudimos enviar tu mensaje. Probá de nuevo en unos segundos.",
      );
    }
  }

  return (
    <div className="rsp-card">
      <p className="rsp-card__eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>

      <form onSubmit={handleSubmit}>
        <div className="rsp-fields rsp-fields--two">
          <div className="rsp-field">
            <label htmlFor="contact-name">Nombre</label>
            <input
              autoComplete="name"
              className="rsp-input"
              id="contact-name"
              maxLength={80}
              name="name"
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Tu nombre"
              required
              value={form.name}
            />
          </div>
          <div className="rsp-field">
            <label htmlFor="contact-email">Email</label>
            <input
              autoComplete="email"
              className="rsp-input"
              id="contact-email"
              maxLength={160}
              name="email"
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="nombre@email.com"
              required
              type="email"
              value={form.email}
            />
          </div>
        </div>

        <div className="rsp-field" style={{ marginBottom: 24 }}>
          <label htmlFor="contact-subject">Asunto</label>
          <input
            className="rsp-input"
            id="contact-subject"
            maxLength={120}
            name="subject"
            onChange={(event) => updateField("subject", event.target.value)}
            placeholder={subjectPlaceholder}
            required
            value={form.subject}
          />
        </div>

        <div className="rsp-field" style={{ marginBottom: 32 }}>
          <label htmlFor="contact-message">Mensaje</label>
          <textarea
            className="rsp-textarea"
            id="contact-message"
            maxLength={3000}
            name="message"
            onChange={(event) => updateField("message", event.target.value)}
            placeholder="Escribí tu consulta acá..."
            required
            rows={6}
            value={form.message}
          />
        </div>

        <label className="rsp-honeypot" aria-hidden="true">
          Sitio web
          <input
            autoComplete="off"
            name="website"
            onChange={(event) => updateField("website", event.target.value)}
            tabIndex={-1}
            value={form.website}
          />
        </label>

        <div className="rsp-card__footer">
          <span>{footerText}</span>
          <button className="rsp-submit" disabled={status === "loading"} type="submit">
            {status === "loading" ? "Enviando..." : "Enviar mensaje →"}
          </button>
        </div>

        {status === "success" && (
          <p className="rsp-notice rsp-notice--success" role="status">
            Mensaje enviado. Gracias por escribirnos; te responderemos pronto.
          </p>
        )}

        {status === "error" && (
          <p className="rsp-notice rsp-notice--error" role="alert">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}
