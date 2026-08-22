import type { z } from "zod";

import type { propertySchema } from "@/schemas/property";

export type Property = z.output<typeof propertySchema>;
export type PropertyPurpose = Property["purpose"];
export type PropertyType = Property["type"];
export type PropertyStatus = Property["status"];
export type PropertyFeature = Property["features"][number];
export type PropertyPrice = Property["price"];
export type PropertyImage = Property["images"][number];
export type PropertySort = "price_asc" | "price_desc" | "newest";

export type PropertyFilters = Readonly<{
  purpose?: PropertyPurpose;
  type?: PropertyType;
  location?: string;
  city?: string;
  neighborhood?: string;
  minPriceInCents?: number;
  maxPriceInCents?: number;
  minBedrooms?: number;
  sort?: PropertySort;
}>;

export type PropertyLookupOptions = Readonly<{
  includeInactive?: boolean;
}>;
