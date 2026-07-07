import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google"; // Geist yerine Inter kullanıyoruz
import "./globals.css";
import GamePopup from "@/components/GamePopup";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
        {children}
        <GamePopup />
        {gaMeasurementId ? <GoogleAnalytics gaId={gaMeasurementId} /> : null}
      </body>
    </html>
  );
}