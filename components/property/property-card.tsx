import Image from "next/image";
import Link from "next/link";
import type { SVGProps } from "react";

import { Badge } from "@/components/ui/badge";
import {
  getPropertyHref,
  getPropertyLocationLabel,
  getPropertyMetaItems,
  getPropertyPriceLabel,
  PROPERTY_PURPOSE_LABELS,
  PROPERTY_TYPE_LABELS,
  type PropertyMetaKind,
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

type IconProps = SVGProps<SVGSVGElement>;

function BedroomIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <path d="M2.5 15.5v-9m15 9v-6.25a2 2 0 0 0-2-2H9v5.25m-6.5 0h15M5 7.25h2a2 2 0 0 1 2 2v3.25H3V9.25a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
    </svg>
  );
}

function BathroomIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <path d="M3 10.5h14v1.75A3.75 3.75 0 0 1 13.25 16h-6.5A3.75 3.75 0 0 1 3 12.25V10.5Zm2-1.75V5.5A2.5 2.5 0 0 1 7.5 3c1.05 0 1.95.65 2.32 1.57M2 10.5h16M5.5 16v1m9-1v1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
    </svg>
  );
}

function ParkingIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.25 14V6h2.25a2.75 2.75 0 1 1 0 5.5H8.25m0-5.5v5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
    </svg>
  );
}

function AreaIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <path d="M3 8V3h5M12 3h5v5M17 12v5h-5M8 17H3v-5M3.5 7.5l4-4m5 13 4-4M12.5 3.5l4 4m-13 5 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
    </svg>
  );
}

const META_ICONS: Record<
  PropertyMetaKind,
  (props: IconProps) => React.ReactNode
> = {
  bedrooms: BedroomIcon,
  suites: BedroomIcon,
  bathrooms: BathroomIcon,
  parking: ParkingIcon,
  area: AreaIcon,
};

export function PropertyCard({
  property,
  imageSizes = "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw",
}: PropertyCardProps) {
  const primaryImage =
    property.images.find((image) => image.isPrimary) ?? FALLBACK_IMAGE;
  const metaItems = getPropertyMetaItems(property);

  return (
    <article className="group h-full">
      <Link
        className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-control transition-[border-color,box-shadow] duration-200 hover:border-border-strong hover:shadow-soft focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus"
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

        <div className="flex flex-1 flex-col p-5 sm:p-6">
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
              {metaItems.map((item) => {
                const Icon = META_ICONS[item.kind];

                return (
                  <li className="inline-flex items-center gap-2 whitespace-nowrap" key={item.kind}>
                    <Icon className="h-[1.125rem] w-[1.125rem] shrink-0" />
                    <span>{item.label}</span>
                  </li>
                );
              })}
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
