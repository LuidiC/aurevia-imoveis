import Link from "next/link";

import { Container } from "@/components/ui/container";

export default function NotFoundPage() {
  return (
    <main id="conteudo" className="flex flex-1 items-center py-20">
      <Container>
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Erro 404
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
            Página não encontrada
          </h1>
          <p className="mt-5 leading-7 text-muted-foreground">
            O endereço informado não existe ou o conteúdo não está mais disponível.
          </p>
          <Link
            className="mt-8 inline-flex min-h-11 items-center rounded-md bg-brand px-5 font-medium text-brand-foreground"
            href="/"
          >
            Voltar ao início
          </Link>
        </div>
      </Container>
    </main>
  );
}
