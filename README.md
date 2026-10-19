# Aurévia Imóveis

Repositório privado: [LuidiC/aurevia-imoveis](https://github.com/LuidiC/aurevia-imoveis).

Demonstração de uma imobiliária fictícia em **Lagoa Santa/MG e Vetor Norte**,
com curadoria clara, contemporânea e próxima. Marca, endereço, catálogo, valores,
características e imagens são ilustrativos; não representam ofertas comerciais.

A identidade usa azul profundo, azul principal, superfícies claras e um detalhe
areia. O símbolo vetorial representa um portal e um caminho; o nome usa texto real
em Manrope. Header e Footer compartilham o componente `BrandLogo` e a configuração
em `config/site.ts`, incluindo telefone, WhatsApp, mensagens e endereço.
O domínio planejado `aurevia-imoveis.example` está inativo.

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
git clone https://github.com/LuidiC/aurevia-imoveis.git
cd aurevia-imoveis
npm ci
copy .env.example .env.local
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

O comando `copy` acima é para Windows; em macOS/Linux, use `cp`. O arquivo
`.env.local` é local e ignorado pelo Git. Versione somente os nomes e exemplos
de configuração em `.env.example`, sem credenciais.

Para acessar a prévia por um IP da rede, autorize o endereço exato em
`allowedDevOrigins`, em `next.config.ts`, e reinicie `npm run dev`. A configuração
atual inclui `172.30.112.1`, usado no ambiente local deste projeto. Isso permite
carregar o JavaScript interativo da galeria nesse endereço durante o desenvolvimento.

## Versionamento e produção

A branch principal é `main`, com `origin` apontando para este repositório privado.
A conexão anterior da pasta foi preservada como `legacy-origin`, apenas como
referência histórica. O histórico Git existente foi mantido.

Após alterar o projeto, valide e envie as mudanças:

```bash
npm run check
git add .
git commit -m "Descreva a alteração"
git push origin main
```

`node_modules/`, `.next/`, arquivos locais de ambiente e logs ficam fora do
versionamento. Código, catálogo, imagens, documentação e capturas de revisão
estão incluídos no repositório.

Para executar o build de produção localmente:

```bash
npm run build
npm run start
```

Configure `NEXT_PUBLIC_SITE_URL` com a URL pública real no ambiente de hospedagem
antes do build. O envio ao GitHub mantém o código versionado; a hospedagem do site
é configurada separadamente.

## Google Maps incorporado

Os mapas de imóveis com localização exata usam a Google Maps Embed
API. No Google Cloud, habilite essa API, crie uma chave, restrinja-a aos HTTP
referrers/domínios autorizados e permita seu uso somente com a Maps Embed API.
Configure `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` no `.env.local` e reinicie o
servidor local. Sem a chave, endereço e link “Como chegar” continuam disponíveis,
mas o iframe não é renderizado. O endereço institucional demonstrativo não é
geocodificado nem incorporado em iframe: o card identifica a natureza fictícia e
oferece uma consulta textual no Maps. Não há coordenadas inventadas.

Com a chave configurada, o mapa inicia no modo `place`. A ação “Traçar rota da
minha localização” solicita geolocalização somente após o clique e troca o mesmo
iframe para o modo `directions`. As coordenadas do usuário ficam apenas no estado
temporário da página: não são persistidas, registradas ou enviadas a um backend.

## Scripts

- `npm run dev`: inicia o ambiente local.
- `npm run lint`: executa o ESLint.
- `npm run typecheck`: valida os tipos sem gerar arquivos.
- `npm run test`: executa os testes automatizados do domínio, catálogo, CLI e renderização da galeria.
- `npm run build`: gera o build de produção.
- `npm run start`: executa o build de produção.
- `npm run check`: executa lint, typecheck, testes, validação do catálogo e build em sequência. É a validação recomendada antes de commit ou deploy.

## Gerenciamento de imóveis

O catálogo público é mantido em `data/properties.json`. A interface TypeScript em
`data/properties.ts` valida esse arquivo com o schema Zod do domínio antes de o site
consumi-lo. Para gerenciar os registros localmente, use:

- `npm run property:list -- [--active|--inactive]`: lista o catálogo e permite filtrar por status.
- `npm run property:add`: adiciona um imóvel e gera o próximo ID e o slug sugerido.
- `npm run property:next-id`: consulta o próximo ID e informa a pasta correspondente de imagens.
- `npm run property:edit -- [MC-001]`: edita sem alterar ID ou data de criação.
- `npm run property:remove -- [MC-001]`: desativa logicamente; é reversível e não apaga o registro nem as imagens.
- `npm run property:delete -- MC-001`: exclui o registro permanentemente após confirmação forte pelo ID.
- `npm run property:activate -- [MC-001]`: reativa um imóvel.
- `npm run property:validate`: valida schema, duplicatas, arquivos de imagem e metadata de IDs.

`remove` e `delete` têm propósitos diferentes. `remove` apenas muda o status para
inativo, preserva as imagens e permite reativação posterior. `delete` remove o
registro definitivamente e exige que o ID seja digitado exatamente, com a mesma
capitalização. Se existir `public/images/properties/[ID]/`, o comando pergunta,
com resposta padrão negativa, se essa pasta também deve ser excluída. Uma falha
na remoção opcional das imagens é informada explicitamente; ela não desfaz a
exclusão já persistida no catálogo.

Os prompts aceitam valores em reais como `650000`, `650.000` e `650.000,00`;
`2.500` significa R$ 2.500,00. Antes de qualquer escrita, a ferramenta mostra um
resumo e exige confirmação, cujo padrão é não salvar. Em edições, Enter mantém o
valor atual e `-` remove um campo opcional. Mudanças de slug exibem um aviso porque
alteram a URL pública.

Coloque novas imagens preferencialmente em
`public/images/properties/MC-001/` (trocando pelo ID correspondente). A CLI aceita
o nome do arquivo nessa pasta, um caminho iniciado em `public/` ou um caminho web
iniciado por `/`. Somente `property:delete`, mediante confirmação separada, pode
excluir a pasta do imóvel.

O arquivo versionado `data/property-id-state.json` registra o maior sequencial de
ID já emitido. O valor é reconciliado com o maior ID existente no catálogo e nunca
é reduzido automaticamente. Um ID passa a ser consumido quando o novo imóvel é
salvo; cancelar `property:add` antes do salvamento não avança a sequência. IDs de
registros excluídos nunca são reutilizados. A formatação preserva ao menos três
dígitos e continua como `MC-1000` após `MC-999`. Em instalações antigas sem a
metadata, a CLI a inicializa com segurança a partir do maior ID do catálogo.

`property:next-id` usa a mesma regra de cálculo do `property:add`, mas é somente
consulta: não reserva nem consome o ID, não altera catálogo ou metadata e não cria
a pasta informada. Pode ser executado repetidamente com o mesmo resultado enquanto
nenhum imóvel for salvo. A existência antecipada da pasta de imagens também não
consome o ID; ele só passa a ser utilizado no salvamento do `property:add`.

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
- O catálogo contém seis imóveis fictícios ativos, com três destaques e localização aproximada, sem endereço exato, CEP ou coordenadas.
- Valores monetários são inteiros em centavos. Venda aceita preço fixo ou sob consulta; aluguel exige preço fixo.
- A divulgação da localização é explícita (`exact` ou `approximate`) e independente da existência de endereço cadastrado.
- O parâmetro legado `location` continua aceitando valores manuais por compatibilidade; as cidades oferecidas pela interface são comparadas exatamente com o campo `city`.
- Imóveis semelhantes são ativos, possuem a mesma finalidade e são ordenados por tipo, localização, proximidade de preço e ID como desempate.
- Server Components são o padrão. Busca, navegação, galeria e mapa interativo usam estado no cliente quando necessário.
- As cores são tokens semânticos em `app/globals.css`, preparados para refinamento visual.
- O domínio planejado está documentado na configuração, mas não é considerado ativo. `NEXT_PUBLIC_SITE_URL` controla a URL base de metadata por ambiente.
- Não há backend, banco de dados, autenticação, Analytics ou CMS.

## Catálogo inicial demonstrativo

| ID | Tipo | Finalidade | Cidade | Imagens |
|---|---|---|---|---|
| MC-001 | Casa térrea com jardim | Venda | Lagoa Santa | 5 |
| MC-002 | Apartamento com varanda | Aluguel | Lagoa Santa | 5 |
| MC-003 | Terreno residencial | Venda | Vespasiano | 5 |
| MC-004 | Chácara com pomar | Venda sob consulta | Jaboticatubas | 5 |
| MC-005 | Espaço comercial | Aluguel | Lagoa Santa | 5 |
| MC-006 | Casa contemporânea | Venda | Confins | 5 |

O reset dos IDs foi uma **migração manual única para esta versão demonstrativa**:
o catálogo foi substituído por MC-001 a MC-006 e `lastIssuedSequence` foi definido
intencionalmente como 6. `npm run property:next-id` deve retornar **MC-007** neste
estado inicial. A regra geral de maior sequencial emitido permanece intacta: excluir
um imóvel normalmente não libera seu ID para reutilização. Não repita esse reset
como parte do gerenciamento cotidiano.

As fotografias do Hero, do ambiente de atendimento e dos seis imóveis foram geradas
originalmente pela ferramenta de imagens do Codex para esta demonstração, sem
reaproveitar fotografias reais. Cada imóvel tem cinco arquivos WebP horizontais,
com nomes semânticos em `public/images/properties/MC-001/` até `MC-006/`.
A galeria permite avançar e voltar pelas imagens usando setas no computador e no
celular, além das miniaturas. As prévias laterais no computador e as miniaturas
abaixo da imagem no celular já integram o HTML inicial; o CSS adapta sua exibição
à largura da tela. Há exatamente uma imagem primária por registro. Os valores são inteiros em centavos;
aluguéis têm preço fixo e a chácara tem preço sob consulta.

Os conceitos e prompts usados nos assets estão em `docs/asset-generation.md`.
As rotas `/preview/imovel/apartamento`, `/preview/imovel/terreno` e
`/preview/imovel/sob-consulta` continuam disponíveis somente em desenvolvimento.

Não há backend, banco de dados, CMS, autenticação ou Analytics. Nenhuma dependência
foi acrescentada para a identidade visual ou para otimizar as imagens.
