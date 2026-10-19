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

test("rejects unknown fields at the property root", () => {
  const result = propertySchema.safeParse({
    ...validSaleProperty,
    bedroms: 99,
  });

  assert.equal(result.success, false);
});

test("rejects unknown fields in nested property objects", () => {
  const nestedCases = [
    {
      ...validSaleProperty,
      price: { ...validSaleProperty.price, currency: "BRL" },
    },
    {
      ...validSaleProperty,
      additionalCosts: {
        ...validSaleProperty.additionalCosts,
        billingPeriod: "annual",
      },
    },
    {
      ...validSaleProperty,
      location: { ...validSaleProperty.location, precision: "street" },
    },
    {
      ...validSaleProperty,
      location: {
        ...validSaleProperty.location,
        address: {
          ...validSaleProperty.location.address,
          referencePoint: "Praça central",
        },
      },
    },
    {
      ...validSaleProperty,
      location: {
        ...validSaleProperty.location,
        coordinates: { latitude: -19.62, longitude: -44.04, accuracy: 5 },
      },
    },
    {
      ...validSaleProperty,
      images: [
        { ...validSaleProperty.images[0], caption: "Fachada principal" },
      ],
    },
  ];

  nestedCases.forEach((candidate) => {
    assert.equal(propertySchema.safeParse(candidate).success, false);
  });
});

test("rejects an exact address in an approximate property location", () => {
  const result = propertySchema.safeParse({
    ...validSaleProperty,
    location: {
      ...validSaleProperty.location,
      disclosure: "approximate",
    },
  });

  assert.equal(result.success, false);
});

test("rejects coordinates in an approximate property location", () => {
  const result = propertySchema.safeParse({
    ...validSaleProperty,
    location: {
      city: "Lagoa Santa",
      state: "MG",
      neighborhood: "Centro",
      coordinates: { latitude: -19.62, longitude: -44.04 },
      disclosure: "approximate",
    },
  });

  assert.equal(result.success, false);
});

test("accepts supported exact location data", () => {
  const result = propertySchema.safeParse({
    ...validSaleProperty,
    location: {
      ...validSaleProperty.location,
      coordinates: { latitude: -19.62, longitude: -44.04 },
      disclosure: "exact",
    },
  });

  assert.equal(result.success, true);
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
