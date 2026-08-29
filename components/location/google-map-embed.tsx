import { GoogleMapEmbedClient } from "@/components/location/google-map-embed-client";
import { buttonStyles } from "@/components/ui/button";
import { buildGoogleMapsPlaceEmbedUrl } from "@/lib/location/google-maps";

type GoogleMapEmbedProps = Readonly<{
  destination: string;
  externalDirectionsUrl: string;
  externalLinkLabel: string;
  title: string;
  className?: string;
  variant?: "default" | "inverse";
}>;

export function GoogleMapEmbed({
  destination,
  externalDirectionsUrl,
  externalLinkLabel,
  title,
  className = "",
  variant = "default",
}: GoogleMapEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;
  const placeUrl = buildGoogleMapsPlaceEmbedUrl(destination, apiKey);

  if (!placeUrl || !apiKey) {
    return (
      <a
        aria-label={externalLinkLabel}
        className={
          variant === "inverse"
            ? `inline-flex min-h-11 items-center rounded-md font-semibold text-primary-foreground underline decoration-primary-foreground/55 underline-offset-4 transition-colors hover:decoration-primary-foreground ${className}`
            : buttonStyles({ variant: "outline", className })
        }
        href={externalDirectionsUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        Como chegar
      </a>
    );
  }

  return (
    <GoogleMapEmbedClient
      apiKey={apiKey}
      className={className}
      destination={destination}
      externalDirectionsUrl={externalDirectionsUrl}
      externalLinkLabel={externalLinkLabel}
      placeUrl={placeUrl}
      title={title}
      variant={variant}
    />
  );
}
