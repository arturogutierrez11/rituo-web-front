"use client";

import { useState } from "react";

const FAQ_DATA = [
  {
    q: "¿Cómo funciona Rituo?",
    a: "Elegís qué apps querés dejar afuera y activás un Modo en el momento o programás un Ritual para que se active automáticamente durante tu semana. Mientras Rituo está activo, esas apps quedan bloqueadas. Si querés volver a usarlas antes de que termine, necesitás tu tarjeta.",
  },
  {
    q: "¿Para qué sirve la tarjeta?",
    a: "Para poner un gesto real entre el impulso y la decisión de volver. No necesitás la tarjeta para empezar a bloquear apps: la necesitás si decidís desbloquearlas antes de tiempo. Ese paso extra hace que volver al teléfono deje de ser automático y vuelva a ser una elección.",
  },
  {
    q: "¿Qué diferencia hay entre un Modo y un Ritual?",
    a: "Un Modo es para cuando lo necesitás ahora: elegís qué apps dejar afuera y lo activás en el momento, por el tiempo que quieras. Un Ritual es una programación recurrente, por ejemplo dejar ciertas apps bloqueadas de lunes a viernes mientras trabajás, estudiás, cenás o dormís.",
  },
  {
    q: "¿Puedo elegir qué apps bloquear?",
    a: "Sí. Vos decidís qué apps querés dejar afuera en cada Modo o Ritual. Tu teléfono sigue siendo una herramienta: podés mantener disponibles las que necesitás y sacar del medio solo las que te distraen.",
  },
  {
    q: "¿Necesito tener la tarjeta conmigo para activar Rituo?",
    a: "No. Podés activar un Modo directamente desde la app y los Rituales se activan automáticamente según la programación elegida. La tarjeta entra en juego cuando querés salir antes de tiempo.",
  },
  {
    q: "¿Qué pasa si necesito desbloquear una app antes?",
    a: "Acercás tu tarjeta Rituo a tu iPhone y podés terminar el bloqueo. La idea no es impedirte volver, sino que haya una decisión consciente antes de hacerlo.",
  },
  {
    q: "¿Si no tengo mi tarjeta y necesito entrar sí o sí?",
    a: "Rituo cuenta con una Salida de emergencia para los momentos en los que realmente necesitás terminar un bloqueo y no tenés la tarjeta cerca. Está pensada como una excepción, no como la forma habitual de salir de un Modo o Ritual (se renueva cada mes).",
  },
  {
    q: "¿La tarjeta necesita batería o cargarse?",
    a: "No. Rituo funciona mediante NFC, por lo que la tarjeta no lleva batería y no necesita cargarse.",
  },
  {
    q: "¿Con qué teléfonos funciona Rituo?",
    a: "Para iPhone con sistema operativo iOS 17 en adelante, y muy pronto para Android.",
  },
  {
    q: "¿Qué pasa si pierdo mi tarjeta?",
    a: "Podés usar la Salida de emergencia para recuperar el acceso a tus apps y vincular una nueva tarjeta Rituo.",
  },
  {
    q: "¿Rituo bloquea todo mi teléfono?",
    a: "No. Rituo bloquea únicamente las apps que vos elegís. Podés seguir usando llamadas, mapas, cámara o cualquier otra app que necesites.",
  },
  {
    q: "¿Por qué usar una tarjeta física y no solamente una app?",
    a: "Porque cuando la salida está en la misma pantalla que la distracción, es demasiado fácil cambiar de opinión en un segundo. Rituo pone algo físico en el medio: no para impedirte usar el teléfono, sino para asegurarse de que, cuando vuelvas, sea porque realmente lo elegiste.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="rt-section-pad" style={{ width: "100%", background: "var(--paper,#fff)", padding: "0 32px 140px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-accent,#495C78)",
              marginBottom: 16,
            }}
          >
            Preguntas frecuentes
          </div>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text-strong,#212749)",
              fontSize: "clamp(28px,3.4vw,42px)",
              margin: 0,
            }}
          >
            Todo lo que querés saber.
          </h2>
        </div>

        <div style={{ borderTop: "1px solid var(--border-default,#dfe4ea)" }}>
          {FAQ_DATA.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} style={{ borderBottom: "1px solid var(--border-default, #dfe4ea)" }}>
                <button
                  type="button"
                  onClick={() => setOpenIndex((current) => (current === i ? -1 : i))}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "24px 0",
                    fontFamily: "var(--font-sans)",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "var(--text-strong, #212749)",
                  }}
                >
                  <span>{item.q}</span>
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 400,
                      color: "var(--text-accent, #495C78)",
                      flexShrink: 0,
                      transition: "transform 240ms var(--ease-calm, ease-out)",
                      transform: open ? "rotate(45deg)" : "none",
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transition: "grid-template-rows 320ms var(--ease-calm, ease-out)",
                  }}
                >
                  <div style={{ overflow: "hidden", minHeight: 0 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 16,
                        lineHeight: 1.65,
                        color: "var(--text-body, #4b5468)",
                        margin: "0 0 28px",
                        maxWidth: 680,
                      }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
