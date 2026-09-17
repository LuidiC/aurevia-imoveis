import {
  lstat,
  mkdir,
  realpath,
  rename,
  readFile,
  rm,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { propertyCollectionSchema } from "../../schemas/property";
import { PROPERTY_ID_PATTERN } from "../../lib/properties/constants";
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
  await writeJsonSafely(filePath, validated);
}

export async function writeJsonSafely(
  filePath: string,
  value: unknown,
): Promise<void> {
  const serialized = `${JSON.stringify(value, null, 2)}\n`;
  const temporaryPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;

  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(temporaryPath, serialized, { encoding: "utf8", flag: "wx" });
    await rename(temporaryPath, filePath);
  } finally {
    await unlink(temporaryPath).catch(() => undefined);
  }
}

export type PropertyImageDirectory = Readonly<{
  absolutePath: string;
  displayPath: string;
  exists: boolean;
}>;

export async function inspectPropertyImageDirectory(
  publicDirectory: string,
  propertyId: string,
): Promise<PropertyImageDirectory> {
  if (!PROPERTY_ID_PATTERN.test(propertyId)) {
    throw new Error(`ID inválido para pasta de imagens: ${propertyId}.`);
  }

  const publicRoot = path.resolve(publicDirectory);
  const imagesDirectory = path.join(publicRoot, "images");
  const parentDirectory = path.join(imagesDirectory, "properties");
  const absolutePath = path.resolve(parentDirectory, propertyId);
  const relativePath = path.relative(parentDirectory, absolutePath);

  if (relativePath !== propertyId || path.isAbsolute(relativePath)) {
    throw new Error("A pasta de imagens calculada não corresponde exatamente ao ID.");
  }

  for (const allowedDirectory of [publicRoot, imagesDirectory, parentDirectory]) {
    const allowedStat = await lstat(allowedDirectory).catch((error: unknown) => {
      if (isMissingFileError(error)) return undefined;
      throw error;
    });
    if (!allowedStat) {
      return {
        absolutePath,
        displayPath: `public/images/properties/${propertyId}/`,
        exists: false,
      };
    }
    if (allowedStat.isSymbolicLink()) {
      throw new Error("O caminho permitido de imagens não pode conter links simbólicos.");
    }
    if (!allowedStat.isDirectory()) {
      throw new Error("O caminho permitido de imagens contém um item que não é pasta.");
    }
  }

  let directoryStat;
  try {
    directoryStat = await lstat(absolutePath);
  } catch (error) {
    if (isMissingFileError(error)) {
      return {
        absolutePath,
        displayPath: `public/images/properties/${propertyId}/`,
        exists: false,
      };
    }
    throw new Error(`Não foi possível inspecionar a pasta de imagens: ${getErrorMessage(error)}`);
  }

  if (directoryStat.isSymbolicLink()) {
    throw new Error("A pasta de imagens do imóvel não pode ser um link simbólico.");
  }
  if (!directoryStat.isDirectory()) {
    throw new Error("O caminho de imagens do imóvel existe, mas não é uma pasta.");
  }

  const [realPublicRoot, realParent, realDirectory] = await Promise.all([
    realpath(publicRoot),
    realpath(parentDirectory),
    realpath(absolutePath),
  ]);
  const realParentFromPublic = path.relative(realPublicRoot, realParent);
  if (
    realParentFromPublic !== path.join("images", "properties") ||
    path.isAbsolute(realParentFromPublic)
  ) {
    throw new Error("O diretório de imagens permitido resolve para fora de public.");
  }
  const realRelativePath = path.relative(realParent, realDirectory);
  if (realRelativePath !== propertyId || path.isAbsolute(realRelativePath)) {
    throw new Error("A pasta de imagens resolve para fora do diretório permitido.");
  }

  return {
    absolutePath,
    displayPath: `public/images/properties/${propertyId}/`,
    exists: true,
  };
}

export async function removePropertyImageDirectory(
  publicDirectory: string,
  propertyId: string,
): Promise<boolean> {
  const directory = await inspectPropertyImageDirectory(publicDirectory, propertyId);
  if (!directory.exists) return false;

  await rm(directory.absolutePath, { recursive: true, force: false });
  return true;
}

type ResolvedPublicAsset = Readonly<{
  absolutePath: string;
  urlPath: string;
}>;

function resolvePublicAssetPath(
  source: string,
  publicDirectory: string,
): ResolvedPublicAsset {
  const value = source.trim().replace(/\\/g, "/");
  const publicRoot = path.resolve(publicDirectory);

  if (/^https?:\/\//i.test(value)) {
    throw new Error(
      "URLs remotas não são permitidas. Use um arquivo dentro de public/images/properties/[ID]/.",
    );
  }

  if (value.split("/").includes("..")) {
    throw new Error("O caminho da imagem não pode conter segmentos '..'.");
  }

  let absolutePath: string;
  if (/^[A-Za-z]:\//.test(value) || value.startsWith("//")) {
    absolutePath = path.resolve(value);
  } else {
    const relativeSource = value.toLowerCase().startsWith("public/")
      ? value.slice(7)
      : value.replace(/^\.\//, "").replace(/^\//, "");
    absolutePath = path.resolve(publicRoot, relativeSource);
  }

  const relativePath = path.relative(publicRoot, absolutePath);
  const isOutsidePublic =
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath);

  if (isOutsidePublic) {
    throw new Error("O caminho da imagem deve permanecer dentro da pasta public.");
  }

  return {
    absolutePath,
    urlPath: `/${relativePath.split(path.sep).join("/")}`,
  };
}

export function normalizeImageSource(
  input: string,
  propertyId: string,
  publicDirectory: string,
): string {
  const value = input.trim().replace(/\\/g, "/");
  if (!value) throw new Error("Informe uma imagem.");

  const source = value.includes("/") || path.win32.isAbsolute(value)
    ? value
    : `images/properties/${propertyId}/${value}`;

  return resolvePublicAssetPath(source, publicDirectory).urlPath;
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

      if (/^https?:\/\//i.test(image.src)) {
        issues.push({
          propertyId: property.id,
          src: image.src,
          message:
            "URLs remotas não são permitidas; use public/images/properties/[ID]/",
        });
        continue;
      }

      if (!IMAGE_EXTENSIONS.has(extension)) {
        issues.push({
          propertyId: property.id,
          src: image.src,
          message: `extensão não permitida (${extension || "ausente"})`,
        });
        continue;
      }

      let localPath: string;
      try {
        localPath = resolvePublicAssetPath(
          urlPath,
          publicDirectory,
        ).absolutePath;
      } catch (error) {
        issues.push({
          propertyId: property.id,
          src: image.src,
          message: getErrorMessage(error),
        });
        continue;
      }

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

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
