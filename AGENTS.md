# Instruções para agentes

Estas regras se aplicam a toda tarefa futura neste repositório.

1. Leia o código existente e o briefing da tarefa antes de alterar arquivos.
2. Preserve a arquitetura e a separação atual de responsabilidades.
3. Não adicione dependências sem necessidade comprovada.
4. Utilize TypeScript estrito.
5. Não utilize `any` sem justificativa técnica concreta.
6. Mantenha componentes com responsabilidade clara e limitada.
7. Não duplique lógica; compartilhe apenas o que tiver uso real.
8. Prefira Server Components quando não houver necessidade de Client Component.
9. Utilize `"use client"` somente quando necessário.
10. Preserve semântica, navegação por teclado, contraste e demais requisitos de acessibilidade.
11. Desenvolva interfaces mobile-first.
12. Não introduza Analytics.
13. Não introduza backend ou banco de dados sem instrução explícita.
14. Não altere requisitos comerciais por conta própria.
15. Não crie funcionalidades fora do escopo solicitado.
16. Execute todas as validações existentes antes de concluir uma tarefa.
17. Nunca exponha secrets, tokens ou credenciais no código, nos logs ou na documentação.
18. Evite comentários redundantes; documente apenas decisões não evidentes.
19. Mantenha o código simples, legível e sustentável.
20. Antes de concluir tarefas grandes, revise o próprio diff e remova alterações acidentais.

## Validação obrigatória

Execute, no mínimo:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

O atalho `npm run check` executa as quatro validações em sequência. Não silencie erros para fazer as validações passarem.
