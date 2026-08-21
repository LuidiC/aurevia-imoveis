import type { Property } from "@/types/property";

import { formatCurrency } from "./currency";

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
  } else if (property.bathrooms) {
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
