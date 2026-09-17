import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { propertyCollectionSchema, propertySchema } from "../schemas/property";
import {
  deleteProperty,
  setPropertyStatus,
  type CommandContext,
  type DeleteCommandDependencies,
} from "../scripts/properties/commands";
import {
  inspectPropertyImageDirectory,
  loadCatalog,
  writeCatalogSafely,
} from "../scripts/properties/storage";
import {
  loadAndReconcilePropertyIdState,
  writePropertyIdState,
} from "../scripts/properties/id-state";
import { validSaleProperty } from "./fixtures/properties";

test("deletes an active property after exact confirmation and preserves others", async (context) => {
  const fixture = await createDeleteFixture(context, "active", true);
  const output: string[] = [];

  await deleteProperty(
    fixture.commandContext,
    "MC-001",
    dependencies("MC-001", false, output),
  );

  const catalog = await loadCatalog(fixture.dataFile);
  assert.deepEqual(catalog.map((property) => property.id), ["MC-002"]);
  assert.equal(propertyCollectionSchema.safeParse(catalog).success, true);
  assert.match(output.join(""), /está ativo e atualmente pode estar publicado/);
  assert.match(output.join(""), /não será reutilizado/);
  await access(fixture.imageDirectory);
});

test("deletes an inactive property", async (context) => {
  const fixture = await createDeleteFixture(context, "inactive", false);
  const output: string[] = [];

  await deleteProperty(
    fixture.commandContext,
    "MC-001",
    dependencies("MC-001", false, output),
  );

  assert.deepEqual((await loadCatalog(fixture.dataFile)).map((item) => item.id), ["MC-002"]);
  assert.doesNotMatch(output.join(""), /atualmente pode estar publicado/);
});

test("reconciles a stale high-water mark before deleting the highest ID", async (context) => {
  const fixture = await createDeleteFixture(context, "active", false);
  await writePropertyIdState(fixture.stateFile, { lastIssuedSequence: 1 });

  await deleteProperty(
    fixture.commandContext,
    "MC-002",
    dependencies("MC-002", false, []),
  );

  const catalog = await loadCatalog(fixture.dataFile);
  const { state } = await loadAndReconcilePropertyIdState(
    fixture.stateFile,
    catalog.map((property) => property.id),
  );
  assert.deepEqual(catalog.map((property) => property.id), ["MC-001"]);
  assert.equal(state.lastIssuedSequence, 2);
});

test("wrong or case-insensitive confirmation cancels without changing anything", async (context) => {
  const fixture = await createDeleteFixture(context, "active", true, false);
  const before = await readFile(fixture.dataFile, "utf8");

  await deleteProperty(
    fixture.commandContext,
    "MC-001",
    dependencies("mc-001", true, []),
  );

  assert.equal(await readFile(fixture.dataFile, "utf8"), before);
  await access(fixture.imageDirectory);
  await assert.rejects(() => access(fixture.stateFile));
});

test("missing property changes neither catalog, images nor ID state", async (context) => {
  const fixture = await createDeleteFixture(context, "active", true, false);
  const before = await readFile(fixture.dataFile, "utf8");

  await assert.rejects(
    () => deleteProperty(fixture.commandContext, "MC-999", {
      createPrompts: () => {
        throw new Error("prompts should not be created");
      },
    }),
    /não encontrado/,
  );

  assert.equal(await readFile(fixture.dataFile, "utf8"), before);
  await access(fixture.imageDirectory);
  await assert.rejects(() => access(fixture.stateFile));
});

test("Enter/default preserves the image directory", async (context) => {
  const fixture = await createDeleteFixture(context, "active", true);

  await deleteProperty(
    fixture.commandContext,
    "MC-001",
    dependencies("MC-001", false, []),
  );

  await access(fixture.imageDirectory);
});

test("explicit N preserves the image directory", async (context) => {
  const fixture = await createDeleteFixture(context, "active", true);

  await deleteProperty(
    fixture.commandContext,
    "MC-001",
    dependencies("MC-001", false, []),
  );

  await access(fixture.imageDirectory);
});

