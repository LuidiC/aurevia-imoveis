import Image from "next/image";
import Link from "next/link";

import { PropertyMetaIcon } from "@/components/property/property-meta-icon";
import { Badge } from "@/components/ui/badge";
import {
  getPropertyHref,
  getPropertyLocationLabel,
  getPropertyMetaItems,
  getPropertyPriceLabel,
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/properties";
import type { Property } from "@/types/property";

const FALLBACK_IMAGE = {
  src: "/images/property-placeholder/property-placeholder.svg",
  alt: "Imagem do imóvel temporariamente indisponível",
} as const;

type PropertyCardProps = Readonly<{
  property: Property;
  imageSizes?: string;
}>;

export function PropertyCard({
  property,
  imageSizes = "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw",
}: PropertyCardProps) {
  const primaryImage =
    property.images.find((image) => image.isPrimary) ?? FALLBACK_IMAGE;
  const metaItems = getPropertyMetaItems(property);

  return (
    <article className="h-full">
      <Link
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-control transition-[border-color,box-shadow] duration-200 hover:border-border-strong hover:shadow-soft focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus"
        href={getPropertyHref(property)}
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-surface-subtle">
          <div aria-hidden="true" className="absolute inset-0 grid place-items-center text-muted-foreground">
            <svg className="h-12 w-12 opacity-40" fill="none" viewBox="0 0 48 48">
              <path d="m8 23 16-13 16 13v17H8V23Zm10 17V28h12v12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <Image
            alt={primaryImage.alt}
            className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.015]"
            fill
            sizes={imageSizes}
            src={primaryImage.src}
          />
          <Badge className="absolute bottom-4 left-4 bg-surface/95 text-accent-foreground shadow-control">
            {PROPERTY_PURPOSE_LABELS[property.purpose]}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col p-5 transition-colors duration-200 ease-out group-active:bg-accent group-focus-visible:bg-accent motion-reduce:transition-none group-hover:bg-accent sm:p-6">
          <p className="text-xs font-bold tracking-wide text-primary">
            {PROPERTY_TYPE_LABELS[property.type]}
          </p>
          <h3 className="mt-2 line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-[1.45] tracking-[-0.015em] text-foreground">
            {property.title}
          </h3>
          <p className="mt-2 truncate text-sm text-muted-foreground">
            {getPropertyLocationLabel(property.location)}
          </p>

          {metaItems.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2.5 border-t border-border pt-4 text-sm font-medium text-foreground/75 sm:gap-x-5">
              {metaItems.map((item) => (
                <li className="inline-flex items-center gap-2 whitespace-nowrap" key={item.kind}>
                  <PropertyMetaIcon className="h-[1.125rem] w-[1.125rem] shrink-0" kind={item.kind} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-auto pt-5 text-xl font-bold leading-tight tracking-[-0.02em] text-foreground">
            {getPropertyPriceLabel(property)}
          </p>
        </div>
      </Link>
    </article>
  );
}
