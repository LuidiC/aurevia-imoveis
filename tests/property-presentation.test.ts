import assert from "node:assert/strict";
import test from "node:test";

import {
  getPropertyHref,
  getPropertyLocationLabel,
  getPropertyMetaItems,
  getPropertyPriceLabel,
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "../lib/properties";
import { propertySchema } from "../schemas/property";
import { validRentalProperty, validSaleProperty } from "./fixtures/properties";

const saleProperty = propertySchema.parse(validSaleProperty);
const rentalProperty = propertySchema.parse(validRentalProperty);

test("maps domain values to reusable Portuguese labels", () => {
  assert.equal(PROPERTY_PURPOSE_LABELS.sale, "Venda");
  assert.equal(PROPERTY_PURPOSE_LABELS.rent, "Aluguel");
  assert.equal(PROPERTY_TYPE_LABELS.land, "Terreno");
  assert.equal(PROPERTY_TYPE_LABELS.rural, "Imóvel rural");
});

test("builds the public property link and a private summary location", () => {
  assert.equal(
    getPropertyHref(saleProperty),
    "/imoveis/casa-3-quartos-centro-mc-001",
  );
  assert.equal(
    getPropertyLocationLabel(saleProperty.location),
    "Centro · Pedro Leopoldo",
  );
  assert.equal(
    getPropertyLocationLabel({
      city: "Matozinhos",
      state: "MG",
      disclosure: "approximate",
    }),
    "Matozinhos · MG",
  );
  assert.doesNotMatch(
    getPropertyLocationLabel(saleProperty.location),
    /Rua de Teste/,
  );
});

test("formats sale, rental and on-request prices", () => {
  assert.match(getPropertyPriceLabel(saleProperty), /R\$\s*650\.000$/);
  assert.match(getPropertyPriceLabel(rentalProperty), /R\$\s*2\.500\/mês$/);
  assert.equal(
    getPropertyPriceLabel({ purpose: "sale", price: { kind: "on_request" } }),
    "Valor sob consulta",
  );
});

test("omits zero and unavailable metadata while preserving useful values", () => {
  assert.deepEqual(
    getPropertyMetaItems({
      areaInSquareMeters: 720,
    }),
    [{ kind: "area", label: "720 m²" }],
  );

  assert.deepEqual(
    getPropertyMetaItems({
      bedrooms: 2,
      suites: 0,
      bathrooms: 1,
      parkingSpaces: 1,
      areaInSquareMeters: 84,
    }).map((item) => item.label),
    ["2 quartos", "1 banheiro", "1 vaga", "84 m²"],
  );
});
