'use client';

import { useEffect, useState } from 'react';

interface Product {
  product: string;
  display: { en: string };
  description?: { summary: { en: string } };
  pricing?: {
    price: {
      USD: number;
    };
  };
  image?: string;
}

/**
 * EmbeddedCheckout Component
 * 
 * Displays the FastSpring embedded storefront with product selection.
 * Uses the Store Builder Library (SBL) to manage the shopping cart
 * and checkout experience.
 */
export default function EmbeddedCheckout() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    fetch('/api/products/')
      .then((res) => res.json())
      .then((data) => {
        const productPromises = data.products.map((path: string) =>
          fetch(`/api/products/${path}`).then((res) => res.json())
        );
        return Promise.all(productPromises);
      })
      .then((productDetails) => {
        const allProducts = productDetails.flatMap((response) => response.products || []);
        setProducts(allProducts);
        if (allProducts.length > 0) {
          setSelectedProduct(allProducts[0].product);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('[API] Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (productPath: string) => {
    if (window.fastspring && window.fastspring.builder) {
      console.log('[Embedded Checkout] Adding to cart:', productPath);
      window.fastspring.builder.add(productPath);
      setSelectedProduct(productPath);
    }
  };

  const handleCheckout = () => {
    if (!selectedProduct) {
      alert('Please select a plan first');
      return;
    }

    if (window.fastspring && window.fastspring.builder) {
      console.log('[Embedded Checkout] Adding product and opening checkout:', selectedProduct);
      window.fastspring.builder.add(selectedProduct);
      // Wait for product to be added before opening checkout
      setTimeout(() => {
        window.fastspring.builder.checkout();
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Store</h1>
          <p className="text-gray-400">Choose your plan and get started today</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Selection */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-gray-400">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No products available</div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.product}
                    onClick={() => handleAddToCart(product.product)}
                    className={`p-6 rounded-lg border transition-all cursor-pointer ${
                      selectedProduct === product.product
                        ? 'bg-slate-800 border-cyan-500 ring-2 ring-cyan-500/50'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {product.display.en}
                        </h3>
                        {product.description?.summary?.en && (
                          <p className="text-sm text-gray-400 mt-1">
                            {product.description.summary.en}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-cyan-400">
                          ${product.pricing?.price?.USD?.toFixed(2) || 'Contact'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.product);
                      }}
                      className="w-full mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition-colors"
                    >
                      {selectedProduct === product.product ? '✓ Selected' : 'Select Plan'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 p-6 bg-slate-800 border border-slate-700 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              {selectedProduct && products.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
                    {(() => {
                      const product = products.find((p) => p.product === selectedProduct);
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">{product?.display.en}</span>
                            <span className="font-semibold">
                              ${product?.pricing?.price?.USD?.toFixed(2) || '0.00'}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>Subtotal</span>
                            <span>${product?.pricing?.price?.USD?.toFixed(2) || '0.00'}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="flex justify-between mb-6 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-cyan-400">
                      ${
                        ((products.find((p) => p.product === selectedProduct)?.pricing?.price
                          ?.USD || 0) * 1.06).toFixed(2)
                      }
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold transition-all hover:shadow-lg hover:shadow-cyan-500/50"
                  >
                    Proceed to Checkout
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Secure checkout powered by FastSpring
                  </p>
                </>
              ) : (
                <p className="text-gray-400 text-center py-8">Select a plan to get started</p>
              )}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-12 border-t border-slate-800">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl mb-2">🔒</div>
              <p className="font-semibold">Secure Payments</p>
              <p className="text-sm text-gray-400">PCI DSS compliant checkout</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🌍</div>
              <p className="font-semibold">Global</p>
              <p className="text-sm text-gray-400">170+ countries supported</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📧</div>
              <p className="font-semibold">Instant Access</p>
              <p className="text-sm text-gray-400">Automatic API key delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
