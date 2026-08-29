"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, type FormEventHandler, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import {
  buildPropertyCatalogUrl,
  CATALOG_PROPERTY_TYPES,
  formatCurrency,
  parsePropertySearchParams,
  PROPERTY_CITY_OPTIONS,
  PROPERTY_PRICE_OPTIONS,
  PROPERTY_TYPE_LABELS,
  type PropertyCatalogSearch,
} from "@/lib/properties";
import type { PropertyPurpose } from "@/types/property";

type PropertyFiltersProps = Readonly<{
  search: PropertyCatalogSearch;
  activeFilterCount: number;
}>;

type FilterFormProps = Readonly<{
  idPrefix: string;
  search: PropertyCatalogSearch;
  purpose: PropertyPurpose | "";
  maxPrice: string;
  onPurposeChange: (purpose: PropertyPurpose | "") => void;
  onMaxPriceChange: (maxPrice: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}>;

function getFormValue(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value : "";
}

function FilterForm({
  idPrefix,
  search,
  purpose,
  maxPrice,
  onPurposeChange,
  onMaxPriceChange,
  onSubmit,
}: FilterFormProps) {
  const priceOptions = purpose ? PROPERTY_PRICE_OPTIONS[purpose] : [];
  const hasPresetPrice = priceOptions.some(
    (option) => option.value === maxPrice,
  );

  return (
    <form action="/imoveis" method="get" onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[0.85fr_1fr_1.3fr_1fr_0.75fr]">
        <Field htmlFor={`${idPrefix}-purpose`} label="Finalidade">
          <Select
            id={`${idPrefix}-purpose`}
            name="purpose"
            onChange={(event) => {
              const nextPurpose =
                event.target.value === "sale" || event.target.value === "rent"
                  ? event.target.value
                  : "";
              onPurposeChange(nextPurpose);
            }}
            value={purpose}
          >
            <option value="">Todos</option>
            <option value="sale">Comprar</option>
            <option value="rent">Alugar</option>
          </Select>
        </Field>

        <Field htmlFor={`${idPrefix}-type`} label="Tipo de imóvel">
          <Select
            defaultValue={search.type}
            id={`${idPrefix}-type`}
            name="type"
          >
            <option value="">Todos</option>
            {CATALOG_PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {PROPERTY_TYPE_LABELS[type]}
              </option>
            ))}
          </Select>
        </Field>

        <Field htmlFor={`${idPrefix}-location`} label="Localização">
          <Select
            autoComplete="address-level2"
            defaultValue={PROPERTY_CITY_OPTIONS.some(
              (city) => city.value === search.location,
            ) ? search.location : ""}
            id={`${idPrefix}-location`}
            name="location"
          >
            {PROPERTY_CITY_OPTIONS.map((city) => (
              <option key={city.value || "all"} value={city.value}>
                {city.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field htmlFor={`${idPrefix}-price`} label="Preço máximo">
          <Select
            disabled={!purpose}
            id={`${idPrefix}-price`}
            name="maxPrice"
            onChange={(event) => onMaxPriceChange(event.target.value)}
            value={maxPrice}
          >
            {purpose ? (
              <>
                {maxPrice && !hasPresetPrice ? (
                  <option value={maxPrice}>
                    Até {formatCurrency(Number(maxPrice) * 100).replace(/,00$/, "")}
                    {purpose === "rent" ? "/mês" : ""}
                  </option>
                ) : null}
                {priceOptions.map((option) => (
                  <option key={option.value || "any"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </>
            ) : (
              <option value="">Selecione compra ou aluguel</option>
            )}
          </Select>
        </Field>

        <Field htmlFor={`${idPrefix}-bedrooms`} label="Quartos">
          <Select
            defaultValue={search.bedrooms}
            id={`${idPrefix}-bedrooms`}
            name="bedrooms"
          >
            <option value="">Qualquer</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </Select>
        </Field>
      </div>

      <div className="mt-6 flex justify-end">
        <Button className="w-full sm:w-auto" type="submit">
          Aplicar filtros
        </Button>
      </div>
    </form>
  );
}

export function PropertyFilters({
  search,
  activeFilterCount,
}: PropertyFiltersProps) {
  const router = useRouter();
  const [purpose, setPurpose] = useState<PropertyPurpose | "">(search.purpose);
  const [maxPrice, setMaxPrice] = useState(search.maxPrice);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextSearch = parsePropertySearchParams({
      purpose: getFormValue(formData, "purpose"),
      type: getFormValue(formData, "type"),
      location: getFormValue(formData, "location"),
      maxPrice: getFormValue(formData, "maxPrice"),
      bedrooms: getFormValue(formData, "bedrooms"),
      sort: search.sort,
    });

    router.push(buildPropertyCatalogUrl(nextSearch), { scroll: false });
  }

  return (
    <>
      <details className="group rounded-lg border border-border bg-surface shadow-control lg:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 font-semibold text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2.5">
            <svg aria-hidden="true" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 20 20">
              <path d="M3 5h14M5.5 10h9M8 15h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
            </svg>
            Filtros
          </span>
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            {activeFilterCount > 0
              ? `${activeFilterCount} ${activeFilterCount === 1 ? "ativo" : "ativos"}`
              : "Exibir"}
            <svg aria-hidden="true" className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 20 20">
              <path d="m5.5 7.5 4.5 4.5 4.5-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </span>
        </summary>
        <div className="border-t border-border p-5">
          <FilterForm
            idPrefix="catalog-mobile"
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            onPurposeChange={(nextPurpose) => {
              setPurpose(nextPurpose);
              setMaxPrice("");
            }}
            onSubmit={handleSubmit}
            purpose={purpose}
            search={search}
          />
        </div>
      </details>

      <div className="hidden rounded-lg border border-border bg-surface p-6 shadow-control lg:block">
        <FilterForm
          idPrefix="catalog-desktop"
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          onPurposeChange={(nextPurpose) => {
            setPurpose(nextPurpose);
            setMaxPrice("");
          }}
          onSubmit={handleSubmit}
          purpose={purpose}
          search={search}
        />
      </div>
    </>
  );
}
