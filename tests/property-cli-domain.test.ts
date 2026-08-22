import assert from "node:assert/strict";
import test from "node:test";

import {
  finalizeEditedProperty,
  generateNextPropertyId,
  generatePropertySlug,
  parseBrlToCents,
  parseOptionalNonNegativeInteger,
  parseOptionalPositiveDecimal,
  slugify,
} from "../scripts/properties/domain";
import { validSaleProperty } from "./fixtures/properties";
import { propertySchema } from "../schemas/property";

test("generates the next ID from the highest valid sequence", () => {
  assert.equal(generateNextPropertyId(["MC-002", "MC-009", "MC-004"]), "MC-010");
});

test("does not reuse an inactive or removed property ID", () => {
  assert.equal(generateNextPropertyId(["MC-001", "MC-003"]), "MC-004");
});

test("supports IDs beyond 999 without truncation", () => {
  assert.equal(generateNextPropertyId(["MC-999"]), "MC-1000");
  assert.equal(propertySchema.safeParse({ ...validSaleProperty, id: "MC-1000" }).success, true);
});

test("rejects duplicate IDs while calculating the next sequence", () => {
  assert.throws(
    () => generateNextPropertyId(["MC-001", "MC-001"]),
    /ID duplicado/,
  );
});

test("generates a normalized property slug with accents removed", () => {
  assert.equal(slugify("  Imóvel à Venda -- Centro!  "), "imovel-a-venda-centro");
  assert.equal(
    generatePropertySlug("Apartamento com 3 quartos no Centro", "MC-021"),
    "apartamento-com-3-quartos-no-centro-mc-021",
  );
});

test("parses common human BRL formats into integer cents", () => {
  assert.equal(parseBrlToCents("650000"), 65_000_000);
  assert.equal(parseBrlToCents("650000,00"), 65_000_000);
  assert.equal(parseBrlToCents("650.000"), 65_000_000);
  assert.equal(parseBrlToCents("650.000,00"), 65_000_000);
  assert.equal(parseBrlToCents("2.500"), 250_000);
  assert.equal(parseBrlToCents("R$ 2.500,50"), 250_050);
});

test("rejects ambiguous or unsafe BRL input", () => {
  assert.throws(() => parseBrlToCents("10.50"));
  assert.throws(() => parseBrlToCents("2,500"));
  assert.throws(() => parseBrlToCents("0"));
  assert.throws(() => parseBrlToCents("999999999999999"));
});

test("parses optional integers without silently coercing invalid values", () => {
  assert.equal(parseOptionalNonNegativeInteger(""), undefined);
  assert.equal(parseOptionalNonNegativeInteger("0"), 0);
  assert.equal(parseOptionalNonNegativeInteger("3"), 3);
  assert.throws(() => parseOptionalNonNegativeInteger("3,5"));
  assert.throws(() => parseOptionalNonNegativeInteger("abc"));
});

test("parses optional positive area values", () => {
  assert.equal(parseOptionalPositiveDecimal(""), undefined);
  assert.equal(parseOptionalPositiveDecimal("180,5"), 180.5);
  assert.throws(() => parseOptionalPositiveDecimal("0"));
  assert.throws(() => parseOptionalPositiveDecimal("abc"));
});

test("editing preserves ID and createdAt while updating updatedAt", () => {
  const current = propertySchema.parse(validSaleProperty);
  const edited = finalizeEditedProperty(
    current,
    { ...current, id: "MC-999", createdAt: "2030-01-01T00:00:00.000Z" },
    "2026-04-01T10:00:00.000Z",
  );

  assert.equal(edited.id, current.id);
  assert.equal(edited.createdAt, current.createdAt);
  assert.equal(edited.updatedAt, "2026-04-01T10:00:00.000Z");
});

