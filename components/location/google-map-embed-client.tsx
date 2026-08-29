"use client";

import { useState } from "react";

import { Button, buttonStyles } from "@/components/ui/button";
import { buildGoogleMapsDirectionsEmbedUrl } from "@/lib/location/google-maps";

type GoogleMapEmbedClientProps = Readonly<{
  apiKey: string;
  destination: string;
  externalDirectionsUrl: string;
  externalLinkLabel: string;
  placeUrl: string;
  title: string;
  className: string;
  variant: "default" | "inverse";
}>;

type RouteStatus = "idle" | "loading" | "active" | "error";

const GEOLOCATION_ERROR_MESSAGE =
  "Não foi possível acessar sua localização. Você ainda pode abrir a rota no Google Maps.";

function RouteIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="M6 15.5h1.5a2.5 2.5 0 0 0 2.5-2.5V7a2.5 2.5 0 0 1 2.5-2.5H14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="m11.5 2 2.5 2.5L11.5 7M4.5 13 2 15.5 4.5 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function GoogleMapEmbedClient({
  apiKey,
  destination,
  externalDirectionsUrl,
  externalLinkLabel,
  placeUrl,
  title,
  className,
  variant,
}: GoogleMapEmbedClientProps) {
  const [iframeUrl, setIframeUrl] = useState(placeUrl);
  const [routeStatus, setRouteStatus] = useState<RouteStatus>("idle");

  function requestDirections() {
    if (!("geolocation" in navigator)) {
      setRouteStatus("error");
      return;
    }

    setRouteStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const directionsUrl = buildGoogleMapsDirectionsEmbedUrl(
          destination,
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          apiKey,
        );

        if (!directionsUrl) {
          setRouteStatus("error");
          return;
        }

        setIframeUrl(directionsUrl);
        setRouteStatus("active");
      },
      () => setRouteStatus("error"),
      {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 10_000,
      },
    );
  }

  function resetDirections() {
    setIframeUrl(placeUrl);
    setRouteStatus("idle");
  }

  const isInverse = variant === "inverse";
  const primaryButtonClass = isInverse
    ? "border-primary-foreground bg-primary-foreground text-primary hover:bg-primary-foreground/90"
    : undefined;
  const externalLinkClass = isInverse
    ? "border-primary-foreground/55 bg-transparent text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10"
    : undefined;

  return (
    <div className={className}>
      <div className="h-[17.5rem] w-full overflow-hidden rounded-lg bg-surface-subtle sm:h-[22rem]">
        <iframe
          allowFullScreen
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={iframeUrl}
          title={routeStatus === "active" ? `${title} com rota` : title}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {routeStatus === "active" ? (
          <Button
            className={primaryButtonClass}
            onClick={resetDirections}
            type="button"
          >
            Ver somente localização
          </Button>
        ) : (
          <Button
            className={primaryButtonClass}
            disabled={routeStatus === "loading"}
            onClick={requestDirections}
            type="button"
          >
            <RouteIcon />
            {routeStatus === "loading"
              ? "Obtendo sua localização..."
              : "Traçar rota da minha localização"}
          </Button>
        )}

        <a
          aria-label={externalLinkLabel}
          className={buttonStyles({
            variant: "outline",
            className: externalLinkClass,
          })}
          href={externalDirectionsUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Como chegar
        </a>
      </div>

      {routeStatus === "error" || routeStatus === "active" ? (
        <p
          aria-live="polite"
          className={`mt-3 text-sm ${isInverse ? "text-primary-foreground/85" : "text-muted-foreground"}`}
          role="status"
        >
          {routeStatus === "error"
            ? GEOLOCATION_ERROR_MESSAGE
            : "Rota exibida a partir da sua localização atual."}
        </p>
      ) : null}
    </div>
  );
}
