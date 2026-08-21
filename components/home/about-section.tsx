import Image from "next/image";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SITE_CONFIG } from "@/config/site";

const aboutHighlights = [
  { term: "Experiência", description: "Mais de 30 anos de atuação" },
  { term: "Atuação", description: "Venda e aluguel" },
  { term: "Região", description: SITE_CONFIG.serviceArea },
] as const;

export function AboutSection() {
  return (
    <section className="section-spacing border-y border-border bg-surface-subtle" id="sobre">
      <Container className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 xl:gap-20">
        <figure className="overflow-hidden rounded-lg border border-border bg-surface shadow-soft">
          <div className="relative aspect-[4/5] max-h-[42rem] min-h-96 overflow-hidden">
            <Image
              alt="Interior da sede da Marli Corretora, com área de atendimento e a identidade da empresa ao fundo"
              className="object-cover object-center"
              fill
              sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 100vw"
              src="/images/office/sede-marli-corretora-recepcao.jpeg"
            />
          </div>
          <figcaption className="border-t border-border px-5 py-4 text-small text-muted-foreground sm:px-6">
            Sede da Marli Corretora em Pedro Leopoldo/MG
          </figcaption>
        </figure>

        <div className="pt-2 lg:pt-0">
          <SectionHeading
            description="A Marli Corretora acompanha pessoas e famílias na compra e no aluguel de imóveis urbanos, terrenos e imóveis rurais, sempre com atendimento próximo e conhecimento da região."
            eyebrow="Sobre a Marli Corretora"
            title="Experiência local construída ao longo de mais de 30 anos."
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
