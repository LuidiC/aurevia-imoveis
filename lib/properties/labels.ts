import type { PropertyPurpose, PropertyType } from "@/types/property";

export const PROPERTY_PURPOSE_LABELS = {
  sale: "Venda",
  rent: "Aluguel",
} satisfies Record<PropertyPurpose, string>;

export const PROPERTY_TYPE_LABELS = {
  house: "Casa",
  apartment: "Apartamento",
  land: "Terreno",
  rural: "Imóvel rural",
  commercial: "Comercial",
  other: "Outro imóvel",
} satisfies Record<PropertyType, string>;
