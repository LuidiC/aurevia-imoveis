import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { Container } from "@/components/ui/container";
import { SITE_NAVIGATION } from "@/config/navigation";
import { SITE_CONFIG } from "@/config/site";
import {
  buildGoogleMapsSearchUrl,
  getBusinessAddressLines,
} from "@/lib/location/business-location";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-whatsapp-url";

export function SiteFooter() {
  const sharesPhoneAndWhatsapp =
    SITE_CONFIG.contacts.phone.e164 === SITE_CONFIG.contacts.whatsapp.e164;
  const whatsappHref = buildWhatsAppUrl(
    SITE_CONFIG.contacts.whatsapp.defaultMessage,
  );
  const mapsHref = buildGoogleMapsSearchUrl();
  const [streetLine, localityLine] = getBusinessAddressLines();

  return (
    <footer className="border-t border-border bg-surface text-small text-muted-foreground">
      <Container className="grid gap-8 py-12 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-[1.4fr_0.75fr_1fr_0.85fr] lg:gap-12 lg:py-18">
        <div className="max-w-sm sm:col-span-2 lg:col-span-1">
          <Link
            aria-label="Marli Corretora — página inicial"
            className="inline-flex"
            href="/"
          >
            <BrandLogo className="h-20 w-[11.25rem]" />
          </Link>
          <p className="mt-5 leading-7">{SITE_CONFIG.business.summary}</p>
          <p className="mt-4 font-semibold text-foreground">
            {SITE_CONFIG.serviceArea}
          </p>
        </div>

        <div>
          <h2 className="text-label text-primary">Navegação</h2>
          <nav aria-label="Navegação do rodapé" className="mt-4 sm:mt-5">
            <ul className="grid gap-1">
              {SITE_NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    className="inline-flex min-h-10 items-center font-semibold text-foreground transition-colors hover:text-primary"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
          <h2 className="text-label text-primary">Atendimento</h2>
          <address className="mt-4 not-italic sm:mt-5">
            <dl className="grid gap-4 sm:gap-5">
              {sharesPhoneAndWhatsapp ? (
                <div>
                  <dt className="text-muted-foreground">
                    Telefone / WhatsApp
                  </dt>
                  <dd className="mt-1">
                    <a
                      className="font-semibold text-foreground transition-colors hover:text-primary"
                      href={SITE_CONFIG.contacts.phone.href}
                    >
                      {SITE_CONFIG.contacts.phone.display}
                    </a>
                  </dd>
                </div>
              ) : (
                <>
                  <div>
                    <dt className="text-muted-foreground">Telefone</dt>
                    <dd className="mt-1">
                      <a
                        className="font-semibold text-foreground transition-colors hover:text-primary"
                        href={SITE_CONFIG.contacts.phone.href}
                      >
                        {SITE_CONFIG.contacts.phone.display}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">WhatsApp</dt>
                    <dd className="mt-1">
                      <a
                        aria-label="Conversar com a Marli Corretora no WhatsApp; abre em uma nova aba"
                        className="font-semibold text-foreground transition-colors hover:text-primary"
                        href={whatsappHref}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {SITE_CONFIG.contacts.whatsapp.display}
                      </a>
                    </dd>
                  </div>
                </>
              )}
              <div>
                <dt className="text-muted-foreground">Sede</dt>
                <dd className="mt-1 font-semibold leading-6 text-foreground">
                  <span className="block">{streetLine}</span>
                  <span className="block">{localityLine}</span>
                  <a
                    aria-label={`Como chegar à sede da ${SITE_CONFIG.name} no Google Maps; abre em uma nova aba`}
                    className="mt-2 inline-flex min-h-10 items-center text-primary underline-offset-4 hover:underline"
                    href={mapsHref}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Como chegar
                  </a>
                </dd>
              </div>
              {SITE_CONFIG.business.openingHours ? (
                <div>
                  <dt className="text-muted-foreground">Horário</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    {SITE_CONFIG.business.openingHours}
                  </dd>
                </div>
              ) : null}
            </dl>
          </address>
        </div>

        <div>
          <h2 className="text-label text-primary">Redes sociais</h2>
          <a
            aria-label={`${SITE_CONFIG.name} no Instagram; abre em uma nova aba`}
            className="mt-4 inline-flex min-h-10 items-center font-semibold text-foreground transition-colors hover:text-primary sm:mt-5"
            href={SITE_CONFIG.contacts.instagram.href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {SITE_CONFIG.contacts.instagram.display}
          </a>
        </div>
      </Container>

      <div className="bg-secondary py-4 text-secondary-foreground/80 sm:py-5">
        <Container className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}.</p>
          <p>Confiança e atendimento próximo há mais de 30 anos.</p>
        </Container>
      </div>
    </footer>
  );
}
