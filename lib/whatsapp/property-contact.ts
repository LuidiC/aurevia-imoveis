import type { Property } from "@/types/property";

import { buildWhatsAppUrl } from "./build-whatsapp-url";

type ContactProperty = Pick<Property, "title">;

export function buildPropertyWhatsAppMessage(
  property: ContactProperty,
): string {
  return `Olá, Marli! Tenho interesse no imóvel ${property.title}. Gostaria de mais informações.`;
}

export function buildPropertyWhatsAppUrl(property: ContactProperty): string {
  return buildWhatsAppUrl(buildPropertyWhatsAppMessage(property));
}
