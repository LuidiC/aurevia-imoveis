import type { PropertyStatus } from "../../types/property";

import {
  addProperty,
  editProperty,
  listProperties,
  setPropertyStatus,
  validateCatalog,
  type CommandContext,
} from "./commands";

export { addProperty, editProperty, listProperties, validateCatalog };

export function removeProperty(
  context: CommandContext,
  requestedId?: string,
): Promise<void> {
  return setPropertyStatus(context, "inactive", requestedId);
}

export function activateProperty(
  context: CommandContext,
  requestedId?: string,
): Promise<void> {
  return setPropertyStatus(context, "active", requestedId);
}

export type { CommandContext, PropertyStatus };

