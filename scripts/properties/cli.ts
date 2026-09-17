import path from "node:path";
import { stderr } from "node:process";

import type { PropertyStatus } from "../../types/property";

import {
  activateProperty,
  addProperty,
  deleteProperty,
  editProperty,
  listProperties,
  removeProperty,
  showNextPropertyId,
  validateCatalog,
} from "./entrypoints";

type ParsedArguments = Readonly<{
  command?: string;
  id?: string;
  status?: PropertyStatus;
  dataFile: string;
  idStateFile: string;
  publicDirectory: string;
}>;

async function main(): Promise<void> {
  const args = parseArguments(process.argv.slice(2));
  const context = {
    dataFile: args.dataFile,
    idStateFile: args.idStateFile,
    publicDirectory: args.publicDirectory,
  };

  switch (args.command) {
    case "list":
      await listProperties(context, args.status);
      break;
    case "add":
      await addProperty(context);
      break;
    case "next-id":
      await showNextPropertyId(context);
      break;
    case "edit":
      await editProperty(context, args.id);
      break;
    case "remove":
      await removeProperty(context, args.id);
      break;
    case "delete":
      await deleteProperty(context, args.id);
      break;
    case "activate":
      await activateProperty(context, args.id);
      break;
    case "validate":
      await validateCatalog(context);
      break;
    default:
      printHelp();
      if (args.command) process.exitCode = 1;
  }
}

function parseArguments(argv: readonly string[]): ParsedArguments {
  const positional: string[] = [];
  let status: PropertyStatus | undefined;
  let dataFile = path.resolve("data/properties.json");
  let idStateFile: string | undefined;
  let publicDirectory = path.resolve("public");

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--active") status = "active";
    else if (argument === "--inactive") status = "inactive";
    else if (argument === "--data-file") {
      dataFile = path.resolve(requireOptionValue(argv, ++index, argument));
    } else if (argument === "--public-dir") {
      publicDirectory = path.resolve(requireOptionValue(argv, ++index, argument));
    } else if (argument === "--id-state-file") {
      idStateFile = path.resolve(requireOptionValue(argv, ++index, argument));
    } else if (argument.startsWith("--")) {
      throw new Error(`Opção desconhecida: ${argument}.`);
    } else {
      positional.push(argument);
    }
  }

  return {
    command: positional[0],
    id: positional[1],
    status,
    dataFile,
    idStateFile: idStateFile ?? path.join(path.dirname(dataFile), "property-id-state.json"),
    publicDirectory,
  };
}

function requireOptionValue(
  argv: readonly string[],
  index: number,
  option: string,
): string {
  const value = argv[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`A opção ${option} exige um caminho.`);
  }
  return value;
}

function printHelp(): void {
  process.stdout.write(
    [
      "Gerenciamento local de imóveis",
      "",
      "Comandos:",
      "  list [--active|--inactive]",
      "  add",
      "  next-id",
      "  edit [MC-001]",
      "  remove [MC-001]",
      "  delete MC-001",
      "  activate [MC-001]",
      "  validate",
      "",
    ].join("\n"),
  );
}

main().catch((error: unknown) => {
  stderr.write(`Erro: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
