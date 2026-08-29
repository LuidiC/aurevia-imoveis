import assert from "node:assert/strict";
import test from "node:test";

import { SITE_CONFIG } from "../config/site";
import {
  buildBusinessGoogleMapsDirectionsUrl,
  getBusinessAddressLines,
  getBusinessAddressQuery,
} from "../lib/location/business-location";

test("formats the configured business address for display", () => {
  assert.deepEqual(getBusinessAddressLines(), [
    "Rua Jockey Club, 281",
    "Centro — Pedro Leopoldo/MG",
  ]);
});

test("builds a deterministic Google Maps directions URL from the full address", () => {
  const firstUrl = buildBusinessGoogleMapsDirectionsUrl();
  const secondUrl = buildBusinessGoogleMapsDirectionsUrl();
  const parsedUrl = new URL(firstUrl);

  assert.equal(firstUrl, secondUrl);
  assert.equal(parsedUrl.origin, "https://www.google.com");
  assert.equal(parsedUrl.pathname, "/maps/dir/");
  assert.equal(parsedUrl.searchParams.get("api"), "1");
  assert.equal(
    parsedUrl.searchParams.get("destination"),
    getBusinessAddressQuery(SITE_CONFIG.business.address),
  );
  assert.equal(
    parsedUrl.searchParams.get("destination"),
    "Rua Jockey Club, 281, Centro, Pedro Leopoldo/MG, Brasil",
  );
});
