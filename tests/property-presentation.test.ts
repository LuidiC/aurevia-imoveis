import assert from "node:assert/strict";
import test from "node:test";

import {
  getPropertyAdditionalCostItems,
  getPropertyFeatureLabels,
  getPropertyHref,
  getPropertyLocationDetails,
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

test("presents suites and bathrooms together when both are available", () => {
  assert.deepEqual(
    getPropertyMetaItems({
      bedrooms: 3,
      suites: 1,
      bathrooms: 2,
      parkingSpaces: 2,
      areaInSquareMeters: 118,
    }).map((item) => item.label),
    ["3 quartos", "1 suíte", "2 banheiros", "2 vagas", "118 m²"],
  );
});

test("presents only available additional costs without inventing periodicity", () => {
  assert.deepEqual(getPropertyAdditionalCostItems(rentalProperty), [
    {
      kind: "condominium",
      label: "Condomínio",
      value: "R$ 350,00",
    },
    {
      kind: "property_tax",
      label: "IPTU",
      value: "R$ 80,00",
    },
  ]);
  assert.deepEqual(getPropertyAdditionalCostItems({}), []);
});

test("maps feature labels and omits a section naturally when there are none", () => {
  assert.deepEqual(getPropertyFeatureLabels(saleProperty.features), [
    "Quintal",
    "Aceita financiamento",
  ]);
  assert.deepEqual(getPropertyFeatureLabels([]), []);
});

test("respects approximate and exact location disclosure", () => {
  const approximate = getPropertyLocationDetails({
    city: "Pedro Leopoldo",
    state: "MG",
    neighborhood: "Centro",
    disclosure: "approximate",
  });
  const exact = getPropertyLocationDetails(saleProperty.location);

  assert.equal(approximate.label, "Centro · Pedro Leopoldo · MG");
  assert.match(approximate.note ?? "", /aproximada/i);
  assert.match(exact.label, /Rua de Teste, 100/);
  assert.doesNotMatch(exact.note ?? "", /aproximada/i);
});
