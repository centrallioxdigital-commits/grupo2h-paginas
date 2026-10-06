# Lead magnet: 7 sinais de que sua agência não é transparente com você

Página: https://grupo2h.com.br/7-sinais/ (mora em `7-sinais/` na raiz do repositório, como as outras LPs).

- `conteudo.mjs`: todo o texto (título, os 7 sinais, faixas do resultado, webhook, WhatsApp, link da política).
- `pagina.mjs`: a página, montada com os componentes do site (pílulas, botões, capa, cartões, perguntas, divisórias, faixa final).
- `gerar.mjs`: copia o CSS, o `site.js` e as imagens do site para `7-sinais/assets/`, grava `7-sinais/index.html`, `7-sinais/material.html` e imprime o PDF pelo Chrome.

Mudou o visual do site (CSS ou `site.js`)? Rode o gerador de novo para a página acompanhar.

Mudou algum texto? Edite `conteudo.mjs` e rode:

```bash
node site/lead-magnet/gerar.mjs
```

## Como funciona
1. A pessoa preenche nome, WhatsApp, faturamento e "sua agência te mostra os números?" e autoriza o contato (LGPD).
2. Os dados vão para o n8n em `.../webhook/grupo2h?source=lead-magnet` (campos: `source`, `formulario`, `nome`, `whatsapp` com 55, `faturamento`, `agencia_mostra_numeros`, `consentimento_lgpd`, `pagina`, `enviado_em` e, se houver, `origem` e `utm_*`). O workflow precisa ter o ramo `lead-magnet` ativo.
3. O checklist abre na página: a pessoa marca os sinais e vê a faixa (verde, amarelo ou vermelho), com botões para o diagnóstico gratuito (`/diagnostico-rapido/?origem=lead-magnet-7-sinais&sinais=N`), o PDF e o WhatsApp.
4. O GTM recebe o evento `lead_magnet` (`lead_magnet: 7-sinais`).

Quem já preencheu volta direto para o checklist (fica guardado no navegador).

Na virada do site para produção, troque `privacidade` em `conteudo.mjs` para `/privacidade/` e gere de novo.
