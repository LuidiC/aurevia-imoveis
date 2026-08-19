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
- `npm run build`: gera o build de produção.
- `npm run start`: executa o build de produção.
- `npm run check`: executa lint, typecheck e build em sequência.

## Estrutura geral

- `app/`: rotas, layouts, metadata e estilos globais.
- `components/`: componentes separados por responsabilidade (`ui`, `layout`, `home` e `property`).
- `config/`: configuração central do produto.
- `data/`: fonte local dos registros de imóveis.
- `lib/`: regras de acesso aos imóveis e utilitários de SEO e WhatsApp.
- `schemas/`: contratos de validação Zod.
- `types/`: tipos compartilhados derivados dos contratos.

## Decisões iniciais

- Os imóveis serão mantidos em arquivos TypeScript locais e validados com Zod ao carregar a aplicação.
- O catálogo começa vazio; nenhum imóvel fictício foi tratado como conteúdo real.
- Server Components são o padrão. Não há estado de cliente nesta fundação.
- As cores são tokens semânticos em `app/globals.css`, preparados para refinamento visual.
- O domínio planejado está documentado na configuração, mas não é considerado ativo. `NEXT_PUBLIC_SITE_URL` controla a URL base de metadata por ambiente.
- Não há backend, banco de dados, autenticação, Analytics ou CMS.
