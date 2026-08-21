import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SITE_NAVIGATION } from "@/config/navigation";
import { SITE_CONFIG } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-whatsapp-url";

export function SiteHeader() {
  const whatsappHref = buildWhatsAppUrl(
    SITE_CONFIG.contacts.whatsapp.defaultMessage,
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <Container className="relative flex min-h-20 items-center justify-between gap-4 lg:min-h-24 lg:gap-8">
        <Link
          aria-label="Marli Corretora — página inicial"
          className="shrink-0"
          href="/"
        >
          <BrandLogo className="lg:h-20 lg:w-[11.25rem]" priority />
        </Link>

        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          <nav aria-label="Navegação principal">
            <ul className="flex items-center gap-5 text-sm text-muted-foreground xl:gap-7">
              {SITE_NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    className="inline-flex min-h-11 items-center font-semibold transition-colors hover:text-primary"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a
            aria-label="Falar com a Marli Corretora no WhatsApp; abre em uma nova aba"
            className={buttonStyles({ className: "whitespace-nowrap" })}
            href={whatsappHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            Falar no WhatsApp
          </a>
        </div>

        <MobileNavigation items={SITE_NAVIGATION} whatsappHref={whatsappHref} />
      </Container>
    </header>
  );
}
