import type { Property } from "@/types/property";

import { formatCurrency } from "./currency";
import { PROPERTY_FEATURE_LABELS } from "./labels";

export type PropertyMetaKind =
  | "bedrooms"
  | "suites"
  | "bathrooms"
  | "parking"
  | "area";

export type PropertyMetaItem = Readonly<{
  kind: PropertyMetaKind;
  label: string;
}>;

export type PropertyAdditionalCostItem = Readonly<{
  kind: "condominium" | "property_tax";
  label: string;
  value: string;
}>;

export type PropertyLocationDetails = Readonly<{
  label: string;
  note?: string;
}>;

function pluralize(value: number, singular: string, plural: string): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

export function getPropertyHref(property: Pick<Property, "slug">): string {
  return `/imoveis/${property.slug}`;
}

export function getPropertyLocationLabel(
  location: Property["location"],
): string {
  return location.neighborhood
    ? `${location.neighborhood} · ${location.city}`
    : `${location.city} · ${location.state}`;
}

export function getPropertyPriceLabel(
  property: Pick<Property, "price" | "purpose">,
): string {
  if (property.price.kind === "on_request") {
    return "Valor sob consulta";
  }

  const price = formatCurrency(property.price.amountInCents).replace(/,00$/, "");

  return property.purpose === "rent" ? `${price}/mês` : price;
}

export function getPropertyMetaItems(
  property: Pick<
    Property,
    | "bedrooms"
    | "suites"
    | "bathrooms"
    | "parkingSpaces"
    | "areaInSquareMeters"
  >,
): readonly PropertyMetaItem[] {
  const items: PropertyMetaItem[] = [];

  if (property.bedrooms) {
    items.push({
      kind: "bedrooms",
      label: pluralize(property.bedrooms, "quarto", "quartos"),
    });
  }

  if (property.suites) {
    items.push({
      kind: "suites",
      label: pluralize(property.suites, "suíte", "suítes"),
    });
  }

  if (property.bathrooms) {
    items.push({
      kind: "bathrooms",
      label: pluralize(property.bathrooms, "banheiro", "banheiros"),
    });
  }

  if (property.parkingSpaces) {
    items.push({
      kind: "parking",
      label: pluralize(property.parkingSpaces, "vaga", "vagas"),
    });
  }

  if (property.areaInSquareMeters) {
    const area = new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 2,
    }).format(property.areaInSquareMeters);

    items.push({ kind: "area", label: `${area} m²` });
  }

  return items;
}

export function getPropertyAdditionalCostItems(
  property: Pick<Property, "additionalCosts">,
): readonly PropertyAdditionalCostItem[] {
  const costs = property.additionalCosts;

  if (!costs) return [];

  const items: PropertyAdditionalCostItem[] = [];

  if (costs.condominiumFeeInCents) {
    items.push({
      kind: "condominium",
      label: "Condomínio",
      value: formatCurrency(costs.condominiumFeeInCents),
    });
  }

  if (costs.propertyTaxInCents) {
    items.push({
      kind: "property_tax",
      label: "IPTU",
      value: formatCurrency(costs.propertyTaxInCents),
    });
  }

  return items;
}

function getPropertyAddressLabel(location: Property["location"]): string | undefined {
  if (!location.address) return undefined;

  const streetLine = [location.address.street, location.address.number]
    .filter(Boolean)
    .join(", ");
  const complement = location.address.complement
    ? `, ${location.address.complement}`
    : "";
  const locality = [location.neighborhood, location.city]
    .filter(Boolean)
    .join(" · ");
  const postalCode = location.address.postalCode
    ? ` · CEP ${location.address.postalCode}`
    : "";

  return `${streetLine}${complement} · ${locality} · ${location.state}${postalCode}`;
}

export function getPropertyLocationDetails(
  location: Property["location"],
): PropertyLocationDetails {
  if (location.disclosure === "approximate") {
    const locality = [location.neighborhood, location.city]
      .filter(Boolean)
      .join(" · ");

    return {
      label: `${locality} · ${location.state}`,
      note: "A localização apresentada é aproximada. O endereço completo é informado durante o atendimento.",
    };
  }

  const addressLabel = getPropertyAddressLabel(location);

  if (addressLabel) return { label: addressLabel };

  return {
    label: getPropertyLocationLabel(location),
    note: "A localização exata está cadastrada e pode ser confirmada durante o atendimento.",
  };
}

export function getPropertyFeatureLabels(
  features: Property["features"],
): readonly string[] {
  return features.map((feature) => PROPERTY_FEATURE_LABELS[feature]);
}
