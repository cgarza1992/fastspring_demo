"use client";

import { useEffect } from "react";

interface EmbeddedCheckoutProps {
  storefront: string;
  productPath?: string;
}

/**
 * EmbeddedCheckout Component
 * 
 * Renders a FastSpring embedded checkout container.
 * Relies on the global SBL script loaded in layout.tsx
 */
export default function EmbeddedCheckout({ storefront, productPath = "devmetrics-pro" }: EmbeddedCheckoutProps) {
  useEffect(() => {
    // Wait for FastSpring to be available, then initialize
    let attempts = 0;
    const checkInterval = setInterval(() => {
      if (window.fastspring && window.fastspring.builder) {
        console.log("[SBL] FastSpring available, adding product:", productPath);
        window.fastspring.builder.reset();
        window.fastspring.builder.add(productPath);
        clearInterval(checkInterval);
      } else if (attempts > 50) {
        console.warn("[SBL] FastSpring did not load after 5 seconds");
        clearInterval(checkInterval);
      }
      attempts++;
    }, 100);

    return () => clearInterval(checkInterval);
  }, [productPath]);

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
