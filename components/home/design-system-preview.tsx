import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { Select } from "@/components/ui/select";

const palette = [
  {
    role: "Primary",
    value: "#53786D",
    className: "bg-primary text-primary-foreground",
  },
  {
    role: "Primary hover",
    value: "#45675D",
    className: "bg-primary-hover text-primary-foreground",
  },
  {
    role: "Foreground",
    value: "#2B2F2D",
    className: "bg-foreground text-background",
  },
  {
    role: "Background",
    value: "#F7F6F2",
    className: "bg-background text-foreground",
  },
  {
    role: "Surface",
    value: "#FFFFFF",
    className: "bg-surface text-foreground",
  },
  {
    role: "Muted",
    value: "#EAEDE9",
    className: "bg-muted text-foreground",
  },
  {
    role: "Border",
    value: "#D8DDD9",
    className: "bg-border text-foreground",
  },
  {
    role: "Accent",
    value: "#E3ECE8",
    className: "bg-accent text-accent-foreground",
  },
  {
    role: "Destructive",
    value: "#A33F3F",
    className: "bg-destructive text-destructive-foreground",
  },
  {
    role: "Focus",
    value: "#2E6D5A",
    className: "bg-focus text-white",
  },
] as const;

const foundations = [
  { label: "Conteúdo", value: "máx. 1.280 px" },
  { label: "Respiro lateral", value: "20–40 px" },
  { label: "Seções", value: "64–112 px" },
  { label: "Raios", value: "4 / 8 / 12 px" },
] as const;

