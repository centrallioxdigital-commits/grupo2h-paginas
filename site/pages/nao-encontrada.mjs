// 404 da raiz do domínio (GitHub Pages usa /404.html para todo caminho que
// não existe). Além da página de "não encontrada", ela abre na hora um post
// recém-publicado cujo HTML estático ainda não foi gerado pelo robô.

import { cfg, u, icon, asset } from '../lib/core.mjs';
import { pagina } from '../lib/layout.mjs';
import { CATEGORIAS } from '../lib/blog.mjs';

export function pagina404() {
  const corpo = `
<section class="nf" data-nf>
  <div>
    <p class="nf-cod">404</p>
    <h1>Essa página saiu do mapa.</h1>
    <p>O endereço pode ter mudado ou não existir mais. Daqui você chega em qualquer lugar do site.</p>
    <div class="nf-links">
      <a class="btn btn-ouro" href="${u('')}">Ir para o início ${icon('arrow-right')}</a>
      <a class="btn btn-linha" href="${u('solucoes/')}">Soluções</a>
      <a class="btn btn-linha" href="${u('blog/')}">Blog</a>
      <a class="btn btn-linha" href="${u('contato/')}">Contato</a>
    </div>
  </div>
</section>`;
  return pagina({
    path: '404.html',
    titulo: 'Página não encontrada',
    descricao: 'A página que você procurou não foi encontrada no site do Grupo 2!H.',
    corpo,
    noindex: true,
    scripts: `<script>window.G2H_BLOG=${JSON.stringify({ url: cfg.supabase.url, chave: cfg.supabase.chavePublica, base: cfg.base, categorias: CATEGORIAS })};</script><script src="${asset('js/post-ao-vivo.js')}" defer></script>`,
  });
}
