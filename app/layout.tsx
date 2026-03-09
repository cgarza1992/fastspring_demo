import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import  Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevMetrics",
  description: "Proof of concept using the FastSpring API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Script
          id="fsc-api-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.onFSData = function(data) { window.__fsData = data; document.dispatchEvent(new CustomEvent('fs:data', { detail: data })); };`
          }}
        />
        <Script
            id="fsc-api"
            src="https://sbl.onfastspring.com/sbl/1.0.6/fastspring-builder.min.js"
            data-storefront={process.env.NEXT_PUBLIC_FASTSPRING_STOREFRONT}
            data-data-callback="onFSData"
            strategy="afterInteractive"
          />
      </body>
    </html>
  );
}
