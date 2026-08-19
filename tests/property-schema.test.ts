import assert from "node:assert/strict";
import test from "node:test";

import {
  propertyCollectionSchema,
  propertySchema,
} from "../schemas/property";
import {
  validRentalProperty,
  validSaleProperty,
} from "./fixtures/properties";

test("accepts a valid property", () => {
  const result = propertySchema.safeParse(validSaleProperty);

  assert.equal(result.success, true);
});

test("rejects an otherwise invalid property", () => {
  const result = propertySchema.safeParse({
    ...validSaleProperty,
    title: "",
  });

  assert.equal(result.success, false);
});

test("rejects an invalid property ID", () => {
  const result = propertySchema.safeParse({
    ...validSaleProperty,
    id: "001",
  });

  assert.equal(result.success, false);
});

test("rejects an invalid slug", () => {
  const result = propertySchema.safeParse({
    ...validSaleProperty,
    slug: "Casa com Espaços",
  });

  assert.equal(result.success, false);
});

test("requires a fixed price for rental properties", () => {
  const result = propertySchema.safeParse({
    ...validRentalProperty,
    price: { kind: "on_request" },
  });

  assert.equal(result.success, false);
});

test("rejects fractional cents in monetary values", () => {
  const result = propertySchema.safeParse({
    ...validSaleProperty,
    price: { kind: "fixed", amountInCents: 65_000_000.5 },
  });

  assert.equal(result.success, false);
});

test("accepts an on-request price for sale properties", () => {
  const result = propertySchema.safeParse({
    ...validSaleProperty,
    price: { kind: "on_request" },
  });

  assert.equal(result.success, true);
});

test("rejects a property without images", () => {
  const result = propertySchema.safeParse({
    ...validSaleProperty,
    images: [],
  });

  assert.equal(result.success, false);
});

test("rejects collections with duplicate IDs", () => {
  const result = propertyCollectionSchema.safeParse([
    validSaleProperty,
    { ...validRentalProperty, id: validSaleProperty.id },
  ]);

  assert.equal(result.success, false);
});
