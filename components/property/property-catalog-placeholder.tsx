import { Container } from "@/components/ui/container";

type PropertyCatalogPlaceholderProps = Readonly<{
  propertyCount: number;
}>;

export function PropertyCatalogPlaceholder({
  propertyCount,
}: PropertyCatalogPlaceholderProps) {
  return (
    <main id="conteudo" className="flex-1 py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Catálogo
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
            Imóveis
          </h1>
          <p className="mt-5 leading-7 text-muted-foreground">
            A estrutura do catálogo está pronta. Os imóveis reais e os filtros
            serão adicionados em uma próxima etapa.
          </p>
        </div>
        <div className="mt-10 rounded-lg border border-border bg-surface p-6">
          <p className="font-medium text-foreground">
            {propertyCount === 0
              ? "Nenhum imóvel publicado por enquanto."
              : `${propertyCount} imóveis disponíveis.`}
          </p>
        </div>
      </Container>
    </main>
  );
}