// Esta composição é uma vitrine temporária e será substituída pela Home final.
export function DesignSystemPreview() {
  return (
    <main id="conteudo" className="flex-1">
      <section className="section-spacing border-b border-border bg-background">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="max-w-3xl">
            <p className="text-label mb-5 text-primary">
              Vitrine temporária · Design System v1
            </p>
            <h1 className="text-heading-1 max-w-3xl text-foreground">
              Fundação visual da Marli Corretora
            </h1>
            <p className="text-body-lg mt-6 max-w-2xl text-muted-foreground">
              Uma linguagem digital clara e acolhedora, construída para unir mais
              de 30 anos de confiança a uma experiência contemporânea.
            </p>
          </div>

          <div className="flex min-h-72 items-center justify-center rounded-lg border border-border bg-surface p-8 shadow-soft sm:p-12">
            <Image
              alt="Logomarca oficial Marli Corretora"
              className="h-auto w-full max-w-sm"
              height={500}
              priority
              src="/brand/marli-corretora-logo.png"
              width={500}
            />
          </div>
        </Container>
      </section>

      <section className="section-spacing">
        <Container>
          <SectionHeading
            description="O verde mineral e o grafite vêm do arquivo oficial. Neutros claros ampliam a sensação de cuidado, leitura e proximidade."
            eyebrow="01 · Cor"
            title="Paleta funcional e reconhecível"
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {palette.map((color) => (
              <div
                className={`flex min-h-36 flex-col justify-end rounded-lg border border-black/5 p-5 shadow-control ${color.className}`}
                key={color.role}
              >
                <p className="text-sm font-bold">{color.role}</p>
                <p className="mt-1 font-mono text-xs opacity-80">{color.value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-spacing border-y border-border bg-surface">
        <Container>
          <SectionHeading
            description="Uma única família sustenta toda a experiência. Pesos, tracking e escala criam hierarquia sem aproximar a marca de uma estética editorial ou elitista."
            eyebrow="02 · Tipografia"
            title="Confiança contemporânea, sem excessos"
          />

          <div className="mt-12">
            <div className="border-b border-border pb-12">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="text-label text-primary">Manrope Variable · Display</p>
                <p className="text-small text-muted-foreground">48–64 px · peso 650</p>
              </div>
              <p className="text-display mt-5 max-w-4xl text-foreground">
                Morar bem começa com confiança.
              </p>
              <p className="text-body-lg mt-7 max-w-2xl text-muted-foreground">
                Há mais de 30 anos, cada atendimento começa ouvindo com atenção e
                termina com uma escolha feita com segurança.
              </p>
            </div>

            <div className="divide-y divide-border">
              {[
                {
                  name: "H1",
                  scale: "40–56 px · peso 650",
                  className: "text-heading-1",
                  sample: "Encontre um imóvel para a sua história",
                },
                {
                  name: "H2",
                  scale: "32–44 px · peso 650",
                  className: "text-heading-2",
                  sample: "Atendimento próximo em cada decisão",
                },
                {
                  name: "H3",
                  scale: "24–30 px · peso 600",
                  className: "text-heading-3",
                  sample: "Conhecimento de Pedro Leopoldo e região",
                },
                {
                  name: "Body",
                  scale: "16 px · entrelinha 170%",
                  className: "text-body max-w-2xl",
                  sample:
                    "Informação clara e acompanhamento experiente para comprar ou alugar com tranquilidade.",
                },
                {
                  name: "Label",
                  scale: "12 px · peso 700",
                  className: "text-label text-primary",
                  sample: "Imóveis em destaque",
                },
              ].map(({ name, scale, className, sample }) => (
                <div
                  className="grid gap-4 py-8 lg:grid-cols-[9rem_1fr] lg:gap-8"
                  key={name}
                >
                  <div>
                    <p className="font-semibold text-foreground">{name}</p>
                    <p className="text-small mt-1 text-muted-foreground">{scale}</p>
                  </div>
                  <p className={className}>{sample}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="section-spacing">
        <Container>
          <SectionHeading
            description="Poucas variantes, estados claros e controles nativos quando eles entregam a melhor experiência acessível."
            eyebrow="03 · Componentes"
            title="Primitivas para as próximas interfaces"
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-6 shadow-soft sm:p-8">
              <h3 className="text-heading-3">Botões e badges</h3>
              <p className="text-body mt-3 text-muted-foreground">
                Hierarquia suficiente para ações principais, auxiliares e discretas.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button>Falar com a corretora</Button>
                <Button variant="secondary">Ver imóveis</Button>
                <Button variant="outline">Saiba mais</Button>
                <Button variant="ghost">Voltar</Button>
                <Button disabled>Indisponível</Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Badge>Venda</Badge>
                <Badge variant="neutral">Aluguel</Badge>
                <Badge variant="outline">Destaque</Badge>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface p-6 shadow-soft sm:p-8">
              <h3 className="text-heading-3">Campos básicos</h3>
              <p className="text-body mt-3 text-muted-foreground">
                Base visual para filtros futuros, sem implementar sua lógica nesta etapa.
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field htmlFor="preview-location" label="Bairro ou cidade">
                  <Input id="preview-location" placeholder="Ex.: Centro" />
                </Field>
                <Field htmlFor="preview-purpose" label="Finalidade">
                  <Select defaultValue="" id="preview-purpose">
                    <option disabled value="">
                      Selecione
                    </option>
                    <option>Comprar</option>
                    <option>Alugar</option>
                  </Select>
                </Field>
                <Field
                  className="sm:col-span-2"
                  description="Exemplo de estado indisponível."
                  htmlFor="preview-disabled"
                  label="Tipo de imóvel"
                >
                  <Input disabled id="preview-disabled" placeholder="Todos os tipos" />
                </Field>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-spacing border-y border-border bg-surface-subtle">
        <Container>
          <SectionHeading
            description="As imagens reais carregam a narrativa. A tipografia organiza o contexto com presença profissional, sem competir com os ambientes."
            eyebrow="04 · Fotografia e superfícies"
            title="Autêntico, próximo e sem excessos"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <figure className="overflow-hidden rounded-lg border border-border bg-surface shadow-soft">
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  alt="Sala de atendimento da sede da Marli Corretora, com mesa de madeira e identidade da empresa ao fundo"
                  className="h-full w-full object-cover"
                  height={1280}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  src="/images/office/sede-marli-corretora-atendimento.jpeg"
                  width={960}
                />
              </div>
              <figcaption className="p-5 sm:p-6">
                <p className="text-label text-primary">Atendimento presencial</p>
                <h3 className="text-heading-3 mt-3 text-foreground">
                  Conversas com calma e atenção
                </h3>
                <p className="text-small mt-3 text-muted-foreground">
                  Enquadramento amplo para contexto e acolhimento.
                </p>
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-lg border border-border bg-surface shadow-soft">
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  alt="Interior da sede da Marli Corretora com painel de madeira, logomarca e área de atendimento"
                  className="h-full w-full object-cover"
                  height={1280}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  src="/images/office/sede-marli-corretora-recepcao.jpeg"
                  width={960}
                />
              </div>
              <figcaption className="p-5 sm:p-6">
                <p className="text-label text-primary">Experiência local</p>
                <h3 className="text-heading-3 mt-3 text-foreground">
                  Tradição em uma presença atual
                </h3>
                <p className="text-small mt-3 text-muted-foreground">
                  Cortes naturais, luz real e tratamento sem filtros artificiais.
                </p>
              </figcaption>
            </figure>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {foundations.map((item) => (
              <div className="rounded-md border border-border bg-surface p-5" key={item.label}>
                <p className="text-label text-primary">{item.label}</p>
                <p className="mt-3 font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
