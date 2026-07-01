"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";

const MAX_TILT = 8;

export function InteractiveTag() {
  const sceneRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;

    const scene = sceneRef.current;
    if (!scene) return;

    const bounds = scene.getBoundingClientRect();

    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;

    const rotateY = (x - 0.5) * MAX_TILT * 2;
    const rotateX = (0.5 - y) * MAX_TILT * 2;

    scene.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
    scene.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
    scene.style.setProperty("--light-x", `${(x * 100).toFixed(1)}%`);
    scene.style.setProperty("--light-y", `${(y * 100).toFixed(1)}%`);
  }

  function resetTilt() {
    const scene = sceneRef.current;
    if (!scene) return;

    scene.style.setProperty("--rotate-x", "0deg");
    scene.style.setProperty("--rotate-y", "0deg");
    scene.style.setProperty("--light-x", "68%");
    scene.style.setProperty("--light-y", "24%");
  }

  return (
    <div
      ref={sceneRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      className="interactive-tag"
    >
      <div className="interactive-tag__field" aria-hidden="true">
        <span className="interactive-tag__wave interactive-tag__wave--one" />
        <span className="interactive-tag__wave interactive-tag__wave--two" />
        <span className="interactive-tag__wave interactive-tag__wave--three" />
      </div>

      <span className="interactive-tag__beam interactive-tag__beam--one" aria-hidden="true" />
      <span className="interactive-tag__beam interactive-tag__beam--two" aria-hidden="true" />

      <div className="interactive-tag__shadow" />

      <div className="interactive-tag__glow" />

      <div className="interactive-tag__product">
        <Image
          src="/images/rituo-hero.png"
          alt="Rituo Tag, tarjeta NFC para activar el modo foco"
          width={1564}
          height={1280}
          priority
          loading="eager"
          sizes="(max-width: 800px) 112vw, 58vw"
          className="interactive-tag__image"
        />

        <span aria-hidden="true" className="interactive-tag__shine" />
      </div>

      <div className="interactive-tag__status">
        <span />
        NFC listo
      </div>
      <span className="interactive-tag__scan" aria-hidden="true" />
    </div>
  );
}
