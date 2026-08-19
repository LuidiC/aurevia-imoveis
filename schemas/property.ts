import { z } from "zod";

const propertyPhotoSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

const propertyAddressSchema = z.object({
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
});

export const propertySchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  purpose: z.enum(["venda", "locacao"]),
  type: z.enum([
    "apartamento",
    "casa",
    "comercial",
    "lote",
    "rural",
  ]),
  status: z.enum(["disponivel", "reservado", "indisponivel"]),
  priceInCents: z.number().int().nonnegative(),
  featured: z.boolean(),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  parkingSpaces: z.number().int().nonnegative().optional(),
  areaInSquareMeters: z.number().positive().optional(),
  address: propertyAddressSchema,
  photos: z.array(propertyPhotoSchema).min(1),
});

export const propertyCollectionSchema = z.array(propertySchema);

export type PropertyInput = z.input<typeof propertySchema>;
