import assert from "node:assert/strict";
import test from "node:test";

import { SITE_CONFIG } from "../config/site";
import {
  buildPropertyWhatsAppMessage,
  buildPropertyWhatsAppUrl,
} from "../lib/whatsapp/property-contact";
import { propertySchema } from "../schemas/property";
import { validSaleProperty } from "./fixtures/properties";

const property = propertySchema.parse(validSaleProperty);

test("builds a short contextual message that identifies the property", () => {
  const message = buildPropertyWhatsAppMessage(property);

  assert.match(message, /^Olá! Tenho interesse no imóvel /);
  assert.ok(message.includes(property.title));
  assert.doesNotMatch(message, /MC-\d+/);
});

test("uses the configured WhatsApp number and encodes the contextual message", () => {
  const url = new URL(buildPropertyWhatsAppUrl(property));

  assert.equal(url.pathname, `/${SITE_CONFIG.contacts.whatsapp.digits}`);
  assert.equal(url.pathname, "/5531996930657");
  assert.equal(url.searchParams.get("text"), buildPropertyWhatsAppMessage(property));
  assert.doesNotMatch(url.toString(), /MC-\d+/);
});
