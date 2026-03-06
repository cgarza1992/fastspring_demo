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
 * The SBL script must be loaded globally (in layout.tsx) for this to work.
 */
export default function EmbeddedCheckout({ storefront, productPath = "devmetrics-pro" }: EmbeddedCheckoutProps) {
  useEffect(() => {
    // Check if SBL script already exists
    let existingScript = document.getElementById("fsc-api");
    
    // If script exists and FastSpring is loaded, just reinitialize the cart
    if (existingScript && window.fastspring && window.fastspring.builder) {
      console.log("[SBL] Script already loaded, reinitializing cart");
      window.fastspring.builder.reset();
      window.fastspring.builder.add(productPath);
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
      
      // Add product on load to trigger embedded checkout
      if (window.fastspring && window.fastspring.builder) {
        window.fastspring.builder.reset();
        window.fastspring.builder.add(productPath);
        console.log("[SBL] Added product to cart:", productPath);
      }
    };

    script.onerror = () => {
      console.error("[SBL] Failed to load embedded checkout script");
    };

    document.head.appendChild(script);
  }, [storefront, productPath]);

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
