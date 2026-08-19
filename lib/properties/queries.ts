import type {
  Property,
  PropertyFilters,
  PropertyLookupOptions,
} from "@/types/property";

const DEFAULT_SIMILAR_PROPERTIES_LIMIT = 3;

function normalizeSearchTerm(value: string): string {
  return value.trim().toLocaleLowerCase("pt-BR");
}

function getFixedPriceInCents(property: Property): number | undefined {
  return property.price.kind === "fixed"
    ? property.price.amountInCents
    : undefined;
}

function matchesFilters(property: Property, filters: PropertyFilters): boolean {
  if (filters.purpose && property.purpose !== filters.purpose) return false;
  if (filters.type && property.type !== filters.type) return false;

  if (
    filters.city &&
    normalizeSearchTerm(property.location.city) !==
      normalizeSearchTerm(filters.city)
  ) {
    return false;
  }

  if (
    filters.neighborhood &&
    (!property.location.neighborhood ||
      normalizeSearchTerm(property.location.neighborhood) !==
        normalizeSearchTerm(filters.neighborhood))
  ) {
    return false;
  }

  if (
    filters.minBedrooms !== undefined &&
    (property.bedrooms === undefined ||
      property.bedrooms < filters.minBedrooms)
  ) {
    return false;
  }

  if (
    filters.minPriceInCents !== undefined ||
    filters.maxPriceInCents !== undefined
  ) {
    const priceInCents = getFixedPriceInCents(property);

    if (priceInCents === undefined) return false;
    if (
      filters.minPriceInCents !== undefined &&
      priceInCents < filters.minPriceInCents
    ) {
      return false;
    }
    if (
      filters.maxPriceInCents !== undefined &&
      priceInCents > filters.maxPriceInCents
    ) {
      return false;
    }
  }

  return true;
}

function canBeReturned(
  property: Property,
  options: PropertyLookupOptions,
): boolean {
  return options.includeInactive === true || property.status === "active";
}

export function getActivePropertiesFrom(
  properties: readonly Property[],
  filters: PropertyFilters = {},
): readonly Property[] {
  return properties.filter(
    (property) => property.status === "active" && matchesFilters(property, filters),
  );
}

export function getPropertyBySlugFrom(
  properties: readonly Property[],
  slug: string,
  options: PropertyLookupOptions = {},
): Property | undefined {
  return properties.find(
    (property) =>
      property.slug === slug && canBeReturned(property, options),
  );
}

export function getPropertyByIdFrom(
  properties: readonly Property[],
  id: string,
  options: PropertyLookupOptions = {},
): Property | undefined {
  return properties.find(
    (property) => property.id === id && canBeReturned(property, options),
  );
}

export function getFeaturedPropertiesFrom(
  properties: readonly Property[],
): readonly Property[] {
  return properties.filter(
    (property) => property.status === "active" && property.featured,
  );
}

function getSimilarityScore(target: Property, candidate: Property): number {
  let score = 1;

  if (target.type === candidate.type) score += 4;
  if (
    normalizeSearchTerm(target.location.city) ===
    normalizeSearchTerm(candidate.location.city)
  ) {
    score += 3;
  }
  if (
    target.location.neighborhood &&
    candidate.location.neighborhood &&
    normalizeSearchTerm(target.location.neighborhood) ===
      normalizeSearchTerm(candidate.location.neighborhood)
  ) {
    score += 2;
  }

  const targetPrice = getFixedPriceInCents(target);
  const candidatePrice = getFixedPriceInCents(candidate);

  if (targetPrice !== undefined && candidatePrice !== undefined) {
    const relativeDifference = Math.abs(targetPrice - candidatePrice) / targetPrice;

    if (relativeDifference <= 0.2) score += 2;
    else if (relativeDifference <= 0.4) score += 1;
  }

  return score;
}

export function getSimilarPropertiesFrom(
  properties: readonly Property[],
  target: Property,
  limit = DEFAULT_SIMILAR_PROPERTIES_LIMIT,
): readonly Property[] {
  const normalizedLimit = Number.isFinite(limit)
    ? Math.max(0, Math.floor(limit))
    : DEFAULT_SIMILAR_PROPERTIES_LIMIT;

  return properties
    .filter(
      (candidate) =>
        candidate.id !== target.id &&
        candidate.status === "active" &&
        candidate.purpose === target.purpose,
    )
    .map((candidate) => ({
      property: candidate,
      score: getSimilarityScore(target, candidate),
    }))
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.property.id.localeCompare(right.property.id),
    )
    .slice(0, normalizedLimit)
    .map(({ property }) => property);
}
