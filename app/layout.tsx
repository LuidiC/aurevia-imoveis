import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SITE_CONFIG } from "@/config/site";
import { getMetadataBase } from "@/lib/seo/metadata";

import "./globals.css";

const bodyFont = localFont({
  src: "./fonts/manrope-latin-variable.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "400 800",
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  applicationName: SITE_CONFIG.name,
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  icons: {
    icon: SITE_CONFIG.brand.logoSrc,
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    locale: "pt_BR",
    siteName: SITE_CONFIG.name,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html data-scroll-behavior="smooth" lang="pt-BR">
      <body
        className={`${bodyFont.variable} flex min-h-screen flex-col antialiased`}
      >
        <a
          className="sr-only z-50 bg-surface p-3 text-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
          href="#conteudo"
        >
          Pular para o conteúdo
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
