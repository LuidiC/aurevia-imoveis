import Image from "next/image";

import { Container } from "@/components/ui/container";

import { PropertySearch } from "./property-search";

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden text-white">
      <Image
        alt="Interior moderno de um imóvel"
        className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
        fill
        priority
        sizes="100vw"
        src="/images/hero/hero-interior.png"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-black/40"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/25 via-black/10 to-black/55"
      />

      <Container className="relative flex min-h-[100svh] flex-col justify-center pb-10 pt-28 sm:pb-12 sm:pt-32 lg:pb-14 lg:pt-36">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center text-center">
          <p className="text-label mb-5 text-white/80">
            Imóveis em Pedro Leopoldo e região
          </p>

          <h1 className="text-display max-w-5xl text-white drop-shadow-sm max-sm:!text-[clamp(2.4rem,10vw,3rem)] max-sm:!leading-[1.08]">
            Encontre o imóvel certo para o seu próximo capítulo.
          </h1>

          <p className="text-body-lg mt-6 max-w-3xl text-white/80">
            Casas, apartamentos, terrenos e imóveis rurais para comprar ou
            alugar, com a confiança de quem atua na região há mais de 30 anos.
          </p>
        </div>

        <div className="mt-8 w-full lg:mt-10">
          <PropertySearch />
        </div>
      </Container>
    </section>
  );
}