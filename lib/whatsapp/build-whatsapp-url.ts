import { SITE_CONFIG } from "@/config/site";

const WHATSAPP_BASE_URL = "https://wa.me/";

export function buildWhatsAppUrl(message?: string): string {
  const url = new URL(SITE_CONFIG.contacts.whatsappDigits, WHATSAPP_BASE_URL);
  const normalizedMessage = message?.trim();

  if (normalizedMessage) {
    url.searchParams.set("text", normalizedMessage);
  }

  return url.toString();
}
