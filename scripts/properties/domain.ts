import { PROPERTY_ID_PATTERN } from "../../lib/properties/constants";
import { propertySchema, type PropertyInput } from "../../schemas/property";
import type { Property } from "../../types/property";

const BRL_PATTERN = /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,(\d{1,2}))?$/;

export function generateNextPropertyId(ids: readonly string[]): string {
  const seen = new Set<string>();
  let highest = BigInt(0);

  for (const id of ids) {
    if (!PROPERTY_ID_PATTERN.test(id)) continue;
    if (seen.has(id)) throw new Error(`ID duplicado no catálogo: ${id}.`);

    seen.add(id);
    const sequence = BigInt(id.slice(3));
    if (sequence > highest) highest = sequence;
  }

  return `MC-${String(highest + BigInt(1)).padStart(3, "0")}`;
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function generatePropertySlug(title: string, id: string): string {
  return slugify(`${title}-${id}`);
}

export function parseBrlToCents(input: string): number {
  const normalized = input
    .trim()
    .replace(/^R\$\s*/i, "")
    .replace(/[\s\u00a0]/g, "");
  const match = BRL_PATTERN.exec(normalized);

  if (!match) {
    throw new Error(
      "Use reais no formato 650000, 650.000 ou 650.000,00.",
    );
  }

  const integerPart = normalized.split(",", 1)[0].replace(/\./g, "");
  const decimalPart = (match[1] ?? "").padEnd(2, "0");
  const cents = BigInt(integerPart) * BigInt(100) + BigInt(decimalPart || "0");

  if (cents <= BigInt(0)) throw new Error("O valor deve ser maior que zero.");
  if (cents > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("O valor informado excede o limite seguro.");
  }

  return Number(cents);
}

export function parseOptionalNonNegativeInteger(
  input: string,
): number | undefined {
  const normalized = input.trim();
  if (!normalized) return undefined;
  if (!/^\d+$/.test(normalized)) {
    throw new Error("Informe um número inteiro maior ou igual a zero.");
  }

  const value = Number(normalized);
  if (!Number.isSafeInteger(value)) throw new Error("Número fora do limite seguro.");
  return value;
}

export function parseOptionalPositiveDecimal(
  input: string,
): number | undefined {
  const normalized = input.trim().replace(",", ".");
  if (!normalized) return undefined;
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    throw new Error("Informe um número positivo, por exemplo 180 ou 180,5.");
  }

  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("A área deve ser maior que zero.");
  }

  return value;
}

export function finalizeEditedProperty(
  current: Property,
  candidate: PropertyInput,
  updatedAt: string,
): Property {
  return propertySchema.parse({
    ...candidate,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt,
  });
}
