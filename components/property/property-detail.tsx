import Link from "next/link";

import { GoogleMapEmbed } from "@/components/location/google-map-embed";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyMetaIcon } from "@/components/property/property-meta-icon";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  getPropertyAdditionalCostItems,
  getPropertyFeatureLabels,
  getPropertyLocationDetails,
  getPropertyLocationLabel,
  getPropertyMetaItems,
  getPropertyPriceLabel,
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/properties";
import { getPropertyGoogleMapsLocation } from "@/lib/location/google-maps";
import { buildPropertyWhatsAppUrl } from "@/lib/whatsapp/property-contact";
import type { Property } from "@/types/property";

type PropertyDetailProps = Readonly<{
  property: Property;
  similarProperties?: readonly Property[];
}>;

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M20.2 11.6a8.2 8.2 0 0 1-12.1 7.2L4 20l1.2-4A8.2 8.2 0 1 1 20.2 11.6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M9 8.3c.2-.4.4-.4.7-.4h.4c.2 0 .3.1.4.4l.7 1.7c.1.3.1.5-.1.7l-.5.6c-.2.2-.1.4 0 .6.5.9 1.2 1.6 2.1 2.1.2.1.4.2.6 0l.7-.8c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.4.5 0 .3-.1 1.2-.8 1.7-.5.4-1.2.6-2 .4-1.1-.3-2.5-.9-3.9-2.2-1.1-1-1.9-2.2-2.3-3.3-.4-1.1 0-2 .3-2.4l1-.3Z" fill="currentColor" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 20 20">
      <path d="M15.5 8.25c0 3.75-5.5 8.25-5.5 8.25s-5.5-4.5-5.5-8.25a5.5 5.5 0 1 1 11 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="10" cy="8.25" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Description({ description }: Readonly<{ description: string }>) {
  const paragraphs = description.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="mt-5 grid max-w-3xl gap-4 text-body text-muted-foreground">
      {paragraphs.map((paragraph, index) => (
        <p className="whitespace-pre-line" key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

export function PropertyDetail({
  property,
  similarProperties = [],
}: PropertyDetailProps) {
  const metaItems = getPropertyMetaItems(property);
  const additionalCosts = getPropertyAdditionalCostItems(property);
  const featureLabels = getPropertyFeatureLabels(property.features);
  const location = getPropertyLocationDetails(property.location);
  const mapLocation = getPropertyGoogleMapsLocation(property.location);
  const price = getPropertyPriceLabel(property);
  const whatsappHref = buildPropertyWhatsAppUrl(property);

  return (
    <main className="flex-1 pb-20 pt-8 sm:pb-24 sm:pt-10 lg:pb-28" id="conteudo">
      <Container>
        <nav aria-label="Caminho da página">
          <ol className="flex min-w-0 items-center gap-2 overflow-hidden text-sm text-muted-foreground">
            <li className="shrink-0">
              <Link className="rounded-sm underline-offset-4 hover:text-primary hover:underline" href="/">Início</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="shrink-0">
              <Link className="rounded-sm underline-offset-4 hover:text-primary hover:underline" href="/imoveis">Imóveis</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="min-w-0 truncate text-foreground">{property.title}</li>
          </ol>
        </nav>

        <header className="mt-7 grid gap-6 border-b border-border pb-8 sm:mt-9 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Badge>{PROPERTY_PURPOSE_LABELS[property.purpose]}</Badge>
              <Badge variant="outline">{PROPERTY_TYPE_LABELS[property.type]}</Badge>
            </div>
            <h1 className="text-heading-1 mt-4 max-w-4xl break-words text-foreground">{property.title}</h1>
            <p className="mt-4 flex items-start gap-2 text-muted-foreground">
              <LocationIcon />
              <span>{getPropertyLocationLabel(property.location)}</span>
            </p>
          </div>
          <div className="lg:text-right">
            <p className="text-label text-muted-foreground">Valor do imóvel</p>
            <p className="mt-2 text-2xl font-bold leading-tight tracking-[-0.025em] text-foreground sm:text-3xl">{price}</p>
          </div>
        </header>

        <div className="mt-6 sm:mt-8">
          <PropertyGallery images={property.images} />
        </div>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-16">
          <div className="min-w-0">
            {metaItems.length > 0 ? (
              <section aria-labelledby="property-highlights-title">
                <h2 className="text-label text-primary" id="property-highlights-title">Informações principais</h2>
                <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-6 border-y border-border py-6 sm:grid-cols-3 xl:grid-cols-5">
                  {metaItems.map((item) => (
                    <li className="flex min-w-0 items-center gap-3" key={item.kind}>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
                        <PropertyMetaIcon className="h-5 w-5" kind={item.kind} />
                      </span>
                      <span className="text-sm font-semibold text-foreground">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section aria-labelledby="property-description-title" className={metaItems.length > 0 ? "mt-12 sm:mt-16" : undefined}>
              <p className="text-label text-primary">Detalhes</p>
              <h2 className="text-heading-3 mt-3 text-foreground" id="property-description-title">Sobre este imóvel</h2>
              <Description description={property.description} />
            </section>

            {featureLabels.length > 0 ? (
              <section aria-labelledby="property-features-title" className="mt-12 border-t border-border pt-12 sm:mt-16 sm:pt-16">
                <h2 className="text-heading-3 text-foreground" id="property-features-title">Características</h2>
                <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {featureLabels.map((feature) => (
                    <li className="flex items-center gap-3 text-foreground" key={feature}>
                      <svg aria-hidden="true" className="h-5 w-5 shrink-0 text-primary" fill="none" viewBox="0 0 20 20">
                        <path d="m4 10 3.5 3.5L16 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section aria-labelledby="property-location-title" className="mt-12 border-t border-border pt-12 sm:mt-16 sm:pt-16">
              <p className="text-label text-primary">Onde fica</p>
              <h2 className="text-heading-3 mt-3 text-foreground" id="property-location-title">Localização do imóvel</h2>
              <div className="mt-5 flex max-w-3xl items-start gap-3 text-foreground">
                <span className="mt-0.5 text-primary"><LocationIcon /></span>
                <div>
                  <p className="font-semibold leading-7">{location.label}</p>
                  {location.note ? <p className="mt-2 text-small text-muted-foreground">{location.note}</p> : null}
                </div>
              </div>
              {mapLocation ? (
                <GoogleMapEmbed
                  className="mt-6"
                  destination={mapLocation.destination}
                  externalDirectionsUrl={mapLocation.directionsUrl}
                  externalLinkLabel={`Como chegar ao imóvel ${property.title} no Google Maps; abre em uma nova aba`}
                  title={`Mapa da localização exata de ${property.title}`}
                />
              ) : null}
            </section>
          </div>

          <aside className="rounded-lg border border-border bg-surface p-6 shadow-soft lg:sticky lg:top-32 lg:p-7" aria-labelledby="property-contact-title">
            <p className="text-label text-primary">Atendimento próximo</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground" id="property-contact-title">Quer saber mais sobre este imóvel?</h2>
            <p className="mt-3 text-small text-muted-foreground">Converse diretamente com a Marli e tire suas dúvidas com tranquilidade.</p>

            {additionalCosts.length > 0 ? (
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Custos informados</p>
                <dl className="mt-3 grid gap-2.5">
                  {additionalCosts.map((cost) => (
                    <div className="flex items-baseline justify-between gap-4" key={cost.kind}>
                      <dt className="text-sm text-muted-foreground">{cost.label}</dt>
                      <dd className="text-sm font-semibold text-foreground">{cost.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            <a
              aria-label={`Falar com a Marli no WhatsApp sobre ${property.title}; abre em uma nova aba`}
              className={buttonStyles({ className: "mt-6 w-full" })}
              href={whatsappHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              <WhatsAppIcon />
              Falar no WhatsApp
            </a>
          </aside>
        </div>

        <section aria-labelledby="property-final-contact-title" className="mt-16 rounded-lg bg-secondary px-6 py-10 text-secondary-foreground sm:mt-20 sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-label text-secondary-foreground/70">Próximo passo</p>
            <h2 className="text-heading-3 mt-3" id="property-final-contact-title">Gostou deste imóvel?</h2>
            <p className="mt-3 leading-7 text-secondary-foreground/80">Fale com a Marli para confirmar detalhes e entender se ele combina com o que você procura.</p>
          </div>
          <a
            aria-label={`Falar com a Marli no WhatsApp sobre ${property.title}; abre em uma nova aba`}
            className={buttonStyles({ variant: "outline", className: "mt-7 shrink-0 border-white/50 bg-white text-secondary hover:border-white hover:bg-accent lg:mt-0" })}
            href={whatsappHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <WhatsAppIcon />
            Falar sobre este imóvel
          </a>
        </section>

        {similarProperties.length > 0 ? (
          <section aria-labelledby="similar-properties-title" className="mt-16 sm:mt-20">
            <p className="text-label text-primary">Outras oportunidades</p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-heading-2 text-foreground" id="similar-properties-title">Imóveis semelhantes</h2>
              <Link className="font-semibold text-primary underline-offset-4 hover:underline" href="/imoveis">Ver todos os imóveis</Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {similarProperties.slice(0, 3).map((similarProperty) => (
                <PropertyCard key={similarProperty.id} property={similarProperty} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </main>
  );
}
