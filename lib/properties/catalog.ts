import { propertiesData } from "@/data/properties";
import { propertyCollectionSchema } from "@/schemas/property";
import type {
  Property,
  PropertyFilters,
  PropertyLookupOptions,
} from "@/types/property";

import {
  getActivePropertiesFrom,
  getFeaturedPropertiesFrom,
  getPropertyByIdFrom,
  getPropertyBySlugFrom,
  getSimilarPropertiesFrom,
} from "./queries";

const properties: readonly Property[] = propertyCollectionSchema.parse(propertiesData);

export function getActiveProperties(
  filters: PropertyFilters = {},
): readonly Property[] {
  return getActivePropertiesFrom(properties, filters);
}

export function getPropertyBySlug(
  slug: string,
  options: PropertyLookupOptions = {},
): Property | undefined {
  return getPropertyBySlugFrom(properties, slug, options);
}

export function getPropertyById(
  id: string,
  options: PropertyLookupOptions = {},
): Property | undefined {
  return getPropertyByIdFrom(properties, id, options);
}

export function getFeaturedProperties(): readonly Property[] {
  return getFeaturedPropertiesFrom(properties);
}

export function getSimilarProperties(
  property: Property,
  limit?: number,
): readonly Property[] {
  return getSimilarPropertiesFrom(properties, property, limit);
}
