import Link from "next/link";

import { Container } from "@/components/ui/container";
import { SITE_CONFIG } from "@/config/site";

export function DevelopmentNotice() {
  return (
    <main id="conteudo" className="flex flex-1 items-center py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand">
            {SITE_CONFIG.serviceArea}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Uma nova experiência para encontrar seu próximo imóvel.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            O novo site da {SITE_CONFIG.name} está em desenvolvimento. A base
            técnica já está pronta para receber o catálogo e os conteúdos reais.
          </p>
          <Link
            className="mt-8 inline-flex min-h-11 items-center rounded-md bg-brand px-5 font-medium text-brand-foreground transition-opacity hover:opacity-90"
            href="/imoveis"
          >
            Ver estrutura de imóveis
          </Link>
        </div>
      </Container>
    </main>
  );
}
