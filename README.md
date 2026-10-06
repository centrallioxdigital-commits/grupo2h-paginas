# Formulários · Grupo 2H

Duas páginas estáticas hospedadas no GitHub Pages, no domínio `grupo2h.com.br`.

| Página | URL | Perguntas |
|---|---|---|
| Ficha de matrícula da Imersão Estrutura 5A | https://grupo2h.com.br/ficha | 10 |
| Diagnóstico Estratégico | https://grupo2h.com.br/diagnostico | 11 |

A raiz do domínio não serve nada de propósito, para deixar `grupo2h.com.br`
livre para um site institucional no futuro.

## Como funcionam

Formato Typeform: uma pergunta por tela, barra de progresso, Enter avança,
Esc volta, a letra da opção marca e avança sozinha. Todas as perguntas são
obrigatórias e de alternativa única, fora os campos de texto.

No fim, a pessoa autoriza o uso dos dados (LGPD) e o formulário calcula uma
nota de lead de 0 a 100 antes de enviar tudo para o n8n.

## Para editar

Cada página é um arquivo único, sem dependências além da fonte do Google.
Abra `ficha/index.html` ou `diagnostico/index.html` e procure:

- `const CONFIG = {` — link do grupo de WhatsApp, URL do webhook, nome da
  empresa e e-mail de contato do texto da LGPD.
- `const Q = [` — as perguntas, as opções e os textos de apoio.
- `const SCORE = {` — os pesos do lead scoring, as faixas e as regras de corte.
  Os pesos seguem a mesma ordem das opções de cada pergunta.

Do bloco `MOTOR` para baixo é o mecanismo do formulário, não precisa mexer.

Depois de editar, um `git push` para a branch `main` republica sozinho.

## Webhook

| Formulário | URL |
|---|---|
| Ficha | `https://n8n-n8n-start.dnjlb7.easypanel.host/webhook/grupo2h?source=onboarding` |
| Diagnóstico | `https://n8n-n8n-start.dnjlb7.easypanel.host/webhook/grupo2h?source=diagnostico` |

O `source` chega em `$json.query.source` e separa os dois fluxos dentro do n8n.
O workflow precisa estar ativo, senão a resposta é 404 e o envio se perde.

A documentação completa (payload, pesos do scoring, faixas e regras de corte)
está em `LEIA-ME-FORMULARIOS.md`, na pasta do projeto.

## Site principal (novo)

O site institucional com blog fica em `site/` (código, textos e documentação)
e é gerado para `novo/` enquanto está em prévia (https://grupo2h.com.br/novo/).
Guia completo em [`site/README.md`](site/README.md). O robô
`.github/workflows/site.yml` regera as páginas do blog a cada 10 minutos.
