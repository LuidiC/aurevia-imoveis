import Link from "next/link";

import { PropertyCard } from "@/components/property/property-card";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFeaturedProperties } from "@/lib/properties";

const MAX_HOME_FEATURED_PROPERTIES = 3;

export function FeaturedPropertiesSection() {
  const properties = getFeaturedProperties().slice(
    0,
    MAX_HOME_FEATURED_PROPERTIES,
  );

  return (
    <section className="section-spacing bg-background">
      <Container>
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            description="Uma seleção enxuta para você começar a conhecer as oportunidades disponíveis."
            eyebrow="Seleção da Marli"
            title="Imóveis em destaque"
          />
          <Link
            className={buttonStyles({ variant: "outline", className: "shrink-0 sm:mb-1" })}
            href="/imoveis"
          >
            Ver todos os imóveis
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 rounded-lg border border-border bg-surface px-6 py-8 shadow-control sm:grid-cols-[auto_1fr] sm:items-center sm:px-8 sm:py-10">
            <div
              aria-hidden="true"
              className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 28 28">
                <path d="m4.5 13.5 9.5-8 9.5 8V23h-19v-9.5ZM11 23v-6.5h6V23" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Novos imóveis serão publicados em breve.
              </h3>
              <p className="text-body mt-2 max-w-2xl text-muted-foreground">
                A seleção será atualizada automaticamente quando as próximas
                oportunidades estiverem disponíveis no catálogo.
              </p>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
