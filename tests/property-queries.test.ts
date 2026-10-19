import assert from "node:assert/strict";
import test from "node:test";

import {
  getActivePropertiesFrom,
  getFeaturedPropertiesFrom,
  getPropertyByIdFrom,
  getPropertyBySlugFrom,
  getSimilarPropertiesFrom,
} from "../lib/properties/queries";
import {
  getPropertyFiltersFromSearch,
  parsePropertySearchParams,
} from "../lib/properties/search";
import { propertyCollectionSchema } from "../schemas/property";
import {
  inactiveSaleProperty,
  onRequestSaleProperty,
  similarSaleProperty,
  validRentalProperty,
  validSaleProperty,
} from "./fixtures/properties";

const properties = propertyCollectionSchema.parse([
  validSaleProperty,
  validRentalProperty,
  inactiveSaleProperty,
  similarSaleProperty,
  onRequestSaleProperty,
]);

test("finds active properties by slug and ID", () => {
  assert.equal(
    getPropertyBySlugFrom(properties, validSaleProperty.slug)?.id,
    validSaleProperty.id,
  );
  assert.equal(
    getPropertyByIdFrom(properties, validRentalProperty.id)?.slug,
    validRentalProperty.slug,
  );
});

test("excludes inactive properties from public lookups by default", () => {
  assert.equal(
    getPropertyBySlugFrom(properties, inactiveSaleProperty.slug),
    undefined,
  );
  assert.equal(getPropertyByIdFrom(properties, inactiveSaleProperty.id), undefined);
  assert.equal(
    getPropertyByIdFrom(properties, inactiveSaleProperty.id, {
      includeInactive: true,
    })?.id,
    inactiveSaleProperty.id,
  );
});

test("lists and filters only active properties", () => {
  const activeSales = getActivePropertiesFrom(properties, {
    purpose: "sale",
    city: "lagoa santa",
    minBedrooms: 3,
    maxPriceInCents: 70_000_000,
  });

  assert.deepEqual(activeSales.map((property) => property.id), ["MC-001"]);
  assert.equal(
    getFeaturedPropertiesFrom(properties).some(
      (property) => property.id === inactiveSaleProperty.id,
    ),
    false,
  );
});

test("filters by purpose and property type", () => {
  const result = getActivePropertiesFrom(properties, {
    purpose: "rent",
    type: "apartment",
  });

  assert.deepEqual(result.map((property) => property.id), ["MC-002"]);
});

test("matches location substrings across neighborhood and city", () => {
  assert.deepEqual(
    getActivePropertiesFrom(properties, { location: "  lagoa   de santo " }).map(
      (property) => property.id,
    ),
    ["MC-005"],
  );
  assert.equal(
    getActivePropertiesFrom(properties, { location: "santa" }).length,
    4,
  );
});

test("filters listed location values by exact city instead of neighborhood text", () => {
  const vespasianoProperty = {
    ...validSaleProperty,
    id: "MC-006",
    slug: "casa-vespasiano-mc-006",
    title: "Casa em Vespasiano para teste",
    location: {
      ...validSaleProperty.location,
      city: "Vespasiano",
      neighborhood: "Lagoa Santa",
    },
  };
  const cityProperties = propertyCollectionSchema.parse([
    validSaleProperty,
    vespasianoProperty,
  ]);

  const lagoaSantaFilters = getPropertyFiltersFromSearch(
    parsePropertySearchParams({ location: "Lagoa Santa" }),
  );
  const vespasianoFilters = getPropertyFiltersFromSearch(
    parsePropertySearchParams({ location: "Vespasiano" }),
  );

  assert.deepEqual(
    getActivePropertiesFrom(cityProperties, lagoaSantaFilters).map(
      (property) => property.id,
    ),
    ["MC-001"],
  );
  assert.deepEqual(
    getActivePropertiesFrom(cityProperties, vespasianoFilters).map(
      (property) => property.id,
    ),
    ["MC-006"],
  );
});

test("combines type, location, price, and bedroom filters", () => {
  const result = getActivePropertiesFrom(properties, {
    purpose: "sale",
    type: "house",
    location: "centro",
    maxPriceInCents: 62_000_000,
    minBedrooms: 2,
  });

  assert.deepEqual(result.map((property) => property.id), ["MC-004"]);
});

test("excludes on-request properties from numeric price filters", () => {
  const result = getActivePropertiesFrom(properties, {
    purpose: "sale",
    maxPriceInCents: 100_000_000,
  });

  assert.equal(
    result.some((property) => property.id === onRequestSaleProperty.id),
    false,
  );
});

test("sorts fixed prices and always places on-request prices last", () => {
  assert.deepEqual(
    getActivePropertiesFrom(properties, { sort: "price_asc" }).map(
      (property) => property.id,
    ),
    ["MC-002", "MC-004", "MC-001", "MC-005"],
  );
  assert.deepEqual(
    getActivePropertiesFrom(properties, { sort: "price_desc" }).map(
      (property) => property.id,
    ),
    ["MC-001", "MC-004", "MC-002", "MC-005"],
  );
});

test("sorts properties from newest to oldest", () => {
  const result = getActivePropertiesFrom(properties, { sort: "newest" });

  assert.equal(result[0]?.id, "MC-005");
});

test("similar properties exclude the target and inactive records", () => {
  const result = getSimilarPropertiesFrom(properties, properties[0], 1);

  assert.deepEqual(result.map((property) => property.id), ["MC-004"]);
  assert.equal(result.some((property) => property.id === properties[0].id), false);
  assert.equal(
    result.some((property) => property.status === "inactive"),
    false,
  );
});
