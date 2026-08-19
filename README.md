# Marli Corretora

Fundação técnica do site público da **Marli Corretora**, imobiliária com atuação há mais de 30 anos em Pedro Leopoldo/MG e região. O projeto está em desenvolvimento e, nesta etapa, contém apenas a arquitetura inicial e páginas mínimas.

## Stack

- Next.js com App Router
- React e TypeScript estrito
- Tailwind CSS
- Zod para validação dos dados de imóveis
- ESLint
- npm e Git

## Requisitos

- Node.js 22 ou superior
- npm 11 ou versão compatível

## Instalação e execução

```bash
npm install
copy .env.example .env.local
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Scripts

- `npm run dev`: inicia o ambiente local.
- `npm run lint`: executa o ESLint.
- `npm run typecheck`: valida os tipos sem gerar arquivos.
- `npm run test`: executa os testes automatizados da camada de domínio.
- `npm run build`: gera o build de produção.
- `npm run start`: executa o build de produção.
- `npm run check`: executa lint, typecheck, testes e build em sequência.

## Estrutura geral

- `app/`: rotas, layouts, metadata e estilos globais.
- `components/`: componentes separados por responsabilidade (`ui`, `layout`, `home` e `property`).
- `config/`: configuração central do produto.
- `data/`: fonte local dos registros de imóveis.
- `lib/`: catálogo, consultas puras e utilitários de imóveis, SEO e WhatsApp.
- `schemas/`: contratos de validação Zod.
- `tests/`: fixtures isoladas e testes automatizados do domínio.
- `types/`: tipos compartilhados derivados dos contratos.

## Decisões iniciais

- Os imóveis serão mantidos em arquivos TypeScript locais e validados com Zod ao carregar a aplicação. IDs e slugs são únicos no catálogo.
- O catálogo começa vazio; nenhum imóvel fictício foi tratado como conteúdo real.
- Valores monetários são inteiros em centavos. Venda aceita preço fixo ou sob consulta; aluguel exige preço fixo.
- A divulgação da localização é explícita (`exact` ou `approximate`) e independente da existência de endereço cadastrado.
- Imóveis semelhantes são ativos, possuem a mesma finalidade e são ordenados por tipo, localização, proximidade de preço e ID como desempate.
- Server Components são o padrão. Não há estado de cliente nesta fundação.
- As cores são tokens semânticos em `app/globals.css`, preparados para refinamento visual.
- O domínio planejado está documentado na configuração, mas não é considerado ativo. `NEXT_PUBLIC_SITE_URL` controla a URL base de metadata por ambiente.
- Não há backend, banco de dados, autenticação, Analytics ou CMS.
