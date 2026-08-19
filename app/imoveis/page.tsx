import type { Metadata } from "next";

import { PropertyCatalogPlaceholder } from "@/components/property/property-catalog-placeholder";
import { getActiveProperties } from "@/lib/properties";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Imóveis",
  description: "Catálogo de imóveis da Marli Corretora em Pedro Leopoldo/MG e região.",
  path: "/imoveis",
});

export default function PropertiesPage() {
  const properties = getActiveProperties();

  return <PropertyCatalogPlaceholder propertyCount={properties.length} />;
}
