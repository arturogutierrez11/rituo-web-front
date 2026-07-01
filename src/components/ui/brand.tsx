import Image from "next/image";

interface BrandProps {
  compact?: boolean;
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <a className="brand" href="#inicio" aria-label="Rituo, volver al inicio">
      <Image
        src="/images/rituo-logo-white.png"
        alt=""
        width={32}
        height={32}
        className="brand__logo"
        aria-hidden="true"
      />
      <span className="brand__word">rituo</span>
      {!compact && <span className="brand__dot" aria-hidden="true" />}
    </a>
  );
}
