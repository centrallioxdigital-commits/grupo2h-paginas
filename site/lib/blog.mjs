// Blog: busca os posts publicados no Supabase e prepara cada um para virar
// página estática (HTML, índice, tempo de leitura, resumo).

import { Marked } from 'marked';
import { cfg, u, abs, esc, slugify, icon, dataBR } from './core.mjs';

export const CATEGORIAS = {
  estrategia: 'Estratégia',
  estrutura: 'Estrutura digital',
  trafego: 'Tráfego',
  dados: 'Dados e rastreamento',
  comercial: 'Comercial e CRM',
  'metodo-5a': 'Método 5A',
};

const COLUNAS = 'id,slug,titulo,resumo,conteudo,capa_url,capa_alt,categoria,tags,publicado_em,autor_nome,atualizado_em';

/** Busca os posts publicados. Se o Supabase não responder, o build para (nada é apagado). */
export async function buscarPosts() {
  const url = `${cfg.supabase.url}/rest/v1/blog_posts?select=${COLUNAS}&status=eq.publicado&publicado_em=lte.${encodeURIComponent(new Date().toISOString())}&order=publicado_em.desc`;
  let ultimoErro;
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      const r = await fetch(url, { headers: { apikey: cfg.supabase.chavePublica, Accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
      if (!r.ok) throw new Error(`Supabase respondeu ${r.status}: ${await r.text()}`);
      return await r.json();
    } catch (e) {
      ultimoErro = e;
      await new Promise((res) => setTimeout(res, 1500 * tentativa));
    }
  }
  throw new Error(`Não consegui ler os posts do Supabase (${ultimoErro?.message}). Build interrompido para não apagar o blog.`);
}

/** Resolve a capa: URL absoluta (Supabase) ou caminho do site ('/assets/...'). */
export function capaUrl(p) {
  if (!p.capa_url) return null;
  if (/^https?:\/\//.test(p.capa_url)) return p.capa_url;
  return u(p.capa_url.replace(/^\//, ''));
}
export function capaAbs(p) {
  if (!p.capa_url) return null;
  if (/^https?:\/\//.test(p.capa_url)) return p.capa_url;
  return abs((cfg.producao ? '' : cfg.base.replace(/^\//, '')) + p.capa_url.replace(/^\//, ''));
}

function criarMarked(indice) {
  const ids = new Map();
  const m = new Marked({ gfm: true, breaks: false });
  m.use({
    renderer: {
      heading({ tokens, depth }) {
        const texto = this.parser.parseInline(tokens);
        const plano = texto.replace(/<[^>]+>/g, '');
        let id = slugify(plano) || 'secao';
        const n = (ids.get(id) || 0) + 1; ids.set(id, n);
        if (n > 1) id += `-${n}`;
        const nivel = Math.min(Math.max(depth, 2), 4); // o h1 é só o título do post
        if (nivel === 2 || nivel === 3) indice.push({ id, texto: plano, nivel });
        return `<h${nivel} id="${id}">${texto}</h${nivel}>\n`;
      },
      html({ text }) { return esc(text); }, // HTML cru do autor vira texto: nada de script no site
      link({ href, title, tokens }) {
        const texto = this.parser.parseInline(tokens);
        if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) return texto;
        // links para páginas do site seguem a base (prévia em /novo/, produção em /)
        if (/^\/(solucoes|como-funciona|comofunciona|sobre|metodo-5a|blog|contato|glossario|perguntas-frequentes|privacidade)(\/|$|#|\?)/.test(href)) href = u(href);
        const externo = /^https?:/i.test(href) && !href.startsWith(cfg.dominio);
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${externo ? ' target="_blank" rel="noopener"' : ''}>${texto}</a>`;
      },
      image({ href, title, text }) {
        if (!/^(https?:|\/)/i.test(href)) return '';
        return `<img src="${esc(href)}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ''} loading="lazy" decoding="async">`;
      },
    },
  });
  return m;
}

export function prepararPost(p) {
  const indice = [];
  const html = criarMarked(indice).parse(p.conteudo || '');
  const textoPlano = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const palavras = textoPlano.split(' ').filter(Boolean).length;
  const resumo = (p.resumo && p.resumo.trim()) || (textoPlano.length > 158 ? textoPlano.slice(0, 155).replace(/\s+\S*$/, '') + '...' : textoPlano);
  return {
    ...p,
    categoriaNome: CATEGORIAS[p.categoria] || 'Artigo',
    html,
    indice,
    palavras,
    leitura: Math.max(1, Math.round(palavras / 200)),
    resumoFinal: resumo,
    path: `blog/${p.slug}/`,
    data: dataBR(p.publicado_em),
    textoPlano,
  };
}

export function cartaoPost(p, { nivel = 'h3', carregar = 'lazy' } = {}) {
  const capa = capaUrl(p);
  return `<article class="post-card" data-slug="${esc(p.slug)}" data-texto="${esc((p.titulo + ' ' + p.resumoFinal + ' ' + p.categoriaNome).toLowerCase())}">
  <div class="post-capa">${capa ? `<img src="${esc(capa)}" alt="${esc(p.capa_alt || '')}" loading="${carregar}" decoding="async" width="800" height="500">` : ''}</div>
  <div class="post-meta"><span class="post-cat">${esc(p.categoriaNome)}</span><span>${esc(p.data)}</span><span>${p.leitura} min de leitura</span></div>
  <${nivel}><a href="${u(p.path)}">${esc(p.titulo)}</a></${nivel}>
  <p>${esc(p.resumoFinal)}</p>
</article>`;
}

export function blogPostingLD(p) {
  const img = capaAbs(p);
  return {
    '@type': 'BlogPosting',
    '@id': abs(p.path) + '#artigo',
    headline: p.titulo,
    description: p.resumoFinal,
    datePublished: p.publicado_em,
    dateModified: p.atualizado_em || p.publicado_em,
    inLanguage: 'pt-BR',
    mainEntityOfPage: abs(p.path),
    url: abs(p.path),
    wordCount: p.palavras,
    articleSection: p.categoriaNome,
    keywords: (p.tags || []).join(', ') || undefined,
    ...(img ? { image: [img] } : {}),
    author: p.autor_nome ? { '@type': 'Person', name: p.autor_nome, worksFor: { '@id': abs('#organizacao') } } : { '@id': abs('#organizacao') },
    publisher: { '@id': abs('#organizacao') },
  };
}

export const iconeCategoria = { estrategia: 'compass', estrutura: 'stack', trafego: 'megaphone', dados: 'chart-bar', comercial: 'handshake', 'metodo-5a': 'path' };
export { icon };
