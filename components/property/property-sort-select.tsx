"use client";

import { useRouter } from "next/navigation";

import { Select } from "@/components/ui/select";
import {
  buildPropertyCatalogUrl,
  parsePropertySearchParams,
  type PropertyCatalogSearch,
} from "@/lib/properties";

type PropertySortSelectProps = Readonly<{
  search: PropertyCatalogSearch;
}>;

export function PropertySortSelect({ search }: PropertySortSelectProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <label className="shrink-0 text-sm font-semibold text-foreground" htmlFor="catalog-sort">
        Ordenar por
      </label>
      <Select
        className="min-h-11 w-auto min-w-44 py-2 text-sm"
        id="catalog-sort"
        onChange={(event) => {
          const nextSearch = parsePropertySearchParams({
            ...search,
            sort: event.target.value,
          });

          router.push(buildPropertyCatalogUrl(nextSearch), { scroll: false });
        }}
        value={search.sort}
      >
        <option value="">Padrão</option>
        <option value="price_asc">Menor preço</option>
        <option value="price_desc">Maior preço</option>
        <option value="newest">Mais recentes</option>
      </Select>
    </div>
  );
}
