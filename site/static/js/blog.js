/* Listagem do blog: busca instantânea e posts recém-publicados.
   A página estática já traz todos os posts gerados; este script só soma
   os que foram publicados depois do último build (aparecem na hora). */
(function () {
  'use strict';
  var G = window.G2H_BLOG || {};
  var doc = document;
  var lista = doc.querySelector('[data-lista-posts]');
  var vazio = doc.querySelector('[data-sem-resultado]');
  var busca = doc.querySelector('[data-busca]');

  function cartoes() { return Array.prototype.slice.call(doc.querySelectorAll('.post-card')); }

  function filtrar() {
    if (!busca) return;
    var q = busca.value.trim().toLowerCase();
    var n = 0;
    cartoes().forEach(function (c) {
      var ok = !q || (c.getAttribute('data-texto') || '').indexOf(q) !== -1;
      c.hidden = !ok; if (ok) n++;
    });
    if (vazio) vazio.hidden = n > 0 || !cartoes().length;
  }
  if (busca) busca.addEventListener('input', filtrar);

  function esc(s) { var d = doc.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function dataBR(iso) { try { return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; } }
  function capa(p) { if (!p.capa_url) return ''; return /^https?:/.test(p.capa_url) ? p.capa_url : G.base + p.capa_url.replace(/^\//, ''); }

  if (!lista || !G.url || !window.fetch) return;
  var url = G.url + '/rest/v1/blog_posts?select=slug,titulo,resumo,capa_url,capa_alt,categoria,publicado_em&status=eq.publicado&publicado_em=lte.' + encodeURIComponent(new Date().toISOString()) + '&order=publicado_em.desc&limit=12';
  fetch(url, { headers: { apikey: G.chave } })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (posts) {
      var novos = posts.filter(function (p) { return !doc.querySelector('[data-slug="' + p.slug + '"]'); });
      novos.reverse().forEach(function (p) {
        var cat = (G.categorias && G.categorias[p.categoria]) || 'Artigo';
        var resumo = p.resumo || '';
        var a = doc.createElement('article');
        a.className = 'post-card';
        a.setAttribute('data-slug', p.slug);
        a.setAttribute('data-texto', (p.titulo + ' ' + resumo + ' ' + cat).toLowerCase());
        var img = capa(p);
        a.innerHTML = '<div class="post-capa">' + (img ? '<img src="' + esc(img) + '" alt="' + esc(p.capa_alt || '') + '" loading="lazy">' : '') + '</div>' +
          '<div class="post-meta"><span class="post-cat">' + esc(cat) + '</span><span>' + esc(dataBR(p.publicado_em)) + '</span><span>Novo</span></div>' +
          '<h3><a href="' + G.base + 'blog/' + encodeURIComponent(p.slug) + '/">' + esc(p.titulo) + '</a></h3>' +
          '<p>' + esc(resumo) + '</p>';
        lista.insertBefore(a, lista.firstChild);
      });
      if (novos.length && vazio && !busca) vazio.hidden = true;
      if (novos.length) filtrar();
    })
    .catch(function () { /* sem rede: fica a lista estática */ });
})();
