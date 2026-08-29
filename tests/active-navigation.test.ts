import assert from "node:assert/strict";
import test from "node:test";

import { getActiveNavigationHref } from "../lib/navigation/active-navigation";

test("selects Início on the Home page", () => {
  assert.equal(getActiveNavigationHref("/"), "/");
});

test("selects Imóveis on the catalog and property detail routes", () => {
  assert.equal(getActiveNavigationHref("/imoveis"), "/imoveis");
  assert.equal(
    getActiveNavigationHref("/imoveis/casa-no-centro"),
    "/imoveis",
  );
});

test("selects Home sections from the URL hash", () => {
  assert.equal(getActiveNavigationHref("/", "#sobre"), "/#sobre");
  assert.equal(getActiveNavigationHref("/", "#contato"), "/#contato");
});

test("the visible Home section takes precedence over a stale hash", () => {
  assert.equal(getActiveNavigationHref("/", "#sobre", "contato"), "/#contato");
  assert.equal(getActiveNavigationHref("/", "#contato", "inicio"), "/");
});
