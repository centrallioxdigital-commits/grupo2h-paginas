/* Roda na 404 da raiz. Se o endereço for de um post do blog que acabou de
   ser publicado (o robô ainda não gerou a página estática), busca o post no
   Supabase e mostra na hora. Quando a página estática existir, ela é que
   abre (e é a que o Google e as IAs leem). */
(function () {
  'use strict';
  var G = window.G2H_BLOG || {};
  var prefixo = (G.base || '/') + 'blog/';
  var caminho = decodeURIComponent(location.pathname);
  if (caminho.indexOf(prefixo) !== 0) return;
  var slug = caminho.slice(prefixo.length).replace(/\/+$/, '');
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug === 'admin') return;

  var alvo = document.querySelector('[data-nf]');
  if (!alvo) return;
  alvo.style.opacity = '0';
  var mostrar404 = function () { alvo.style.opacity = ''; };

  function carregar(src) {
    return new Promise(function (ok, erro) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = erro; document.head.appendChild(s); });
  }
  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }

  var url = G.url + '/rest/v1/blog_posts?select=slug,titulo,resumo,conteudo,capa_url,capa_alt,categoria,publicado_em,autor_nome&status=eq.publicado&slug=eq.' + encodeURIComponent(slug) + '&limit=1';
  Promise.all([
    fetch(url, { headers: { apikey: G.chave } }).then(function (r) { return r.ok ? r.json() : []; }),
    carregar('https://cdn.jsdelivr.net/npm/marked@15.0.12/marked.min.js'),
    carregar('https://cdn.jsdelivr.net/npm/dompurify@3.2.6/dist/purify.min.js'),
  ]).then(function (res) {
    var p = res[0][0];
    if (!p || !window.marked || !window.DOMPurify) return mostrar404();
    var cat = (G.categorias && G.categorias[p.categoria]) || 'Artigo';
    var capa = p.capa_url ? (/^https?:/.test(p.capa_url) ? p.capa_url : G.base + p.capa_url.replace(/^\//, '')) : '';
    var html = DOMPurify.sanitize(marked.parse(p.conteudo || ''), { FORBID_TAGS: ['style', 'iframe', 'form'], FORBID_ATTR: ['style'] });
    var palavras = (p.conteudo || '').split(/\s+/).length;
    var data = new Date(p.publicado_em).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    document.title = p.titulo + ' | Grupo 2!H';
    var sec = document.createElement('div');
    sec.innerHTML =
      '<header class="post-cab"><div class="wrap">' +
      '<nav class="trilha" aria-label="Você está em"><ol><li><a href="' + G.base + '">Início</a></li><li><a href="' + G.base + 'blog/">Blog</a></li><li aria-current="page">' + esc(cat) + '</li></ol></nav>' +
      '<p class="post-cat" style="margin-bottom:16px">' + esc(cat) + '</p><h1 class="post-h1">' + esc(p.titulo) + '</h1>' +
      (p.resumo ? '<p class="post-resumo">' + esc(p.resumo) + '</p>' : '') +
      '<div class="post-info"><span>Por <b>' + esc(p.autor_nome || 'Equipe 2!H') + '</b></span><span>' + esc(data) + '</span><span>' + Math.max(1, Math.round(palavras / 200)) + ' min de leitura</span></div>' +
      '</div></header>' +
      (capa ? '<figure class="post-capa-g"><img src="' + esc(capa) + '" alt="' + esc(p.capa_alt || '') + '"></figure>' : '') +
      '<div class="wrap"><div class="post-corpo" style="grid-template-columns:minmax(0,720px)"><article class="prosa">' + html + '</article></div></div>';
    alvo.replaceWith(sec);
  }).catch(mostrar404);
})();
