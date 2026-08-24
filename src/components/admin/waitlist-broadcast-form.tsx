"use client";

import { useState, type FormEvent } from "react";

interface WaitlistBroadcastFormProps {
  totalCount: number;
  iosCount: number;
  androidCount: number;
}

type Status = "idle" | "sending-test" | "sending" | "success" | "error";
type OsFilter = "all" | "iOS" | "Android";

export function WaitlistBroadcastForm({
  totalCount,
  iosCount,
  androidCount,
}: WaitlistBroadcastFormProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [osFilter, setOsFilter] = useState<OsFilter>("all");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const recipientCount =
    osFilter === "iOS" ? iosCount : osFilter === "Android" ? androidCount : totalCount;

  async function send(body: {
    subject: string;
    message: string;
    testEmail?: string;
    operatingSystem?: "iOS" | "Android";
  }) {
    const response = await fetch("/api/admin/waitlist/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => ({}))) as {
      totalRecipients?: number;
      skipped?: number;
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
      await send({
        subject,
        message,
        testEmail,
        operatingSystem: osFilter === "all" ? undefined : osFilter,
      });
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

    const audienceLabel =
      osFilter === "iOS" ? " (solo iOS)" : osFilter === "Android" ? " (solo Android)" : "";
    const confirmed = window.confirm(
      `Vas a mandar este email a ${recipientCount} persona${recipientCount === 1 ? "" : "s"} de la lista de espera${audienceLabel}, de verdad. ¿Ya mandaste una prueba y está todo bien? Confirmá para enviar.`,
    );

    if (!confirmed) {
      return;
    }

    setStatus("sending");
    setFeedback(null);

    try {
      const data = await send({
        subject,
        message,
        operatingSystem: osFilter === "all" ? undefined : osFilter,
      });
      setStatus("success");
      const skippedNote =
        data.skipped && data.skipped > 0
          ? ` (${data.skipped} con email inválido, no se les mandó)`
          : "";
      setFeedback(`Enviado a ${data.totalRecipients ?? recipientCount} personas${skippedNote}.`);
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

        <fieldset
          style={{
            border: "1px solid var(--border, rgba(156,178,198,0.2))",
            borderRadius: 10,
            padding: "12px 14px",
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            margin: 0,
          }}
        >
          <legend style={{ padding: "0 6px", fontSize: "0.8rem" }}>Destinatarios</legend>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 400 }}>
            <input
              type="radio"
              name="osFilter"
              checked={osFilter === "all"}
              onChange={() => setOsFilter("all")}
            />
            Todos ({totalCount})
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 400 }}>
            <input
              type="radio"
              name="osFilter"
              checked={osFilter === "iOS"}
              onChange={() => setOsFilter("iOS")}
            />
            Solo iOS ({iosCount})
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 400 }}>
            <input
              type="radio"
              name="osFilter"
              checked={osFilter === "Android"}
              onChange={() => setOsFilter("Android")}
            />
            Solo Android ({androidCount})
          </label>
        </fieldset>

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
