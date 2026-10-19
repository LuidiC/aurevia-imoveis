import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  generateNextPropertyId,
  getPropertySequence,
} from "../scripts/properties/domain";
import { persistNewProperty } from "../scripts/properties/commands";
import {
  loadAndReconcilePropertyIdState,
  writePropertyIdState,
} from "../scripts/properties/id-state";
import { loadCatalog, writeCatalogSafely } from "../scripts/properties/storage";
import { propertySchema } from "../schemas/property";
import { validSaleProperty } from "./fixtures/properties";

test("deleting a lower ID never makes it reusable", () => {
  assert.equal(generateNextPropertyId(["MC-002", "MC-003"], 3), "MC-004");
});

test("deleting the highest ID never makes it reusable", () => {
  assert.equal(generateNextPropertyId(["MC-001", "MC-002"], 3), "MC-004");
});

test("multiple saved and deleted IDs keep advancing the high-water mark", () => {
  assert.equal(generateNextPropertyId(["MC-001"], 3), "MC-004");
});

test("catalog ahead of metadata is reconciled upward", async (context) => {
  const { stateFile } = await createStateFixture(context, 5);

  const result = await loadAndReconcilePropertyIdState(stateFile, ["MC-008"]);

  assert.equal(result.change, "reconciled");
  assert.equal(result.state.lastIssuedSequence, 8);
  assert.deepEqual(JSON.parse(await readFile(stateFile, "utf8")), {
    lastIssuedSequence: 8,
  });
  assert.equal(generateNextPropertyId(["MC-008"], 8), "MC-009");
});

test("metadata ahead of catalog is never reduced", async (context) => {
  const { stateFile } = await createStateFixture(context, 20);

  const result = await loadAndReconcilePropertyIdState(stateFile, ["MC-008"]);

  assert.equal(result.change, "none");
  assert.equal(result.state.lastIssuedSequence, 20);
  assert.equal(generateNextPropertyId(["MC-008"], 20), "MC-021");
});

test("missing metadata is safely initialized from the current catalog", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "aurevia-id-state-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const stateFile = path.join(directory, "property-id-state.json");

  const result = await loadAndReconcilePropertyIdState(
    stateFile,
    ["MC-001", "MC-003"],
  );

  assert.equal(result.change, "initialized");
  assert.equal(result.state.lastIssuedSequence, 3);
});

test("an add cancelled before save leaves the candidate ID available", async (context) => {
  const { stateFile } = await createStateFixture(context, 3);
  const before = await readFile(stateFile, "utf8");
  const candidate = generateNextPropertyId(["MC-001", "MC-003"], 3);

  assert.equal(candidate, "MC-004");
  assert.equal(await readFile(stateFile, "utf8"), before);
  assert.equal(generateNextPropertyId(["MC-001", "MC-003"], 3), "MC-004");
});

test("an ID persisted after save is never reused", async (context) => {
  const { directory, stateFile } = await createStateFixture(context, 3);
  const dataFile = path.join(directory, "properties.json");
  const existing = [propertySchema.parse(validSaleProperty)];
  const added = propertySchema.parse({
    ...validSaleProperty,
    id: "MC-004",
    slug: "imovel-adicionado-mc-004",
    title: "Imóvel adicionado com sucesso",
  });
  await writeCatalogSafely(dataFile, existing);
  await persistNewProperty(
    { dataFile, idStateFile: stateFile, publicDirectory: path.join(directory, "public") },
    existing,
    added,
    3,
  );

  const { state } = await loadAndReconcilePropertyIdState(
    stateFile,
    (await loadCatalog(dataFile)).map((property) => property.id),
  );

  assert.equal(generateNextPropertyId(["MC-001"], state.lastIssuedSequence), "MC-005");
});

test("a failed catalog save does not advance the high-water mark", async (context) => {
  const { directory, stateFile } = await createStateFixture(context, 3);
  const invalidDataFile = path.join(directory, "catalog-directory");
  await writeFile(invalidDataFile, "blocks directory creation", "utf8");
  const property = propertySchema.parse({
    ...validSaleProperty,
    id: "MC-004",
    slug: "falha-de-save-mc-004",
  });

  await assert.rejects(() => persistNewProperty(
    {
      dataFile: path.join(invalidDataFile, "properties.json"),
      idStateFile: stateFile,
      publicDirectory: path.join(directory, "public"),
    },
    [],
    property,
    3,
  ));

  assert.deepEqual(JSON.parse(await readFile(stateFile, "utf8")), {
    lastIssuedSequence: 3,
  });
});

test("MC-999 advances to MC-1000 with persisted metadata", () => {
  assert.equal(generateNextPropertyId([], 999), "MC-1000");
  assert.equal(getPropertySequence("MC-1000"), 1000);
});

test("invalid metadata is rejected", async (context) => {
  const directory = await mkdtemp(path.join(tmpdir(), "aurevia-id-state-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const stateFile = path.join(directory, "property-id-state.json");
  await writeFile(stateFile, '{"lastIssuedSequence":-1}', "utf8");

  await assert.rejects(
    () => loadAndReconcilePropertyIdState(stateFile, ["MC-001"]),
    /Metadata de IDs inválida/,
  );
});

async function createStateFixture(
  context: test.TestContext,
  lastIssuedSequence: number,
): Promise<{ directory: string; stateFile: string }> {
  const directory = await mkdtemp(path.join(tmpdir(), "aurevia-id-state-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const stateFile = path.join(directory, "property-id-state.json");
  await writePropertyIdState(stateFile, { lastIssuedSequence });
  return { directory, stateFile };
}
