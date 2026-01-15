import Script from "next/script";
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Geist yerine Inter kullanıyoruz
import "./globals.css";

// Inter fontunu tanımlıyoruz (Eski sürümlerde standart budur)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OMÜ Diş Not Hesaplama | Ortalama Hesaplama Aracı",
  description: "OMÜ Diş Hekimliği öğrencileri için vize, final ve yıl sonu ortalama hesaplama aracı. Ders notlarınızı girin, geçme notunuzu hemen öğrenin.",
  keywords: ["omü diş", "omü diş hekimliği", "not hesaplama", "diş hekimliği ortalama", "omü not", "samsun diş", "vize final hesaplama"],
  authors: [{ name: "Emir Red", url: "https://emirred.space" }],
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
      <body className={inter.className}>
        {/* Umami Takip Kodu - TypeScript Hatalarını Önleyen Yöntem */}
        <Script
          id="umami-tracker"
          src="https://admin.omudisnot.space/script.js"
          strategy="afterInteractive"
          {...{ "data-website-id": "49a0810c-bd0a-4e6c-88b3-6d504c544330" }}
        />

        {children}
      </body>
    </html>
  );
}