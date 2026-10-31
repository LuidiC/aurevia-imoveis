const phoneDigits = "5531989911356";
const phoneDisplay = "(31) 98991-1356";
const phoneE164 = `+${phoneDigits}`;
const name = "Aurévia Imóveis";

export const SITE_CONFIG = {
  name,
  brand: {
    wordmark: "Aurévia",
    descriptor: "Imóveis",
    logoSrc: "/brand/aurevia-symbol.svg",
    inverseLogoSrc: "/brand/aurevia-symbol-inverse.svg",
    accessibleName: `${name} — página inicial`,
  },
  description:
    "Curadoria imobiliária clara, contemporânea e próxima em Lagoa Santa/MG e Vetor Norte. Encontre imóveis para comprar ou alugar.",
  locale: "pt-BR",
  serviceArea: "Lagoa Santa/MG e Vetor Norte",
  location: { city: "Lagoa Santa", state: "MG", country: "Brasil" },
  contacts: {
    phone: { display: phoneDisplay, e164: phoneE164, href: `tel:${phoneE164}` },
    whatsapp: {
      display: phoneDisplay,
      e164: phoneE164,
      digits: phoneDigits,
      defaultMessage: `Olá! Vim pelo site da ${name} e gostaria de mais informações.`,
      searchMessage: `Olá! Vim pelo site da ${name} e gostaria de ajuda para encontrar um imóvel.`,
    },
    instagram: {
      display: "@pablo_.matoso",
      href: "https://www.instagram.com/pablo_.matoso?srtk=cTg1ZzFkb3Jzb2I5",
    },
  },
  business: {
    summary:
      "A Aurévia Imóveis conecta pessoas a espaços que combinam com seus planos, com atendimento próximo, informação clara e uma seleção cuidadosa de imóveis no Vetor Norte de Minas.",
    address: {
      street: "Avenida Horizonte", number: "120", neighborhood: "Centro",
      city: "Lagoa Santa", state: "MG", country: "Brasil",
    },
    openingHours: "Segunda a sexta, das 9h às 18h; sábado com agendamento",
    isDemonstrative: true,
  },
  demonstrationNotice:
    "Projeto demonstrativo. Marca, imóveis, imagens e informações são meramente ilustrativos.",
  domain: { planned: "aurevia-imoveis.example", isActive: false },
} as const;
