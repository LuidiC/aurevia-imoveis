import assert from "node:assert/strict";
import test from "node:test";

import { buildPropertySearchUrl } from "@/lib/properties";

test("builds the minimum catalog URL with the selected purpose", () => {
  assert.equal(
    buildPropertySearchUrl({ purpose: "sale" }),
    "/imoveis?purpose=sale",
  );
});

test("adds selected property search filters and trims the location", () => {
  assert.equal(
    buildPropertySearchUrl({
      purpose: "rent",
      type: "house",
      location: "  Lagoa de Santo Antônio  ",
      maxPrice: "2500",
    }),
    "/imoveis?purpose=rent&type=house&location=Lagoa+de+Santo+Ant%C3%B4nio&maxPrice=2500",
  );
});

test("omits empty and invalid optional filters", () => {
  assert.equal(
    buildPropertySearchUrl({
      purpose: "sale",
      type: "",
      location: "   ",
      maxPrice: "not-a-price",
    }),
    "/imoveis?purpose=sale",
  );
});
