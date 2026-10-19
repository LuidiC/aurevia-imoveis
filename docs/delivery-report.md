# Entrega da demonstração Aurévia Imóveis

Trabalho realizado exclusivamente no projeto aberto, conforme confirmação do usuário.
As seções 1 a 8 registram a entrega inicial, anterior ao versionamento no novo
repositório. As atualizações posteriores e o estado atual estão ao final deste documento.

## 1. Identidade e arquitetura

Marca fictícia Aurévia Imóveis, com posicionamento de curadoria clara, contemporânea
e próxima em Lagoa Santa/MG e Vetor Norte. Paleta azul, superfícies claras, detalhe
areia e fonte Manrope preservada. Sem afirmações de experiência, depoimentos ou
resultados inventados. Aviso demonstrativo legível no rodapé.

Arquitetura preservada: App Router, TypeScript estrito, schema Zod, JSON local,
filtros na URL, helpers de apresentação, privacidade de localização e CLI local.
Sem dependências novas, backend, banco, CMS, autenticação ou Analytics.

## 2. Marca e imagens

- `public/brand/aurevia-symbol.svg`: símbolo vetorial original para fundo claro.
- `public/brand/aurevia-symbol-inverse.svg`: versão inversa transparente.
- `components/layout/brand-logo.tsx`: lockup horizontal responsivo, com texto real,
  nome acessível e símbolo sem recorte. Nome e caminhos vêm de `SITE_CONFIG`.
- `public/images/hero/aurevia-sala.webp`: sala contemporânea clara, gerada originalmente.
- `public/images/office/aurevia-atendimento.webp`: ambiente neutro de atendimento,
  gerado originalmente, sem pessoas, logos ou textos falsos.
- 24 imagens originais de imóveis, inspecionadas em seis conjuntos coerentes e
  otimizadas em WebP, 1536 × 1024, qualidade 84 (~6 MiB no total).
- Prompts finais e conceitos: [asset-generation.md](asset-generation.md).

## 3. Imóveis e sequência

| ID | Tipo | Finalidade | Cidade | Imagens | Destaque |
|---|---|---|---|---:|---|
| MC-001 | Casa térrea com jardim e área gourmet | Venda | Lagoa Santa | 4 | Sim |
| MC-002 | Apartamento claro com varanda | Aluguel | Lagoa Santa | 4 | Sim |
| MC-003 | Terreno residencial | Venda | Vespasiano | 4 | Não |
| MC-004 | Chácara contemporânea com pomar | Venda sob consulta | Jaboticatubas | 4 | Sim |
| MC-005 | Espaço comercial no Centro | Aluguel | Lagoa Santa | 4 | Não |
| MC-006 | Casa contemporânea com quintal | Venda | Confins | 4 | Não |

Todos ativos, com IDs e slugs únicos, datas ISO válidas, uma imagem primária por
imóvel e valores fixos em centavos quando aplicável. Nenhum imóvel armazena endereço,
CEP ou coordenadas. Cidades da interface correspondem exatamente às quatro cidades
do catálogo. Os aluguéis têm preço fixo e MC-004 usa `on_request`.

Migração manual única: `lastIssuedSequence: 6`. `npm run property:next-id` retornou
`MC-007`, com pasta sugerida `public/images/properties/MC-007/`. A consulta não
consumiu o ID. A CLI e os testes de maior sequencial emitido e não reutilização
normal de IDs foram preservados.

## 4. Header e contato

Header fixo na Home, inicialmente branco com 95% de opacidade; após 40 px de rolagem,
branco sólido com sombra discreta. Nas demais páginas, permanece sticky. Logo e
navegação escuras nos dois estados; mesmo componente de logo no Footer. Menu móvel
com alvos de 44 px, fechamento com Escape e retorno do foco. Foco visível e
`prefers-reduced-motion` preservados. Links de telefone do Footer ampliados para
44 px, assim como controles pequenos e filtros ativos.

WhatsApp centralizado em `SITE_CONFIG`: **(31) 99693-0657**, **+5531996930657**,
**5531996930657**; telefone **tel:+5531996930657**.

- Geral: “Olá! Vim pelo site da Aurévia Imóveis e gostaria de mais informações.”
- Busca: “Olá! Vim pelo site da Aurévia Imóveis e gostaria de ajuda para encontrar um imóvel.”
- Imóvel: “Olá! Tenho interesse no imóvel {título}. Gostaria de mais informações.”

