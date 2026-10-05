"use client";

import { useState } from "react";

interface CopyButtonProps {
  value: string;
  label: string;
}

async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Fallback para navegadores/contextos sin Clipboard API.
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  }
}

export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (await copyToClipboard(value)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <button
      aria-label={copied ? `${label} copiado` : `Copiar ${label}`}
      className={`copy-btn${copied ? " is-copied" : ""}`}
      onClick={handleCopy}
      title={copied ? "¡Copiado!" : `Copiar ${label}`}
      type="button"
    >
      {copied ? (
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
