import assert from "node:assert/strict";
import test from "node:test";

import { SITE_CONFIG } from "../config/site";
import {
  buildGoogleMapsSearchUrl,
  getBusinessAddressLines,
  getBusinessAddressQuery,
} from "../lib/location/business-location";

test("formats the configured business address for display", () => {
  assert.deepEqual(getBusinessAddressLines(), [
    "Rua Jockey Club, 281",
    "Centro — Pedro Leopoldo/MG",
  ]);
});

test("builds a deterministic Google Maps search URL from the full address", () => {
  const firstUrl = buildGoogleMapsSearchUrl();
  const secondUrl = buildGoogleMapsSearchUrl();
  const parsedUrl = new URL(firstUrl);

  assert.equal(firstUrl, secondUrl);
  assert.equal(parsedUrl.origin, "https://www.google.com");
  assert.equal(parsedUrl.pathname, "/maps/search/");
  assert.equal(parsedUrl.searchParams.get("api"), "1");
  assert.equal(
    parsedUrl.searchParams.get("query"),
    getBusinessAddressQuery(SITE_CONFIG.business.address),
  );
  assert.equal(
    parsedUrl.searchParams.get("query"),
    "Rua Jockey Club, 281, Centro, Pedro Leopoldo/MG, Brasil",
  );
});
