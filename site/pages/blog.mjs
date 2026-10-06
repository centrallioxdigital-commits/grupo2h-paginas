// Blog: listagem, um arquivo por post e páginas de categoria.

import { cfg, u, abs, esc, icon, asset } from '../lib/core.mjs';
import { pagina, diag, trilha, capa, ctaFinal } from '../lib/layout.mjs';
import { CATEGORIAS, cartaoPost, blogPostingLD, capaUrl, capaAbs } from '../lib/blog.mjs';
import { whatsappLink } from '../content/empresa.mjs';

const scriptBlog = (extra = '') =>
  `<script>window.G2H_BLOG=${JSON.stringify({ url: cfg.supabase.url, chave: cfg.supabase.chavePublica, base: cfg.base, categorias: CATEGORIAS })};</script><script src="${asset('js/blog.js')}" defer></script>${extra}`;

function filtros(posts, atual) {
  const usadas = Object.keys(CATEGORIAS).filter((c) => posts.some((p) => p.categoria === c));
  if (!usadas.length) return '';
  return `<nav class="filtros" aria-label="Categorias"><a href="${u('blog/')}"${!atual ? ' aria-current="page"' : ''}>Todos</a>${usadas
    .map((c) => `<a href="${u(`blog/categoria/${c}/`)}"${atual === c ? ' aria-current="page"' : ''}>${esc(CATEGORIAS[c])}</a>`)
    .join('')}</nav>`;
}

function indicePagina(posts) {
  const t = trilha([{ nome: 'Blog', path: 'blog/' }]);
  const [primeiro, ...resto] = posts;
  const destaque = primeiro
    ? `<article class="destaque post-card" data-slug="${esc(primeiro.slug)}" data-texto="${esc((primeiro.titulo + ' ' + primeiro.resumoFinal + ' ' + primeiro.categoriaNome).toLowerCase())}">
        <div class="post-capa">${capaUrl(primeiro) ? `<img src="${esc(capaUrl(primeiro))}" alt="${esc(primeiro.capa_alt || '')}" width="1200" height="750" fetchpriority="high">` : ''}</div>
        <div class="post-corpo-c">
          <div class="post-meta"><span class="post-cat">Em destaque · ${esc(primeiro.categoriaNome)}</span><span class="post-chip">${icon('calendar-blank')}${esc(primeiro.data)}</span><span class="post-chip">${icon('clock')}${primeiro.leitura} min de leitura</span></div>
          <h2><a href="${u(primeiro.path)}">${esc(primeiro.titulo)}</a></h2>
          <p>${esc(primeiro.resumoFinal)}</p>
          <span class="post-ler" aria-hidden="true">Ler artigo ${icon('arrow-right')}</span>
        </div>
      </article>`
    : '';
  const corpo = `
${capa({ trilhaHtml: t.html, titulo: 'Blog da 2!H.', tituloOuro: 'Conteúdo para decidir melhor.', lead: 'Estrutura, tráfego, dados, comercial e o Método 5A, explicados por quem organiza a máquina de vendas de empresas todos os dias.', fotoFundo: 'notebook-abajur' })}
<section class="sec">
  <div class="wrap">
    ${posts.length ? `<div class="blog-topo" style="margin-bottom:40px">${filtros(posts)}<label class="busca"><span class="sr">Buscar no blog</span>${icon('magnifying-glass')}<input type="search" placeholder="Buscar artigo" data-busca autocomplete="off"></label></div>` : ''}
    ${destaque}
    <div class="posts" data-lista-posts>${resto.map((p) => cartaoPost(p)).join('')}</div>
    <p class="vazio" data-sem-resultado ${posts.length ? 'hidden' : ''}>${posts.length ? 'Nenhum artigo encontrado para essa busca.' : 'Os primeiros artigos estão sendo preparados. Volte em breve.'}</p>
  </div>
</section>
${ctaFinal({ origem: 'blog' })}`;
  const desc = 'Blog do Grupo 2!H: artigos sobre estrutura digital, tráfego, dados e rastreamento, comercial e CRM e o Método 5A para crescer com previsibilidade.';
  return {
    path: 'blog/', prioridade: 0.8, titulo: 'Blog', descricao: desc, mudanca: 'daily',
    html: pagina({
      path: 'blog/', titulo: 'Blog: estrutura, tráfego, dados e vendas', descricao: desc, corpo, tipoPagina: 'CollectionPage', scripts: scriptBlog(),
      ld: [t.ld, { '@type': 'Blog', '@id': abs('blog/') + '#blog', name: 'Blog do Grupo 2!H', url: abs('blog/'), inLanguage: 'pt-BR', publisher: { '@id': abs('#organizacao') }, blogPost: posts.slice(0, 20).map((p) => ({ '@type': 'BlogPosting', headline: p.titulo, url: abs(p.path), datePublished: p.publicado_em })) }],
    }),
  };
}

