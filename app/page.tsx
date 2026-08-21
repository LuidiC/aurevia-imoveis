import type { Metadata } from "next";

import { AboutSection } from "@/components/home/about-section";
import { ContactSection } from "@/components/home/contact-section";
import { FeaturedPropertiesSection } from "@/components/home/featured-properties-section";
import { HomeHero } from "@/components/home/home-hero";
import { SITE_CONFIG } from "@/config/site";

const title = "Marli Corretora | Imóveis em Pedro Leopoldo e região";
const description =
  "Encontre casas, apartamentos, terrenos e imóveis rurais para comprar ou alugar em Pedro Leopoldo/MG e região, com mais de 30 anos de experiência local.";

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
