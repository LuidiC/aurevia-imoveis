import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { propertySchema } from "../schemas/property";
import {
  resolveNextPropertyId,
  showNextPropertyId,
  type CommandContext,
} from "../scripts/properties/commands";
import { writePropertyIdState } from "../scripts/properties/id-state";
import { writeCatalogSafely } from "../scripts/properties/storage";
import { validSaleProperty } from "./fixtures/properties";

test("lastIssuedSequence 3 reports MC-004 and its image folder", async (context) => {
  const fixture = await createNextIdFixture(context, 3, ["MC-001", "MC-003"]);
  const output: string[] = [];

  await showNextPropertyId(fixture.commandContext, (message) => output.push(message));

  assert.deepEqual(output, [
    "Próximo ID disponível: MC-004\n",
    "Pasta de imagens: public/images/properties/MC-004/\n",
  ]);
});

test("repeated queries are read-only and return the same ID", async (context) => {
  const fixture = await createNextIdFixture(context, 3, ["MC-003"]);
  const dataBefore = await readFile(fixture.dataFile, "utf8");
  const stateBefore = await readFile(fixture.stateFile, "utf8");
  const first: string[] = [];
  const second: string[] = [];

  await showNextPropertyId(fixture.commandContext, (message) => first.push(message));
  await showNextPropertyId(fixture.commandContext, (message) => second.push(message));

  assert.deepEqual(first, second);
  assert.match(first.join(""), /MC-004/);
  assert.equal(await readFile(fixture.dataFile, "utf8"), dataBefore);
  assert.equal(await readFile(fixture.stateFile, "utf8"), stateBefore);
  await assert.rejects(() => access(path.join(fixture.imagesRoot, "MC-004")));
});

test("catalog ahead of metadata is reconciled only in memory", async (context) => {
  const fixture = await createNextIdFixture(context, 5, ["MC-008"]);
  const stateBefore = await readFile(fixture.stateFile, "utf8");
  const result = await resolveNextPropertyId(fixture.commandContext, false);

  assert.equal(result.id, "MC-009");
  assert.equal(await readFile(fixture.stateFile, "utf8"), stateBefore);
});

test("metadata ahead of catalog controls the next ID", async (context) => {
  const fixture = await createNextIdFixture(context, 20, ["MC-008"]);

  const result = await resolveNextPropertyId(fixture.commandContext, false);

  assert.equal(result.id, "MC-021");
});

test("MC-999 advances to MC-1000", async (context) => {
  const fixture = await createNextIdFixture(context, 999, []);

  const result = await resolveNextPropertyId(fixture.commandContext, false);

  assert.equal(result.id, "MC-1000");
});

test("an existing image folder does not consume or change the next ID", async (context) => {
  const fixture = await createNextIdFixture(context, 3, ["MC-003"]);
  const imageDirectory = path.join(fixture.imagesRoot, "MC-004");
  await mkdir(imageDirectory, { recursive: true });

  const result = await resolveNextPropertyId(fixture.commandContext, false);

  assert.equal(result.id, "MC-004");
  await access(imageDirectory);
});

test("missing metadata is resolved from the catalog without creating a file", async (context) => {
  const fixture = await createNextIdFixture(context, undefined, ["MC-008"]);

  const result = await resolveNextPropertyId(fixture.commandContext, false);

  assert.equal(result.id, "MC-009");
  await assert.rejects(() => access(fixture.stateFile));
});

test("invalid metadata fails clearly and remains unchanged", async (context) => {
  const fixture = await createNextIdFixture(context, 3, ["MC-003"]);
  const invalidState = '{"lastIssuedSequence":-1}\n';
  await writeFile(fixture.stateFile, invalidState, "utf8");

  await assert.rejects(
    () => showNextPropertyId(fixture.commandContext),
    /Metadata de IDs inválida[\s\S]*property:validate/,
  );
  assert.equal(await readFile(fixture.stateFile, "utf8"), invalidState);
});

test("next-id and add resolve the same candidate in the same state", async (context) => {
  const fixture = await createNextIdFixture(context, 5, ["MC-008"]);
  const queried = await resolveNextPropertyId(fixture.commandContext, false);
  const forAdd = await resolveNextPropertyId(fixture.commandContext, true);

  assert.equal(queried.id, "MC-009");
  assert.equal(forAdd.id, queried.id);
});

async function createNextIdFixture(
  context: test.TestContext,
  lastIssuedSequence: number | undefined,
  ids: readonly string[],
) {
  const root = await mkdtemp(path.join(tmpdir(), "marli-next-id-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  const dataFile = path.join(root, "data", "properties.json");
  const stateFile = path.join(root, "data", "property-id-state.json");
  const publicDirectory = path.join(root, "public");
  const imagesRoot = path.join(publicDirectory, "images", "properties");
  const properties = ids.map((id, index) => propertySchema.parse({
    ...validSaleProperty,
    id,
    slug: `imovel-fixture-${id.toLowerCase()}`,
    title: `Imóvel fixture número ${index + 1}`,
  }));

  await writeCatalogSafely(dataFile, properties);
  if (lastIssuedSequence !== undefined) {
    await writePropertyIdState(stateFile, { lastIssuedSequence });
  }

  const commandContext: CommandContext = {
    dataFile,
    idStateFile: stateFile,
    publicDirectory,
  };
  return { commandContext, dataFile, stateFile, imagesRoot };
}
