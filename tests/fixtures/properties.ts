import type { PropertyInput } from "../../schemas/property";

export const validSaleProperty = {
  id: "MC-001",
  slug: "casa-3-quartos-centro-mc-001",
  title: "Casa com três quartos no Centro",
  summary: "Casa espaçosa com quintal em localização central.",
  description:
    "Casa bem localizada, com ambientes amplos e estrutura adequada para toda a família.",
  purpose: "sale",
  type: "house",
  status: "active",
  price: { kind: "fixed", amountInCents: 65_000_000 },
  featured: true,
  bedrooms: 3,
  suites: 1,
  bathrooms: 2,
  parkingSpaces: 2,
  areaInSquareMeters: 180,
  additionalCosts: { propertyTaxInCents: 120_000 },
  location: {
    city: "Pedro Leopoldo",
    state: "MG",
    neighborhood: "Centro",
    address: {
      street: "Rua de Teste",
      number: "100",
      postalCode: "33600-000",
    },
    disclosure: "exact",
  },
  features: ["backyard", "financing_eligible"],
  images: [
    {
      src: "/fixtures/mc-001/main.jpg",
      alt: "Fachada da casa de teste",
      isPrimary: true,
    },
  ],
  createdAt: "2026-01-10T10:00:00.000Z",
  updatedAt: "2026-02-15T12:00:00.000Z",
} satisfies PropertyInput;

export const validRentalProperty = {
  ...validSaleProperty,
  id: "MC-002",
  slug: "apartamento-2-quartos-centro-mc-002",
  title: "Apartamento com dois quartos no Centro",
  summary: "Apartamento de teste próximo aos serviços do Centro.",
  purpose: "rent",
  type: "apartment",
  price: { kind: "fixed", amountInCents: 250_000 },
  bedrooms: 2,
  suites: 0,
  parkingSpaces: 1,
  additionalCosts: {
    condominiumFeeInCents: 35_000,
    propertyTaxInCents: 8_000,
  },
  images: [
    {
      src: "/fixtures/mc-002/main.jpg",
      alt: "Sala do apartamento de teste",
      isPrimary: true,
    },
  ],
} satisfies PropertyInput;

export const inactiveSaleProperty = {
  ...validSaleProperty,
  id: "MC-003",
  slug: "casa-inativa-centro-mc-003",
  title: "Casa inativa no Centro",
  status: "inactive",
  featured: true,
  images: [
    {
      src: "/fixtures/mc-003/main.jpg",
      alt: "Fachada da casa inativa de teste",
      isPrimary: true,
    },
  ],
} satisfies PropertyInput;

export const similarSaleProperty = {
  ...validSaleProperty,
  id: "MC-004",
  slug: "casa-2-quartos-centro-mc-004",
  title: "Casa com dois quartos no Centro",
  summary: "Casa de teste com perfil semelhante no mesmo bairro.",
  price: { kind: "fixed", amountInCents: 60_000_000 },
  bedrooms: 2,
  suites: 0,
  featured: false,
  images: [
    {
      src: "/fixtures/mc-004/main.jpg",
      alt: "Fachada da casa semelhante de teste",
      isPrimary: true,
    },
  ],
} satisfies PropertyInput;

export const onRequestSaleProperty = {
  ...validSaleProperty,
  id: "MC-005",
  slug: "casa-4-quartos-lagoa-mc-005",
  title: "Casa com quatro quartos na Lagoa",
  summary: "Casa ampla de teste com valor disponível sob consulta.",
  price: { kind: "on_request" },
  bedrooms: 4,
  suites: 2,
  featured: false,
  location: {
    city: "Pedro Leopoldo",
    state: "MG",
    neighborhood: "Lagoa de Santo Antônio",
    disclosure: "approximate",
  },
  images: [
    {
      src: "/fixtures/mc-005/main.jpg",
      alt: "Fachada da casa com valor sob consulta",
      isPrimary: true,
    },
  ],
  createdAt: "2026-03-01T10:00:00.000Z",
  updatedAt: "2026-03-02T10:00:00.000Z",
} satisfies PropertyInput;
