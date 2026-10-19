import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPropertyCatalogUrl,
  buildPropertySearchUrl,
  getPropertyFiltersFromSearch,
  parsePropertySearchParams,
} from "@/lib/properties";

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

test("builds the Home search URL with a selected city", () => {
  assert.equal(
    buildPropertySearchUrl({
      purpose: "sale",
      location: "Lagoa Santa",
    }),
    "/imoveis?purpose=sale&location=Lagoa+Santa",
  );
  assert.equal(
    buildPropertySearchUrl({
      purpose: "rent",
      location: "Vespasiano",
    }),
    "/imoveis?purpose=rent&location=Vespasiano",
  );
});

test("omits location when all cities are selected", () => {
  assert.equal(
    buildPropertySearchUrl({ purpose: "sale", location: "" }),
    "/imoveis?purpose=sale",
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

test("parses and normalizes catalog search parameters", () => {
  assert.deepEqual(
    parsePropertySearchParams({
      purpose: "rent",
      type: "apartment",
      location: "  Lagoa   de Santo Antônio  ",
      maxPrice: "02500",
      bedrooms: "2",
      sort: "price_asc",
    }),
    {
      purpose: "rent",
      type: "apartment",
      location: "Lagoa de Santo Antônio",
      maxPrice: "2500",
      bedrooms: "2",
      sort: "price_asc",
    },
  );
});

test("uses the first value and ignores unsupported catalog parameters", () => {
  assert.deepEqual(
    parsePropertySearchParams({
      purpose: ["sale", "rent"],
      type: "other",
      maxPrice: "not-a-price",
      bedrooms: "5",
      sort: "popular",
    }),
    {
      purpose: "sale",
      type: "",
      location: "",
      maxPrice: "",
      bedrooms: "",
      sort: "",
    },
  );
});

test("requires a purpose before applying a maximum price", () => {
  assert.equal(
    parsePropertySearchParams({ maxPrice: "500000" }).maxPrice,
    "",
  );
});

test("converts URL prices in reais to domain prices in cents", () => {
  const search = parsePropertySearchParams({
    purpose: "sale",
    maxPrice: "600000",
    bedrooms: "3",
  });

  assert.deepEqual(getPropertyFiltersFromSearch(search), {
    purpose: "sale",
    type: undefined,
    location: undefined,
    maxPriceInCents: 60_000_000,
    minBedrooms: 3,
    sort: undefined,
  });
});

test("maps UI city values to an exact city domain filter", () => {
  const search = parsePropertySearchParams({ location: "Lagoa Santa" });

  assert.deepEqual(getPropertyFiltersFromSearch(search), {
    purpose: undefined,
    type: undefined,
    city: "Lagoa Santa",
    maxPriceInCents: undefined,
    minBedrooms: undefined,
    sort: undefined,
  });
});

test("builds shareable URLs and removes only the selected filter", () => {
  const search = parsePropertySearchParams({
    purpose: "sale",
    type: "house",
    location: "Centro",
    maxPrice: "600000",
    bedrooms: "3",
    sort: "newest",
  });

  assert.equal(
    buildPropertyCatalogUrl(search),
    "/imoveis?purpose=sale&type=house&location=Centro&maxPrice=600000&bedrooms=3&sort=newest",
  );
  assert.equal(
    buildPropertyCatalogUrl({ ...search, type: "" }),
    "/imoveis?purpose=sale&location=Centro&maxPrice=600000&bedrooms=3&sort=newest",
  );
  assert.equal(buildPropertyCatalogUrl({}), "/imoveis");
});
