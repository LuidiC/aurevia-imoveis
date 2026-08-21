import type { PropertyPurpose, PropertyType } from "@/types/property";

export type PropertySearchInput = Readonly<{
  purpose: PropertyPurpose;
  type?: PropertyType | "";
  location?: string;
  maxPrice?: string;
}>;

export function buildPropertySearchUrl({
  purpose,
  type,
  location,
  maxPrice,
}: PropertySearchInput): string {
  const params = new URLSearchParams({ purpose });
  const normalizedLocation = location?.trim();

  if (type) params.set("type", type);
  if (normalizedLocation) params.set("location", normalizedLocation);
  if (maxPrice && /^\d+$/.test(maxPrice)) params.set("maxPrice", maxPrice);

  return `/imoveis?${params.toString()}`;
}
