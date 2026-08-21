import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/container";
import { getPropertyBySlug } from "@/lib/properties";
import { createPageMetadata } from "@/lib/seo/metadata";

type PropertyPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    return createPageMetadata({
      title: "Imóvel não encontrado",
      description: "O imóvel solicitado não está disponível.",
      path: `/imoveis/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: property.title,
    description: property.summary,
    path: `/imoveis/${property.slug}`,
  });
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <main id="conteudo" className="flex-1 py-16 sm:py-24">
      <Container>
        <p className="text-label text-primary">
          Imóvel
        </p>
        <h1 className="text-heading-1 mt-3 text-foreground">
          {property.title}
        </h1>
        <p className="text-body-lg mt-5 max-w-2xl text-muted-foreground">
          {property.summary}
        </p>
      </Container>
    </main>
  );
}
