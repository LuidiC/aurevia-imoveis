import Link from "next/link";

import { Container } from "@/components/ui/container";
import { SITE_CONFIG } from "@/config/site";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Imóveis" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <Container className="flex min-h-16 items-center justify-between gap-6">
        <Link className="font-semibold text-foreground" href="/">
          {SITE_CONFIG.name}
        </Link>
        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-5 text-sm text-muted-foreground">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link className="transition-colors hover:text-foreground" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
