import { stdout } from "node:process";

import {
  LOCATION_DISCLOSURES,
  PROPERTY_FEATURES,
  PROPERTY_PURPOSES,
  PROPERTY_SLUG_PATTERN,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
} from "../../lib/properties/constants";
import {
  PROPERTY_FEATURE_LABELS,
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "../../lib/properties/labels";
import {
  getPropertyMetaItems,
  getPropertyPriceLabel,
} from "../../lib/properties/presentation";
import { formatCurrency } from "../../lib/properties/currency";
import { propertySchema } from "../../schemas/property";
import type {
  Property,
  PropertyFeature,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
} from "../../types/property";

import {
  finalizeEditedProperty,
  generateNextPropertyId,
  generatePropertySlug,
  parseBrlToCents,
  parseOptionalNonNegativeInteger,
  parseOptionalPositiveDecimal,
} from "./domain";
import { Prompts } from "./prompts";
import {
  loadCatalog,
  normalizeImageSource,
  validatePropertyImages,
  writeCatalogSafely,
} from "./storage";

export type CommandContext = Readonly<{
  dataFile: string;
  publicDirectory: string;
}>;

const purposeChoices = PROPERTY_PURPOSES.map((value) => ({
  value,
  label: PROPERTY_PURPOSE_LABELS[value],
}));
const typeChoices = PROPERTY_TYPES.map((value) => ({
  value,
  label: PROPERTY_TYPE_LABELS[value],
}));
const statusChoices = PROPERTY_STATUSES.map((value) => ({
  value,
  label: value === "active" ? "Ativo" : "Inativo",
}));
const featureChoices = PROPERTY_FEATURES.map((value) => ({
  value,
  label: PROPERTY_FEATURE_LABELS[value],
}));

export async function listProperties(
  context: CommandContext,
  status?: PropertyStatus,
): Promise<void> {
  const properties = (await loadCatalog(context.dataFile)).filter(
    (property) => status === undefined || property.status === status,
  );

  if (properties.length === 0) {
    stdout.write("Nenhum imóvel encontrado.\n");
    return;
  }

  const rows = properties.map((property) => ({
    ID: property.id,
    Status: property.status === "active" ? "ativo" : "inativo",
    Finalidade: PROPERTY_PURPOSE_LABELS[property.purpose],
    Tipo: PROPERTY_TYPE_LABELS[property.type],
    Título: truncate(property.title, 42),
    Preço: getPropertyPriceLabel(property),
    Local: truncate(
      [property.location.city, property.location.neighborhood]
        .filter(Boolean)
        .join(" / "),
      32,
    ),
    Destaque: property.featured ? "sim" : "não",
  }));

  console.table(rows);
}

export async function addProperty(context: CommandContext): Promise<void> {
  const properties = await loadCatalog(context.dataFile);
  const id = generateNextPropertyId(properties.map((property) => property.id));
  const prompts = new Prompts();

  try {
    stdout.write(`Próximo ID reservado: ${id}\n`);
    const property = await collectProperty(prompts, context, id);
    ensureUniqueSlug(properties, property.slug);
    await ensureImagesAreValid([property], context.publicDirectory);
    printPropertySummary(property);

    if (!(await prompts.confirm("Salvar novo imóvel?"))) {
      stdout.write("Operação cancelada; nenhum arquivo foi alterado.\n");
      return;
    }

    await writeCatalogSafely(context.dataFile, [...properties, property]);
    stdout.write(`Imóvel ${property.id} salvo com sucesso.\n`);
  } finally {
    prompts.close();
  }
}

export async function editProperty(
  context: CommandContext,
  requestedId?: string,
): Promise<void> {
  const properties = await loadCatalog(context.dataFile);
  const prompts = new Prompts();

  try {
    const current = await selectProperty(prompts, properties, requestedId);
    const candidate = await collectProperty(prompts, context, current.id, current);
    const updated = finalizeEditedProperty(current, candidate, new Date().toISOString());
    ensureUniqueSlug(properties, updated.slug, current.id);
    await ensureImagesAreValid([updated], context.publicDirectory);
    printPropertySummary(updated);

    if (!(await prompts.confirm("Salvar alterações?"))) {
      stdout.write("Operação cancelada; nenhum arquivo foi alterado.\n");
      return;
    }

    await writeCatalogSafely(
      context.dataFile,
      properties.map((property) => property.id === current.id ? updated : property),
    );
    stdout.write(`Imóvel ${updated.id} atualizado com sucesso.\n`);
  } finally {
    prompts.close();
  }
}

export async function setPropertyStatus(
  context: CommandContext,
  targetStatus: PropertyStatus,
  requestedId?: string,
): Promise<void> {
  const properties = await loadCatalog(context.dataFile);
  const candidates = properties.filter((property) => property.status !== targetStatus);
  const prompts = new Prompts();

  try {
    if (candidates.length === 0) {
      stdout.write(
        targetStatus === "inactive"
          ? "Não há imóveis ativos para desativar.\n"
          : "Não há imóveis inativos para reativar.\n",
      );
      return;
    }

    const current = await selectProperty(prompts, candidates, requestedId);
    printPropertySummary(current);
    const action = targetStatus === "inactive" ? "Desativar" : "Reativar";
    if (!(await prompts.confirm(`${action} este imóvel?`))) {
      stdout.write("Operação cancelada; nenhum arquivo foi alterado.\n");
      return;
    }

    const updated = propertySchema.parse({
      ...current,
      status: targetStatus,
      updatedAt: new Date().toISOString(),
    });
    await writeCatalogSafely(
      context.dataFile,
      properties.map((property) => property.id === current.id ? updated : property),
    );
    stdout.write(
      targetStatus === "inactive"
        ? `${current.id} foi desativado e não aparecerá no catálogo público.\n`
        : `${current.id} foi reativado.\n`,
    );
  } finally {
    prompts.close();
  }
}

export async function validateCatalog(context: CommandContext): Promise<void> {
  const properties = await loadCatalog(context.dataFile);
  await ensureImagesAreValid(properties, context.publicDirectory);
  stdout.write(`Catálogo válido: ${properties.length} imóvel(is).\n`);
}

async function collectProperty(
  prompts: Prompts,
  context: CommandContext,
  id: string,
  current?: Property,
): Promise<Property> {
  prompts.section("A. IDENTIFICAÇÃO");
  const title = await requiredText(prompts, "Título", current?.title, 5, 120);
  const summary = await requiredText(prompts, "Resumo", current?.summary, 10, 180);
  const description = await requiredText(
    prompts,
    "Descrição",
    current?.description,
    20,
    5_000,
  );

  let slug = current?.slug ?? generatePropertySlug(title, id);
  if (!current) {
    slug = await requiredText(
      prompts,
      "Slug",
      slug,
      1,
      180,
      undefined,
      validateSlug,
    );
  } else {
    const titleChanged = title !== current.title;
    const alterSlug = await prompts.confirm(
      titleChanged
        ? "O título mudou. Deseja gerar um novo slug? Isso altera a URL e pode afetar SEO/links"
        : "Deseja alterar o slug? Isso altera a URL e pode afetar SEO/links",
    );
    if (alterSlug) {
      slug = await requiredText(
        prompts,
        "Novo slug",
        titleChanged ? generatePropertySlug(title, id) : current.slug,
        1,
        180,
        undefined,
        validateSlug,
      );
    }
  }

  prompts.section("B. NEGÓCIO");
  const purpose = await prompts.choose<PropertyPurpose>(
    "Finalidade",
    purposeChoices,
    current?.purpose,
  );
  const type = await prompts.choose<PropertyType>("Tipo", typeChoices, current?.type);

  prompts.section("C. PREÇO");
  const currentPriceKind = current?.purpose === purpose ? current.price.kind : undefined;
  const priceKind = purpose === "rent"
    ? "fixed"
    : await prompts.choose(
        "Preço",
        [
          { value: "fixed", label: "Valor fixo" },
          { value: "on_request", label: "Sob consulta" },
        ] as const,
        currentPriceKind,
      );
  const amountInCents = priceKind === "fixed"
    ? await prompts.parsed(
        purpose === "rent" ? "Valor mensal" : "Valor de venda",
        parseBrlToCents,
        {
          current: current?.price.kind === "fixed"
            ? current.price.amountInCents
            : undefined,
          formatCurrent: formatCurrency,
        },
      )
    : undefined;
  const price = priceKind === "fixed"
    ? { kind: "fixed" as const, amountInCents: requireDefined(amountInCents) }
    : { kind: "on_request" as const };

  prompts.section("D. CUSTOS (vazio = não informado)");
  const condominiumFeeInCents = await prompts.parsed(
    "Condomínio",
    parseBrlToCents,
    {
      current: current?.additionalCosts?.condominiumFeeInCents,
      optional: true,
      formatCurrent: formatCurrency,
    },
  );
  const propertyTaxInCents = await prompts.parsed("IPTU", parseBrlToCents, {
    current: current?.additionalCosts?.propertyTaxInCents,
    optional: true,
    formatCurrent: formatCurrency,
  });
  const additionalCosts = condominiumFeeInCents || propertyTaxInCents
    ? { condominiumFeeInCents, propertyTaxInCents }
    : undefined;

  prompts.section("E. CARACTERÍSTICAS (vazio = não informado)");
  stdout.write("Em terrenos, deixe atributos residenciais vazios.\n");
  const bedrooms = await optionalInteger(prompts, "Quartos", current?.bedrooms);
  const suites = await optionalInteger(prompts, "Suítes", current?.suites);
  const bathrooms = await optionalInteger(prompts, "Banheiros", current?.bathrooms);
  const parkingSpaces = await optionalInteger(prompts, "Vagas", current?.parkingSpaces);
  const areaInSquareMeters = await prompts.parsed(
    "Área em m²",
    (value) => requireDefined(parseOptionalPositiveDecimal(value)),
    { current: current?.areaInSquareMeters, optional: true },
  );

  prompts.section("F. LOCALIZAÇÃO");
  const disclosure = await prompts.choose(
    "Política de divulgação da localização",
    LOCATION_DISCLOSURES.map((value) => ({
      value,
      label: value === "exact" ? "Exata" : "Aproximada",
    })),
    current?.location.disclosure ?? "approximate",
  );
  const city = await requiredText(prompts, "Cidade", current?.location.city, 1, 100);
  const state = await requiredText(
    prompts,
    "UF",
    current?.location.state ?? "MG",
    2,
    2,
    (value) => value.toUpperCase(),
    (value) => /^[A-Z]{2}$/.test(value) ? undefined : "Use uma UF com duas letras.",
  );
  const neighborhood = await optionalText(
    prompts,
    "Bairro",
    current?.location.neighborhood,
    100,
  );
  let address: Property["location"]["address"];
  let coordinates: Property["location"]["coordinates"];

  if (disclosure === "exact") {
    stdout.write(
      "A localização exata exige endereço, coordenadas ou ambos.\n",
    );
    const street = await optionalText(
      prompts,
      "Logradouro",
      current?.location.address?.street,
      160,
    );
    address = street
      ? {
          street,
          number: await optionalText(
            prompts,
            "Número",
            current?.location.address?.number,
            20,
          ),
          complement: await optionalText(
            prompts,
            "Complemento",
            current?.location.address?.complement,
            100,
          ),
          postalCode: await prompts.text("CEP (00000-000)", {
            current: current?.location.address?.postalCode,
            optional: true,
            validate: (value) => /^\d{5}-\d{3}$/.test(value)
              ? undefined
              : "Use o formato 00000-000.",
          }),
        }
      : undefined;
    const latitude = await prompts.parsed("Latitude", parseCoordinate(-90, 90), {
      current: current?.location.coordinates?.latitude,
      optional: true,
    });
    const longitude = await prompts.parsed("Longitude", parseCoordinate(-180, 180), {
      current: current?.location.coordinates?.longitude,
      optional: true,
    });
    if ((latitude === undefined) !== (longitude === undefined)) {
      throw new Error("Latitude e longitude devem ser informadas juntas.");
    }
    coordinates = latitude === undefined || longitude === undefined
      ? undefined
      : { latitude, longitude };
  } else {
    stdout.write(
      "Localização aproximada: apenas bairro, cidade e UF serão armazenados.\n",
    );
  }

  prompts.section("G. CARACTERÍSTICAS CONTROLADAS");
  const features = await prompts.multiChoose<PropertyFeature>(
    "Features",
    featureChoices,
    current?.features,
  );

  prompts.section("H. IMAGENS");
  stdout.write(
    `Convenção: public/images/properties/${id}/. Você pode informar só o nome do arquivo.\n`,
  );
  let images = current?.images;
  if (!current || await prompts.confirm("Deseja substituir o conjunto de imagens?")) {
    const primarySourceInput = await requiredText(prompts, "Imagem principal", undefined, 1, 500);
    const primaryAlt = await requiredText(prompts, "Alt text da principal", undefined, 1, 180);
    const collectedImages: Property["images"][number][] = [{
      src: normalizeImageSource(primarySourceInput, id, context.publicDirectory),
      alt: primaryAlt,
      isPrimary: true,
    }];

    while (await prompts.confirm("Adicionar outra imagem?")) {
      const sourceInput = await requiredText(prompts, "Imagem", undefined, 1, 500);
      const alt = await requiredText(prompts, "Alt text", undefined, 1, 180);
      collectedImages.push({
        src: normalizeImageSource(sourceInput, id, context.publicDirectory),
        alt,
        isPrimary: false,
      });
    }
    images = collectedImages;
  }

  prompts.section("I. DESTAQUE");
  const featured = await prompts.choose(
    "Imóvel em destaque",
    [
      { value: "yes", label: "Sim" },
      { value: "no", label: "Não" },
    ] as const,
    current?.featured ? "yes" : current ? "no" : undefined,
  ) === "yes";

  prompts.section("J. STATUS");
  const status = await prompts.choose<PropertyStatus>(
    "Status",
    statusChoices,
    current?.status ?? "active",
  );
  const now = new Date().toISOString();

  return propertySchema.parse({
    id,
    slug,
    title,
    summary,
    description,
    purpose,
    type,
    status,
    price,
    featured,
    bedrooms,
    suites,
    bathrooms,
    parkingSpaces,
    areaInSquareMeters,
    additionalCosts,
    location: {
      city,
      state,
      neighborhood,
      address,
      coordinates,
      disclosure,
    },
    features,
    images: requireDefined(images),
    createdAt: current?.createdAt ?? now,
    updatedAt: current?.updatedAt ?? now,
  });
}

async function selectProperty(
  prompts: Prompts,
  properties: readonly Property[],
  requestedId?: string,
): Promise<Property> {
  if (requestedId) {
    const property = properties.find(
      (candidate) => candidate.id.toLowerCase() === requestedId.toLowerCase(),
    );
    if (!property) throw new Error(`Imóvel ${requestedId} não encontrado.`);
    return property;
  }

  stdout.write("\nImóveis disponíveis:\n");
  properties.forEach((property, index) => {
    stdout.write(`  ${index + 1}. ${property.id} — ${property.title}\n`);
  });
  const selected = await prompts.parsed(
    "Número do imóvel",
    (value) => {
      const index = Number(value) - 1;
      if (!Number.isInteger(index) || !properties[index]) {
        throw new Error("Escolha um número da lista.");
      }
      return properties[index];
    },
  );
  return requireDefined(selected);
}

function printPropertySummary(property: Property): void {
  const meta = getPropertyMetaItems(property).map((item) => item.label).join(" | ");
  stdout.write(
    [
      "\n--------------------------------",
      property.id,
      property.title,
      PROPERTY_PURPOSE_LABELS[property.purpose],
      getPropertyPriceLabel(property),
      `${property.location.neighborhood ? `${property.location.neighborhood} — ` : ""}${property.location.city}/${property.location.state}`,
      meta || "Características principais não informadas",
      `${property.images.length} imagem(ns)`,
      `Status: ${property.status === "active" ? "ativo" : "inativo"}`,
      `Slug: ${property.slug}`,
      "--------------------------------\n",
    ].join("\n"),
  );
}

async function ensureImagesAreValid(
  properties: readonly Property[],
  publicDirectory: string,
): Promise<void> {
  const issues = await validatePropertyImages(properties, publicDirectory);
  if (issues.length === 0) return;

  throw new Error(
    `Imagens inválidas:\n${issues
      .map((issue) => `${issue.propertyId} ${issue.src}: ${issue.message}`)
      .join("\n")}`,
  );
}

function ensureUniqueSlug(
  properties: readonly Property[],
  slug: string,
  ignoredId?: string,
): void {
  if (properties.some((property) => property.id !== ignoredId && property.slug === slug)) {
    throw new Error(`O slug ${slug} já está em uso.`);
  }
}

function parseCoordinate(min: number, max: number): (value: string) => number {
  return (value) => {
    const parsed = Number(value.trim().replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
      throw new Error(`Informe um número entre ${min} e ${max}.`);
    }
    return parsed;
  };
}

async function optionalInteger(
  prompts: Prompts,
  label: string,
  current?: number,
): Promise<number | undefined> {
  return prompts.parsed(
    label,
    (value) => requireDefined(parseOptionalNonNegativeInteger(value)),
    { current, optional: true },
  );
}

async function requiredText(
  prompts: Prompts,
  label: string,
  current: string | undefined,
  minLength: number,
  maxLength: number,
  transform?: (value: string) => string,
  validate?: (value: string) => string | undefined,
): Promise<string> {
  return requireDefined(await prompts.text(label, {
    current,
    minLength,
    maxLength,
    transform,
    validate,
  }));
}

async function optionalText(
  prompts: Prompts,
  label: string,
  current: string | undefined,
  maxLength: number,
): Promise<string | undefined> {
  return prompts.text(label, { current, optional: true, maxLength });
}

function requireDefined<T>(value: T | undefined): T {
  if (value === undefined) throw new Error("Valor obrigatório ausente.");
  return value;
}

function truncate(value: string, maximumLength: number): string {
  return value.length <= maximumLength
    ? value
    : `${value.slice(0, maximumLength - 1)}…`;
}

function validateSlug(value: string): string | undefined {
  return PROPERTY_SLUG_PATTERN.test(value)
    ? undefined
    : "Use apenas letras minúsculas, números e hífens simples.";
}
