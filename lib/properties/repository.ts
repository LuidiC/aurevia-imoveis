import { propertiesData } from "@/data/properties";
import { propertyCollectionSchema } from "@/schemas/property";
import type { Property } from "@/types/property";

const properties = propertyCollectionSchema.parse(propertiesData);

export function listProperties(): readonly Property[] {
  return properties;
}

export function listFeaturedProperties(): readonly Property[] {
  return properties.filter((property) => property.featured);
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug);
}
