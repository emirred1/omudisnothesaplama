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

// SEO AYARLARI BURADA GÜÇLENDİRİLDİ
export const metadata: Metadata = {
  title: "OMÜ Diş Not Hesaplama | Ortalama Hesaplama Aracı",
  description: "OMÜ Diş Hekimliği öğrencileri için vize, final ve yıl sonu ortalama hesaplama aracı. Ders notlarınızı girin, geçme notunuzu hemen öğrenin.",
  keywords: ["omü diş", "omü diş hekimliği", "not hesaplama", "diş hekimliği ortalama", "omü not", "samsun diş", "vize final hesaplama"],
  authors: [{ name: "Emir", url: "https://emirred.space" }],
  openGraph: {
    title: "OMÜ Diş Not Hesaplama",
    description: "OMÜ Diş Hekimliği öğrencileri için pratik not hesaplama aracı.",
    url: "https://omudisnot.space",
    siteName: "OMÜ Diş Not",
    locale: "tr_TR",
    type: "website",
  },
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
        {/* Umami Takip Kodu */}
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