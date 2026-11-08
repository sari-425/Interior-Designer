import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { PreviewBanner } from "@/components/layout/PreviewBanner";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

// Schriften werden beim Build lokal eingebunden: Besucher laden nichts von Google-Servern.
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: {
    default: "DesignBySari – Dein Zuhause. Dein Budget. Dein Design.",
    template: "%s · DesignBySari",
  },
  description:
    "Lade ein Foto deines Wohnzimmers hoch, wähle Stil, Farben und Budget und entdecke, wie dein Wohnzimmer neu aussehen kann. Einrichtungsplanung mit KI für Deutschland.",
  applicationName: "DesignBySari",
};

export const viewport: Viewport = {
  themeColor: "#f2ede5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-charcoal focus:px-4 focus:py-2 focus:text-cream"
        >
          Zum Inhalt springen
        </a>
        <PreviewBanner />
        <SiteHeader />
        <main id="inhalt" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
