'use client';

import { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function StorePage() {
  useEffect(() => {
    // Check if script is already loaded
    if (document.getElementById('fsc-api')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'fsc-api';
    script.src = 'https://sbl.onfastspring.com/sbl/1.0.6/fastspring-builder.min.js';
    script.setAttribute('data-storefront', 'fastspringpoc.test.onfastspring.com/embedded-store-1');
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Store</h1>
        <p className="text-gray-400 mb-8">Choose your plan</p>
        <div id="fsc-embedded-checkout-container"></div>
      </div>

      <Footer />
    </main>
  );
}
