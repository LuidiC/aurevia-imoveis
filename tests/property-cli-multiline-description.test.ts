import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { PropertyDescription } from "../components/property/property-detail";
import { propertySchema } from "../schemas/property";
import {
  normalizeMultilineText,
  Prompts,
} from "../scripts/properties/prompts";
import { writeCatalogSafely } from "../scripts/properties/storage";
import { validSaleProperty } from "./fixtures/properties";

test("property:add accepts a one-line description terminated by :fim", async () => {
  const { prompts } = promptFixture([
    "Casa ampla e bem localizada.",
    ":fim",
  ]);

  assert.equal(
    await prompts.multiline("Descrição do imóvel", { minLength: 20 }),
    "Casa ampla e bem localizada.",
  );
});

test("property:add accepts two description lines", async () => {
  const { prompts } = promptFixture([
    "Casa ampla e bem localizada.",
    "Possui excelente acabamento.",
    ":fim",
  ]);

  assert.equal(
    await prompts.multiline("Descrição do imóvel"),
    "Casa ampla e bem localizada.\nPossui excelente acabamento.",
  );
});

test("property:add preserves multiple paragraphs and internal empty lines", async () => {
  const { prompts } = promptFixture([
    "Casa ampla e bem localizada.",
    "",
    "Possui excelente acabamento e ótima iluminação natural.",
    "",
    "Venha conhecer!",
    ":fim",
  ]);

  assert.equal(
    await prompts.multiline("Descrição do imóvel"),
    "Casa ampla e bem localizada.\n\n" +
      "Possui excelente acabamento e ótima iluminação natural.\n\n" +
      "Venha conhecer!",
  );
});

test("multiline input removes only the exact :fim terminator", async () => {
  const { prompts } = promptFixture([
    "Texto válido antes do marcador.",
    ":fim ",
    ":fim",
  ]);

  assert.equal(
    await prompts.multiline("Descrição do imóvel"),
    "Texto válido antes do marcador.\n:fim",
  );
});

test("multiline normalization converts CRLF to LF and trims only global whitespace", () => {
  assert.equal(
    normalizeMultilineText("\r\n  Primeiro parágrafo.\r\n\r\nSegundo parágrafo.  \r\n"),
    "Primeiro parágrafo.\n\nSegundo parágrafo.",
  );
});

test("property:edit replaces a current one-line description with paragraphs", async () => {
  const { prompts } = promptFixture([
    "s",
    "Nova descrição ampla.",
    "",
    "Venha conhecer!",
    ":fim",
  ]);

  assert.equal(
    await prompts.multiline("Descrição do imóvel", {
      current: "Descrição antiga de uma linha.",
    }),
    "Nova descrição ampla.\n\nVenha conhecer!",
  );
});

test("property:edit keeps the current description when Enter selects the default", async () => {
  const current = "Descrição atual preservada sem alterações.";
  const fixture = promptFixture([""]);

  assert.equal(
    await fixture.prompts.multiline("Descrição do imóvel", { current }),
    current,
  );
  assert.equal(fixture.answerCount(), 1);
});

test("multiline input keeps the existing minimum-length validation", async () => {
  const fixture = promptFixture([
    "Curta",
    ":fim",
    "Descrição válida com tamanho suficiente.",
    ":fim",
  ]);

  assert.equal(
    await fixture.prompts.multiline("Descrição do imóvel", { minLength: 20 }),
    "Descrição válida com tamanho suficiente.",
  );
  assert.match(fixture.output.join(""), /Informe ao menos 20 caracteres/);
});

test("multiline input keeps the existing maximum-length validation", async () => {
  const fixture = promptFixture([
    "123456",
    ":fim",
    "12345",
    ":fim",
  ]);

  assert.equal(
    await fixture.prompts.multiline("Descrição do imóvel", { maxLength: 5 }),
    "12345",
  );
  assert.match(fixture.output.join(""), /Use no máximo 5 caracteres/);
});

test("legacy one-line and new multiline descriptions both satisfy the Property schema", () => {
  assert.equal(propertySchema.safeParse(validSaleProperty).success, true);
  assert.equal(propertySchema.safeParse({
    ...validSaleProperty,
    description: "Casa ampla e bem localizada.\n\nVenha conhecer!",
  }).success, true);
});

test("catalog storage serializes multiline descriptions as plain JSON text with escaped newlines", async (context) => {
  const root = await mkdtemp(path.join(tmpdir(), "aurevia-description-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  const dataFile = path.join(root, "data", "properties.json");
  const description = "Casa ampla e bem localizada.\n\nVenha conhecer!";
  const property = propertySchema.parse({ ...validSaleProperty, description });

  await writeCatalogSafely(dataFile, [property]);

  const stored = await readFile(dataFile, "utf8");
  assert.match(stored, /Casa ampla e bem localizada\.\\n\\nVenha conhecer!/);
  assert.doesNotMatch(stored, /<br|<p|<div/i);
});

test("property detail renders plain multiline text with whitespace-pre-line", () => {
  const description = "Casa ampla e bem localizada.\n\nVenha conhecer!";
  const markup = renderToStaticMarkup(
    createElement(PropertyDescription, { description }),
  );

  assert.match(markup, /whitespace-pre-line/);
  assert.match(markup, /Casa ampla e bem localizada\.\n\nVenha conhecer!/);
  assert.doesNotMatch(markup, /<br|dangerouslySetInnerHTML/);
});

function promptFixture(answers: readonly string[]) {
  let index = 0;
  const output: string[] = [];
  const prompts = new Prompts(
    {
      question: async () => {
        const answer = answers[index];
        assert.notEqual(answer, undefined, "A CLI solicitou uma resposta inesperada.");
        index += 1;
        return answer;
      },
      close: () => undefined,
    },
    (message) => output.push(message),
  );

  return { prompts, output, answerCount: () => index };
}
