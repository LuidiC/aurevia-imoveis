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
          <p className="text-label text-primary">
            Catálogo
          </p>
          <h1 className="text-heading-1 mt-3 text-foreground">
            Imóveis
          </h1>
          <p className="text-body-lg mt-5 text-muted-foreground">
            A estrutura do catálogo está pronta. Os imóveis reais e os filtros
            serão adicionados em uma próxima etapa.
          </p>
        </div>
        <div className="mt-10 rounded-lg border border-border bg-surface p-6 shadow-soft">
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
