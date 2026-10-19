import assert from "node:assert/strict";
import test from "node:test";

import { SITE_CONFIG } from "../config/site";
import { getBusinessAddressQuery } from "../lib/location/business-location";
import {
  buildGoogleMapsDirectionsEmbedUrl,
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsPlaceEmbedUrl,
  getPropertyGoogleMapsLocation,
} from "../lib/location/google-maps";
import { propertySchema } from "../schemas/property";
import { onRequestSaleProperty, validSaleProperty } from "./fixtures/properties";

test("builds an encoded place Embed URL from an address", () => {
  const query = "Avenida Horizonte, 120, Centro, Lagoa Santa/MG, Brasil";
  const url = new URL(buildGoogleMapsPlaceEmbedUrl(query, "test-key") ?? "");

  assert.equal(url.pathname, "/maps/embed/v1/place");
  assert.equal(url.searchParams.get("key"), "test-key");
  assert.equal(url.searchParams.get("q"), query);
});

test("builds a driving directions Embed URL from current coordinates", () => {
  const destination = "Avenida Horizonte, 120, Centro, Lagoa Santa/MG, Brasil";
  const url = new URL(
    buildGoogleMapsDirectionsEmbedUrl(
      destination,
      { latitude: -19.6243, longitude: -44.0403 },
      "test-key",
    ) ?? "",
  );

  assert.equal(url.pathname, "/maps/embed/v1/directions");
  assert.equal(url.searchParams.get("key"), "test-key");
  assert.equal(url.searchParams.get("origin"), "-19.6243,-44.0403");
  assert.equal(url.searchParams.get("destination"), destination);
  assert.equal(url.searchParams.get("mode"), "driving");
});

test("does not build an Embed URL without an API key", () => {
  assert.equal(
    buildGoogleMapsPlaceEmbedUrl("Lagoa Santa, MG", undefined),
    undefined,
  );
  assert.equal(
    buildGoogleMapsDirectionsEmbedUrl(
      "Lagoa Santa, MG",
      { latitude: -19.6243, longitude: -44.0403 },
      "",
    ),
    undefined,
  );
});

test("builds a directions URL while leaving the origin open", () => {
  const destination = "-19.6243,-44.0403";
  const url = new URL(buildGoogleMapsDirectionsUrl(destination));

  assert.equal(url.pathname, "/maps/dir/");
  assert.equal(url.searchParams.get("api"), "1");
  assert.equal(url.searchParams.get("destination"), destination);
  assert.equal(url.searchParams.has("origin"), false);
});

test("never creates Google Maps configuration for an approximate property", () => {
  const property = propertySchema.parse(onRequestSaleProperty);

  assert.equal(getPropertyGoogleMapsLocation(property.location), undefined);
});

test("creates Google Maps configuration from an exact property address", () => {
  const property = propertySchema.parse(validSaleProperty);
  const location = getPropertyGoogleMapsLocation(property.location);

  assert.equal(
    location?.destination,
    "Rua de Teste, 100, Centro, Lagoa Santa, MG, 33600-000, Brasil",
  );
  assert.equal(
    new URL(location?.directionsUrl ?? "https://invalid.test").searchParams.get(
      "destination",
    ),
    location?.destination,
  );
});

test("prefers explicitly registered coordinates for an exact property", () => {
  const property = propertySchema.parse({
    ...validSaleProperty,
    location: {
      ...validSaleProperty.location,
      coordinates: { latitude: -19.6243, longitude: -44.0403 },
    },
  });

  assert.equal(
    getPropertyGoogleMapsLocation(property.location)?.destination,
    "-19.6243,-44.0403",
  );
});

test("uses the configured institutional address as the headquarters destination", () => {
  assert.equal(
    getBusinessAddressQuery(SITE_CONFIG.business.address),
    "Avenida Horizonte, 120, Centro, Lagoa Santa/MG, Brasil",
  );
});
