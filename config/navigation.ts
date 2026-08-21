export const SITE_NAVIGATION = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/#contato", label: "Contato" },
] as const;

export type SiteNavigationItem = (typeof SITE_NAVIGATION)[number];