function categoriaPagina(cat, posts) {
  const nome = CATEGORIAS[cat];
  const path = `blog/categoria/${cat}/`;
  const t = trilha([{ nome: 'Blog', path: 'blog/' }, { nome, path }]);
  const corpo = `
${capa({ trilhaHtml: t.html, titulo: nome + '.', lead: `Artigos da 2!H sobre ${nome.toLowerCase()}.` })}
<section class="sec"><div class="wrap">
  <div style="margin-bottom:40px">${filtros(posts.all, cat)}</div>
  <div class="posts">${posts.cat.map((p) => cartaoPost(p)).join('')}</div>
</div></section>
${ctaFinal({ origem: `blog-${cat}` })}`;
  const desc = `Artigos do Grupo 2!H sobre ${nome.toLowerCase()}: estrutura, dados e processo para crescer com previsibilidade.`;
  return {
    path, prioridade: 0.5, titulo: `${nome} | Blog`, descricao: desc,
    html: pagina({ path, titulo: `${nome}: artigos do blog`, descricao: desc, corpo, tipoPagina: 'CollectionPage', ld: [t.ld], navAtual: 'blog/' }),
  };
}

function postPagina(p, todos) {
  const t = trilha([{ nome: 'Blog', path: 'blog/' }, { nome: p.categoriaNome, path: `blog/categoria/${p.categoria}/` }, { nome: p.titulo, path: p.path }]);
  const relacionados = [...todos.filter((x) => x.slug !== p.slug && x.categoria === p.categoria), ...todos.filter((x) => x.slug !== p.slug && x.categoria !== p.categoria)].slice(0, 3);
  const url = abs(p.path);
  const capa = capaUrl(p);
  const zap = `https://api.whatsapp.com/send?text=${encodeURIComponent(p.titulo + ' ' + url)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const corpo = `
<div class="progresso" aria-hidden="true"></div>
<header class="post-cab">
  <div class="wrap">
    ${t.html}
    <p class="post-cat" style="margin-bottom:16px">${esc(p.categoriaNome)}</p>
    <h1 class="post-h1">${esc(p.titulo)}</h1>
    ${p.resumo ? `<p class="post-resumo">${esc(p.resumo)}</p>` : ''}
    <div class="post-info">
      <span>${icon('user')} Por <b>${esc(p.autor_nome || 'Equipe 2!H')}</b></span>
      <span>${icon('calendar-blank')} <time datetime="${esc(p.publicado_em)}">${esc(p.data)}</time></span>
      <span>${icon('clock')} ${p.leitura} min de leitura</span>
    </div>
  </div>
</header>
${capa ? `<figure class="post-capa-g"><img src="${esc(capa)}" alt="${esc(p.capa_alt || '')}" width="1600" height="900" fetchpriority="high"></figure>` : ''}
<div class="wrap">
  <div class="post-corpo">
    <article class="prosa">${p.html}
      <div class="compartilhar">Compartilhar:
        <a href="${zap}" target="_blank" rel="noopener">${icon('whatsapp-logo')} WhatsApp</a>
        <a href="${linkedin}" target="_blank" rel="noopener">${icon('linkedin-logo')} LinkedIn</a>
        <button type="button" data-copiar="${esc(url)}">${icon('link')} <span>Copiar link</span></button>
      </div>
      <aside class="post-cta">
        <h2>Quer saber onde a sua empresa perde dinheiro?</h2>
        <p>Responda o diagnóstico rápido, em menos de 1 minuto. A 2!H te chama no WhatsApp para entender o seu caso.</p>
        <a class="btn btn-ouro" href="${diag(`blog-${p.slug}`.slice(0, 60))}" data-diag>Fazer o diagnóstico ${icon('arrow-right')}</a>
      </aside>
    </article>
    ${p.indice.length >= 2 ? `<nav class="indice" aria-label="Neste artigo" data-indice><p>Neste artigo</p><ol>${p.indice.map((h) => `<li class="n${h.nivel}"><a href="#${h.id}">${esc(h.texto)}</a></li>`).join('')}</ol></nav>` : '<div></div>'}
  </div>
</div>
${relacionados.length ? `<section class="sec"><div class="wrap"><div class="sec-cab blog-topo"><h2 class="h2">Continue lendo.</h2><a class="btn btn-linha" href="${u('blog/')}">Todos os artigos ${icon('arrow-right')}</a></div><div class="posts">${relacionados.map((r) => cartaoPost(r)).join('')}</div></div></section>` : ''}`;
  return {
    path: p.path, prioridade: 0.7, titulo: p.titulo, descricao: p.resumoFinal, lastmod: (p.atualizado_em || p.publicado_em).slice(0, 10), post: p,
    html: pagina({
      path: p.path, titulo: p.titulo, descricao: p.resumoFinal, corpo, tipo: 'article', imagem: capaAbs(p), imagemAlt: p.capa_alt || p.titulo, navAtual: 'blog/',
      ld: [t.ld, blogPostingLD(p)],
      extraHead: `<meta property="article:published_time" content="${esc(p.publicado_em)}"><meta property="article:modified_time" content="${esc(p.atualizado_em || p.publicado_em)}"><meta property="article:section" content="${esc(p.categoriaNome)}">${(p.tags || []).map((tg) => `<meta property="article:tag" content="${esc(tg)}">`).join('')}`,
    }),
  };
}

export function paginasBlog({ posts }) {
  const cats = Object.keys(CATEGORIAS).filter((c) => posts.some((p) => p.categoria === c));
  return [
    indicePagina(posts),
    ...posts.map((p) => postPagina(p, posts)),
    ...cats.map((c) => categoriaPagina(c, { all: posts, cat: posts.filter((p) => p.categoria === c) })),
  ];
}
