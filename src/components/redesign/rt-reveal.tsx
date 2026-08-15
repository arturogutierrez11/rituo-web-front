"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PropsWithChildren } from "react";

interface RtRevealProps extends PropsWithChildren {
  delayMs?: number;
  durationMs?: number;
  translateY?: number;
  style?: CSSProperties;
  className?: string;
}

export function RtReveal({
  children,
  delayMs = 0,
  durationMs = 700,
  translateY = 16,
  style,
  className,
}: RtRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${translateY}px)`,
        transition: `opacity ${durationMs}ms var(--ease-calm, ease-out) ${delayMs}ms, transform ${durationMs}ms var(--ease-calm, ease-out) ${delayMs}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
