import {
  PROPERTY_PURPOSES,
  PROPERTY_TYPES,
} from "@/lib/properties/constants";
import type {
  PropertyFilters,
  PropertyPurpose,
  PropertySort,
  PropertyType,
} from "@/types/property";

export const PROPERTY_PRICE_OPTIONS = {
  sale: [
    { value: "", label: "Qualquer faixa" },
    { value: "300000", label: "Até R$ 300 mil" },
    { value: "500000", label: "Até R$ 500 mil" },
    { value: "800000", label: "Até R$ 800 mil" },
    { value: "1200000", label: "Até R$ 1,2 milhão" },
  ],
  rent: [
    { value: "", label: "Qualquer faixa" },
    { value: "1500", label: "Até R$ 1.500/mês" },
    { value: "2500", label: "Até R$ 2.500/mês" },
    { value: "4000", label: "Até R$ 4.000/mês" },
    { value: "6000", label: "Até R$ 6.000/mês" },
  ],
} as const satisfies Record<
  PropertyPurpose,
  readonly { value: string; label: string }[]
>;

export const CATALOG_PROPERTY_TYPES = [
  "house",
  "apartment",
  "land",
  "rural",
  "commercial",
] as const satisfies readonly PropertyType[];

export const PROPERTY_CITY_OPTIONS = [
  { value: "", label: "Todas as cidades" },
  { value: "Lagoa Santa", label: "Lagoa Santa" },
  { value: "Vespasiano", label: "Vespasiano" },
  { value: "Jaboticatubas", label: "Jaboticatubas" },
  { value: "Confins", label: "Confins" },
] as const;

type PropertyCity = Exclude<(typeof PROPERTY_CITY_OPTIONS)[number]["value"], "">;

const PROPERTY_SORTS = ["price_asc", "price_desc", "newest"] as const;
const BEDROOM_OPTIONS = ["1", "2", "3", "4"] as const;

export type PropertySearchParams = Readonly<
  Record<string, string | readonly string[] | undefined>
>;

export type PropertyCatalogSearch = Readonly<{
  purpose: PropertyPurpose | "";
  type: PropertyType | "";
  location: string;
  maxPrice: string;
  bedrooms: string;
  sort: PropertySort | "";
}>;

export type PropertySearchInput = Readonly<{
  purpose: PropertyPurpose;
  type?: PropertyType | "";
  location?: string;
  maxPrice?: string;
}>;

function getFirstValue(value: string | readonly string[] | undefined): string {
  return typeof value === "string" ? value : (value?.[0] ?? "");
}

function isIncluded<T extends string>(
  values: readonly T[],
  value: string,
): value is T {
  return values.some((candidate) => candidate === value);
}

function normalizeLocation(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function isPropertyCity(value: string): value is PropertyCity {
  return PROPERTY_CITY_OPTIONS.some(
    (option) => option.value !== "" && option.value === value,
  );
}

function normalizePositiveInteger(value: string): string {
  if (!/^\d+$/.test(value)) return "";

  const parsed = Number(value);

  return Number.isSafeInteger(parsed) && parsed > 0 ? String(parsed) : "";
}

export function parsePropertySearchParams(
  params: PropertySearchParams,
): PropertyCatalogSearch {
  const purposeValue = getFirstValue(params.purpose);
  const typeValue = getFirstValue(params.type);
  const bedroomsValue = getFirstValue(params.bedrooms);
  const sortValue = getFirstValue(params.sort);
  const purpose = isIncluded(PROPERTY_PURPOSES, purposeValue)
    ? purposeValue
    : "";
  const parsedMaxPrice = normalizePositiveInteger(
    getFirstValue(params.maxPrice),
  );
  const maxPrice = purpose ? parsedMaxPrice : "";
  const maxPriceInCents = maxPrice ? Number(maxPrice) * 100 : 0;

  return {
    purpose,
    type:
      isIncluded(PROPERTY_TYPES, typeValue) &&
      isIncluded(CATALOG_PROPERTY_TYPES, typeValue)
        ? typeValue
        : "",
    location: normalizeLocation(getFirstValue(params.location)),
    maxPrice: Number.isSafeInteger(maxPriceInCents) ? maxPrice : "",
    bedrooms: isIncluded(BEDROOM_OPTIONS, bedroomsValue)
      ? bedroomsValue
      : "",
    sort: isIncluded(PROPERTY_SORTS, sortValue) ? sortValue : "",
  };
}

export function getPropertyFiltersFromSearch(
  search: PropertyCatalogSearch,
): PropertyFilters {
  const locationFilter = isPropertyCity(search.location)
    ? { city: search.location }
    : { location: search.location || undefined };

  return {
    purpose: search.purpose || undefined,
    type: search.type || undefined,
    ...locationFilter,
    maxPriceInCents: search.maxPrice
      ? Number(search.maxPrice) * 100
      : undefined,
    minBedrooms: search.bedrooms ? Number(search.bedrooms) : undefined,
    sort: search.sort || undefined,
  };
}

export function hasPropertyFilters(search: PropertyCatalogSearch): boolean {
  return Boolean(
    search.purpose ||
      search.type ||
      search.location ||
      search.maxPrice ||
      search.bedrooms,
  );
}

export function buildPropertyCatalogUrl(
  input: Partial<PropertyCatalogSearch>,
): string {
  const search = parsePropertySearchParams(input);
  const params = new URLSearchParams();

  if (search.purpose) params.set("purpose", search.purpose);
  if (search.type) params.set("type", search.type);
  if (search.location) params.set("location", search.location);
  if (search.maxPrice) params.set("maxPrice", search.maxPrice);
  if (search.bedrooms) params.set("bedrooms", search.bedrooms);
  if (search.sort) params.set("sort", search.sort);

  const query = params.toString();

  return query ? `/imoveis?${query}` : "/imoveis";
}

export function buildPropertySearchUrl({
  purpose,
  type,
  location,
  maxPrice,
}: PropertySearchInput): string {
  return buildPropertyCatalogUrl({ purpose, type, location, maxPrice });
}
