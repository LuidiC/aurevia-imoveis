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

## Google Maps incorporado

Os mapas da sede e dos imóveis com localização exata usam a Google Maps Embed
API. No Google Cloud, habilite essa API, crie uma chave, restrinja-a aos HTTP
referrers/domínios autorizados e permita seu uso somente com a Maps Embed API.
Configure `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` no `.env.local` e reinicie o
servidor local. Sem a chave, endereço e link “Como chegar” continuam disponíveis,
mas o iframe não é renderizado.

Com a chave configurada, o mapa inicia no modo `place`. A ação “Traçar rota da
minha localização” solicita geolocalização somente após o clique e troca o mesmo
iframe para o modo `directions`. As coordenadas do usuário ficam apenas no estado
temporário da página: não são persistidas, registradas ou enviadas a um backend.

## Scripts

- `npm run dev`: inicia o ambiente local.
- `npm run lint`: executa o ESLint.
- `npm run typecheck`: valida os tipos sem gerar arquivos.
- `npm run test`: executa os testes automatizados da camada de domínio.
- `npm run build`: gera o build de produção.
- `npm run start`: executa o build de produção.
- `npm run check`: executa lint, typecheck, testes, validação do catálogo e build em sequência. É a validação recomendada antes de commit ou deploy.

## Gerenciamento de imóveis

O catálogo público é mantido em `data/properties.json`. A interface TypeScript em
`data/properties.ts` valida esse arquivo com o schema Zod do domínio antes de o site
consumi-lo. Para gerenciar os registros localmente, use:

- `npm run property:list -- [--active|--inactive]`: lista o catálogo e permite filtrar por status.
- `npm run property:add`: adiciona um imóvel e gera o próximo ID e o slug sugerido.
- `npm run property:edit -- [MC-001]`: edita sem alterar ID ou data de criação.
- `npm run property:remove -- [MC-001]`: desativa logicamente; não apaga o registro nem imagens.
- `npm run property:activate -- [MC-001]`: reativa um imóvel.
- `npm run property:validate`: valida schema, duplicatas e arquivos de imagem.

Os prompts aceitam valores em reais como `650000`, `650.000` e `650.000,00`;
`2.500` significa R$ 2.500,00. Antes de qualquer escrita, a ferramenta mostra um
resumo e exige confirmação, cujo padrão é não salvar. Em edições, Enter mantém o
valor atual e `-` remove um campo opcional. Mudanças de slug exibem um aviso porque
alteram a URL pública.

Coloque novas imagens preferencialmente em
`public/images/properties/MC-001/` (trocando pelo ID correspondente). A CLI aceita
o nome do arquivo nessa pasta, um caminho iniciado em `public/` ou um caminho web
iniciado por `/`; ela não move nem exclui imagens. O próximo ID é calculado pelo
maior sequencial já registrado, inclui inativos, preserva ao menos três dígitos e
continua como `MC-1000` após `MC-999`.

Use `npm run property:validate` para validar somente o catálogo. Antes de commit
ou deploy, execute o fluxo completo com `npm run check`.

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

- Os imóveis são mantidos em JSON local versionável e validados com Zod ao carregar a aplicação. IDs e slugs são únicos no catálogo.
- O catálogo começa vazio; nenhum imóvel fictício foi tratado como conteúdo real.
- Valores monetários são inteiros em centavos. Venda aceita preço fixo ou sob consulta; aluguel exige preço fixo.
- A divulgação da localização é explícita (`exact` ou `approximate`) e independente da existência de endereço cadastrado.
- O parâmetro legado `location` continua aceitando valores manuais por compatibilidade; as cidades oferecidas pela interface são comparadas exatamente com o campo `city`.
- Imóveis semelhantes são ativos, possuem a mesma finalidade e são ordenados por tipo, localização, proximidade de preço e ID como desempate.
- Server Components são o padrão. Não há estado de cliente nesta fundação.
- As cores são tokens semânticos em `app/globals.css`, preparados para refinamento visual.
- O domínio planejado está documentado na configuração, mas não é considerado ativo. `NEXT_PUBLIC_SITE_URL` controla a URL base de metadata por ambiente.
- Não há backend, banco de dados, autenticação, Analytics ou CMS.
