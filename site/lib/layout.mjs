// Moldura de todas as páginas: <head> com SEO completo, cabeçalho com menu,
// rodapé e dados estruturados (JSON-LD) que Google e IAs leem.

import { cfg, u, abs, esc, icon, asset, assetAbs, cssEmbutido } from './core.mjs';
import { empresa, whatsappLink } from '../content/empresa.mjs';
import { servicos } from '../content/servicos.mjs';
import { programas } from '../content/metodo.mjs';

/** Foto tratada (site/static/img/fotos): versão 800 no celular, 1600 no computador. */
export function foto(nome, alt, { cls = '', revela = true, prioridade = false, sizes = '(max-width: 900px) 100vw, 50vw', legenda = '' } = {}) {
  return `<figure class="foto ${cls}"${revela ? ' data-revela' : ''}><img src="${asset(`img/fotos/${nome}.webp`)}" srcset="${asset(`img/fotos/${nome}-800.webp`)} 800w, ${asset(`img/fotos/${nome}.webp`)} 1600w" sizes="${sizes}" alt="${esc(alt)}" ${prioridade ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">${legenda}</figure>`;
}

/** Divisa com a medalha 2!H nas dobras entre seções que mudam de clima. */
const DOBRA = /\b(bloco-ouro|creme|cta-final|capa)\b/;
function inserirDivisas(html) {
  const partes = html.split(/(?=<section class=")/);
  const orig = [...partes];
  const classe = (p) => (p.match(/^<section class="([^"]*)"/) || [, ''])[1];
  for (let i = 1; i < partes.length; i++) {
    const ant = classe(orig[i - 1]), prox = classe(orig[i]);
    if (!orig[i - 1].startsWith('<section') || !(DOBRA.test(ant) || DOBRA.test(prox))) continue;
    const tom = /creme/.test(prox) || /creme/.test(ant) ? ' no-claro' : /bloco-ouro/.test(prox) || /bloco-ouro/.test(ant) ? ' no-ouro' : '';
    partes[i] = `<div class="divisa${tom}" aria-hidden="true"><span class="divisa-selo"><span class="divisa-moeda"><img src="${asset('img/logo-2h-glyph.png')}" alt="" width="39" height="36"></span></span></div>
` + partes[i];
  }
  return partes.join('');
}

export const ORG_ID = abs('#organizacao');
export const SITE_ID = abs('#site');

/** Link para o chat de qualificação, com a origem do clique (o site.js soma as UTMs da visita). */
export const diag = (origem) => `/diagnostico-rapido/?origem=site-${origem}`;

export const NAV = [
  { label: 'Soluções', href: 'solucoes/', mega: true },
  { label: 'Método 5A', href: 'metodo-5a/' },
  { label: 'Como funciona', href: 'como-funciona/' },
  { label: 'Sobre', href: 'sobre/' },
  { label: 'Blog', href: 'blog/' },
  { label: 'Contato', href: 'contato/' },
];

export function organizacaoLD() {
  const sameAs = [empresa.instagram, empresa.linkedin, empresa.youtube].filter(Boolean);
  const org = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: empresa.nome,
    alternateName: ['2!H', 'Grupo 2H', '2H'],
    url: abs(''),
    logo: { '@type': 'ImageObject', url: assetAbs('img/icon-512.png'), width: 512, height: 512 },
    description: empresa.descricao,
    slogan: empresa.slogan,
    email: empresa.email,
    telephone: '+' + empresa.whatsapp,
    areaServed: { '@type': 'Country', name: 'Brasil' },
    knowsAbout: [
      'Estruturação digital', 'Growth marketing', 'Gestão de tráfego pago', 'Meta Ads', 'Google Ads',
      'Rastreamento de conversões', 'CRM', 'Funil de vendas', 'Integração entre marketing e vendas',
      'Dashboards e inteligência de dados', 'Lançamentos', 'Método 5A',
    ],
    contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', email: empresa.email, telephone: '+' + empresa.whatsapp, availableLanguage: 'Portuguese', areaServed: 'BR' }],
  };
  if (sameAs.length) org.sameAs = sameAs;
  if (empresa.fundacao) org.foundingDate = String(empresa.fundacao);
  if (empresa.razaoSocial) org.legalName = empresa.razaoSocial;
  if (empresa.cnpj) org.taxID = empresa.cnpj;
  if (empresa.endereco) org.address = { '@type': 'PostalAddress', streetAddress: empresa.endereco.rua, addressLocality: empresa.endereco.cidade, addressRegion: empresa.endereco.uf, postalCode: empresa.endereco.cep, addressCountry: 'BR' };
  return org;
}

const siteLD = () => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: abs(''),
  name: empresa.nome,
  inLanguage: 'pt-BR',
  publisher: { '@id': ORG_ID },
});

