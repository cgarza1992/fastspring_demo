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

interface LocalizedPrice {
  price: string;
  currency: string;
}

export default function StorePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [localizedPrices, setLocalizedPrices] = useState<Record<string, LocalizedPrice>>({});

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

  // Listen for localized pricing posted from the iframe's onFSData callback
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "FS_PRICES") {
        setLocalizedPrices(event.data.prices);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
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
            data-storefront="fastspringpoc.test.onfastspring.com/embedded-store-1"
            data-data-callback="onFSData">
        </script>
        
        <div id="fsc-embedded-checkout-container"></div>

        <script>
            console.log('[Iframe] Initialized');
            let fastspringReady = false;

            function onFSData(data) {
                if (!data || !data.groups) return;
                const prices = {};
                data.groups.forEach(function(group) {
                    (group.items || []).forEach(function(item) {
                        if (item.path && item.price) {
                            prices[item.path] = {
                                price: item.price,
                                currency: data.currency || ''
                            };
                        }
                    });
                });
                window.parent.postMessage({ type: 'FS_PRICES', prices: prices }, '*');
            }

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

      {/* Page header */}
      <div className="border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-cyan-400 font-semibold mb-1 uppercase tracking-wider text-sm">Upgrade your plan</p>
          <h1 className="text-4xl font-bold mb-2">DevMetrics Store</h1>
          <p className="text-slate-400">
            Select a plan below and complete checkout. Billing is handled globally by FastSpring — taxes, VAT, and currency conversion included.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Plan selector */}
          <div>
            <h2 className="text-xl font-semibold mb-1">Choose your plan</h2>
            <p className="text-slate-500 text-sm mb-6">Click a plan to add it to your cart on the right.</p>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-400 animate-spin"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => {
                  const isSelected = selectedProducts.includes(product.product);
                  return (
                    <div
                      key={product.product}
                      onClick={() => handleAddProduct(product.product)}
                      className={`group relative rounded-xl border p-5 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-cyan-400/60 bg-cyan-500/5"
                          : "border-slate-700/50 bg-slate-800/30 hover:border-cyan-400/40 hover:bg-slate-800/50"
                      }`}
                    >
                      {/* Selected indicator */}
                      {isSelected && (
                        <span className="absolute top-4 right-4 flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Added
                        </span>
                      )}

                      <div className="flex items-start justify-between pr-16">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-white mb-1">
                            {product.display?.en || product.product}
                          </h3>
                          {product.description?.summary?.en && (
                            <p className="text-slate-400 text-sm leading-relaxed">
                              {product.description.summary.en}
                            </p>
                          )}
                        </div>
                      </div>

                      {(localizedPrices[product.product] || product.pricing?.price?.USD) && (
                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-white">
                            {localizedPrices[product.product]
                              ? localizedPrices[product.product].price
                              : `$${product.pricing!.price.USD.toFixed(2)}`}
                          </span>
                          <span className="text-slate-400 text-sm">/mo</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Trust signals */}
            <div className="mt-8 pt-6 border-t border-slate-800/50">
              <p className="text-slate-500 text-xs mb-3 uppercase tracking-wider">Why FastSpring</p>
              <ul className="space-y-2">
                {[
                  "Taxes & VAT handled automatically in 200+ countries",
                  "PCI-compliant — your card data never touches our servers",
                  "Cancel or upgrade anytime from your billing portal",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-400 text-sm">
                    <svg className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Embedded checkout */}
          <div>
            <h2 className="text-xl font-semibold mb-1">Complete your subscription</h2>
            <p className="text-slate-500 text-sm mb-6">Powered by FastSpring's embedded checkout — no redirects.</p>
            <iframe
              ref={iframeRef}
              srcDoc={iframeContent}
              title="FastSpring Embedded Checkout"
              className="w-full border border-slate-700/50 rounded-xl"
              style={{ minHeight: "900px" }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
