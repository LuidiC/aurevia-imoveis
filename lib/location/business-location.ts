import { SITE_CONFIG } from "@/config/site";

const GOOGLE_MAPS_SEARCH_URL = "https://www.google.com/maps/search/";

type BusinessAddress = typeof SITE_CONFIG.business.address;

export function getBusinessAddressLines(
  address: BusinessAddress = SITE_CONFIG.business.address,
): readonly [string, string] {
  return [
    `${address.street}, ${address.number}`,
    `${address.neighborhood} — ${address.city}/${address.state}`,
  ];
}

export function getBusinessAddressQuery(
  address: BusinessAddress = SITE_CONFIG.business.address,
): string {
  return [
    address.street,
    address.number,
    address.neighborhood,
    `${address.city}/${address.state}`,
    address.country,
  ].join(", ");
}

export function buildGoogleMapsSearchUrl(
  address: BusinessAddress = SITE_CONFIG.business.address,
): string {
  const url = new URL(GOOGLE_MAPS_SEARCH_URL);

  url.searchParams.set("api", "1");
  url.searchParams.set("query", getBusinessAddressQuery(address));

  return url.toString();
}
