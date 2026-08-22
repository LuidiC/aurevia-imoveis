import type { Property } from "@/types/property";

import { buildWhatsAppUrl } from "./build-whatsapp-url";

type ContactProperty = Pick<Property, "id" | "title">;

export function buildPropertyWhatsAppMessage(
  property: ContactProperty,
): string {
  return `Olá, Marli! Tenho interesse no imóvel ${property.title} (${property.id}). Gostaria de mais informações.`;
}

export function buildPropertyWhatsAppUrl(property: ContactProperty): string {
  return buildWhatsAppUrl(buildPropertyWhatsAppMessage(property));
}
