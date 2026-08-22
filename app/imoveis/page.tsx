import type { Metadata } from "next";
import Link from "next/link";

import { ActivePropertyFilters } from "@/components/property/active-property-filters";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertySortSelect } from "@/components/property/property-sort-select";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  buildPropertyCatalogUrl,
  getActiveProperties,
  getPropertyFiltersFromSearch,
  hasPropertyFilters,
  parsePropertySearchParams,
  type PropertySearchParams,
} from "@/lib/properties";
import { createPageMetadata } from "@/lib/seo/metadata";

const description =
  "Encontre casas, apartamentos, terrenos e imóveis para comprar ou alugar em Pedro Leopoldo e região.";

export const metadata: Metadata = createPageMetadata({
  title: "Imóveis em Pedro Leopoldo e região",
  description,
  path: "/imoveis",
});

type PropertiesPageProps = Readonly<{
  searchParams: Promise<PropertySearchParams>;
}>;

function getResultLabel(count: number): string {
  return `${count} ${count === 1 ? "imóvel encontrado" : "imóveis encontrados"}`;
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const search = parsePropertySearchParams(await searchParams);
  const hasFilters = hasPropertyFilters(search);
  const allProperties = getActiveProperties();
  const properties = getActiveProperties(getPropertyFiltersFromSearch(search));
  const activeFilterCount = [
    search.purpose,
    search.type,
    search.location,
    search.maxPrice,
    search.bedrooms,
  ].filter(Boolean).length;
  const searchKey = buildPropertyCatalogUrl(search);

  return (
    <main className="flex-1 py-12 sm:py-16 lg:py-20" id="conteudo">
      <Container>
        <div className="max-w-3xl">
          <p className="text-label text-primary">Catálogo</p>
          <h1 className="text-heading-1 mt-3 text-foreground">Imóveis</h1>
          <p className="text-body-lg mt-5 text-muted-foreground">{description}</p>
        </div>

        <div className="mt-9 sm:mt-10">
          <PropertyFilters
            activeFilterCount={activeFilterCount}
            key={searchKey}
            search={search}
          />
          <ActivePropertyFilters search={search} />
        </div>

        <div className="mt-8 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-foreground" role="status">
            {getResultLabel(properties.length)}
          </p>
          <PropertySortSelect key={`${searchKey}-sort`} search={search} />
        </div>

        {properties.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <section className="mt-8 rounded-lg border border-border bg-surface px-6 py-10 text-center shadow-control sm:px-10 sm:py-14">
            <div
              aria-hidden="true"
              className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 28 28">
                <path d="m4.5 13.5 9.5-8 9.5 8V23h-19v-9.5ZM11 23v-6.5h6V23" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
              </svg>
            </div>
            <h2 className="text-heading-3 mt-5 text-foreground">
              {allProperties.length === 0
                ? "Novos imóveis serão publicados em breve."
                : "Nenhum imóvel encontrado com esses filtros."}
            </h2>
            <p className="text-body mx-auto mt-3 max-w-xl text-muted-foreground">
              {allProperties.length === 0
                ? "Estamos preparando as próximas oportunidades para o catálogo. Fale com a Marli para contar o que você procura."
                : "Tente ajustar os critérios de busca ou limpar os filtros."}
            </p>
            {allProperties.length > 0 && hasFilters ? (
              <Link
                className={buttonStyles({ variant: "outline", className: "mt-6" })}
                href="/imoveis"
                scroll={false}
              >
                Limpar filtros
              </Link>
            ) : null}
          </section>
        )}
      </Container>
    </main>
  );
}
