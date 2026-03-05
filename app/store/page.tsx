'use client';

import dynamic from 'next/dynamic';

const EmbeddedCheckout = dynamic(
  () => Promise.resolve(() => (
    <>
      <script
        id="fsc-api"
        src="https://sbl.onfastspring.com/sbl/1.0.6/fastspring-builder.min.js"
        type="text/javascript"
        data-storefront="fastspringpoc.test.onfastspring.com/embedded-store-1">
      </script>
      <div id="fsc-embedded-checkout-container"></div>
    </>
  )),
  { ssr: false }
);

export default function StorePage() {
  return <EmbeddedCheckout />;
}