Mensagens específicas contêm o título e não expõem IDs. Endereço e horário vêm da
configuração. Avenida Horizonte, 120, Centro, Lagoa Santa/MG aparece como endereço
demonstrativo, com consulta textual no Maps e sem iframe ou coordenadas inventadas.
O helper genérico de mapas continua preservado para dados exatos e mantém fallback
sem chave.

## 5. Validações e testes

| Validação | Resultado |
|---|---|
| `npm run lint` | Aprovado |
| `npm run typecheck` | Aprovado |
| `npm run test` | 129 aprovados; zero falhas, cancelados ou ignorados |
| `npm run property:validate` | 6 imóveis válidos; sequencial 6 |
| `npm run check` | Aprovado, incluindo catálogo e build |
| `npm run build` | Aprovado em produção com Turbopack |
| `npm run property:next-id` | MC-007 |
| `git diff --check` | Aprovado |

Cinco novos testes de integração em `tests/demo-catalog.test.ts` cobrem catálogo,
IDs e slugs, status e destaques, tipos/finalidades, imagens distintas e existentes
em WebP, imagem primária, privacidade, datas, cidades e consulta do próximo ID sem
mutação. Testes existentes atualizados para configuração, região, endereço,
WhatsApp e nomes dos diretórios temporários. A verificação da mensagem usa conteúdo
semântico e título, sem comparar uma frase longa inteira.

As primeiras execuções no sandbox falharam por EPERM em operações atômicas de
arquivos temporários; repetidas com as permissões adequadas, passaram sem alterar
as proteções da CLI. O preview de desenvolvimento usou Webpack após falha de
processo auxiliar do Turbopack no ambiente; os builds finais normais com Turbopack
passaram. Nenhum erro foi silenciado.

## 6. Revisão visual

Nove telas revistas em **390, 768, 1024 e 1440 px**: Home, catálogo, filtros sem
resultado e os seis detalhes de imóveis. As 36 medições registradas mostram
`scrollWidth === clientWidth`, sem overflow horizontal. Capturas completas estão
em `review-screenshots/`; métricas em `review-screenshots/visual-metrics.json`.

Também inspecionados: Hero, busca, cards, imagem institucional, Footer, endereço
sem chave de mapa, Header inicial e rolado, menu mobile, foco e seleção da galeria
por teclado, seleção da galeria desktop e links contextuais de WhatsApp. Interações
de âncora e galeria confirmadas no build de produção. Nenhuma imagem quebrada na
checagem final da Home em produção. Sem deformação das imagens; a galeria mantém
`object-contain` para apresentar a imagem inteira.

Contrastes calculados: branco/azul principal **5,92:1**; branco/azul profundo
**12,42:1**; texto secundário/superfície secundária **5,09:1**; texto principal/fundo
**14,54:1**; foco/branco **5,61:1**.

## 7. Inventário de arquivos

### Criados