test("explicit S removes only the exact property image directory", async (context) => {
  const fixture = await createDeleteFixture(context, "active", true);
  const parentDirectory = path.dirname(fixture.imageDirectory);
  const siblingDirectory = path.join(parentDirectory, "MC-002");
  await mkdir(siblingDirectory, { recursive: true });
  await writeFile(path.join(siblingDirectory, "keep.jpg"), "fixture", "utf8");

  await deleteProperty(
    fixture.commandContext,
    "MC-001",
    dependencies("MC-001", true, []),
  );

  await assert.rejects(() => access(fixture.imageDirectory));
  await access(parentDirectory);
  await access(siblingDirectory);
});

test("path traversal and parent directory targets are rejected", async (context) => {
  const fixture = await createDeleteFixture(context, "active", true);
  const parentDirectory = path.dirname(fixture.imageDirectory);

  await assert.rejects(
    () => inspectPropertyImageDirectory(fixture.publicDirectory, "../properties"),
    /ID inválido/,
  );
  await assert.rejects(
    () => inspectPropertyImageDirectory(fixture.publicDirectory, "MC-001/.."),
    /ID inválido/,
  );
  await access(parentDirectory);
});

test("image removal failure reports partial completion without restoring the record", async (context) => {
  const fixture = await createDeleteFixture(context, "active", true);

  await assert.rejects(
    () => deleteProperty(
      fixture.commandContext,
      "MC-001",
      {
        ...dependencies("MC-001", true, []),
        removeImages: async () => {
          throw new Error("falha simulada");
        },
      },
    ),
    /removido do catálogo.*pasta de imagens não pôde ser excluída.*falha simulada/,
  );

  assert.deepEqual((await loadCatalog(fixture.dataFile)).map((item) => item.id), ["MC-002"]);
  await access(fixture.imageDirectory);
});

test("logical remove remains reversible and never deletes images", async (context) => {
  const fixture = await createDeleteFixture(context, "active", true);
  const prompt = statusPrompt(true);

  await setPropertyStatus(
    fixture.commandContext,
    "inactive",
    "MC-001",
    { createPrompts: () => prompt },
  );
  assert.equal((await loadCatalog(fixture.dataFile))[0]?.status, "inactive");
  await access(fixture.imageDirectory);

  await setPropertyStatus(
    fixture.commandContext,
    "active",
    "MC-001",
    { createPrompts: () => statusPrompt(true) },
  );
  assert.equal((await loadCatalog(fixture.dataFile))[0]?.status, "active");
  await access(fixture.imageDirectory);
});

function dependencies(
  confirmation: string,
  deleteImages: boolean,
  output: string[],
): DeleteCommandDependencies {
  return {
    createPrompts: () => ({
      raw: async () => confirmation,
      confirm: async () => deleteImages,
      close: () => undefined,
    }),
    output: (message) => output.push(message),
  };
}

function statusPrompt(confirmation: boolean) {
  return {
    confirm: async () => confirmation,
    parsed: async <T>() => undefined as T | undefined,
    close: () => undefined,
  };
}

async function createDeleteFixture(
  context: test.TestContext,
  status: "active" | "inactive",
  withImages: boolean,
  withState = true,
) {
  const root = await mkdtemp(path.join(tmpdir(), "marli-delete-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  const dataFile = path.join(root, "data", "properties.json");
  const stateFile = path.join(root, "data", "property-id-state.json");
  const publicDirectory = path.join(root, "public");
  const imageDirectory = path.join(
    publicDirectory,
    "images",
    "properties",
    "MC-001",
  );
  const first = propertySchema.parse({ ...validSaleProperty, status });
  const second = propertySchema.parse({
    ...validSaleProperty,
    id: "MC-002",
    slug: "segundo-imovel-mc-002",
    title: "Segundo imóvel válido",
  });

  await writeCatalogSafely(dataFile, [first, second]);
  if (withState) await writePropertyIdState(stateFile, { lastIssuedSequence: 2 });
  if (withImages) {
    await mkdir(imageDirectory, { recursive: true });
    await writeFile(path.join(imageDirectory, "main.jpg"), "fixture", "utf8");
  }

  const commandContext: CommandContext = {
    dataFile,
    idStateFile: stateFile,
    publicDirectory,
  };
  return {
    commandContext,
    dataFile,
    stateFile,
    publicDirectory,
    imageDirectory,
  };
}
