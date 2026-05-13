// =============================================================
// app/layout.tsx
//
// ROOT LAYOUT - Berlaku untuk SEMUA halaman
// Ini adalah "bungkus" HTML dasar seluruh aplikasi
//
// TYPESCRIPT NOTE:
// "Metadata" adalah tipe yang disediakan Next.js untuk SEO.
// "{ children }: { children: React.ReactNode }" adalah cara
// mendefinisikan props untuk layout component.
// =============================================================

import type { Metadata, Viewport } from "next";
import "./globals.css";
import GlobalSidebarWrapper from "@/components/ui/GlobalSidebarWrapper";

// SEO Metadata - diterapkan ke semua halaman secara default
export const metadata: Metadata = {
  title: {
    default: "CardioLearn — Mekanisme & Anatomi Jantung Manusia",
    template: "%s | CardioLearn",
  },
  description:
    "Platform pembelajaran interaktif 3D untuk eksplorasi anatomi, hemodinamik, dan sistem konduksi jantung manusia. Dirancang untuk mahasiswa kedokteran.",
  keywords: [
    "anatomi jantung",
    "hemodinamik",
    "sistem konduksi",
    "medical education",
    "3D heart",
  ],
  authors: [{ name: "CardioLearn Team" }],
  creator: "CardioLearn",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050b1a",
};

// Props type untuk RootLayout
// "React.ReactNode" adalah tipe untuk apapun yang bisa dirender React
type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Preconnect ke Google Fonts untuk performa */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Noise texture overlay untuk luxury feel */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Global Sidebar - muncul di semua halaman */}
        <GlobalSidebarWrapper />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
