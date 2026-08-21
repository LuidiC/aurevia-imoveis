import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFoundPage() {
  return (
    <main id="conteudo" className="flex flex-1 items-center py-20">
      <Container>
        <div className="max-w-xl">
          <p className="text-label text-primary">
            Erro 404
          </p>
          <h1 className="text-heading-1 mt-3 text-foreground">
            Página não encontrada
          </h1>
          <p className="text-body-lg mt-5 text-muted-foreground">
            O endereço informado não existe ou o conteúdo não está mais disponível.
          </p>
          <Link
            className={buttonStyles({ className: "mt-8" })}
            href="/"
          >
            Voltar ao início
          </Link>
        </div>
      </Container>
    </main>
  );
}
