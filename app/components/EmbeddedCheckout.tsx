"use client";

import { useEffect } from "react";

interface EmbeddedCheckoutProps {
  storefront: string;
}

/**
 * EmbeddedCheckout Component
 * 
 * Renders a FastSpring embedded checkout container.
 * The SBL script must be loaded globally (in layout.tsx) for this to work.
 */
export default function EmbeddedCheckout({ storefront }: EmbeddedCheckoutProps) {
  useEffect(() => {
    // Check if SBL script already exists
    const existingScript = document.getElementById("fsc-api");
    
    if (existingScript) {
      console.log("[SBL] Script already loaded");
      return;
    }

    // Create and inject the SBL script with the specific storefront
    const script = document.createElement("script");
    script.id = "fsc-api";
    script.src = "https://sbl.onfastspring.com/sbl/1.0.6/fastspring-builder.min.js";
    script.type = "text/javascript";
    script.setAttribute("data-storefront", storefront);
    script.async = true;

    script.onload = () => {
      console.log("[SBL] Embedded checkout script loaded for storefront:", storefront);
    };

    script.onerror = () => {
      console.error("[SBL] Failed to load embedded checkout script");
    };

    document.head.appendChild(script);
  }, [storefront]);

  return (
    <div className="w-full">
      {/* FastSpring embedded checkout container - must have this exact ID */}
      <div
        id="fsc-embedded-checkout-container"
        className="min-h-96 border border-slate-700/50 rounded-lg bg-slate-900/30 p-6"
        style={{ minHeight: "600px" }}
      >
        <p className="text-slate-400">Loading checkout for {storefront}...</p>
      </div>
    </div>
  );
}
