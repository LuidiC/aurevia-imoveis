import propertiesJson from "@/data/properties.json";
import { propertyCollectionSchema } from "@/schemas/property";

// Catálogo real. Fixtures de teste ficam isoladas em tests/fixtures.
export const propertiesData = propertyCollectionSchema.parse(propertiesJson);
