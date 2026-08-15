"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function CardReveal() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPlay(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="rt-section-vpad rt-section-pad"
      style={{ position: "relative", width: "100%", background: "var(--paper-dim,#f4f6f8)", padding: "160px 32px" }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text-strong,#212749)",
            fontSize: "clamp(30px,4vw,52px)",
            margin: "0 0 64px",
            textWrap: "balance",
          }}
        >
          Para volver antes, necesitás esto.
        </h2>

        <div
          ref={wrapRef}
          style={{
            position: "relative",
            width: "100%",
            minHeight: 420,
            background: "#fff",
            borderRadius: 20,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            isolation: "isolate",
            marginBottom: 56,
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(20,30,55,0.05), transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "min(76vw, 380px)",
              height: "min(48vw, 240px)",
              zIndex: 1,
              borderRadius: 24,
              overflow: "hidden",
            }}
          >
            <Image
              src="/images/redesign/card-hero.png"
              alt="Tarjeta Rituo en primer plano, iluminación premium"
              fill
              sizes="380px"
              style={{ objectFit: "cover" }}
            />
          </div>

          {play && (
            <div
              style={{
                perspective: 1600,
                zIndex: 2,
                width: "min(76vw, 380px)",
                height: "min(48vw, 240px)",
                position: "relative",
              }}
            >
              <div
                className="rt-card"
                style={{
                  position: "absolute",
                  inset: 0,
                  transformStyle: "preserve-3d",
                  animation: "rt-cardReveal 5s cubic-bezier(.33,1,.68,1) forwards",
                }}
              >
                <div
                  className="rt-card-face"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 18,
                    animation: "rt-faceShadow 5s cubic-bezier(.33,1,.68,1) forwards",
                  }}
                />
                <div
                  className="rt-noise"
                  style={{ borderRadius: 18, opacity: 0.5, zIndex: 5 }}
                />
              </div>
            </div>
          )}
        </div>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--text-strong,#212749)",
            fontSize: "clamp(22px,2.4vw,30px)",
            margin: "0 0 20px",
          }}
        >
          Ese segundo extra es todo.
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 18,
            lineHeight: 1.65,
            color: "var(--text-body,#4b5468)",
            margin: "0 auto",
            maxWidth: 560,
          }}
        >
          La tarjeta no está para impedirte usar el teléfono. Está para
          asegurarse de que, cuando vuelvas a usarlo, sea porque realmente lo
          elegiste.
        </p>
      </div>
    </section>
  );
}
