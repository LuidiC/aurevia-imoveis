import type { Metadata } from "next";

import { AboutSection } from "@/components/home/about-section";
import { ContactSection } from "@/components/home/contact-section";
import { FeaturedPropertiesSection } from "@/components/home/featured-properties-section";
import { HomeHero } from "@/components/home/home-hero";
import { SITE_CONFIG } from "@/config/site";

const title = `${SITE_CONFIG.name} | Imóveis em Lagoa Santa e Vetor Norte`;
const description = SITE_CONFIG.description;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    locale: "pt_BR",
    siteName: SITE_CONFIG.name,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function HomePage() {
  return (
    <main className="flex-1" id="conteudo">
      <HomeHero />
      <FeaturedPropertiesSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
