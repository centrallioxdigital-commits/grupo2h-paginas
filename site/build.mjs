// Gera o site principal do Grupo 2!H.
//   node site/build.mjs              (usa o modo de site.config.json)
//   SITE_MODE=producao node site/build.mjs
//
// Lê os posts publicados no Supabase, escreve as páginas estáticas, sitemap,
// RSS, llms.txt, robots.txt (só em produção) e a 404 da raiz do domínio.
// Só regrava arquivo que mudou e apaga o que deixou de existir (manifesto),
// sem nunca tocar nas LPs que moram no mesmo repositório.

import { cfg, write, writeRoot, copiarStatic, juntarCss, finalizarManifesto } from './lib/core.mjs';
import { topografia } from './lib/visuais.mjs';
import { buscarPosts, prepararPost } from './lib/blog.mjs';
import { home } from './pages/home.mjs';
import { paginasInstitucionais } from './pages/institucionais.mjs';
import { paginasServicos } from './pages/solucoes.mjs';
import { paginasBlog } from './pages/blog.mjs';
import { arquivosSEO } from './pages/seo.mjs';
import { paginaAdmin } from './pages/admin.mjs';
import { pagina404 } from './pages/nao-encontrada.mjs';

const t0 = Date.now();
console.log(`Modo: ${cfg.modo} · base ${cfg.base} · saída ${cfg.saida}`);

// 1. Arquivos estáticos e texturas
copiarStatic();
juntarCss();
write('assets/img/topo-hero.svg', topografia({ w: 1600, h: 900, centros: [[1180, 260, 620], [260, 820, 420]], passo: 24, semente: 11 }));
write('assets/img/topo-capa.svg', topografia({ w: 1600, h: 700, centros: [[1250, 330, 560]], passo: 22, semente: 23 }));
write('assets/img/topo-cta.svg', topografia({ w: 1600, h: 800, centros: [[800, 420, 700]], passo: 26, semente: 5 }));
write('assets/img/topo-cartao.svg', topografia({ w: 800, h: 800, centros: [[640, 160, 520]], passo: 22, semente: 31 }));

// 2. Posts do blog (se o Supabase falhar, para aqui sem apagar nada)
const posts = (await buscarPosts()).map(prepararPost);
console.log(`Posts publicados: ${posts.length}`);

// 3. Páginas
const paginas = [
  { path: '', html: home({ posts }) },
  ...paginasInstitucionais({ posts }),
  ...paginasServicos(),
  ...paginasBlog({ posts }),
  paginaAdmin(),
];
for (const p of paginas) write(`${p.path}index.html`, p.html);

// 4. SEO e GEO: sitemap, RSS, llms.txt, manifest, robots (produção)
for (const f of arquivosSEO({ paginas, posts })) write(f.path, f.conteudo);

// 5. 404 da raiz do domínio (também abre post recém-publicado antes do próximo build)
writeRoot('404.html', pagina404());

const { total, removidos } = finalizarManifesto();
console.log(`Pronto: ${paginas.length} páginas, ${total} arquivos controlados${removidos.length ? `, removidos: ${removidos.join(', ')}` : ''} (${Date.now() - t0} ms)`);
