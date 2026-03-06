"use client";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function StorePage() {
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
            window.addEventListener('load', function() {
                if (window.fastspring && window.fastspring.builder) {
                    fastspring.builder.reset();
                    fastspring.builder.add("devmetrics-pro");
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
            This page demonstrates FastSpring's embedded checkout integration.
          </p>
        </div>

        <iframe
          srcDoc={iframeContent}
          title="FastSpring Embedded Checkout"
          className="w-full border border-slate-700/50 rounded-lg"
          style={{ minHeight: "700px" }}
        />
      </div>

      <Footer />
    </main>
  );
}
