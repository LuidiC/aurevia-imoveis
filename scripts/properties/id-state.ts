import { readFile } from "node:fs/promises";

import { z } from "zod";

import { getHighestPropertySequence } from "./domain";
import { writeJsonSafely } from "./storage";

const propertyIdStateSchema = z.strictObject({
  lastIssuedSequence: z.number().int().nonnegative().safe(),
});

export type PropertyIdState = Readonly<
  z.output<typeof propertyIdStateSchema>
>;

export type PropertyIdStateLoadResult = Readonly<{
  state: PropertyIdState;
  change: "none" | "initialized" | "reconciled";
}>;

export async function resolvePropertyIdState(
  filePath: string,
  existingIds: readonly string[],
): Promise<PropertyIdStateLoadResult> {
  const highestExistingSequence = getHighestPropertySequence(existingIds);
  let source: string;

  try {
    source = await readFile(filePath, "utf8");
  } catch (error) {
    if (!isMissingFileError(error)) {
      throw new Error(`Não foi possível ler ${filePath}: ${getErrorMessage(error)}`);
    }

    const state = { lastIssuedSequence: highestExistingSequence };
    return { state, change: "initialized" };
  }

  let input: unknown;
  try {
    input = JSON.parse(source);
  } catch (error) {
    throw new Error(`JSON inválido em ${filePath}: ${getErrorMessage(error)}`);
  }

  const result = propertyIdStateSchema.safeParse(input);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".") || "metadata"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Metadata de IDs inválida:\n${issues}`);
  }

  if (result.data.lastIssuedSequence >= highestExistingSequence) {
    return { state: result.data, change: "none" };
  }

  const state = { lastIssuedSequence: highestExistingSequence };
  return { state, change: "reconciled" };
}

export async function loadAndReconcilePropertyIdState(
  filePath: string,
  existingIds: readonly string[],
): Promise<PropertyIdStateLoadResult> {
  const result = await resolvePropertyIdState(filePath, existingIds);
  if (result.change !== "none") {
    await writePropertyIdState(filePath, result.state);
  }
  return result;
}

export async function writePropertyIdState(
  filePath: string,
  state: PropertyIdState,
): Promise<void> {
  await writeJsonSafely(filePath, propertyIdStateSchema.parse(state));
}

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
