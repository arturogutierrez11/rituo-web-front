"use client";

import { useState, type FormEvent } from "react";

interface WaitlistBroadcastFormProps {
  recipientCount: number;
}

type Status = "idle" | "sending-test" | "sending" | "success" | "error";

export function WaitlistBroadcastForm({ recipientCount }: WaitlistBroadcastFormProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  async function send(body: { subject: string; message: string; testEmail?: string }) {
    const response = await fetch("/api/admin/waitlist/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => ({}))) as {
      totalRecipients?: number;
      message?: string;
    };

    if (!response.ok) {
      throw new Error(data.message ?? "No pudimos enviar el email.");
    }

    return data;
  }

  async function handleTestSend() {
    if (!testEmail.trim()) {
      setStatus("error");
      setFeedback("Poné tu email para mandar la prueba.");
      return;
    }

    setStatus("sending-test");
    setFeedback(null);

    try {
      await send({ subject, message, testEmail });
      setStatus("success");
      setFeedback(`Prueba enviada a ${testEmail}. Revisá tu bandeja antes de mandarlo a todos.`);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Ocurrió un error.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (recipientCount === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Vas a mandar este email a ${recipientCount} persona${recipientCount === 1 ? "" : "s"} de la lista de espera, de verdad. ¿Ya mandaste una prueba y está todo bien? Confirmá para enviar.`,
    );

    if (!confirmed) {
      return;
    }

    setStatus("sending");
    setFeedback(null);

    try {
      const data = await send({ subject, message });
      setStatus("success");
      setFeedback(`Enviado a ${data.totalRecipients ?? recipientCount} personas.`);
      setSubject("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Ocurrió un error.");
    }
  }

  const isBusy = status === "sending" || status === "sending-test";

  return (
    <section className="admin-card">
      <div className="admin-card__head">
        <div>
          <span>Preventa</span>
          <h2>Enviar email a toda la lista</h2>
        </div>
        <p>{recipientCount} destinatarios</p>
      </div>

      <form className="legal-admin-form" onSubmit={handleSubmit}>
        <label>
          Asunto
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Ej: Ya podés reservar tu Rituo Tag"
            maxLength={150}
            required
          />
        </label>
        <label>
          Mensaje
          <textarea
            rows={8}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={"Hola {{nombre}},\n\nTenemos novedades..."}
            maxLength={5000}
            required
          />
        </label>
        <p style={{ color: "var(--muted)", fontSize: "0.76rem", margin: "-8px 0 0" }}>
          Podés usar <code>{"{{nombre}}"}</code> en el asunto o el mensaje para personalizar
          con el nombre de cada persona.
        </p>

        <label>
          Email para la prueba
          <input
            type="email"
            value={testEmail}
            onChange={(event) => setTestEmail(event.target.value)}
            placeholder="tu@email.com"
          />
        </label>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            className="admin-refresh"
            disabled={isBusy}
            onClick={handleTestSend}
            type="button"
          >
            {status === "sending-test" ? "Enviando prueba…" : "Enviar prueba a mi email"}
          </button>
          <button
            className="admin-refresh"
            disabled={isBusy || recipientCount === 0}
            type="submit"
          >
            {status === "sending" ? "Enviando…" : `Enviar a ${recipientCount} personas`}
          </button>
        </div>

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
