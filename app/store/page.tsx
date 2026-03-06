"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export const dynamic = "force-dynamic";

interface Product {
  product: string;
  display: { en: string };
  description?: { summary: { en: string } };
  pricing?: { price: { USD: number } };
}

export default function StorePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch product paths and then get full details
  useEffect(() => {
    fetch("/api/storefronts/embedded-store-1/products")
      .then((res) => res.json())
      .then(async (data) => {
        const productPaths = data.productPaths || [];
        
        // Fetch full details for each product path
        const productDetails = await Promise.all(
          productPaths.map((path: string) =>
            fetch(`/api/products/${path}`)
              .then((res) => res.json())
              .then((data) => {
                // Extract the first (and only) product from the products array
                return data.products?.[0] || null;
              })
              .catch(() => null)
          )
        );
        
        setProducts(productDetails.filter(Boolean));
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleAddProduct = (productId: string) => {
    console.log("[StorePage] Adding product:", productId);
    setSelectedProducts([...selectedProducts, productId]);
    
    // Send to iframe
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "ADD_PRODUCT", productPath: productId },
        "*"
      );
    }
  };

  const iframeContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FastSpring Embedded Store</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(to bottom, #0f172a, #0e1828);
            color: #fff;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            background: linear-gradient(90deg, #3b82f6, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Embedded Checkout</h1>
        
        <script
            id="fsc-api"
            src="https://sbl.onfastspring.com/sbl/1.0.6/fastspring-builder.min.js"
            type="text/javascript"
            data-storefront="fastspringpoc.test.onfastspring.com/embedded-store-1">
        </script>
        
        <div id="fsc-embedded-checkout-container"></div>

        <script>
            console.log('[Iframe] Initialized');
            let fastspringReady = false;

            window.addEventListener('load', function() {
                console.log('[Iframe] Window loaded');
                if (window.fastspring && window.fastspring.builder) {
                    fastspring.builder.reset();
                    fastspringReady = true;
                    console.log('[Iframe] FastSpring ready');
                }
            });

            window.addEventListener('message', function(event) {
                if (event.data.type === 'ADD_PRODUCT') {
                    const productPath = event.data.productPath;
                    console.log('[Iframe] Received ADD_PRODUCT message for:', productPath);
                    
                    const tryAdd = () => {
                        if (window.fastspring && window.fastspring.builder) {
                            console.log('[Iframe] Adding product:', productPath);
                            fastspring.builder.add(productPath);
                        } else {
                            console.log('[Iframe] FastSpring not ready yet, retrying...');
                            setTimeout(tryAdd, 50);
                        }
                    };
                    tryAdd();
                }
            });
        </script>
    </div>
</body>
</html>
  `;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Embedded Store</h1>
          <p className="text-lg text-slate-400">
            Select products and checkout below.
          </p>
        </div>

        {/* Products Section */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Tiles */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Available Products</h2>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-400 animate-spin"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.product}
                    className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-400/50 transition-colors"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {product.display?.en || product.product}
                    </h3>
                    {product.description?.summary?.en && (
                      <p className="text-slate-400 text-sm mb-4">
                        {product.description.summary.en}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {product.pricing?.price?.USD && (
                        <p className="text-cyan-400 font-bold">
                          ${product.pricing.price.USD.toFixed(2)}
                        </p>
                      )}
                      <button
                        onClick={() => handleAddProduct(product.product)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedProducts.length > 0 && (
              <div className="mt-8 p-4 bg-slate-800/40 border border-cyan-400/50 rounded-lg">
                <p className="text-cyan-400 font-semibold">
                  {selectedProducts.length} item(s) added to cart
                </p>
              </div>
            )}
          </div>

          {/* Checkout Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            <iframe
              ref={iframeRef}
              srcDoc={iframeContent}
              title="FastSpring Embedded Checkout"
              className="w-full border border-slate-700/50 rounded-lg"
              style={{ minHeight: "600px" }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