- `docs/asset-generation.md`
- `docs/delivery-report.md`
- `public/brand/aurevia-symbol-inverse.svg`
- `public/brand/aurevia-symbol.svg`
- `public/images/hero/aurevia-sala.webp`
- `public/images/office/aurevia-atendimento.webp`
- `public/images/properties/MC-001/area-gourmet.webp`
- `public/images/properties/MC-001/cozinha.webp`
- `public/images/properties/MC-001/fachada.webp`
- `public/images/properties/MC-001/sala.webp`
- `public/images/properties/MC-002/cozinha.webp`
- `public/images/properties/MC-002/quarto.webp`
- `public/images/properties/MC-002/sala.webp`
- `public/images/properties/MC-002/varanda.webp`
- `public/images/properties/MC-003/topografia.webp`
- `public/images/properties/MC-003/vista-frontal.webp`
- `public/images/properties/MC-003/vista-fundos.webp`
- `public/images/properties/MC-003/vista-lateral.webp`
- `public/images/properties/MC-004/fachada.webp`
- `public/images/properties/MC-004/pomar.webp`
- `public/images/properties/MC-004/sala.webp`
- `public/images/properties/MC-004/varanda.webp`
- `public/images/properties/MC-005/apoio.webp`
- `public/images/properties/MC-005/copa.webp`
- `public/images/properties/MC-005/fachada.webp`
- `public/images/properties/MC-005/salao.webp`
- `public/images/properties/MC-006/cozinha.webp`
- `public/images/properties/MC-006/fachada.webp`
- `public/images/properties/MC-006/quintal.webp`
- `public/images/properties/MC-006/sala.webp`
- `review-screenshots/aurevia-apartamento-1024-full.jpg`
- `review-screenshots/aurevia-apartamento-1440-full.jpg`
- `review-screenshots/aurevia-apartamento-390-full.jpg`
- `review-screenshots/aurevia-apartamento-768-full.jpg`
- `review-screenshots/aurevia-casa-1024-full.jpg`
- `review-screenshots/aurevia-casa-1440-full.jpg`
- `review-screenshots/aurevia-casa-390-full.jpg`
- `review-screenshots/aurevia-casa-768-full.jpg`
- `review-screenshots/aurevia-catalogo-1024-full.jpg`
- `review-screenshots/aurevia-catalogo-1440-full.jpg`
- `review-screenshots/aurevia-catalogo-390-full.jpg`
- `review-screenshots/aurevia-catalogo-768-full.jpg`
- `review-screenshots/aurevia-comercial-1024-full.jpg`
- `review-screenshots/aurevia-comercial-1440-full.jpg`
- `review-screenshots/aurevia-comercial-390-full.jpg`
- `review-screenshots/aurevia-comercial-768-full.jpg`
- `review-screenshots/aurevia-confins-1024-full.jpg`
- `review-screenshots/aurevia-confins-1440-full.jpg`
- `review-screenshots/aurevia-confins-390-full.jpg`
- `review-screenshots/aurevia-confins-768-full.jpg`
- `review-screenshots/aurevia-contato-footer-desktop.jpg`
- `review-screenshots/aurevia-contato-mobile.jpg`
- `review-screenshots/aurevia-galeria-desktop.jpg`
- `review-screenshots/aurevia-galeria-mobile-teclado.jpg`
- `review-screenshots/aurevia-home-1024-full.jpg`
- `review-screenshots/aurevia-home-1440-full.jpg`
- `review-screenshots/aurevia-home-1440.jpg`
- `review-screenshots/aurevia-home-390-full.jpg`
- `review-screenshots/aurevia-home-768-full.jpg`
- `review-screenshots/aurevia-menu-mobile.jpg`
- `review-screenshots/aurevia-rural-1024-full.jpg`
- `review-screenshots/aurevia-rural-1440-full.jpg`
- `review-screenshots/aurevia-rural-390-full.jpg`
- `review-screenshots/aurevia-rural-768-full.jpg`
- `review-screenshots/aurevia-terreno-1024-full.jpg`
- `review-screenshots/aurevia-terreno-1440-full.jpg`
- `review-screenshots/aurevia-terreno-390-full.jpg`
- `review-screenshots/aurevia-terreno-768-full.jpg`
- `review-screenshots/aurevia-vazio-1024-full.jpg`
- `review-screenshots/aurevia-vazio-1440-full.jpg`
- `review-screenshots/aurevia-vazio-390-full.jpg`
- `review-screenshots/aurevia-vazio-768-full.jpg`
- `review-screenshots/visual-metrics.json`
- `tests/demo-catalog.test.ts`

### Modificados

- `README.md`
- `app/globals.css`
- `app/imoveis/page.tsx`
- `app/layout.tsx`
- `app/page.tsx`
- `app/preview/imovel/[scenario]/preview-properties.ts`
- `components/home/about-section.tsx`
- `components/home/contact-section.tsx`
- `components/home/featured-properties-section.tsx`
- `components/home/home-hero.tsx`
- `components/layout/brand-logo.tsx`
- `components/layout/mobile-navigation.tsx`
- `components/layout/site-footer.tsx`
- `components/layout/site-header.tsx`
- `components/layout/site-navigation.tsx`
- `components/property/active-property-filters.tsx`
- `components/property/property-detail.tsx`
- `components/ui/button.tsx`
- `config/site.ts`
- `data/properties.json`
- `data/properties.ts`
- `data/property-id-state.json`
- `lib/properties/search.ts`
- `lib/whatsapp/property-contact.ts`
- `package-lock.json`
- `package.json`
- `public/images/property-placeholder/apartment-placeholder.svg`
- `public/images/property-placeholder/commercial-placeholder.svg`
- `public/images/property-placeholder/house-placeholder.svg`
- `public/images/property-placeholder/land-placeholder.svg`
- `public/images/property-placeholder/property-placeholder.svg`
- `public/images/property-placeholder/rural-placeholder.svg`
- `tests/business-location.test.ts`
- `tests/fixtures/properties.ts`
- `tests/google-maps.test.ts`
- `tests/property-cli-delete.test.ts`
- `tests/property-cli-id-state.test.ts`
- `tests/property-cli-multiline-description.test.ts`
- `tests/property-cli-next-id.test.ts`
- `tests/property-cli-storage.test.ts`
- `tests/property-presentation.test.ts`
- `tests/property-queries.test.ts`
- `tests/property-schema.test.ts`
- `tests/property-search.test.ts`
- `tests/property-whatsapp.test.ts`

