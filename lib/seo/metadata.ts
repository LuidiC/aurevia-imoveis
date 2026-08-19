import type { Metadata } from "next";

import { SITE_CONFIG } from "@/config/site";

const LOCAL_METADATA_BASE = "http://localhost:3000";

export function getMetadataBase(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? LOCAL_METADATA_BASE;

  try {
    return new URL(configuredUrl);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL deve ser uma URL absoluta válida, incluindo o protocolo.",
    );
  }
}

type PageMetadataInput = Readonly<{
  title: string;
  description: string;
  path: `/${string}` | "/";
  noIndex?: boolean;
}>;

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      locale: "pt_BR",
      siteName: SITE_CONFIG.name,
      type: "website",
      url: path,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
