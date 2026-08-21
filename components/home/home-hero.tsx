import { Container } from "@/components/ui/container";

import { HeroPropertyVisual } from "./hero-property-visual";
import { PropertySearch } from "./property-search";

export function HomeHero() {
  return (
    <section className="overflow-hidden bg-secondary text-secondary-foreground">
      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 xl:gap-20">
          <div className="max-w-3xl">
            <p className="text-label mb-5 text-primary-foreground/75">
              Imóveis em Pedro Leopoldo e região
            </p>
            <h1 className="text-display max-w-3xl text-secondary-foreground max-sm:!text-[clamp(2.5rem,11vw,3rem)] max-sm:!leading-[1.08]">
              Encontre o imóvel certo para o seu próximo capítulo.
            </h1>
            <p className="text-body-lg mt-6 max-w-2xl text-secondary-foreground/75">
              Casas, apartamentos, terrenos e imóveis rurais para comprar ou
              alugar, com a confiança de quem atua na região há mais de 30 anos.
            </p>
          </div>

          <HeroPropertyVisual />
        </div>

        <div className="mt-10 lg:mt-12">
          <PropertySearch />
        </div>
      </Container>
    </section>
  );
}
