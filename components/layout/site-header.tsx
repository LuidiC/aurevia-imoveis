import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { SiteNavigation } from "@/components/layout/site-navigation";
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

        <SiteNavigation items={SITE_NAVIGATION} whatsappHref={whatsappHref} />
      </Container>
    </header>
  );
}
