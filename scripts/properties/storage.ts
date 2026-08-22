import {
  rename,
  readFile,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { propertyCollectionSchema } from "../../schemas/property";
import type { Property } from "../../types/property";

const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

export type ImageValidationIssue = Readonly<{
  propertyId: string;
  src: string;
  message: string;
}>;

export function formatZodIssues(error: z.ZodError): readonly string[] {
  return error.issues.map((issue) => {
    const location = issue.path.length > 0 ? issue.path.join(".") : "catálogo";
    return `${location}: ${issue.message}`;
  });
}

export async function loadCatalog(filePath: string): Promise<readonly Property[]> {
  let source: string;

  try {
    source = await readFile(filePath, "utf8");
  } catch (error) {
    throw new Error(`Não foi possível ler ${filePath}: ${getErrorMessage(error)}`);
  }

  let input: unknown;
  try {
    input = JSON.parse(source);
  } catch (error) {
    throw new Error(`JSON inválido em ${filePath}: ${getErrorMessage(error)}`);
  }

  const result = propertyCollectionSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`Catálogo inválido:\n${formatZodIssues(result.error).join("\n")}`);
  }

  return result.data;
}

export async function writeCatalogSafely(
  filePath: string,
  properties: readonly Property[],
): Promise<void> {
  const validated = propertyCollectionSchema.parse(properties);
  const serialized = `${JSON.stringify(validated, null, 2)}\n`;
  const temporaryPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;

  try {
    await writeFile(temporaryPath, serialized, { encoding: "utf8", flag: "wx" });
    await rename(temporaryPath, filePath);
  } finally {
    await unlink(temporaryPath).catch(() => undefined);
  }
}

export function normalizeImageSource(
  input: string,
  propertyId: string,
  publicDirectory: string,
): string {
  const value = input.trim().replace(/\\/g, "/");
  if (!value) throw new Error("Informe uma imagem.");
  if (/^https?:\/\//i.test(value)) return value;

  const normalizedPublic = path.resolve(publicDirectory).replace(/\\/g, "/");
  if (value.toLowerCase().startsWith(`${normalizedPublic.toLowerCase()}/`)) {
    return value.slice(normalizedPublic.length);
  }

  if (value.startsWith("/")) return value;

  if (path.win32.isAbsolute(value)) {
    throw new Error("Caminhos absolutos de imagem devem estar dentro da pasta public.");
  }

  if (value.toLowerCase().startsWith("public/")) return `/${value.slice(7)}`;
  if (value.includes("/")) return `/${value.replace(/^\.\//, "")}`;

  return `/images/properties/${propertyId}/${value}`;
}

export async function validatePropertyImages(
  properties: readonly Property[],
  publicDirectory: string,
): Promise<readonly ImageValidationIssue[]> {
  const issues: ImageValidationIssue[] = [];

  for (const property of properties) {
    for (const image of property.images) {
      const urlPath = image.src.split(/[?#]/, 1)[0];
      const extension = path.extname(urlPath).toLowerCase();

      if (!IMAGE_EXTENSIONS.has(extension)) {
        issues.push({
          propertyId: property.id,
          src: image.src,
          message: `extensão não permitida (${extension || "ausente"})`,
        });
        continue;
      }

      if (/^https?:\/\//i.test(image.src)) continue;

      const localPath = image.src.startsWith("/")
        ? path.join(publicDirectory, image.src.slice(1))
        : path.resolve(path.dirname(publicDirectory), image.src);

      try {
        const imageStat = await stat(localPath);
        if (!imageStat.isFile()) throw new Error("não é um arquivo");
      } catch {
        issues.push({
          propertyId: property.id,
          src: image.src,
          message: "arquivo não encontrado na pasta public",
        });
      }
    }
  }

  return issues;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
