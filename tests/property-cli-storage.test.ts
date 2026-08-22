import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { propertySchema } from "../schemas/property";
import {
  loadCatalog,
  normalizeImageSource,
  validatePropertyImages,
  writeCatalogSafely,
} from "../scripts/properties/storage";
import { validSaleProperty } from "./fixtures/properties";

test("writes and reloads a validated catalog without touching real data", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "marli-properties-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const filePath = path.join(directory, "properties.json");
  const property = propertySchema.parse(validSaleProperty);

  await writeCatalogSafely(filePath, [property]);
  const reloaded = await loadCatalog(filePath);
  const source = await readFile(filePath, "utf8");

  assert.deepEqual(reloaded, [property]);
  assert.equal(source.endsWith("\n"), true);
  assert.equal(source, `${JSON.stringify([property], null, 2)}\n`);
});

test("rejects an invalid catalog with duplicate IDs", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "marli-properties-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const filePath = path.join(directory, "properties.json");
  await writeFile(
    filePath,
    JSON.stringify([validSaleProperty, validSaleProperty]),
    "utf8",
  );

  await assert.rejects(() => loadCatalog(filePath), /Duplicate property ID/);
});

test("rejects an invalid catalog with duplicate slugs", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "marli-properties-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const filePath = path.join(directory, "properties.json");
  await writeFile(
    filePath,
    JSON.stringify([
      validSaleProperty,
      { ...validSaleProperty, id: "MC-002" },
    ]),
    "utf8",
  );

  await assert.rejects(() => loadCatalog(filePath), /Duplicate property slug/);
});

test("normalizes image names to the property convention", () => {
  const publicDirectory = path.resolve("public");
  assert.equal(
    normalizeImageSource("fachada.webp", "MC-021", publicDirectory),
    "/images/properties/MC-021/fachada.webp",
  );
  assert.equal(
    normalizeImageSource("public/images/shared/fachada.jpg", "MC-021", publicDirectory),
    "/images/shared/fachada.jpg",
  );
});

test("validates local image existence and allowed extensions", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "marli-images-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const imageDirectory = path.join(directory, "images", "properties", "MC-001");
  await mkdir(imageDirectory, { recursive: true });
  await writeFile(path.join(imageDirectory, "main.jpg"), "fixture", "utf8");
  const validProperty = propertySchema.parse({
    ...validSaleProperty,
    images: [{ src: "/images/properties/MC-001/main.jpg", alt: "Fachada", isPrimary: true }],
  });
  const missingProperty = propertySchema.parse({
    ...validProperty,
    images: [{ src: "/images/properties/MC-001/missing.jpg", alt: "Fachada", isPrimary: true }],
  });

  assert.deepEqual(await validatePropertyImages([validProperty], directory), []);
  assert.equal((await validatePropertyImages([missingProperty], directory)).length, 1);
});
