"use client";

import Header from "@/app/components/Header";
import EmbeddedCheckout from "@/app/components/EmbeddedCheckout";
import Footer from "@/app/components/Footer";

export default function StorePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Embedded Store 1</h1>
          <p className="text-lg text-slate-400">
            This page demonstrates FastSpring's embedded checkout integration.
          </p>
        </div>

        <EmbeddedCheckout storefront="fastspringpoc.test.onfastspring.com/embedded-store-1" />
      </div>

      <Footer />
    </main>
  );
}
