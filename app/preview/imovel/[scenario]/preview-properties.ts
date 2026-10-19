import { getSimilarPropertiesFrom } from "@/lib/properties/queries";
import { propertyCollectionSchema } from "@/schemas/property";
import type { Property } from "@/types/property";

const previewProperties = propertyCollectionSchema.parse([
  {
    id: "MC-901",
    slug: "preview-apartamento-venda",
    title: "Apartamento amplo com varanda em região central",
    summary: "Cenário isolado para validar a página de um apartamento à venda.",
    description:
      "Esta descrição existe apenas no ambiente de preview para verificar a leitura de parágrafos e o ritmo do conteúdo.\n\nO cenário reúne os campos necessários para revisar a apresentação sem publicar um imóvel fictício no catálogo.",
    purpose: "sale",
    type: "apartment",
    status: "active",
    price: { kind: "fixed", amountInCents: 72_000_000 },
    featured: false,
    bedrooms: 3,
    suites: 1,
    bathrooms: 2,
    parkingSpaces: 2,
    areaInSquareMeters: 118,
    additionalCosts: {
      condominiumFeeInCents: 64_000,
      propertyTaxInCents: 135_000,
    },
    location: {
      city: "Lagoa Santa",
      state: "MG",
      neighborhood: "Centro",
      disclosure: "approximate",
    },
    features: [
      "balcony",
      "gourmet_area",
      "elevator",
      "built_in_cabinets",
      "financing_eligible",
    ],
    images: [
      {
        src: "/images/property-placeholder/apartment-placeholder.svg",
        alt: "Imagem de demonstração do apartamento indisponível",
        isPrimary: true,
      },
      {
        src: "/images/property-placeholder/property-placeholder.svg",
        alt: "Segunda imagem de demonstração indisponível",
        isPrimary: false,
      },
      {
        src: "/images/property-placeholder/apartment-placeholder.svg",
        alt: "Terceira imagem de demonstração indisponível",
        isPrimary: false,
      },
      {
        src: "/images/property-placeholder/property-placeholder.svg",
        alt: "Quarta imagem de demonstração indisponível",
        isPrimary: false,
      },
    ],
    createdAt: "2026-08-01T12:00:00.000Z",
    updatedAt: "2026-08-01T12:00:00.000Z",
  },
  {
    id: "MC-902",
    slug: "preview-terreno-venda",
    title: "Terreno à venda em área residencial tranquila de Lagoa Santa",
    summary: "Cenário isolado para validar terreno com poucos atributos.",
    description:
      "Cenário de preview criado para verificar um imóvel sem dormitórios, suítes, banheiros ou vagas, mantendo apenas as informações que fazem sentido para um terreno.",
    purpose: "sale",
    type: "land",
    status: "active",
    price: { kind: "fixed", amountInCents: 24_000_000 },
    featured: false,
    areaInSquareMeters: 720,
    location: {
      city: "Lagoa Santa",
      state: "MG",
      neighborhood: "Região residencial",
      disclosure: "approximate",
    },
    features: ["financing_eligible"],
    images: [
      {
        src: "/images/property-placeholder/land-placeholder.svg",
        alt: "Imagem de demonstração do terreno indisponível",
        isPrimary: true,
      },
    ],
    createdAt: "2026-08-02T12:00:00.000Z",
    updatedAt: "2026-08-02T12:00:00.000Z",
  },
  {
    id: "MC-903",
    slug: "preview-valor-sob-consulta",
    title: "Imóvel residencial com valor disponível sob consulta",
    summary: "Cenário isolado para validar a apresentação de preço sob consulta.",
    description:
      "Este cenário confirma que a página apresenta valor sob consulta sem criar estimativas, parcelas ou condições comerciais inexistentes.",
    purpose: "sale",
    type: "house",
    status: "active",
    price: { kind: "on_request" },
    featured: false,
    bedrooms: 2,
    bathrooms: 1,
    areaInSquareMeters: 96,
    location: {
      city: "Lagoa Santa",
      state: "MG",
      disclosure: "approximate",
    },
    features: [],
    images: [
      {
        src: "/images/property-placeholder/house-placeholder.svg",
        alt: "Imagem de demonstração do imóvel indisponível",
        isPrimary: true,
      },
    ],
    createdAt: "2026-08-03T12:00:00.000Z",
    updatedAt: "2026-08-03T12:00:00.000Z",
  },
]);

export const PROPERTY_PREVIEW_SCENARIOS = [
  "apartamento",
  "terreno",
  "sob-consulta",
] as const;

type PreviewScenario = (typeof PROPERTY_PREVIEW_SCENARIOS)[number];

const scenarioPropertyIds = {
  apartamento: "MC-901",
  terreno: "MC-902",
  "sob-consulta": "MC-903",
} satisfies Record<PreviewScenario, string>;

export function getPreviewProperty(scenario: string): Property | undefined {
  if (!PROPERTY_PREVIEW_SCENARIOS.includes(scenario as PreviewScenario)) {
    return undefined;
  }

  const id = scenarioPropertyIds[scenario as PreviewScenario];

  return previewProperties.find((property) => property.id === id);
}

export function getPreviewSimilarProperties(
  property: Property,
): readonly Property[] {
  return getSimilarPropertiesFrom(previewProperties, property, 3);
}
