import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OMÜ Diş - Not Hesaplama",
  description: "OMÜ Diş Öğrencileri İçin Not Hesaplama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Umami Takip Kodu - Düzeltilmiş Hali */}
        <Script
          src="https://admin.omudisnot.space/script.js"
          data-website-id="49a0810c-bd0a-4e6c-88b3-6d504c544330"
          strategy="afterInteractive"
        />

        {children}
      </body>
    </html>
  );
}