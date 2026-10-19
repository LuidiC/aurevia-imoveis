import Image from "next/image";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SITE_CONFIG } from "@/config/site";

const aboutHighlights = [
  { term: "Curadoria", description: "Seleção cuidadosa" },
  { term: "Atuação", description: "Venda e aluguel" },
  { term: "Região", description: SITE_CONFIG.serviceArea },
] as const;

export function AboutSection() {
  return (
    <section className="section-spacing border-y border-border bg-surface-subtle" id="sobre">
      <Container className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 xl:gap-20">
        <figure className="overflow-hidden rounded-lg border border-border bg-surface shadow-soft">
          <div className="relative aspect-[4/3] max-h-[42rem] min-h-96 overflow-hidden">
            <Image
              alt="Ambiente de atendimento com mesa de madeira clara, cadeiras azul-acinzentadas e luz natural"
              className="object-cover object-center"
              fill
              sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 100vw"
              src="/images/office/aurevia-atendimento.webp"
            />
          </div>
          <figcaption className="border-t border-border px-5 py-4 text-small text-muted-foreground sm:px-6">
            Ambiente ilustrativo de atendimento da {SITE_CONFIG.name}
          </figcaption>
        </figure>

        <div className="pt-2 lg:pt-0">
          <SectionHeading
            description={SITE_CONFIG.business.summary}
            eyebrow={`Sobre a ${SITE_CONFIG.name}`}
            title="Seu próximo plano começa com uma boa conversa."
          />

          <dl className="mt-9 grid border-y border-border sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {aboutHighlights.map((item, index) => (
              <div
                className={`py-5 sm:px-5 sm:first:pl-0 sm:last:pr-0 lg:px-0 xl:px-5 xl:first:pl-0 xl:last:pr-0 ${
                  index > 0
                    ? "border-t border-border sm:border-l sm:border-t-0 lg:border-l-0 lg:border-t xl:border-l xl:border-t-0"
                    : ""
                }`}
                key={item.term}
              >
                <dt className="text-label text-primary">{item.term}</dt>
                <dd className="mt-2 font-semibold leading-6 text-foreground">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
