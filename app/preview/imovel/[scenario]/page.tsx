import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PropertyDetail } from "@/components/property/property-detail";

import {
  getPreviewProperty,
  getPreviewSimilarProperties,
} from "./preview-properties";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preview da página de imóvel",
  robots: { index: false, follow: false },
};

type PreviewPropertyPageProps = Readonly<{
  params: Promise<{ scenario: string }>;
}>;

export default async function PreviewPropertyPage({
  params,
}: PreviewPropertyPageProps) {
  if (process.env.NODE_ENV === "production") notFound();

  const { scenario } = await params;
  const property = getPreviewProperty(scenario);

  if (!property) notFound();

  return (
    <PropertyDetail
      property={property}
      similarProperties={getPreviewSimilarProperties(property)}
    />
  );
}
