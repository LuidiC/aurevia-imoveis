import Image from "next/image";

import { SITE_CONFIG } from "@/config/site";

type BrandLogoProps = Readonly<{
  className?: string;
  priority?: boolean;
  inverse?: boolean;
}>;

export function BrandLogo({ className = "", priority = false, inverse = false }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${inverse ? "text-white" : "text-secondary"} ${className}`}>
      <Image
        alt=""
        aria-hidden="true"
        className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12"
        height={56}
        priority={priority}
        src={inverse ? SITE_CONFIG.brand.inverseLogoSrc : SITE_CONFIG.brand.logoSrc}
        width={56}
      />
      <span className="flex flex-col" aria-label={SITE_CONFIG.name}>
        <span className="text-[1.65rem] font-bold leading-none tracking-[-0.045em] sm:text-[1.85rem]">{SITE_CONFIG.brand.wordmark}</span>
        <span className="mt-1.5 text-[0.65rem] font-semibold uppercase leading-none tracking-[0.25em]">{SITE_CONFIG.brand.descriptor}</span>
      </span>
    </span>
  );
}
