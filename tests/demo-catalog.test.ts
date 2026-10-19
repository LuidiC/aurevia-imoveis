import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import propertiesJson from "../data/properties.json";
import idState from "../data/property-id-state.json";
import { PROPERTY_CITY_OPTIONS } from "../lib/properties/search";
import { propertyCollectionSchema } from "../schemas/property";
import { resolveNextPropertyId } from "../scripts/properties/commands";
import { validatePropertyImages } from "../scripts/properties/storage";

const properties = propertyCollectionSchema.parse(propertiesJson);

test("demonstration catalog has six unique active records and three highlights", () => {
  assert.deepEqual(properties.map(({ id }) => id), ["MC-001", "MC-002", "MC-003", "MC-004", "MC-005", "MC-006"]);
  assert.equal(new Set(properties.map(({ id }) => id)).size, 6);
  assert.equal(new Set(properties.map(({ slug }) => slug)).size, 6);
  assert.ok(properties.every(({ status }) => status === "active"));
  assert.equal(properties.filter(({ featured }) => featured).length, 3);
  assert.deepEqual(new Set(properties.map(({ type }) => type)), new Set(["house", "apartment", "land", "rural", "commercial"]));
  assert.ok(properties.some(({ price }) => price.kind === "on_request"));
  assert.ok(properties.filter(({ purpose }) => purpose === "rent").every(({ price }) => price.kind === "fixed"));
});

test("all demonstration images are distinct local files with one primary per property", async () => {
  const sources = properties.flatMap(({ images }) => images.map(({ src }) => src));
  assert.equal(new Set(sources).size, sources.length);
  for (const property of properties) {
    assert.ok(property.images.length >= 5, property.id);
    assert.equal(property.images.filter(({ isPrimary }) => isPrimary).length, 1);
    for (const image of property.images) {
      assert.ok(image.src.startsWith(`/images/properties/${property.id}/`));
      assert.ok(image.alt.length > 20);
      const bytes = await readFile(path.join(process.cwd(), "public", image.src));
      assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    }
  }
  assert.deepEqual(await validatePropertyImages(properties, path.resolve("public")), []);
});

test("demonstration locations contain no exact addresses or coordinates", () => {
  for (const { location, createdAt, updatedAt } of properties) {
    assert.equal(location.disclosure, "approximate");
    assert.equal(location.address, undefined);
    assert.equal(location.coordinates, undefined);
    assert.ok(Date.parse(updatedAt) >= Date.parse(createdAt));
  }
});

test("city options match precisely the cities in the demonstration catalog", () => {
  const options = PROPERTY_CITY_OPTIONS.map(({ value }) => value).filter(Boolean);
  assert.equal(new Set(options).size, options.length);
  assert.deepEqual(new Set(options), new Set(properties.map(({ location }) => location.city)));
});

test("one-time demonstration migration leaves MC-007 available without consuming it", async () => {
  const context = {
    dataFile: path.resolve("data/properties.json"),
    idStateFile: path.resolve("data/property-id-state.json"),
    publicDirectory: path.resolve("public"),
  };
  const before = await readFile(context.idStateFile, "utf8");
  assert.equal(idState.lastIssuedSequence, 6);
  assert.equal((await resolveNextPropertyId(context, false)).id, "MC-007");
  assert.equal(await readFile(context.idStateFile, "utf8"), before);
});
