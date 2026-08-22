type BusinessDetails = Readonly<{
  summary: string;
  address: Readonly<{
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  }>;
  openingHours?: string;
}>;

const businessDetails: BusinessDetails = {
  summary:
    "Há mais de 30 anos, a Marli Corretora atua em Pedro Leopoldo/MG e região com venda e aluguel de imóveis urbanos, terrenos e imóveis rurais.",
  address: {
    street: "Rua Jockey Club",
    number: "281",
    neighborhood: "Centro",
    city: "Pedro Leopoldo",
    state: "MG",
    country: "Brasil",
  },
};

export const SITE_CONFIG = {
  name: "Marli Corretora",
  brand: {
    logoSrc: "/brand/marli-corretora-logo.png",
  },
  description:
    "Imóveis em Pedro Leopoldo, Minas Gerais, e região, com atendimento próximo e mais de 30 anos de experiência.",
  locale: "pt-BR",
  serviceArea: "Pedro Leopoldo/MG e região",
  location: {
    city: "Pedro Leopoldo",
    state: "MG",
    country: "Brasil",
  },
  contacts: {
    phone: {
      display: "(31) 98504-3482",
      e164: "+5531985043482",
      href: "tel:+5531985043482",
    },
    whatsapp: {
      display: "(31) 98504-3482",
      e164: "+5531985043482",
      digits: "5531985043482",
      defaultMessage:
        "Olá! Vim pelo site da Marli Corretora e gostaria de mais informações.",
    },
    instagram: {
      display: "@marliccorretora_",
      href: "https://www.instagram.com/marliccorretora_",
    },
  },
  business: businessDetails,
  domain: {
    planned: "marlicorretora.com.br",
    isActive: false,
  },
} as const;
