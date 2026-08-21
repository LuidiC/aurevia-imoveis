import Image from "next/image";

import { SITE_CONFIG } from "@/config/site";

type BrandLogoProps = Readonly<{
  className?: string;
  priority?: boolean;
}>;

export function BrandLogo({ className = "", priority = false }: BrandLogoProps) {
  return (
    <Image
      alt={`Logomarca ${SITE_CONFIG.name}`}
      className={`h-16 w-36 object-cover object-[center_46.5%] ${className}`}
      height={500}
      priority={priority}
      sizes="(min-width: 1024px) 180px, 144px"
      src={SITE_CONFIG.brand.logoSrc}
      width={500}
    />
  );
}
