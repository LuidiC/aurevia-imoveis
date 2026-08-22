"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  buildPropertySearchUrl,
  CATALOG_PROPERTY_TYPES,
  PROPERTY_PRICE_OPTIONS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/properties";
import type { PropertyPurpose, PropertyType } from "@/types/property";

const propertyTypes = [
  { value: "", label: "Todos" },
  ...CATALOG_PROPERTY_TYPES.map((value) => ({
    value,
    label: PROPERTY_TYPE_LABELS[value],
  })),
] as const satisfies readonly {
  value: PropertyType | "";
  label: string;
}[];

export function PropertySearch() {
  const router = useRouter();
  const [purpose, setPurpose] = useState<PropertyPurpose>("sale");
  const [maxPrice, setMaxPrice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const type = formData.get("type");
    const location = formData.get("location");

    router.push(
      buildPropertySearchUrl({
        purpose,
        type: typeof type === "string" ? (type as PropertyType | "") : "",
        location: typeof location === "string" ? location : "",
        maxPrice,
      }),
    );
  }

  return (
    <form
      action="/imoveis"
      className="rounded-lg border border-border bg-surface p-5 text-foreground shadow-soft sm:p-6 lg:p-7"
      method="get"
      onSubmit={handleSubmit}
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold tracking-[-0.015em]">
          Busque seu imóvel
        </h2>
        <p className="text-small text-muted-foreground">
          Escolha o essencial para começar
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[0.85fr_1fr_1.25fr_1fr_auto] xl:items-end">
        <Field htmlFor="property-search-purpose" label="Finalidade">
          <Select
            id="property-search-purpose"
            name="purpose"
            onChange={(event) => {
              setPurpose(event.target.value === "rent" ? "rent" : "sale");
              setMaxPrice("");
            }}
            value={purpose}
          >
            <option value="sale">Comprar</option>
            <option value="rent">Alugar</option>
          </Select>
        </Field>

        <Field htmlFor="property-search-type" label="Tipo de imóvel">
          <Select defaultValue="" id="property-search-type" name="type">
            {propertyTypes.map((type) => (
              <option key={type.value || "all"} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field htmlFor="property-search-location" label="Localização">
          <Input
            autoComplete="address-level2"
            id="property-search-location"
            name="location"
            placeholder="Bairro ou cidade"
          />
        </Field>

        <Field htmlFor="property-search-price" label="Faixa de preço">
          <Select
            id="property-search-price"
            name="maxPrice"
            onChange={(event) => setMaxPrice(event.target.value)}
            value={maxPrice}
          >
            {PROPERTY_PRICE_OPTIONS[purpose].map((option) => (
              <option key={option.value || "any"} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>

        <Button className="w-full whitespace-nowrap sm:col-span-2 xl:col-span-1 xl:w-auto" type="submit">
          Buscar imóveis
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 20 20">
            <path d="m7.5 4.5 5.5 5.5-5.5 5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
          </svg>
        </Button>
      </div>
    </form>
  );
}
