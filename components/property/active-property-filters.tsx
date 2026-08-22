import Link from "next/link";

import {
  buildPropertyCatalogUrl,
  formatCurrency,
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
  type PropertyCatalogSearch,
} from "@/lib/properties";

type ActivePropertyFiltersProps = Readonly<{
  search: PropertyCatalogSearch;
}>;

type FilterKey = "purpose" | "type" | "location" | "maxPrice" | "bedrooms";

export function ActivePropertyFilters({ search }: ActivePropertyFiltersProps) {
  const filters: { key: FilterKey; label: string }[] = [];

  if (search.purpose) {
    filters.push({
      key: "purpose",
      label: PROPERTY_PURPOSE_LABELS[search.purpose],
    });
  }
  if (search.type) {
    filters.push({ key: "type", label: PROPERTY_TYPE_LABELS[search.type] });
  }
  if (search.location) {
    filters.push({ key: "location", label: search.location });
  }
  if (search.maxPrice) {
    const price = formatCurrency(Number(search.maxPrice) * 100).replace(/,00$/, "");
    filters.push({ key: "maxPrice", label: `Até ${price}` });
  }
  if (search.bedrooms) {
    filters.push({
      key: "bedrooms",
      label: `${search.bedrooms}+ ${search.bedrooms === "1" ? "quarto" : "quartos"}`,
    });
  }

  if (filters.length === 0) return null;

  return (
    <div aria-label="Filtros ativos" className="mt-6 flex flex-wrap items-center gap-2.5">
      <span className="mr-1 text-sm font-semibold text-foreground">Filtros ativos:</span>
      {filters.map((filter) => (
        <Link
          aria-label={`Remover filtro ${filter.label}`}
          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border-strong bg-surface px-3.5 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-accent hover:text-accent-foreground"
          href={buildPropertyCatalogUrl({ ...search, [filter.key]: "" })}
          key={filter.key}
          scroll={false}
        >
          {filter.label}
          <span aria-hidden="true" className="text-base leading-none">×</span>
        </Link>
      ))}
      <Link
        className="inline-flex min-h-9 items-center px-2 text-sm font-semibold text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:text-primary-hover"
        href="/imoveis"
        scroll={false}
      >
        Limpar filtros
      </Link>
    </div>
  );
}
