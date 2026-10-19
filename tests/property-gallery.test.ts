import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { PropertyGallery } from "../components/property/property-gallery";
import type { PropertyImage } from "../types/property";

const images: readonly PropertyImage[] = [
  { src: "/images/sala.webp", alt: "Sala integrada ao jardim", isPrimary: false },
  { src: "/images/fachada.webp", alt: "Fachada com jardim", isPrimary: true },
  { src: "/images/cozinha.webp", alt: "Cozinha com bancada", isPrimary: false },
];

test("gallery includes photo previews in server HTML before hydration", () => {
  const html = renderToStaticMarkup(createElement(PropertyGallery, { images }));

  assert.match(html, /alt="Fachada com jardim"/);
  assert.match(html, /aria-label="Mostrar próxima imagem"/);
  assert.match(html, /aria-label="Mostrar imagem anterior"/);
  assert.match(html, /aria-label="Mostrar imagem 2 de 3: Sala integrada ao jardim"/);
  assert.match(html, /aria-label="Mostrar imagem 3 de 3: Cozinha com bancada"/);
  assert.equal((html.match(/aria-pressed="(?:true|false)"/g) ?? []).length, 3);
  assert.equal((html.match(/aria-pressed="true"/g) ?? []).length, 1);
});

test("gallery without photos renders its fallback without navigation controls", () => {
  const html = renderToStaticMarkup(createElement(PropertyGallery, { images: [] }));

  assert.match(html, /Imagem do imóvel temporariamente indisponível/);
  assert.doesNotMatch(html, /<button/);
});
