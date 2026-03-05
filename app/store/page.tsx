'use client';

import { useEffect } from 'react';

export default function StorePage() {
  useEffect(() => {
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
    <div id="fsc-embedded-checkout-container"></div>
  );
}
