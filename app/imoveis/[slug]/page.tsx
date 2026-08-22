import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PropertyDetail } from "@/components/property/property-detail";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/properties";
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
    notFound();
  }

  const primaryImage = property.images.find((image) => image.isPrimary);

  return createPageMetadata({
    title: property.title,
    description: property.summary,
    path: `/imoveis/${property.slug}`,
    image: primaryImage
      ? { url: primaryImage.src, alt: primaryImage.alt }
      : undefined,
  });
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const similarProperties = getSimilarProperties(property, 3);

  return <PropertyDetail property={property} similarProperties={similarProperties} />;
}
