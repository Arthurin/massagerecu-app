"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  url: string;
  lang?: string;
  autoResize?: number | string;
  showSidebar?: number | string;
  style?: React.CSSProperties;
  className?: string;
};

export default function TrafftEmbed({
  url,
  lang = "fr",
  autoResize = 1,
  showSidebar = 1,
  style,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scriptId = "trafft-embed-script";

  useEffect(() => {
    // If script already exists, re-init embed by re-attaching container attributes
    const existing = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null;

    // Ensure the container has the data attributes the embed expects
    if (containerRef.current) {
      containerRef.current.setAttribute("data-url", url);
      containerRef.current.setAttribute("data-lang", String(lang));
      containerRef.current.setAttribute("data-autoresize", String(autoResize));
      containerRef.current.setAttribute(
        "data-showsidebar",
        String(showSidebar),
      );
    }

    if (!existing) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = `${url.replace(/\/$/, "")}/embed.js`;
      s.async = true;
      s.defer = true;
      // append to body so script can access window and document
      document.body.appendChild(s);
    } else {
      // If script exists, try to trigger any reinitialization function if provided by Trafft
      // (not mandatory — depends on the embed library). Keep safe: check for global init function.
      // Example (commented-out): (window as any).Trafft?.init && (window as any).Trafft.init();
    }

    return () => {
      // On unmount: we do minimal cleanup to avoid breaking other embeds.
      // Do NOT remove the shared script if other pages/components may rely on it.
      // We only remove the script if it was created by this instance and no other container exists.
      const script = document.getElementById(scriptId);
      const otherContainers = document.querySelectorAll(".embedded-booking");
      if (script && otherContainers.length <= 1) {
        script.remove();
      }
      // remove data attributes from container (optional cleanup)
      if (containerRef.current) {
        containerRef.current.removeAttribute("data-url");
        containerRef.current.removeAttribute("data-lang");
        containerRef.current.removeAttribute("data-autoresize");
        containerRef.current.removeAttribute("data-showsidebar");
      }
    };
  }, [url, lang, autoResize, showSidebar]);

  return (
    <div
      ref={containerRef}
      className={className ?? "embedded-booking"}
      style={style}
      // keep these attrs for semantics (they'll be overwritten in useEffect too)
      data-url={url}
      data-lang={lang}
      data-autoresize={String(autoResize)}
      data-showsidebar={String(showSidebar)}
      aria-label="Widget de réservation Trafft"
    />
  );
}
