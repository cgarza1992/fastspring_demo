"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductsSection from "./components/ProductsSection";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import SuccessNotification from "./components/SuccessNotification";

declare global {
  interface Window {
    fastspring: {
      builder: {
        add: (productPath: string) => void;
        checkout: () => void;
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

export default function Home() {
  // Grab our fast spring data and save it into state.
  const [fastspringData, setFastspringData] = useState<Record<string, unknown> | null>(null);

  // Grab our product data and save it into state.
  const [products, setProducts] = useState<Product[]>([]);

  // Track if we are still fetching data.
  const [loading, setLoading] = useState(true);


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

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      console.log("[FastSpring] checkout event:", e.detail);
      // Only set data if it contains order information
      if (e.detail && typeof e.detail === 'object' && ('order' in e.detail || 'reference' in e.detail)) {
        setFastspringData(e.detail);
        // Auto-hide notification after 5 seconds
        const timer = setTimeout(() => setFastspringData(null), 5000);
        return () => clearTimeout(timer);
      }
    };
    document.addEventListener("fs:data", handler as EventListener);
    return () => document.removeEventListener("fs:data", handler as EventListener);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');

    // Point to FastSpring's SBL library. 
    script.src = 'https://sbl.onfastspring.com/sbl/1.0.3/fastspring-builder.min.js';

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
      <ProductsSection products={products} loading={loading} onBuyNow={handleBuyNow} />
      <FeaturesSection />
      <Footer />
      <SuccessNotification show={fastspringData !== null} />
    </main>
  );
}
