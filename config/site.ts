export const SITE_CONFIG = {
  name: "Marli Corretora",
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
    },
    instagramUrl: "https://www.instagram.com/marliccorretora_",
  },
  domain: {
    planned: "marlicorretora.com.br",
    isActive: false,
  },
} as const;
