import { stdin, stdout } from "node:process";
import { createInterface, type Interface } from "node:readline/promises";

type Choice<T extends string> = Readonly<{ value: T; label: string }>;

export class Prompts {
  private readonly readline: Interface;

  constructor() {
    this.readline = createInterface({ input: stdin, output: stdout });
  }

  close(): void {
    this.readline.close();
  }

  section(title: string): void {
    stdout.write(`\n${title}\n${"-".repeat(title.length)}\n`);
  }

  async text(
    label: string,
    options: Readonly<{
      current?: string;
      optional?: boolean;
      minLength?: number;
      maxLength?: number;
      transform?: (value: string) => string;
      validate?: (value: string) => string | undefined;
    }> = {},
  ): Promise<string | undefined> {
    while (true) {
      const currentLabel = options.current === undefined ? "" : ` [${options.current}]`;
      const clearLabel = options.optional && options.current !== undefined
        ? " (Enter mantém; - remove)"
        : "";
      const answer = await this.readline.question(`${label}${currentLabel}${clearLabel}: `);
      const trimmed = answer.trim();

      if (!trimmed && options.current !== undefined) return options.current;
      if (trimmed === "-" && options.optional) return undefined;
      if (!trimmed && options.optional) return undefined;
      if (!trimmed) {
        stdout.write("Este campo é obrigatório.\n");
        continue;
      }

      const value = options.transform ? options.transform(trimmed) : trimmed;
      if (options.minLength && value.length < options.minLength) {
        stdout.write(`Informe ao menos ${options.minLength} caracteres.\n`);
        continue;
      }
      if (options.maxLength && value.length > options.maxLength) {
        stdout.write(`Use no máximo ${options.maxLength} caracteres.\n`);
        continue;
      }

      const validationMessage = options.validate?.(value);
      if (validationMessage) {
        stdout.write(`${validationMessage}\n`);
        continue;
      }

      return value;
    }
  }

  async parsed<T>(
    label: string,
    parser: (value: string) => T,
    options: Readonly<{
      current?: T;
      optional?: boolean;
      formatCurrent?: (value: T) => string;
    }> = {},
  ): Promise<T | undefined> {
    while (true) {
      const displayedCurrent = options.current === undefined
        ? undefined
        : options.formatCurrent?.(options.current) ?? String(options.current);
      const currentLabel = displayedCurrent === undefined ? "" : ` [${displayedCurrent}]`;
      const clearLabel = options.optional && options.current !== undefined
        ? " (Enter mantém; - remove)"
        : "";
      const answer = (await this.readline.question(
        `${label}${currentLabel}${clearLabel}: `,
      )).trim();

      if (!answer && options.current !== undefined) return options.current;
      if (answer === "-" && options.optional) return undefined;
      if (!answer && options.optional) return undefined;
      if (!answer) {
        stdout.write("Este campo é obrigatório.\n");
        continue;
      }

      try {
        return parser(answer);
      } catch (error) {
        stdout.write(`${error instanceof Error ? error.message : String(error)}\n`);
      }
    }
  }

  async choose<T extends string>(
    label: string,
    choices: readonly Choice<T>[],
    current?: T,
  ): Promise<T> {
    stdout.write(`${label}:\n`);
    choices.forEach((choice, index) => {
      const marker = choice.value === current ? " (atual)" : "";
      stdout.write(`  ${index + 1}. ${choice.label}${marker}\n`);
    });

    while (true) {
      const answer = (await this.readline.question(
        current === undefined ? "Escolha: " : "Escolha (Enter mantém): ",
      )).trim();
      if (!answer && current !== undefined) return current;

      const index = Number(answer) - 1;
      if (Number.isInteger(index) && choices[index]) return choices[index].value;
      stdout.write("Escolha uma opção válida.\n");
    }
  }

  async multiChoose<T extends string>(
    label: string,
    choices: readonly Choice<T>[],
    current?: readonly T[],
  ): Promise<readonly T[]> {
    stdout.write(`${label} (números separados por vírgula):\n`);
    choices.forEach((choice, index) => {
      const marker = current?.includes(choice.value) ? " (atual)" : "";
      stdout.write(`  ${index + 1}. ${choice.label}${marker}\n`);
    });

    while (true) {
      const answer = (await this.readline.question(
        current === undefined
          ? "Escolhas (Enter = nenhuma): "
          : "Escolhas (Enter mantém; - remove todas): ",
      )).trim();
      if (!answer && current !== undefined) return current;
      if (!answer || answer === "-") return [];

      const indexes = answer.split(",").map((value) => Number(value.trim()) - 1);
      if (indexes.every((index) => Number.isInteger(index) && choices[index])) {
        return [...new Set(indexes.map((index) => choices[index].value))];
      }
      stdout.write("Informe apenas os números das opções disponíveis.\n");
    }
  }

  async confirm(label: string, defaultValue = false): Promise<boolean> {
    const suffix = defaultValue ? " (S/n): " : " (s/N): ";
    while (true) {
      const answer = (await this.readline.question(`${label}${suffix}`))
        .trim()
        .toLowerCase();
      if (!answer) return defaultValue;
      if (answer === "s" || answer === "sim") return true;
      if (answer === "n" || answer === "não" || answer === "nao") return false;
      stdout.write("Responda com s ou n.\n");
    }
  }
}

