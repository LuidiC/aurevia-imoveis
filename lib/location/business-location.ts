import { SITE_CONFIG } from "@/config/site";
import { buildGoogleMapsDirectionsUrl } from "@/lib/location/google-maps";

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

export function buildBusinessGoogleMapsDirectionsUrl(
  address: BusinessAddress = SITE_CONFIG.business.address,
): string {
  return buildGoogleMapsDirectionsUrl(getBusinessAddressQuery(address));
}
