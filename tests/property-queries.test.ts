import assert from "node:assert/strict";
import test from "node:test";

import {
  getActivePropertiesFrom,
  getFeaturedPropertiesFrom,
  getPropertyByIdFrom,
  getPropertyBySlugFrom,
  getSimilarPropertiesFrom,
} from "../lib/properties/queries";
import { propertyCollectionSchema } from "../schemas/property";
import {
  inactiveSaleProperty,
  similarSaleProperty,
  validRentalProperty,
  validSaleProperty,
} from "./fixtures/properties";

const properties = propertyCollectionSchema.parse([
  validSaleProperty,
  validRentalProperty,
  inactiveSaleProperty,
  similarSaleProperty,
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
    city: "pedro leopoldo",
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

test("similar properties exclude the target and inactive records", () => {
  const result = getSimilarPropertiesFrom(properties, properties[0], 1);

  assert.deepEqual(result.map((property) => property.id), ["MC-004"]);
  assert.equal(result.some((property) => property.id === properties[0].id), false);
  assert.equal(
    result.some((property) => property.status === "inactive"),
    false,
  );
});
