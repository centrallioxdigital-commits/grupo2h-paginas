# Site principal do Grupo 2!H

Site institucional com blog, gerado como páginas estáticas (rápido, barato e
fácil para Google e IAs lerem). Mora no mesmo repositório das LPs
(`centrallioxdigital-commits/grupo2h-paginas`), sem tocar nelas.

- **Prévia (agora):** https://grupo2h.com.br/novo/ (fora do Google, com `noindex`)
- **Publicar post:** https://grupo2h.com.br/novo/blog/admin/ (vira `/blog/admin/` em produção)

## Como funciona

```
site/                      código e conteúdo do site (é aqui que se mexe)
  site.config.json         modo (previa | producao), domínio, Supabase, GTM
  content/                 textos: empresa, serviços, Método 5A, FAQ, glossário
  pages/                   uma função por página (home, institucionais, soluções, blog, SEO, admin, 404)
  lib/                     gerador: layout, ilustrações em código, blog, núcleo
  static/                  CSS, JS, fontes, fotos e ícones (copiados para assets/)
  supabase/                migração do blog (com rollback) e os artigos iniciais
  tools/                   scripts das imagens (fotos do Unsplash e capas)
  build.mjs                gera tudo
  serve.mjs                servidor local que imita o GitHub Pages
novo/                      SAÍDA gerada (não editar à mão)
404.html                   404 do domínio (gerado)
.github/workflows/site.yml robô que regera o blog a cada 10 minutos
```

1. O time publica o post no painel (`/blog/admin/`). O login é o mesmo do
   painel interno (Supabase do Dashboard 2!H). Só publica quem é
   administrador ou tem a área **Conteúdo** liberada (regra no banco).
2. O post abre na hora pelo link (a 404 busca o post no Supabase e mostra).
3. Em até ~10 minutos o robô do GitHub gera a página estática do post,
   atualiza a lista do blog, as categorias, o `sitemap.xml`, o RSS e os
   `llms.txt`. Essa é a versão que o Google e as IAs leem.
4. Tirou o post do ar ou apagou? O robô remove a página no ciclo seguinte.

## Rodar no computador

```bash
cd site
npm install
node build.mjs
node serve.mjs
```

Abra http://localhost:8792/novo/

## Virar a chave (prévia para produção)

1. Em `site/site.config.json`, troque `"modo": "previa"` por `"modo": "producao"`.
2. Rode `node site/build.mjs`. O site passa a ser gerado na raiz:
   `index.html` (a home atual é substituída), `/sobre/`, `/como-funciona/`,
   `/solucoes/...`, `/blog/...`, `robots.txt`, `sitemap.xml`, `llms.txt`.
   As LPs (`/edb/`, `/mentoria5a/`, `/imersao5a/`...) não são tocadas.
3. Apague a pasta `novo/` e faça commit e push.
4. No Google Search Console, envie `https://grupo2h.com.br/sitemap.xml`.
5. No Supabase do painel, em Authentication > URL Configuration, inclua
   `https://grupo2h.com.br/blog/admin/` nas Redirect URLs (para o
   "esqueci a senha" voltar para o painel do blog).

Para voltar atrás: `git revert` do commit da virada.

## SEO e GEO (Google e IAs)

- Página estática por post, com título, descrição, imagem de compartilhamento,
  dados estruturados (`BlogPosting`, `BreadcrumbList`) e data de atualização.
- `Organization`, `WebSite`, `Service` (cada serviço), `FAQPage`, `HowTo`
  (Como funciona), `Course` (programas 5A) e `DefinedTermSet` (glossário).
- `sitemap.xml`, `blog/rss.xml`, `llms.txt` e `llms-full.txt` (texto
  completo do site para IAs).
- `robots.txt` (produção) libera explicitamente GPTBot, ChatGPT, ClaudeBot,
  PerplexityBot, Google-Extended, Applebot e Bing.
- IndexNow: quando um post sai em produção, o robô avisa o Bing (que
  alimenta a busca do ChatGPT e do Copilot).

## Fotos

Fotos do Unsplash (licença gratuita para uso comercial), tratadas com o tom
da marca por `site/tools/baixar_fotos.py` (lista em `tools/fotos.json`).
Quando o time mandar fotos reais (equipe, escritório, eventos), troque o
arquivo em `site/static/img/fotos/` mantendo o nome, ou ajuste o JSON.

## Dados da empresa

Tudo em `site/content/empresa.mjs`. Campos `null` (CNPJ, endereço, redes,
time, cases) simplesmente não aparecem até serem preenchidos. A seção de
cases da home só aparece quando houver pelo menos um case real.