export const breadcrumbLD = (trilha) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trilha.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.nome, item: abs(t.path) })),
});

export const faqLD = (itens) => ({
  '@type': 'FAQPage',
  mainEntity: itens.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

function cabecalho(atual) {
  const mega = `
<div class="mega" id="mega-solucoes">
  <div class="mega-in">
    <div class="mega-col">
      <p class="mega-tit">A escada de serviços</p>
      <ul class="mega-lista">${servicos
        .map((s) => `<li><a href="${u(`solucoes/${s.slug}/`)}">${icon(s.icone)}<span><b>${esc(s.nome)}</b><small>${esc(s.nomeLongo)}</small></span></a></li>`)
        .join('')}</ul>
    </div>
    <div class="mega-col">
      <p class="mega-tit">Método 5A</p>
      <ul class="mega-lista">${programas
        .map((p) => `<li><a href="${p.link}">${icon('arrow-up-right')}<span><b>${esc(p.nome)}</b><small>${esc(p.formato)}</small></span></a></li>`)
        .join('')}</ul>
      <a class="mega-todas" href="${u('solucoes/')}">Ver todas as soluções ${icon('arrow-right')}</a>
    </div>
  </div>
</div>`;
  const marcado = (href) => (atual && (atual === href || (href !== 'solucoes/' && atual.startsWith(href))) ? ' mm-atual' : '');
  const item = (href, ic, nome) => `<li><a class="mm-pilula${marcado(href)}" href="${u(href)}">${icon(ic)}<span>${esc(nome)}</span></a></li>`;
  const itemExt = (href, ic, nome) => `<li><a class="mm-pilula" href="${href}">${icon(ic)}<span>${esc(nome)}</span></a></li>`;
  const links = NAV.map((n) => {
    const ativo = atual && (atual === n.href || atual.startsWith(n.href)) ? ' aria-current="page"' : '';
    if (n.mega)
      return `<li class="nav-mega"><a href="${u(n.href)}"${ativo} aria-haspopup="true" aria-expanded="false" aria-controls="mega-solucoes">${n.label}${icon('caret-down', { cls: 'ic ic-caret' })}</a>${mega}</li>`;
    return `<li><a href="${u(n.href)}"${ativo}>${n.label}</a></li>`;
  }).join('');
  return `
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<header class="topo" data-topo>
  <div class="topo-in">
    <a class="marca" href="${u('')}" aria-label="Grupo 2!H, página inicial">
      <img src="${asset('img/logo-2h-glyph.png')}" alt="" width="39" height="36"><span>GRUPO <b>2!H</b></span>
    </a>
    <nav class="nav" aria-label="Principal"><ul>${links}</ul></nav>
    <a class="btn btn-ouro btn-sm topo-cta" href="${diag('menu')}" data-diag>Diagnóstico rápido</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-movel" data-menu-btn><span class="sr">Abrir menu</span><i></i><i></i></button>
  </div>
</header>
<div class="menu-movel" id="menu-movel" data-menu hidden>
  <div class="mm-fundo" aria-hidden="true"></div>
  <nav class="mm-painel" aria-label="Menu do celular">
    <a class="mm-pilula mm-inicio${atual === '' ? ' mm-atual' : ''}" href="${u('')}">${icon('house')}<span>Início</span></a>
    <section class="mm-grupo">
      <p class="mm-tit">Soluções</p>
      <ul class="mm-grade">${servicos.map((s) => item(`solucoes/${s.slug}/`, s.icone, s.nome.replace(' e coprodução', ''))).join('')}${item('solucoes/', 'squares-four', 'Ver todas')}</ul>
    </section>
    <section class="mm-grupo">
      <p class="mm-tit">Método 5A</p>
      <ul class="mm-grade">${item('metodo-5a/', 'graph', 'O Método 5A')}${programas.map((p, k) => itemExt(p.link, ['presentation-chart', 'users-three', 'target'][k] || 'arrow-up-right', p.nome.replace('Estrutura ', '').replace('Estratégico ', ''))).join('')}</ul>
    </section>
    <section class="mm-grupo">
      <p class="mm-tit">A 2!H</p>
      <ul class="mm-grade">${item('como-funciona/', 'compass', 'Como funciona')}${item('sobre/', 'users-three', 'Sobre')}${item('blog/', 'article', 'Blog')}${item('contato/', 'chat-circle-dots', 'Contato')}</ul>
    </section>
    <div class="mm-acoes">
      <a class="mm-acao mm-acao-ouro" href="${diag('menu-celular')}" data-diag>${icon('lightning')}<span>Diagnóstico</span></a>
      <a class="mm-acao" href="${whatsappLink()}" target="_blank" rel="noopener">${icon('whatsapp-logo')}<span>WhatsApp</span></a>
    </div>
  </nav>
</div>`;
}

function rodape() {
  const redes = [
    empresa.instagram && `<a href="${esc(empresa.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram-logo')}</a>`,
    empresa.linkedin && `<a href="${esc(empresa.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon('linkedin-logo')}</a>`,
    empresa.youtube && `<a href="${esc(empresa.youtube)}" target="_blank" rel="noopener" aria-label="YouTube">${icon('youtube-logo')}</a>`,
  ].filter(Boolean).join('');
  const legal = [empresa.razaoSocial, empresa.cnpj && `CNPJ ${empresa.cnpj}`].filter(Boolean).join(' · ');
  const lk = (href, nome, ext) => `<li><a href="${ext ? href : u(href)}"><span>${esc(nome)}</span>${icon('arrow-up-right')}</a></li>`;
  const grupo = (tit, ic, itens) => `<details class="rod-grupo" open><summary><span class="rod-g-ic">${icon(ic)}</span><span class="rod-tit">${tit}</span>${icon('caret-down', { cls: 'ic rod-seta' })}</summary><ul>${itens}</ul></details>`;
  return `
<footer class="rodape rod2">
  <div class="rod2-luz" aria-hidden="true"></div>
  <div class="wrap">
    <div class="rod2-grade">
      <div class="rod2-marca">
        <a class="marca" href="${u('')}" aria-label="Grupo 2!H, página inicial"><img src="${asset('img/logo-2h-glyph.png')}" alt="" width="39" height="36" loading="lazy"><span>GRUPO <b>2!H</b></span></a>
        <p>Estrutura, planejamento e ação para empresas que querem crescer com previsibilidade.</p>
        <div class="rod2-contato">
          <a class="rod2-bt rod2-bt-ouro" href="${whatsappLink()}" target="_blank" rel="noopener">${icon('whatsapp-logo')}<span><small>WhatsApp</small>${esc(empresa.whatsappExibicao)}</span></a>
          <a class="rod2-bt" href="mailto:${esc(empresa.email)}">${icon('envelope-simple')}<span><small>E-mail</small>${esc(empresa.email)}</span></a>
        </div>
        ${redes ? `<div class="rod-redes">${redes}</div>` : ''}
      </div>
      <nav class="rod2-cols" aria-label="Rodapé">
        ${grupo('Empresa', 'buildings', lk('sobre/', 'Sobre a 2!H') + lk('como-funciona/', 'Como funciona') + lk('perguntas-frequentes/', 'Perguntas frequentes') + lk('contato/', 'Contato'))}
        ${grupo('Soluções', 'stack', servicos.map((s) => lk(`solucoes/${s.slug}/`, s.nome)).join(''))}
        ${grupo('Método 5A', 'graph', lk('metodo-5a/', 'O método') + programas.map((p) => lk(p.link, p.nome, true)).join(''))}
        ${grupo('Conteúdo', 'article', lk('blog/', 'Blog') + lk('glossario/', 'Glossário de growth') + lk('blog/rss.xml', 'RSS'))}
      </nav>
    </div>
    <div class="rod2-base">
      <p>© ${new Date().getFullYear()} ${esc(empresa.nome)}. Todos os direitos reservados.${legal ? ` ${esc(legal)}.` : ''}</p>
      <a href="${u('privacidade/')}">Política de privacidade</a>
    </div>
  </div>
</footer>`;
}

/**
 * Página completa.
 * @param {object} o
 *  path: caminho relativo à base ('' para a home, 'sobre/' etc.)
 *  titulo, descricao, corpo (HTML), ld (array de objetos JSON-LD extras),
 *  imagem (URL absoluta da imagem de compartilhamento), tipo ('website'|'article'),
 *  noindex, navAtual, classe, extraHead, semCabecalho, semGTM, semProtecao, scripts
 */
export function pagina(o) {
  const titulo = o.tituloCompleto || `${o.titulo} | Grupo 2!H`;
  const url = abs(o.path ?? '');
  const imagem = o.imagem || assetAbs('img/og-padrao.png');
  const noindex = !cfg.producao || o.noindex;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      organizacaoLD(),
      siteLD(),
      { '@type': o.tipoPagina || 'WebPage', '@id': url + '#pagina', url, name: titulo, description: o.descricao, inLanguage: 'pt-BR', isPartOf: { '@id': SITE_ID }, about: { '@id': ORG_ID }, ...(o.dataModificada ? { dateModified: o.dataModificada } : {}) },
      ...(o.ld || []),
    ],
  };
  const gtm = cfg.producao && !o.semGTM && cfg.gtm;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>(function(h){h.classList.add('js','carregando');var f=function(){h.classList.remove('carregando');['pointermove','pointerdown','touchstart','scroll','keydown'].forEach(function(e){removeEventListener(e,f)})};['pointermove','pointerdown','touchstart','scroll','keydown'].forEach(function(e){addEventListener(e,f,{passive:true,once:true})});setTimeout(f,8000)})(document.documentElement)</script>
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(o.descricao)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">'}
<link rel="canonical" href="${url}">
<meta property="og:type" content="${o.tipo || 'website'}">
<meta property="og:site_name" content="Grupo 2!H">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(o.ogTitulo || o.titulo || titulo)}">
<meta property="og:description" content="${esc(o.descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${esc(imagem)}">
<meta property="og:image:alt" content="${esc(o.imagemAlt || 'Grupo 2!H')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0B0B0D">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="${asset('img/favicon-32.png')}" sizes="32x32" type="image/png">
<link rel="icon" href="${asset('img/favicon-64.png')}" sizes="64x64" type="image/png">
<link rel="apple-touch-icon" href="${asset('img/apple-touch-icon.png')}">
<link rel="manifest" href="${u('site.webmanifest')}">
<link rel="alternate" type="application/rss+xml" title="Blog do Grupo 2!H" href="${u('blog/rss.xml')}">
<link rel="preload" href="${asset('fonts/general-sans-600.woff2')}" as="font" type="font/woff2" crossorigin>
<style>${cssEmbutido.replace(/<\/style/gi, '<\/style')}</style>
${o.extraHead || ''}
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
${gtm ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${cfg.gtm}');</script>` : ''}
</head>
<body class="${o.classe || ''}"${o.semProtecao ? '' : ' data-protegido'}>
${gtm ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${cfg.gtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : ''}
${o.semCabecalho ? '' : cabecalho(o.navAtual ?? o.path)}
<main id="conteudo">
${inserirDivisas(o.corpo)}
</main>
${o.semCabecalho ? '' : rodape()}
<script src="${asset('js/site.js')}" defer></script>
${o.scripts || ''}
</body>
</html>
`;
}

/** Trilha de navegação visível + JSON-LD. trilha: [{nome, path}] (a home entra sozinha). */
export function trilha(itens) {
  const tudo = [{ nome: 'Início', path: '' }, ...itens];
  const html = `<nav class="trilha" aria-label="Você está em"><ol>${tudo
    .map((t, i) => (i === tudo.length - 1 ? `<li aria-current="page">${esc(t.nome)}</li>` : `<li><a href="${u(t.path)}">${esc(t.nome)}</a></li>`))
    .join('')}</ol></nav>`;
  return { html, ld: breadcrumbLD(tudo) };
}

/** Cabeçalho das páginas internas. */
export function capa({ trilhaHtml, titulo, tituloOuro, lead, extra = '', variante = '', visual = '', fotoFundo = '' }) {
  const texto = `${trilhaHtml || ''}
    <h1 class="capa-h1">${esc(titulo)}${tituloOuro ? ` <span class="ouro">${esc(tituloOuro)}</span>` : ''}</h1>
    ${lead ? `<p class="capa-lead">${lead}</p>` : ''}
    ${extra}`;
  return `
<section class="capa ${variante}${visual ? ' com-visual' : ''}">
  ${fotoFundo ? `<div class="capa-foto" aria-hidden="true"><img src="${asset(`img/fotos/${fotoFundo}.webp`)}" srcset="${asset(`img/fotos/${fotoFundo}-800.webp`)} 800w, ${asset(`img/fotos/${fotoFundo}.webp`)} 1600w" sizes="100vw" alt="" fetchpriority="high"></div>` : ''}
  <div class="capa-topo" aria-hidden="true"></div>
  <div class="wrap">
    ${visual ? `<div class="capa-texto">${texto}</div><div class="capa-visual">${visual}</div>` : texto}
  </div>
</section>`;
}

/** Faixa final de chamada (usada no fim de quase todas as páginas). */
export function ctaFinal({ origem, titulo = 'Descubra onde a sua empresa está perdendo dinheiro.', texto = 'Responda o diagnóstico rápido, leva menos de 1 minuto. Depois a 2!H te chama no WhatsApp para entender o seu caso.', botao = 'Quero saber onde minha empresa está perdendo dinheiro', botaoCurto = 'Fazer o diagnóstico', foto: fotoFundo = 'aperto-de-mao' } = {}) {
  return `
<section class="cta-final">
  ${fotoFundo ? `<div class="cta-foto" aria-hidden="true"><img src="${asset(`img/fotos/${fotoFundo}.webp`)}" srcset="${asset(`img/fotos/${fotoFundo}-800.webp`)} 800w, ${asset(`img/fotos/${fotoFundo}.webp`)} 1600w" sizes="100vw" alt="" loading="lazy"></div>` : ''}
  <div class="cta-topo" aria-hidden="true"></div>
  <div class="wrap cta-in" data-revela>
    <h2 class="cta-h2">${esc(titulo)}</h2>
    <p class="cta-p">${esc(texto)}</p>
    <div class="cta-acoes">
      <a class="btn btn-ouro btn-lg" href="${diag(origem)}" data-diag><span class="lbl-l">${esc(botao)}</span><span class="lbl-c">${esc(botaoCurto)}</span> ${icon('arrow-right')}</a>
      <a class="btn-link" href="${whatsappLink()}" target="_blank" rel="noopener">${icon('whatsapp-logo')} Prefiro falar no WhatsApp</a>
    </div>
  </div>
</section>`;
}
