"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

interface InstagramEmbedProps {
  permalink: string;
}

const INSTAGRAM_SCRIPT_ID = "instagram-embed-script";

export function InstagramEmbed({ permalink }: InstagramEmbedProps) {
  useEffect(() => {
    const processEmbed = () => window.instgrm?.Embeds.process();
    const existingScript = document.getElementById(INSTAGRAM_SCRIPT_ID);

    if (existingScript) {
      if (window.instgrm) {
        processEmbed();
      } else {
        existingScript.addEventListener("load", processEmbed, { once: true });
      }

      return () => existingScript.removeEventListener("load", processEmbed);
    }

    const script = document.createElement("script");
    script.async = true;
    script.id = INSTAGRAM_SCRIPT_ID;
    script.src = "https://www.instagram.com/embed.js";
    script.addEventListener("load", processEmbed, { once: true });
    document.body.appendChild(script);

    return () => script.removeEventListener("load", processEmbed);
  }, [permalink]);

  return (
    <div className="instagram-embed">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned=""
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
      >
        <a href={permalink} rel="noreferrer" target="_blank">
          Ver esta publicación en Instagram de @rituo.io
        </a>
      </blockquote>
    </div>
  );
}
