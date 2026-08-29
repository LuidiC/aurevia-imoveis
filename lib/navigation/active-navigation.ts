export type HomeSection = "inicio" | "sobre" | "contato";

export type ActiveNavigationHref =
  | "/"
  | "/imoveis"
  | "/#sobre"
  | "/#contato"
  | null;

export function getActiveNavigationHref(
  pathname: string,
  hash = "",
  visibleHomeSection: HomeSection | null = null,
): ActiveNavigationHref {
  if (pathname === "/imoveis" || pathname.startsWith("/imoveis/")) {
    return "/imoveis";
  }

  if (pathname !== "/") {
    return null;
  }

  if (visibleHomeSection === "sobre") {
    return "/#sobre";
  }

  if (visibleHomeSection === "contato") {
    return "/#contato";
  }

  if (visibleHomeSection === "inicio") {
    return "/";
  }

  if (hash === "#sobre") {
    return "/#sobre";
  }

  if (hash === "#contato") {
    return "/#contato";
  }

  return "/";
}
