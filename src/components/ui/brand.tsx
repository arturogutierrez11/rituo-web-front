import Image from "next/image";

interface BrandProps {
  compact?: boolean;
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <a className="brand" href="#inicio" aria-label="Rituo, volver al inicio">
      <Image
        src="/images/rituo-logo-white.png"
        alt="Rituo"
        width={843}
        height={488}
        className="brand__logo"
        priority
      />
      {!compact && <span className="brand__dot" aria-hidden="true" />}
    </a>
  );
}
