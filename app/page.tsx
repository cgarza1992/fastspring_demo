"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
    <main>
      <h1>FastSpring Demo</h1>
      {loading && <p>Loading products...</p>}
      <div className="grid grid-cols-3 gap-5 mt-5">
        {products.map((product, index) => (
        <div key={index} className="border border-gray-300 p-5 rounded-lg flex flex-col h-full">
          <Image 
            src="https://placehold.co/300x200?text=Product" 
            alt={product.display.en}
            width={300}
            height={200}
            unoptimized
            className="w-full h-48 object-cover rounded mb-4"
          />
          <h2>{product.display.en}</h2>
          <p className="text-gray-600 flex-grow">{product.description?.summary?.en}</p>
          <p className="font-bold text-lg">
            ${product.pricing?.price?.USD || 'N/A'}/month
          </p>
          <button
            onClick={() => handleBuyNow(product.product)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
            Buy Now
          </button>
        </div>
        ))}
      </div>
      {fastspringData && (
        <div>
          <h3>Checkout Data:</h3>
          {/* <pre>{JSON.stringify(fastspringData, null, 2)}</pre> */}
        </div>
      )}
    </main>
  );
}
