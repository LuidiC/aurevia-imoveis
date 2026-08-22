import type { SVGProps } from "react";

import type { PropertyMetaKind } from "@/lib/properties";

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

const META_ICONS: Record<PropertyMetaKind, (props: IconProps) => React.ReactNode> = {
  bedrooms: BedroomIcon,
  suites: BedroomIcon,
  bathrooms: BathroomIcon,
  parking: ParkingIcon,
  area: AreaIcon,
};

type PropertyMetaIconProps = IconProps & Readonly<{ kind: PropertyMetaKind }>;

export function PropertyMetaIcon({ kind, ...props }: PropertyMetaIconProps) {
  const Icon = META_ICONS[kind];

  return <Icon {...props} />;
}
