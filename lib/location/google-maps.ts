import type { Property } from "@/types/property";

const GOOGLE_MAPS_DIRECTIONS_URL = "https://www.google.com/maps/dir/";
const GOOGLE_MAPS_PLACE_EMBED_URL =
  "https://www.google.com/maps/embed/v1/place";
const GOOGLE_MAPS_DIRECTIONS_EMBED_URL =
  "https://www.google.com/maps/embed/v1/directions";

export type Coordinates = Readonly<{
  latitude: number;
  longitude: number;
}>;

export type GoogleMapsLocation = Readonly<{
  destination: string;
  directionsUrl: string;
}>;

function formatCoordinates(coordinates: Coordinates): string | undefined {
  const { latitude, longitude } = coordinates;

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return undefined;
  }

  return `${latitude},${longitude}`;
}

function getPropertyAddressQuery(
  location: Property["location"],
): string | undefined {
  if (!location.address) return undefined;

  return [
    location.address.street,
    location.address.number,
    location.address.complement,
    location.neighborhood,
    location.city,
    location.state,
    location.address.postalCode,
    "Brasil",
  ]
    .filter((part): part is string => Boolean(part))
    .join(", ");
}

export function buildGoogleMapsDirectionsUrl(destination: string): string {
  const url = new URL(GOOGLE_MAPS_DIRECTIONS_URL);

  url.searchParams.set("api", "1");
  url.searchParams.set("destination", destination);

  return url.toString();
}

export function buildGoogleMapsPlaceEmbedUrl(
  destination: string,
  apiKey: string | undefined,
): string | undefined {
  const normalizedApiKey = apiKey?.trim();
  const normalizedDestination = destination.trim();

  if (!normalizedApiKey || !normalizedDestination) return undefined;

  const url = new URL(GOOGLE_MAPS_PLACE_EMBED_URL);

  url.searchParams.set("key", normalizedApiKey);
  url.searchParams.set("q", normalizedDestination);

  return url.toString();
}

export function buildGoogleMapsDirectionsEmbedUrl(
  destination: string,
  origin: Coordinates,
  apiKey: string | undefined,
): string | undefined {
  const normalizedApiKey = apiKey?.trim();
  const normalizedDestination = destination.trim();
  const normalizedOrigin = formatCoordinates(origin);

  if (!normalizedApiKey || !normalizedDestination || !normalizedOrigin) {
    return undefined;
  }

  const url = new URL(GOOGLE_MAPS_DIRECTIONS_EMBED_URL);

  url.searchParams.set("key", normalizedApiKey);
  url.searchParams.set("origin", normalizedOrigin);
  url.searchParams.set("destination", normalizedDestination);
  url.searchParams.set("mode", "driving");

  return url.toString();
}

export function getPropertyGoogleMapsLocation(
  location: Property["location"],
): GoogleMapsLocation | undefined {
  if (location.disclosure !== "exact") return undefined;

  const destination = location.coordinates
    ? formatCoordinates(location.coordinates)
    : getPropertyAddressQuery(location);

  if (!destination) return undefined;

  return {
    destination,
    directionsUrl: buildGoogleMapsDirectionsUrl(destination),
  };
}
