import propertiesJson from "@/data/properties.json";
import { propertyCollectionSchema } from "@/schemas/property";

// Catálogo demonstrativo. Fixtures de teste ficam isoladas em tests/fixtures.
export const propertiesData = propertyCollectionSchema.parse(propertiesJson);
