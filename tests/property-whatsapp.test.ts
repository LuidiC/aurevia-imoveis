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
  assert.equal(
    buildPropertyWhatsAppMessage(property),
    "Olá, Marli! Tenho interesse no imóvel Casa com três quartos no Centro (MC-001). Gostaria de mais informações.",
  );
});

test("uses the configured WhatsApp number and encodes the contextual message", () => {
  const url = new URL(buildPropertyWhatsAppUrl(property));

  assert.equal(url.pathname, `/${SITE_CONFIG.contacts.whatsapp.digits}`);
  assert.equal(url.searchParams.get("text"), buildPropertyWhatsAppMessage(property));
});
