export const PROPERTY_ID_PATTERN = /^MC-\d{3,}$/;
export const PROPERTY_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const PROPERTY_PURPOSES = ["sale", "rent"] as const;

export const PROPERTY_TYPES = [
  "house",
  "apartment",
  "land",
  "rural",
  "commercial",
  "other",
] as const;

export const PROPERTY_STATUSES = ["active", "inactive"] as const;

export const PROPERTY_FEATURES = [
  "pool",
  "balcony",
  "gourmet_area",
  "elevator",
  "concierge",
  "backyard",
  "furnished",
  "barbecue",
  "gated_community",
  "built_in_cabinets",
  "financing_eligible",
] as const;

export const LOCATION_DISCLOSURES = ["exact", "approximate"] as const;
