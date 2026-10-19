import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SITE_CONFIG } from "@/config/site";
import {
  buildBusinessGoogleMapsDirectionsUrl,
  getBusinessAddressLines,
} from "@/lib/location/business-location";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-whatsapp-url";

export function ContactSection() {
  const whatsappHref = buildWhatsAppUrl(SITE_CONFIG.contacts.whatsapp.searchMessage);
  const mapsHref = buildBusinessGoogleMapsDirectionsUrl();
  const [streetLine, localityLine] = getBusinessAddressLines();

  return (
    <section className="section-spacing bg-primary text-primary-foreground" id="contato">
      <Container className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
        <div className="max-w-3xl">
          <p className="text-label mb-4 text-primary-foreground">
            Atendimento próximo
          </p>
          <h2 className="text-heading-2 text-primary-foreground">
            Ainda não encontrou o que procura?
          </h2>
          <p className="text-body-lg mt-5 max-w-2xl text-primary-foreground">
            Fale com a {SITE_CONFIG.name}. Podemos ajudar você a encontrar um imóvel
            que combine com o que precisa.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              aria-label={`Falar com a ${SITE_CONFIG.name} no WhatsApp; abre em uma nova aba`}
              className={buttonStyles({ variant: "secondary" })}
              href={whatsappHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              Falar no WhatsApp
            </a>
            <a
              aria-label={`${SITE_CONFIG.name} no Instagram; abre em uma nova aba`}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-primary-foreground/55 px-5 py-2.5 font-semibold text-primary-foreground transition-colors hover:border-primary-foreground hover:bg-primary-foreground/10"
              href={SITE_CONFIG.contacts.instagram.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              Ver Instagram
            </a>
          </div>
        </div>

        <div className="min-w-0 rounded-lg border border-primary-foreground/20 bg-primary-hover p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-foreground/12"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20">
                <path d="M16 8.25c0 4.5-6 8.75-6 8.75S4 12.75 4 8.25a6 6 0 1 1 12 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <p className="text-label text-primary-foreground">Endereço demonstrativo</p>
              <h3 className="mt-2 text-xl font-semibold">
                {SITE_CONFIG.name}
              </h3>
              <address className="text-body mt-3 not-italic text-primary-foreground/80">
                <span className="block">{streetLine}</span>
                <span className="block">{localityLine}</span>
              </address>
            </div>
          </div>

          <p className="mt-5 text-small text-primary-foreground">
            Endereço fictício para apresentação. Atendimento com agendamento.
          </p>
          <a
            aria-label="Consultar endereço demonstrativo no Google Maps; abre em uma nova aba"
            className="mt-3 inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
            href={mapsHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            Consultar no Google Maps
          </a>
        </div>
      </Container>
    </section>
  );
}
