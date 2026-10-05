import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

type Choice<T extends string> = Readonly<{ value: T; label: string }>;

type PromptReader = Readonly<{
  question: (query: string) => Promise<string>;
  close: () => void;
}>;

type MultilineOptions = Readonly<{
  current?: string;
  minLength?: number;
  maxLength?: number;
  terminator?: string;
}>;

export function normalizeMultilineText(value: string): string {
  return value.replace(/\r\n?/g, "\n").trim();
}

export class Prompts {
  private readonly readline: PromptReader;
  private readonly output: (message: string) => void;

  constructor(
    readline: PromptReader = createInterface({ input: stdin, output: stdout }),
    output: (message: string) => void = (message) => stdout.write(message),
  ) {
    this.readline = readline;
    this.output = output;
  }

  close(): void {
    this.readline.close();
  }

  section(title: string): void {
    this.output(`\n${title}\n${"-".repeat(title.length)}\n`);
  }

  raw(label: string): Promise<string> {
    return this.readline.question(`${label}: `);
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
        this.output("Este campo é obrigatório.\n");
        continue;
      }

      const value = options.transform ? options.transform(trimmed) : trimmed;
      if (options.minLength && value.length < options.minLength) {
        this.output(`Informe ao menos ${options.minLength} caracteres.\n`);
        continue;
      }
      if (options.maxLength && value.length > options.maxLength) {
        this.output(`Use no máximo ${options.maxLength} caracteres.\n`);
        continue;
      }

      const validationMessage = options.validate?.(value);
      if (validationMessage) {
        this.output(`${validationMessage}\n`);
        continue;
      }

      return value;
    }
  }

  async multiline(
    label: string,
    options: MultilineOptions = {},
  ): Promise<string> {
    if (options.current !== undefined) {
      this.output(`${label} atual:\n${options.current}\n`);
      if (!(await this.confirm(`Deseja alterar ${label.toLowerCase()}?`))) {
        return options.current;
      }
    }

    const terminator = options.terminator ?? ":fim";
    while (true) {
      this.output(
        `${label}:\n` +
        "Digite a descrição em quantas linhas desejar.\n" +
        "Para finalizar, digite apenas:\n" +
        `${terminator}\n`,
      );

      const lines: string[] = [];
      while (true) {
        const line = await this.readline.question("> ");
        if (line === terminator) break;
        lines.push(line);
      }

      const value = normalizeMultilineText(lines.join("\n"));
      if (!value) {
        this.output("Este campo é obrigatório.\n");
        continue;
      }
      if (options.minLength && value.length < options.minLength) {
        this.output(`Informe ao menos ${options.minLength} caracteres.\n`);
        continue;
      }
      if (options.maxLength && value.length > options.maxLength) {
        this.output(`Use no máximo ${options.maxLength} caracteres.\n`);
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
        this.output("Este campo é obrigatório.\n");
        continue;
      }

      try {
        return parser(answer);
      } catch (error) {
        this.output(`${error instanceof Error ? error.message : String(error)}\n`);
      }
    }
  }

  async choose<T extends string>(
    label: string,
    choices: readonly Choice<T>[],
    current?: T,
  ): Promise<T> {
    this.output(`${label}:\n`);
    choices.forEach((choice, index) => {
      const marker = choice.value === current ? " (atual)" : "";
      this.output(`  ${index + 1}. ${choice.label}${marker}\n`);
    });

    while (true) {
      const answer = (await this.readline.question(
        current === undefined ? "Escolha: " : "Escolha (Enter mantém): ",
      )).trim();
      if (!answer && current !== undefined) return current;

      const index = Number(answer) - 1;
      if (Number.isInteger(index) && choices[index]) return choices[index].value;
      this.output("Escolha uma opção válida.\n");
    }
  }

  async multiChoose<T extends string>(
    label: string,
    choices: readonly Choice<T>[],
    current?: readonly T[],
  ): Promise<readonly T[]> {
    this.output(`${label} (números separados por vírgula):\n`);
    choices.forEach((choice, index) => {
      const marker = current?.includes(choice.value) ? " (atual)" : "";
      this.output(`  ${index + 1}. ${choice.label}${marker}\n`);
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
      this.output("Informe apenas os números das opções disponíveis.\n");
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
      this.output("Responda com s ou n.\n");
    }
  }
}
