import Image from "next/image";

import { Container } from "@/components/ui/container";
import { PropertySearch } from "./property-search";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-surface-subtle text-secondary">
      <Image
        alt="Sala clara com sofá em tons neutros, madeira clara e grandes janelas para o jardim"
        className="absolute inset-0 -z-30 h-full w-full object-cover object-[65%_center]"
        fill priority sizes="100vw" src="/images/hero/aurevia-sala.webp"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-white/75 lg:bg-transparent lg:bg-linear-to-r lg:from-white/95 lg:via-white/85 lg:to-white/10" />
      <Container className="relative flex min-h-[min(58rem,100svh)] flex-col justify-between gap-10 pb-8 pt-32 sm:gap-12 sm:pb-12 sm:pt-40 lg:pt-44">
        <div className="max-w-[43rem]">
          <p className="text-label mb-5 text-primary">Imóveis em Lagoa Santa e Vetor Norte</p>
          <h1 className="text-display max-sm:!text-[clamp(2.4rem,10vw,3rem)]">Um novo lugar para viver os seus próximos planos.</h1>
          <p className="text-body-lg mt-6 max-w-xl text-foreground">Casas, apartamentos, terrenos e imóveis especiais para comprar ou alugar, com informação clara em cada escolha.</p>
        </div>
        <PropertySearch />
      </Container>
    </section>
  );
}
