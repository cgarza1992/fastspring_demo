"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductsSection from "./components/ProductsSection";
import FeaturesSection from "./components/FeaturesSection";
import EventLog from "./components/EventLog";
import Footer from "./components/Footer";
import SuccessNotification from "./components/SuccessNotification";

declare global {
  interface Window {
    fastspring: {
      builder: {
        add: (productPath: string) => void;
        checkout: () => void;
        reset: () => void;
        remove: (productPath: string) => void;
        recognize: () => void;
        recognizeRecipients: () => void;
        clean: (key: string) => void;
        promo: (code: string) => void;
        country: (code: string) => void;
        language: (code: string) => void;
        tag: (key: string, value: string | number) => void;
      }
    }
  }
}

interface Product {
  product: string;
  display: {en: string};
  description?: { summary: { en: string } };
  pricing?: {
    price: {
      USD: number;
    };
  };
  image?: string;
}

const pricingIframe = `<!DOCTYPE html><html><head></head><body>
  <script
    id="fsc-api"
    src="https://sbl.onfastspring.com/sbl/1.0.6/fastspring-builder.min.js"
    type="text/javascript"
    data-storefront="fastspringpoc.test.onfastspring.com/embedded-store-1"
    data-data-callback="onFSData">
  </script>
  <script>
    function onFSData(data) {
      if (!data || !data.groups) return;
      var prices = {};
      data.groups.forEach(function(group) {
        (group.items || []).forEach(function(item) {
          if (item.path && item.price) prices[item.path] = item.price;
        });
      });
      if (Object.keys(prices).length > 0) {
        window.parent.postMessage({ type: 'FS_PRICES', prices: prices }, '*');
      }
    }
  </script>
</body></html>`;

export default function Home() {
  const pricingIframeRef = useRef<HTMLIFrameElement>(null);
  const [fastspringData, setFastspringData] = useState<Record<string, unknown> | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [localizedPrices, setLocalizedPrices] = useState<Record<string, string>>({});


  const handleBuyNow = (productPath: string) => {
    console.log('[SBL] Buy Now clicked for:', productPath);

    if(window.fastspring && window.fastspring.builder) {
      window.fastspring.builder.add(productPath);
      // Wait 200ms before opening checkout
      setTimeout(() => {
        window.fastspring.builder.checkout();
      }, 200);
    }
  }

  // Receive localized prices from the hidden pricing iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "FS_PRICES") {
        setLocalizedPrices(event.data.prices);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Show success notification on completed order
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const detail = e.detail;
      if (detail && typeof detail === 'object' && ('order' in detail || 'reference' in detail)) {
        setFastspringData(detail);
        const timer = setTimeout(() => setFastspringData(null), 5000);
        return () => clearTimeout(timer);
      }
    };
    document.addEventListener("fs:data", handler as EventListener);
    return () => document.removeEventListener("fs:data", handler as EventListener);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');

    // Required ID so FastSpring initializes window.fastspring.builder
    script.id = 'fsc-api';

    // Point to FastSpring's SBL library.
    script.src = 'https://sbl.onfastspring.com/sbl/1.0.6/fastspring-builder.min.js';

    // Storefront to connect to
    script.setAttribute('data-storefront', process.env.NEXT_PUBLIC_FASTSPRING_STOREFRONT || '');

    // Load our script asynchronously.
    script.async = true;

    script.onload = () => {
      console.log("[SBL] Script loaded");
    }

    // Add the script to the page.
    document.head.appendChild(script);
  },[]);

  useEffect(() => {
    // Fetch the product from fastsprings API.
    fetch("/api/products/")
      .then((res) => res.json())
      .then((data) => {
        console.log("[API] Products data:", data.products);

        // Fetch full details for each product path.
        const productPromises = data.products.map((path: string) => 
          fetch(`/api/products/${path}`).then((res) => res.json())
        );

        return Promise.all(productPromises);
      })
      .then((productDetails) => {
        //Extract products array from each response
        const allProducts = productDetails.flatMap((response) => response.products || []);
        setProducts(allProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error('[API] Error: ', error);
        setLoading(false);
      });
  },[]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      <Hero />
      <ProductsSection products={products} loading={loading} onBuyNow={handleBuyNow} localizedPrices={localizedPrices} />
      <FeaturesSection />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <EventLog />
      </div>
      <Footer />
      <SuccessNotification show={fastspringData !== null} />
      <iframe
        ref={pricingIframeRef}
        srcDoc={pricingIframe}
        style={{ display: "none" }}
        title="pricing-data"
      />
    </main>
  );
}
