import type { Property } from "@/types/property";

const sharedPropertyData: Pick<
  Property,
  | "status"
  | "featured"
  | "summary"
  | "description"
  | "features"
  | "createdAt"
  | "updatedAt"
> = {
  status: "active",
  featured: false,
  summary: "Imóvel fictício criado exclusivamente para a vitrine de componentes.",
  description:
    "Este registro é apenas uma demonstração visual isolada e não integra o catálogo público de imóveis.",
  features: [],
  createdAt: "2026-08-01T12:00:00.000Z",
  updatedAt: "2026-08-01T12:00:00.000Z",
};

export const propertyCardPreviewProperties = [
  {
    ...sharedPropertyData,
    id: "MC-901",
    slug: "preview-apartamento-centro-mc-901",
    title: "Apartamento com 3 quartos no Centro",
    purpose: "sale",
    type: "apartment",
    price: { kind: "fixed", amountInCents: 65_000_000 },
    bedrooms: 3,
    suites: 1,
    bathrooms: 2,
    parkingSpaces: 2,
    areaInSquareMeters: 110,
    location: {
      city: "Pedro Leopoldo",
      state: "MG",
      neighborhood: "Centro",
      disclosure: "approximate",
    },
    images: [
      {
        src: "/images/property-placeholder/apartment-placeholder.svg",
        alt: "Ilustração neutra de um apartamento fictício",
        isPrimary: true,
      },
    ],
  },
  {
    ...sharedPropertyData,
    id: "MC-902",
    slug: "preview-casa-aluguel-mc-902",
    title: "Casa acolhedora próxima à Lagoa de Santo Antônio",
    purpose: "rent",
    type: "house",
    price: { kind: "fixed", amountInCents: 250_000 },
    bedrooms: 2,
    bathrooms: 1,
    parkingSpaces: 1,
    areaInSquareMeters: 84,
    location: {
      city: "Pedro Leopoldo",
      state: "MG",
      neighborhood: "Lagoa de Santo Antônio",
      disclosure: "approximate",
    },
    images: [
      {
        src: "/images/property-placeholder/house-placeholder.svg",
        alt: "Ilustração neutra de uma casa fictícia",
        isPrimary: true,
      },
    ],
  },
  {
    ...sharedPropertyData,
    id: "MC-903",
    slug: "preview-comercial-consulta-mc-903",
    title: "Espaço comercial versátil em região central",
    purpose: "sale",
    type: "commercial",
    price: { kind: "on_request" },
    bathrooms: 2,
    parkingSpaces: 3,
    areaInSquareMeters: 180,
    location: {
      city: "Pedro Leopoldo",
      state: "MG",
      neighborhood: "Centro",
      disclosure: "approximate",
    },
    images: [
      {
        src: "/images/property-placeholder/commercial-placeholder.svg",
        alt: "Ilustração neutra de um imóvel comercial fictício",
        isPrimary: true,
      },
    ],
  },
  {
    ...sharedPropertyData,
    id: "MC-904",
    slug: "preview-terreno-mc-904",
    title: "Terreno com boa topografia e acesso facilitado",
    purpose: "sale",
    type: "land",
    price: { kind: "fixed", amountInCents: 28_000_000 },
    areaInSquareMeters: 720,
    location: {
      city: "Matozinhos",
      state: "MG",
      disclosure: "approximate",
    },
    images: [
      {
        src: "/images/property-placeholder/land-placeholder.svg",
        alt: "Ilustração neutra de um terreno fictício",
        isPrimary: true,
      },
    ],
  },
  {
    ...sharedPropertyData,
    id: "MC-905",
    slug: "preview-rural-titulo-longo-mc-905",
    title:
      "Imóvel rural com ampla área verde e acesso rápido ao centro da cidade",
    purpose: "sale",
    type: "rural",
    price: { kind: "fixed", amountInCents: 98_000_000 },
    bedrooms: 4,
    suites: 2,
    parkingSpaces: 4,
    areaInSquareMeters: 2450.5,
    location: {
      city: "Pedro Leopoldo",
      state: "MG",
      neighborhood: "Fidalgo",
      disclosure: "approximate",
    },
    images: [
      {
        src: "/images/property-placeholder/rural-placeholder.svg",
        alt: "Ilustração neutra de um imóvel rural fictício",
        isPrimary: true,
      },
    ],
  },
] satisfies readonly Property[];
