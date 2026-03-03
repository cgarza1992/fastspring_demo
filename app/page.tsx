"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

declare global {
  interface Window {
    fastspring: {
      getProduct: (productPath: string, callback: (data:Product) => void) => void;
    }
  }
}

interface Product {
  display: string;
  price: string;
  image?: string;
}

export default function Home() {
  // Grab our fast spring data and save it into state.
  const [fastspringData, setFastspringData] = useState<Record<string, unknown> | null>(null);

  // Grab our product data and save it into state.
  const [product, setProduct] = useState<Product | null>(null);

  // Track if we are still fetching data.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      console.log("[FastSpring] checkout event:", e.detail);
      setFastspringData(e.detail);
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
    fetch("/api/products/devmetrics-proj")
      .then((res) => res.json())
      .then((data) => {
        console.log("[API] Product data:", data);
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('[API] Error: ', error);
        setLoading(false);
      });
  },[]);

  return (
    <main>
      <h1>FastSpring Demo</h1>

      {loading && <p>Loading product...</p>}
      {product && (
        <div>
          <h2>{product.display}</h2>
          <p>Price: {product.price}</p>
          {product.image && <Image src={product.image} alt={product.display} width={200} height={200} />}
        </div>
      )}
      {fastspringData && (
        <div>
          <h3>Checkout Data:</h3>
          {/* <pre>{JSON.stringify(fastspringData, null, 2)}</pre> */}
        </div>
      )}
    </main>
  );
}
