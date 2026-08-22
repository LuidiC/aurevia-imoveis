import { z } from "zod";

import {
  LOCATION_DISCLOSURES,
  PROPERTY_FEATURES,
  PROPERTY_ID_PATTERN,
  PROPERTY_PURPOSES,
  PROPERTY_SLUG_PATTERN,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
} from "@/lib/properties/constants";

const moneyInCentsSchema = z
  .number()
  .int()
  .positive()
  .max(Number.MAX_SAFE_INTEGER);

const fixedPriceSchema = z.strictObject({
  kind: z.literal("fixed"),
  amountInCents: moneyInCentsSchema,
});

const onRequestPriceSchema = z.strictObject({
  kind: z.literal("on_request"),
});

const propertyImageSchema = z.strictObject({
  src: z.string().trim().min(1).max(500),
  alt: z.string().trim().min(1).max(180),
  isPrimary: z.boolean(),
});

const propertyImagesSchema = z
  .array(propertyImageSchema)
  .min(1)
  .superRefine((images, context) => {
    const primaryImageCount = images.filter((image) => image.isPrimary).length;

    if (primaryImageCount !== 1) {
      context.addIssue({
        code: "custom",
        message: "A property must have exactly one primary image.",
      });
    }
  });

const propertyAddressSchema = z.strictObject({
  street: z.string().trim().min(1).max(160),
  number: z.string().trim().min(1).max(20).optional(),
  complement: z.string().trim().min(1).max(100).optional(),
  postalCode: z.string().regex(/^\d{5}-\d{3}$/).optional(),
});

const coordinatesSchema = z.strictObject({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const propertyLocationSchema = z
  .strictObject({
    city: z.string().trim().min(1).max(100),
    state: z.string().regex(/^[A-Z]{2}$/),
    neighborhood: z.string().trim().min(1).max(100).optional(),
    address: propertyAddressSchema.optional(),
    coordinates: coordinatesSchema.optional(),
    disclosure: z.enum(LOCATION_DISCLOSURES),
  })
  .superRefine((location, context) => {
    if (
      location.disclosure === "approximate" &&
      (location.address !== undefined || location.coordinates !== undefined)
    ) {
      context.addIssue({
        code: "custom",
        message:
          "An approximate location must not store an exact address or geographic coordinates.",
        path: ["disclosure"],
      });
    }

    if (
      location.disclosure === "exact" &&
      !location.address &&
      !location.coordinates
    ) {
      context.addIssue({
        code: "custom",
        message:
          "An exact location requires an address or geographic coordinates.",
        path: ["disclosure"],
      });
    }
  });

const additionalCostsSchema = z.strictObject({
  condominiumFeeInCents: moneyInCentsSchema.optional(),
  propertyTaxInCents: moneyInCentsSchema.optional(),
});

const propertyBaseSchema = z.strictObject({
  id: z.string().regex(PROPERTY_ID_PATTERN),
  slug: z.string().regex(PROPERTY_SLUG_PATTERN).max(180),
  title: z.string().trim().min(5).max(120),
  summary: z.string().trim().min(10).max(180),
  description: z.string().trim().min(20).max(5_000),
  type: z.enum(PROPERTY_TYPES),
  status: z.enum(PROPERTY_STATUSES),
  featured: z.boolean(),
  bedrooms: z.number().int().nonnegative().optional(),
  suites: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  parkingSpaces: z.number().int().nonnegative().optional(),
  areaInSquareMeters: z.number().positive().optional(),
  additionalCosts: additionalCostsSchema.optional(),
  location: propertyLocationSchema,
  features: z
    .array(z.enum(PROPERTY_FEATURES))
    .refine((features) => new Set(features).size === features.length, {
      message: "Property features must not contain duplicates.",
    }),
  images: propertyImagesSchema,
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

const salePropertySchema = propertyBaseSchema.extend({
  purpose: z.literal(PROPERTY_PURPOSES[0]),
  price: z.discriminatedUnion("kind", [
    fixedPriceSchema,
    onRequestPriceSchema,
  ]),
});

const rentalPropertySchema = propertyBaseSchema.extend({
  purpose: z.literal(PROPERTY_PURPOSES[1]),
  price: fixedPriceSchema,
});

export const propertySchema = z
  .discriminatedUnion("purpose", [salePropertySchema, rentalPropertySchema])
  .superRefine((property, context) => {
    if (property.suites !== undefined) {
      if (property.bedrooms === undefined || property.suites > property.bedrooms) {
        context.addIssue({
          code: "custom",
          message: "Suites cannot exceed the total number of bedrooms.",
          path: ["suites"],
        });
      }
    }

    if (Date.parse(property.updatedAt) < Date.parse(property.createdAt)) {
      context.addIssue({
        code: "custom",
        message: "updatedAt cannot be earlier than createdAt.",
        path: ["updatedAt"],
      });
    }
  });

export const propertyCollectionSchema = z
  .array(propertySchema)
  .superRefine((properties, context) => {
    const ids = new Set<string>();
    const slugs = new Set<string>();

    properties.forEach((property, index) => {
      if (ids.has(property.id)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate property ID: ${property.id}.`,
          path: [index, "id"],
        });
      }

      if (slugs.has(property.slug)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate property slug: ${property.slug}.`,
          path: [index, "slug"],
        });
      }

      ids.add(property.id);
      slugs.add(property.slug);
    });
  });

export type PropertyInput = z.input<typeof propertySchema>;
