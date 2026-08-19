import type { z } from "zod";

import type { propertySchema } from "@/schemas/property";

export type Property = z.output<typeof propertySchema>;
export type PropertyPurpose = Property["purpose"];
export type PropertyType = Property["type"];
export type PropertyStatus = Property["status"];