### Removidos

- `components/home/design-system-preview.tsx`
- `components/home/property-card-preview-data.ts`
- `components/home/hero-property-visual.tsx`
- Dois PNGs da identidade anterior em `public/brand/`.
- O antigo Hero PNG em `public/images/hero/`.
- As duas fotografias anteriores de atendimento em `public/images/office/`.
- Todos os 30 JPEGs do catálogo anterior: seis de MC-004, cinco de MC-005,
  cinco de MC-006, cinco de MC-007, quatro de MC-008 e cinco de MC-009.
- Pastas antigas MC-007, MC-008 e MC-009 após validar as novas referências.
- Onze screenshots de revisão anteriores.

A remoção foi restrita aos arquivos confirmados sem uso, depois de validar os novos
assets. Arquivos temporários desta execução foram retirados. Instruções originais
do repositório e arquivos de suporte gerados pelo Next foram preservados.
O diff foi revisado e a busca final não encontrou resíduos comerciais da identidade
anterior nos arquivos ativos.

## 8. Limitações e decisões humanas

Na entrega inicial, nenhum impedimento para utilizar a demonstração local. Domínio planejado continua
inativo; marca, catálogo, fotografias e endereço permanecem fictícios. Não houve
publicação ou alteração de serviços externos nessa etapa inicial.

## Atualização posterior — Instagram e galerias

O link do Instagram foi atualizado para o endereço informado de `@pablo_.matoso`.
Foram adicionadas seis novas fotografias originais, elevando cada galeria a cinco
imagens. As setas de anterior/próxima agora aparecem também no celular, junto às
miniaturas. O inventário da entrega inicial acima registra o estado anterior;
os novos assets e prompts estão em `docs/additional-property-images.md`.

Validação desta atualização: `npm run check` aprovado, com 129 testes. Navegação
até a quinta imagem confirmada nos seis imóveis em desktop e em 390 px, sem
overflow horizontal. Destino do botão Ver Instagram conferido no navegador.

## Estado atual — galeria e repositório privado

O projeto usa o repositório privado
[LuidiC/aurevia-imoveis](https://github.com/LuidiC/aurevia-imoveis), na branch
`main`. A pasta local aponta para ele por `origin`; a conexão anterior foi
preservada como `legacy-origin`. O histórico Git existente foi mantido.

O catálogo atual contém seis imóveis ativos, três destaques e cinco fotos por
imóvel, totalizando 30 fotografias de imóveis e duas institucionais. O Instagram
aponta para o endereço informado de `@pablo_.matoso`.

A falha de navegação da galeria pelo IP local foi corrigida autorizando
explicitamente `172.30.112.1` em `allowedDevOrigins`, sem liberar outras origens.
As prévias agora são renderizadas no HTML inicial e adaptadas por CSS: laterais
no computador e abaixo da foto no celular. Setas, seleção por miniatura, ciclo
completo das cinco imagens e navegação por teclado foram conferidos no navegador.

Validação atual: `npm run check` aprovado com 131 testes, validação dos seis
registros e build de produção. Dois testes de regressão em
`tests/property-gallery.test.ts` cobrem prévias antes da hidratação e o fallback
sem imagens. Capturas da correção:

- `review-screenshots/aurevia-galeria-corrigida-desktop.jpg`
- `review-screenshots/aurevia-galeria-corrigida-mobile.jpg`

Código, assets, catálogo, testes, documentação e capturas integram o versionamento.
Dependências instaladas, builds, logs e arquivos locais de ambiente permanecem
ignorados. O envio do código ao GitHub não inclui implantação de hospedagem.
