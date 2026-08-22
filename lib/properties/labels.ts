import type {
  PropertyFeature,
  PropertyPurpose,
  PropertyType,
} from "@/types/property";

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

export const PROPERTY_FEATURE_LABELS = {
  pool: "Piscina",
  balcony: "Varanda",
  gourmet_area: "Área gourmet",
  elevator: "Elevador",
  concierge: "Portaria",
  backyard: "Quintal",
  furnished: "Mobiliado",
  barbecue: "Churrasqueira",
  gated_community: "Condomínio fechado",
  built_in_cabinets: "Armários planejados",
  financing_eligible: "Aceita financiamento",
} satisfies Record<PropertyFeature, string>;
